---
 permalink: tutorials/first-steps/06-working-with-database
 category: First Steps
 author: Chimezie Enyinnaya
---

# Working with database

Unless we are building a static site, our application will definitely need some database interaction. This can be simple CRUD operations or complex database transactions.

## Setting up a database

AdonisJS provides an expressive way to interact with database in our application through it ORM called Lucid. Lucid is not installed in our application by default, so we need to install it:

```bash
npm install @adonisjs/lucid@alpha
```

Once installed, we need to set it up. For that, we’ll make use of the `invoke` command to set it up automatically:

```bash
node ace invoke @adonisjs/lucid
```

Amongst other things, this will create a `database.ts` config file inside the `config` directory, update the `.env` file to include database connection details and update `build/ace-manifest.json` to include commands fro creating Lucid models as well as migrations and other migration commands.

Before we can start interacting with a database in our AdonisJS application, we need to first set up the database we want to use. Out of the box AdonisJS supports a handful of databases such as MySQL, MariaDB, PostgreSQL, Oracle, MSSQL and SQLite3. For the purpose of this tutorial, we’ll be using MySQL.

First, we need to install the database driver for MySQL:

```bash
npm install mysql
```

Taking a look at `config/database.ts`, we’ll see that the MySQL config details are pulled from  environment variables. So let’s update `.env` with our database details:

```
// .env

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_USER=YOUR_DATABASE_USERNAME
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_NAME=tasks
```

Remember to update the placeholders accordingly with your own database details.

## Creating a migration

With our database set up, let’s create our first migration. But what’s a migration? Migrations are documented database mutations, created throughout your application’s development lifecycle that you can roll back or re-run at any point in time. Migrations make it easier to work as a team, enabling database schema changes from one developer to be easily tracked and then applied by other developers in your organization.

We can make use of the `make:migration` command to create a migration:

```bash
node ace make:migration tasks
```

This will create a new `database` directory and inside it a `migrations` directory then a `TIMESTAMP_tasks.ts` file inside the `migrations` directory. Open the migration and update the `up()` as below:

```ts
// TIMESTAMP_tasks.ts

public async up () {
  this.schema.createTable(this.$tableName, (table) => {
    table.increments('id')
    table.string('title')
    table.boolean('is_completed').defaultTo(0)
    table.timestamps()
  })
}
```

This migration will create a database table called `tasks` with 5 fields: `id`, `title`, `is_completed`, `created_at` and `updated_at`.

Next, we need to run the migration:

```bash
node ace migration:run
```

## Creating a Lucid model

Before we head straight to create a Lucid model, let’s take a moment to understand what a Lucid model is. Lucid is AdonisJS ORM, which follows the Active Record pattern. It provides a clean way of interacting with relational database. Lucid represents the M in AdonisJS MVC structure. Since Lucid is an ORM, it makes interacting with relational database easy and transparent. It  can be used to perform database operations such as insert, update, select, delete and even database transactions. Also, Lucid can be used to define relationships between database tables without writing a single SQL query.

Now, let’s create our first Lucid model. We can use the `make:model` command:

```bash
node ace make:model Task
```

This will create a new `Models` directory and in it a `Task.ts` file. A Lucid model represents a database table. In this case, the `Task` model will represent the `tasks` table. Just as we did in the migration, we also need to define the table fields in the model. Update the `Task` model as below:

```ts
// app/Models/Task.ts

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public isCompleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static $columns: Pick<
    Task,
    'id' | 'createdAt' | 'updatedAt' | 'title' | 'isCompleted'
  >
}
```

`$columns` makes sure that `Task.create()` should only allow the listed properties.
