---
permalink: guides/database/connections-management
group: Database
category: Advanced Concepts
---

# Connections Management
Database connections in Lucid are fully managed using the inbuilt [connection manager](https://github.com/adonisjs/adonis-lucid/blob/develop/src/Connection/Manager.ts) and you never have to deal with their life cycle manually.

By the end of this guide you will know:

- How connections are internally managed by Lucid.
- Difference between connections and pools.
- How read/write replicas work.
- How to register connections on-demand.

## How connections are defined?
All of the database connections are defined inside the `config/database.ts` file. By default, this file contains a sample configuration for multiple database backends, but you can remove the connections you are not planning to use.

Each connection must specify a `client`, which determines the database backend to be used. Following is the list of available clients.

- `sqlite` or `sqlite3` for SQlite.
- `mysql` for MySQL.
- `pg` for PostgreSQL.
- `redshift` for Amazon Redshift.
- `oracledb` for Oracle.
- `mssql` for SQL server.

After defining the `client`, you will have to define the connection options. Read the [setup guide](/guides/database/setup#configure-sqlite) to learn about the connection options for each client.

### Connections LifeCycle
The database connections are lazy loaded. It means, until you execute a query, the database connection is not created. You can check the state of connections using the connection manager.

```ts
import Database from '@ioc:Adonis/Lucid/Database'
console.log(Database.manager.get('sqlite')?.state)
```

The `get` method accepts the name of the connection defined inside the `connections` object in `config/database.ts` file. A connection will always be in one of the following four states.

- `registered`: The connection is registered within the manager, but not initiated yet.
- `open`: The connection instance has been created and ready for executing queries.
- `migration`: The connection gets into the migration state, when you update the connection config programmatically. During the migration state, the connection waits for existing queries to finish, then disconnect and re-connect using the new config.
- `closed`: The connection is closed but still tracked by the connection manager. Closed connections cannot execute queries.

## Connection Pooling
[Connection pooling](https://en.wikipedia.org/wiki/Connection_pool) is a standard practice of maintaining minimum and maximum connections with the database server.

The minimum connections are maintained for improving the application performance. Establishing a new connection every time is an expensive operation and hence it is recommended to always have couple of connections ready to execute the database queries.

The maximum connections are defined to ensure that your application doesn't overwhelms the database server with too many concurrent connections.

When the pool is full, AdonisJS will queue new queries and waits for the pool to have free resources until the configured timeout. The default timeout is set to `60 seconds` and can be configured using `pool.acquireTimeoutMillis` property.

```ts
{
  mysql: {
    client: 'mysql',
    connection: {},
    pool: {
      // highlight-start
      acquireTimeoutMillis: 60 * 1000,
      // highlight-end
    }
  }
}
```

[tip]
Bigger the pool size, better the performance, is a mis-conception. We recommend you to read this [document](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing) to understand how smaller pool size can boost the application performance.
[/tip]

You can configure the pool settings for a given connection inside the `config/database.ts` file.

```ts{}{config/database.ts}
{
  connections: {
    mysql: {
      client: 'mysql',
      connection: {
        ...
      },
      // highlight-start
      pool: {
        min: 2,
        max: 20,
      },
      // highlight-end
      healthCheck: false,
    },
  }
}
```

## Read/Write Replicas
AdonisJS supports read/write replicas as first class citizen. You can configure one write database server, along with multiple read servers. For example:

[note]
All read queries are automatically sent to one of the read servers and no manual work is required.
[/note]

```ts
{
  connections: {
    mysql: {
      connection: {
        user: Env.get('DB_USER', 'lucid') as string,
        password: Env.get('DB_PASSWORD', 'lucid') as string,
        database: Env.get('DB_NAME', 'lucid') as string,
      },
      // highlight-start
      replicas: {
        read: {
          connection: [
            {
              host: '192.168.1.1',
            },
            {
              host: '192.168.1.2',
            },
          ]
        },
        write: {
          connection: {
            host: '196.168.1.3',
          },
        },
      },
      // highlight-end
    }
  }
}
```

Lucid will merge the main `connection` object with the replicas individual connection objects. So, you can keep shared values like `username` and `password` in the main connection object.

#### Points to note

- Lucid doesn't replicate data from write to read servers. You will have to rely on your database server for that.
- Based upon your database server performance and settings, the data written to the write server may not be available to the read servers right away.
- AdonisJS uses round robin to equally distribute the traffic between the read servers.

### Choosing Connection Modes
Lucid allows you to run queries in one of the following connection modes.

- `dual`: Read queries are sent to the read server and write queries are sent to the write server.
- `read`: Only read queries are allowed.
- `write`: Both read and write queries are sent to the write server.

Flexibility to choose between the available modes is helpful when you want subsequent write and read calls to always to always use the `write` server. For example: Reading the list of users right after adding a new user.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

await Database
  .connection('mysql', { mode: 'write' })
  .table('users')
  .insert({ username: 'virk' })

await Database
  .connection('mysql', { mode: 'write' })
  .from('users')
  .select('*')
```

## Switching Between Connections
You can switch between pre-registered connections using the `Database.connection` method.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

const mysqlConnection = Database.connection('mysql')
const anotherConnection = Database.connection('some-other-connection')
const defaultConnection = Database.connection()
```

Connections can also be passed to a Model query at runtime. For example

```ts
import User from 'App/Models/User'

await User
  .query({ client: connection })
  .where('username', 'virk')
```

[Learn more]() about using connections with Models.

## On Demand Connections
Many multi-tenant applications opt for separate database for every tenant. It means, if there are 1000 tenants, then each tenant will have a separate database or maybe a separate database server all together.

Knowing about all the tenants and their database configuration upfront is not possible and therefore Lucid allows you to register dynamic database (each having a unique name) and use them through out your application.

### Finding the Connection Details
The first step is to identify the tenant and then load their database configuration. How you identify the tenant majorly depends on your application architecture. Some common ways are:

- Identify them using a subdomain
- Append a tenant query string to all URLs
- Or store it inside a session

For the sake of simplicity, we will read the tenant details from the query string and then inside a middleware, we will fetch the database configuration and register the connection with a unique name.

```ts{}{app/Middleware/TenantDb.ts}
import Database from '@ioc:Adonis/Lucid/Database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TenantDb {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {

    const tenantId = ctx.request.input('tenant')
    ctx.response.abortIf(!tenantId, 'Define tenant id using the query string')

    // You may fetch it from a master database
    const tenantConnectionConfig = {
      client: 'mysql' as const,
      connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'tenant_user',
        password: 'tenant_password',
        database: 'tenant_db',
      },
    }

    const connectionName = `tenant_${tenantId}`

    if (!Database.manager.has(connectionName)) {
      Database.manager.add(connectionName, tenantConnectionConfig)
      Database.manager.connect(connectionName)
    }

    await next()
  }
}
```

#### What just happened?
The middleware for registering the connection has a lot going on. Let's discuss it line by line.

- We read the tenant id using the `request.input` method and if it's not defined, we abort the request using the `response.abortIf` method.
- Next, we need the configuration for creating a database connection. Even though the config is hard coded in this example, it can come from anywhere.
- Next, we check to see if that connection for this tenant has already been registered using the `Database.has` method. If not, we register one using `Database.add` method.

Next step is to register the middleware inside `start/kernel.ts` file.

```ts{3}{start/kernel.ts}
Server.middleware.register([
  'Adonis/Core/BodyParserMiddleware',
  'App/Middleware/TenantDb',
])
```

Finally, you can use the database connection by using the unique connection name.

```ts{}{app/Controllers/Http/UsersController.ts}
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index ({ request }: HttpContextContract) {
    return User.query({
      connection: `tenant_${request.input('tenant')}`,
    })
  }
}
```

## Closing connections
One or more database connections can be closed. You can specify if you want to "release" the connection, meaning that you will need to add it again.


```ts{}
await Database.manager.close("myconnection", true)
await Database.manager.closeAll()
```