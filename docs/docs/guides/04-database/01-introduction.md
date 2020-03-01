---
permalink: guides/database/introduction
group: Database
under_progress: true
last_updated_on: 1st March, 2020
---

# Introduction

AdonisJS is one of the few Node.js frameworks (if not the only one) that has first class support for SQL databases. The Database layer of the framework **(called Lucid)** makes database interactions super simple using the [ORM](), the [Query builder](), [Migrations](), [Seeds]() and much more.

## Support for Multiple Connections
Within a single application, you can create and use multiple database connections using different database backends all together. For example: You can have a connection using PostgreSQL and other one using MySQL.

Also, the lifecycle of these connections is entirely managed by Lucid and hence you don't want to worry about initiating or closing connections manually.

Learn more about [Connections management]()

## Connection pooling
Connection pooling is a way to optimize queries and also limit the number of concurrent connections a database server can handle. Inside your database config file, you can define the **min** and **max** number of pool connections for AdonisJS to maintain.

- The `min` number ensures that these many connections are always alive, even when the application is idle. Since, creating a new connection is an expensive operation, you do want to make sure that a couple of connections are always alive to execute queries.
- The `max` number ensures that you are not overwhelming your database with too many concurrent connections.

Learn more about [Connections pooling]()

## Support for Read-Write Replicas
Read-write replicas are treated as first class citizen with Lucid. Inside your database connection config, you can define config for one write server and multiple read servers.

Lucid will round robin between the read servers and all of the read queries will automatically be directed towards one of the read servers.

Learn more about [Read-write replicas]()

## Database Query Builder
Lucid comes a database query builder (built on top of [knex](https://knexjs.org/)), that you can use in order to construct SQL queries. For example:

[codegroup]

```ts{}{Select All}
import Database from '@ioc:Adonis/Lucid/Database'

const users = await Database
  .from('users')
  .select('username', 'email')
```


```ts{}{Where clause}
import Database from '@ioc:Adonis/Lucid/Database'

const user = await Database
  .from('users')
  .select('username', 'email')
  .where('username', 'virk')
  .first()
```

```ts{}{Joins}
import Database from '@ioc:Adonis/Lucid/Database'

const user = await Database
  .from('users')
  .where('username', 'virk')
  .innerJoin('profiles', 'users.id', 'profiles.userId')
  .first()
```

```ts{}{Aggregates}
import Database from '@ioc:Adonis/Lucid/Database'

const [{ total }] = await Database
  .from('users')
  .count('* as total')
```

[/codegroup]

Learn more about [Database query builder]()

## Raw Query Builder
The database query builder offers a rich API to construct SQL queries, ranging from simple **select all** to **complex joins**.

However, at times, the standard query builder API may not be able express the queries you want to construct. For example: Using the native database methods like `YEAR`, `LOWER` and so on.

In scanerios like these, you can opt in for the Raw query builder.

[codegroup]

```ts{4}{Raw where clause}
const user = await Database
  .from('users')
  .where(
    Database.raw('LOWER("username")'),
    'virk',
  )
  .first()
```

```ts{}{Raw Query}
const response = await Database
  .rawQuery(
    'select * from "users" where "username" = ?',
    ['virk'],
  )
```

[/codegroup]

Learn more about [Raw query builder]()

## Support for Transactions & Save Points
Being a SQL ORM, Lucid has first class support for transactions and save points. The transaction object created by Lucid itself is a fully featured query client and you can use it directly to construct and execute sql queries.

```ts
const trx = await Database.transaction()

try {
  const [ userId ] = await trx
   .table('users')
   .returning('id')
   .insert({ username: 'virk', email: 'virk@adonisjs.com' })

  await trx
   .table('profiles')
   .insert({ user_id: userId, twitter: '@AmanVirk1' })

  await trx.commit()
} catch (error) {
  await trx.rollback()
}
```

Learn more about [Transactions]()

## Active Record ORM
Along with the Database query builder, Lucid also comes with a fully fledged implementation of [Active Record ORM](https://en.wikipedia.org/wiki/Active_record_pattern). Using the ORM, you can represent your database tables as **Models** and run SQL operations by invoking methods on your Model class.

[codegroup]

```ts{}{Model Declaration}
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public username: string

  @column()
  public email: string
}
```

```ts{}{Save using Model}
import User from 'App/Models/User'

const user = new User()
user.username = 'virk'
user.email = 'virk@adonisjs.com'

await user.save()
```

```ts{}{Fetch using Model}
import User from 'App/Models/User'

const users = await User.all()

// or use the query builder
const user = await User
  .query()
  .where('username', 'virk')
  .first()
```

[/codegroup]

Learn more about [Lucid Models]()

## Database Migrations

Database migrations is a way of evolving the database schema using code. Instead of manually creating tables using a GUI application, you express database operations by writing Javascript code.

For example: The following code snippet creates a new database table called `users`.

```ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected $tableName = 'users'

  public async up () {
    this.schema.createTable(this.$tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.string('username', 100).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.$tableName)
  }
}
```

## Health Checks
Lucid has inbuilt support for health checks. It will run a sample query on your configured database connection to check its connectivity. All you need to do is enable the `healthcheck` flag inside the config file and then use the AdonisJS central [health check](/guides/basics/health-checks) system to see the status.
