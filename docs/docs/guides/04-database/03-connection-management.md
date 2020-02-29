---
permalink: guides/database/connections-management
group: Database
---

# Connections Management
Database connections in Lucid are fully managed using the inbuilt [connection manager](https://github.com/adonisjs/adonis-lucid/blob/develop/src/Connection/Manager.ts). You never have to manually deal with their lifecycle.

By the end of this guide you will know:

- How connections are internally managed by Lucid.
- Difference between connections and pools.
- How read/write replicas work.
- How to register connections on-demand.

## How connections are defined?
All of the database connections are defined inside the `config/database.ts` file. By default, AdonisJS creates a sample connection config for different database backends, but you can remove the connections you are not planning to use.

Each connection must specify a `client`, which determines the database backend to be used. Following is the list of available clients.

- `sqlite` or `sqlite3` for SQlite.
- `mysql` for MySQL.
- `pg` for PostgreSQL.
- `redshift` for Amazon Redshift.
- `oracledb` for Oracle.
- `mssql` for SQL server.

After defining the `client`, you will have to define the connection options. Read the [setup guide](setup#configure-sqlite) to learn about the connection options for each client.

### Connections Lifecycle
The database connections are lazy loaded. It means, until you don't execute a query, the database connection is not made. You can check the state of connections using the connection manager.

```ts
import Database from '@ioc:Adonis/Lucid/Database'
console.log(Database.manager.get('sqlite')?.state)
```

The `get` method accepts the name of the connection defined inside the `connections` object in `config/database.ts` file. A connection will always be in one of the following four states.

- `registered`: The connection is registered with the manager, but not initiated yet.
- `open`: The connection instance has been created and ready for executing queries.
- `migration`: The connection is in migration state, when you update the connection config programmatically. During the migration state, the connection waits for existing queries to finish, then disconnect and re-connect using the new config.
- `closed`: The connection is closed but still tracked by the connection manager. Closed connections cannot execute queries.

## Connection Pooling
[Connection pooling](https://en.wikipedia.org/wiki/Connection_pool) is a standard practice of maintaing minimum and maximum connections with the database server.

The minimum connections are maintained for improving the application performance. Establishing a new connection everytime is an expensive operation and hence it is recommended to always have couple of connections ready to execute database queries.

The maximum connections are defined to ensure that your application doesn't overwhelms the database server with too many concurrent connections. Also, when the pool is full, AdonisJS will queue the queries and waits for the pool to have free resources.

[tip]
Bigger the pool size, better the performance is a mis-conception. We recommend you to read this [document](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing) to understand how smaller pool size can boost the application performance.
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
- AdonisJS round robin between the read servers to equally distribute the traffic.

### Choosing Connection Modes
Lucid allows you to run queries in one of the following connection modes.

- `dual`: Read queries are sent to the read server and write queries are sent to the write server.
- `read`: Only read queries are allowed.
- `write`: Both read and write queries are send to the write server.
 
Flexibility to choose between the available modes is helpful when you want subsequent write and read calls to always to to the `write` server. For example: Reading the list of users right after adding a new user.

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
