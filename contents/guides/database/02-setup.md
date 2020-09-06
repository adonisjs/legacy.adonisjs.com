---
permalink: guides/database/setup
group: Database
---

# Setup

In this guide, you will install `@adonisjs/lucid` package, along with the database driver of your choice. Lucid supports the following database engines.

- MYSQL
- SQLite
- MSSQL
- PostgreSQL (along with Amazon Redshift)
- MariaDB
- and OracleDB

Install the package from the npm registry by running the following command.

[note]
The `@alpha` tag is required during the preview release.
[/note]

[codegroup]
```sh{}{npm}
npm i @adonisjs/lucid@alpha
```

```sh{}{yarn}
yarn add @adonisjs/lucid@alpha
```
[/codegroup]

Next, you must setup Lucid by running the `node ace invoke` command. The following command will create the default config file and also registers `@adonisjs/lucid` under the `providers` array.

```sh
node ace invoke @adonisjs/lucid

# ✔  create    config/database.ts
#    update    .env
#    update    tsconfig.json
#    update    .adonisrc.json
# ✔  create    ace-manifest.json
```

Congrats! You have configured Lucid. We will now continue with the setup for different database backends.

## Configure SQLite
SQLite is a light weight file based database server. You can quickly get up and running with SQLite by just installing the database driver from npm.

```sh
npm i -D sqlite3
```

Next, open the `config/database.ts` file to review the configuration options.

```ts{2,8}{config/database.ts}
{
  connection: Env.get('DB_CONNECTION', 'sqlite') as string,

  connections: {
    sqlite: {
      client: 'sqlite',
      connection: {
        filename: Application.tmpPath('db.sqlite3'),
      },
      useNullAsDefault: true,
      healthCheck: false,
    },
  }
}
```

- Lucid relies on the `DB_CONNECTION` environment variable to decide the default database connection to use. So make sure to update this to `sqlite` inside the `.env` file.
  ```sh
  DB_CONNECTION=sqlite
  ```
- The database file lives inside the `tmp` path. So, do make sure to create the `tmp` directory inside the project root.
  ```sh
  mkdir tmp
  ```

## Configure MySQL
The first step is to have MySQL server running on your computer. You can [install MySQL](https://dev.mysql.com/downloads/installer/) for your operating system by following the official docs.

Once, the server is running, install the MySQL driver for Node.js from npm.

[note]
You can also connect to the MariaDB database using the `mysql` driver.
[/note]

```sh
npm i mysql
```

Next, open the database config file to review the configuration options.

```ts{2,8-12}{config/database.ts}
{
  connection: Env.get('DB_CONNECTION', 'sqlite') as string,

  connections: {
    mysql: {
      client: 'mysql',
      connection: {
        host: Env.get('DB_HOST', '127.0.0.1') as string,
        port: Number(Env.get('DB_PORT', 3306)),
        user: Env.get('DB_USER', 'lucid') as string,
        password: Env.get('DB_PASSWORD', 'lucid') as string,
        database: Env.get('DB_NAME', 'lucid') as string,
      },
      healthCheck: false,
    },
  }
}
```

- Lucid relies on the `DB_CONNECTION` environment variable to decide the default database connection to use. So make sure to update this to `mysql` inside the `.env` file.
- Also, the database connection values are read from the `.env` file. So make sure to update them as well.
  ```sh
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_USER=root
  DB_PASSWORD=password
  DB_NAME=lucid
  ```

With MySQL, you can also connect using the unix domain socket. Setting the `socketPath` will ignore host and port.

```ts{5}
connections: {
  mysql: {
    client: 'mysql',
    connection: {
      socketPath: '/path/to/socket.sock',
      user: Env.get('DB_USER', 'lucid') as string,
      password: Env.get('DB_PASSWORD', 'lucid') as string,
      database: Env.get('DB_NAME', 'lucid') as string,
    },
    healthCheck: false,
  },
}
```

## Configure PostgreSQL
Just like MySQL, the first step with PostgreSQL is also to install the database server. Make sure to follow the [official guide](https://www.postgresql.org/download/) on installation.

Once, the database server is running, install the PostgreSQL driver for Node.js from npm.

```sh
npm i pg
```

Next, open the database config file to review the configuration options.

```ts{2,8-12}
{
  connection: Env.get('DB_CONNECTION', 'sqlite') as string,

  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: Env.get('DB_HOST', '127.0.0.1') as string,
        port: Number(Env.get('DB_PORT', 5432)),
        user: Env.get('DB_USER', 'lucid') as string,
        password: Env.get('DB_PASSWORD', 'lucid') as string,
        database: Env.get('DB_NAME', 'lucid') as string,
      },
      healthCheck: false,
    },
  }
}
```

Again, make sure to update the `.env` file with the correct `DB_CONNECTION` and other config values.

```sh
DB_CONNECTION=pg
DB_HOST=127.0.0.1
DB_USER=user
DB_PASSWORD=password
DB_NAME=lucid
```

With PostgreSQL, you can also pass the connection string instead of defining every connection property separately.

```ts
{
  connections: {
    pg: {
      client: 'pg',
      connection: 'postgres://someuser:somepassword@somehost:5432/somedatabase',
      healthCheck: false,
    },    
  }
}
```

## Other Database Servers
We haven't covered the setup for all possible databases. However, the process remains same for every other database server.

- Get the database server up and running.
- Install the driver from npm. Following is the list of drivers.
  ```sh
  npm install pg
  npm install sqlite3
  npm install mysql
  npm install mysql2
  npm install oracledb
  npm install mssql
  ```
- Finally, define a new connection inside the `config/database.ts` file

## Verifying Connection
There are a couple of ways to verify the connection settings and ensure that you are able to connect to your database server successfully. One way is to use the **health checks api** and another one is to **manually run a query** inside a dummy route.

### Health Checks
Lucid has inbuilt support for health checks and it works across all database engines. All you need to do is, enable the `healthCheck` flag on the database connection inside the `config/database.ts` file and then use the AdonisJS global Health check API, as shown in the following example.

```ts{}{start/routes.ts}
import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()
  
  return report.healthy
    ? response.ok(report)
    : response.badRequest(report)
})
```

If you now visit [http://localhost:3333/health](http://localhost:3333/health), you must see the health check report for your database connection(s).

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1587544897/adonisjs.com/health-check-report_emwloq.png)


### Manual Query
Another option is to perform a query inside a dummy route. For example:

```ts{}{start/routes.ts}
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

Route.get('test', async () => {
  return Database.query().select('*').from('users')
})
```
