---
permalink: guides/database/migrations
group: Database
---

# Schema Migrations
So far you have learned about the ways to fetch or persist data using the database query builder. In this guide, we take a step further and explore schema migrations for **creating/altering** database tables.

By the end of this guide, you will know:

- What is schema migrations and how it works
- Using the Lucid Javascript API to create, alter or delete tables.
- The Ace commands to run or rollback migrations.

## Migrations Overview
Database [schema migrations](https://en.wikipedia.org/wiki/Schema_migration) is one of the most confusing topics in software programming. Many times individuals don't even understand the need of using migrations vs manually creating database tables. So, let's take a step backward and explore the possible options for creating/modifying tables inside a database.

[note]
AdonisJS uses [Knex.js](https://knexjs.org/#Schema-Building) behind the scene.
Ensure to check out their documentation to see a full list of column types and modifier methods.
[/note]

### Using a GUI Application
The simplest way to create database tables is to make use of a GUI application like Sequel Pro, Table plus and so on. These applications are great during the development phase, however, they have some short-comings during the production workflow.

- You need to expose your database server to the internet, so that the GUI application on your computer can connect to the production database.
- You cannot tie the database changes to your deployment workflow. Every deployment impacting the database will require manual intervention.
- Their is no history of your tables. You do not know, when and how a database modification was done.

### Custom SQL Scripts
Another option is to create SQL scripts and run them during the deployment process. However, you will have to manually build a tracking system to ensure that you are not running the previously ran SQL scripts. For example:

- You write a SQL script to create a new `users` table.
- You run this script as part of the deployment workflow. However, you have to make sure that the next deployment must ignore the previously executed sql script.

### Using Schema Migrations
Schema migrations addresses the above issues and offers a robust API for evolving and tracking database changes. There are many tools available for schema migrations ranging from framework agnostic tools like [flywaydb](https://flywaydb.org/) to framework specific tooling offered by Rails, Laravel and so on.

Similarly, AdonisJS also has its own migrations system. You can create/modify database by just writing Javascript.

## Creating Your First Migration
Let's begin by executing the following ace command to create a new migration file.

[note]
AdonisJS uses the compiled Javascript code for running migrations. So make sure, that you are compiling your project in a separate terminal window using `node ace serve --watch` command. 
[/note]

```sh
node ace make:migration users
# ✔  create    database/migrations/1584350623957_users.ts
```

Open the newly created file inside the text editor and replace its content with the following code snippet.

```ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email').unique().notNullable()
      table.string('password').notNullable()
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
```

[note]

Migrations are executed against the compiled Javascript code. So, make sure to run one of the following ace commands to keep the compiled output upto date.

```sh
# watch & re-compile
node ace build --watch

# watch, re-compile & start http server
node ace serve --watch
```

[/note]

Finally, run the following ace command to execute the instructions for creating the `users` table.

```sh
node ace migration:run

# Migrations source base dir: build
# Last compiled at: Mar 31, 2020, 4:11 PM

# completed database/migrations/1584350623957_users (batch: 1) 👈
```

Congratulations! You have just created and executed your first migration. If you re-run the same command, Lucid will not execute the migration file, since it has already been executed.

```sh
node ace migration:run

# Already upto date 👈
```

### How it works?

- The `make:migration` command creates a new migration file prefixed with the timestamp. The timestamp is important, because the migrations are executed in the ascending order by name.
- Migration files are not only limited to creating a new table. You can also `alter` table, define database triggers and so on.
- The `migration:run` command executes all the pending migrations. Pending migrations are those, which are never executed using `migration:run` command.
- A migration file is either in a `pending` state or in `completed` state.
- Once a migration file has been successfully executed, it will be tracked inside the `adonis_schema` database table to avoid running it for multiple times.

## Changing Existing Migrations
Occasionally you will make mistakes when writing a migration. If you have already run the migration using `migration:run` command, then you cannot just edit the file and re-run it, since the file has been tracked under the list of completed migrations.

Instead, you can rollback the migration by running the `migration:rollback` command. Assuming the previously created migration file already exists, running the rollback command will drop the `users` table.

```sh
node ace migration:rollback

# completed database/migrations/1584350623957_users (batch: 1)
```

### How rollback works?
- Every migration class has two methods, `up` and `down`. The `down` is called during the rollback process.
- You (the developer) is responsible for writing correct instructions to undo the changes made by the `up` method. For example: If `up` method creates a table, then the `down` method must drop it.
- After rollback, Lucid considers the migration file as pending and running `migration:run` will re-run it. So you can modify this file and then re-run it.

### Avoiding Rollbacks
Performing a rollback during development is perfectly fine, since there is no fear of data loss. However, performing a rollback in production is not really an option in majority of cases. Consider this example:

- You create and run a migration to setup the `users` table.
- Overtime this table has received data, since the app is running in production.
- Your product has evolved and now you want to add a new column to the `users` table.
- You cannot simply rollback, edit the existing migration and then re-run it, because, the rollback will drop the `users` table.

Instead, you create a new migration file to alter the existing `users` table by adding the required column. In other words, migrations should always move forward.

### Alter example
Following is an example of creating a new migration to alter the existing table.

[codegroup]

```sh{}{Make Migration}
node ace make:migration add_last_login_column --table=users

# ✔  create    database/migrations/1584415438372_add_last_login_columns.ts
```

```ts{8}{Migration}
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected $tableName = 'users'

  public async up () {
    this.schema.table(this.$tableName, (table) => {
      table.dateTime('last_login_at')
    })
  }

  public async down () {
    this.schema.table(this.$tableName, (table) => {
      table.dropColumn('last_login_at')
    })
  }
}
```

[/codegroup]

## Migrations Config
The configuration for migrations is stored inside the `config/database.ts` file under the connection config object.

```ts{}{config/database.ts}
{
  mysql: {
    client: 'mysql',
    migrations: {
      disableTransactions: false,
      paths: ['database/migrations'],
      tableName: 'adonis_schema',
      disableRollbacksInProduction: true,
    }
  }
}
```

- Instructions inside a migration file are wrapped inside a database transaction. You can disable the use of transactions by setting `disableTransactions = true`.
- You can define multiple `paths` from which to read the migrations files. The migrations are executed in sequence of the defined paths.
- The `tableName` property allows you to customize the table name for tracking completed migrations.
- Since rollbacks can lead to data loss, you can disable them in production by setting `disableRollbacksInProduction = true`.
