---
permalink: guides/database/introduction
group: Database
---

# Introduction

AdonisJS is one of the few Node.js frameworks (if not the only one) that has first class support for SQL databases. The Database layer of the framework **(Lucid)** comes with versatile set of tools, enabling you to build data driven applications quickly and easily.

In this guide, we will briefly talk about the following topics. Once you have the basic understanding, you can dig into the in-depth guides of individual topics.

- Database query builder
- Data Models
- Schema migrations
- Seeds & Factories

## Database query builder
The database query builder offers a rich API for constructing SQL queries, ranging from simple **select all** to **complex joins**.

No need to write the SQL DSL by hand. Just use our Javascript API and we will create the correct SQL query for the database engine in use. For example:

```ts
import Database from '@ioc:Adonis/Lucid/Database'

const users = await Database.from('users').select('*')
// SQL:  SELECT * FROM "users";
```

Similarly you can construct complex queries with where clause and joins.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

const user = await Database
  .from('users')
  .select('*')
  .where('username', 'virk')
  .innerJoin('profiles', 'users.id', 'profiles.user_id')
  .first()

// SQL: SELECT * FROM `users` inner join `profiles` on `users`.`id` = `profiles`.`user_id` where `username` = ? limit ?
```

The goal of the query builder is to offer you a declarative API to construct SQL queries, without preventing you from using the power of SQL. Everything that you can write in raw SQL is also supported by the [query builder](/guides/database/query-builder) or the [raw query builder](/guides/database/query-builder#executing-raw-queries).

## Data Models
The database query builder does a great job by letting you write SQL queries using the JavaScript API. However, the result of every query is an array of plain JavaScript objects with no behavior.

Imagine, you fetch an array of users and each user object has a `date_of_birth` property. Before returning the data back to the client, you want to compute the `age` of the user. How would you do it?

- Well, you will have to loop over the array.
- Subtract the user's `date_of_birth` from the current date.
- Attach a new property to the existing object.
- Delete the `date_of_birth` property.
- Send response.

```ts
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'

const users = await Database.from('users').select('*')

return users.map((user) => {
  const dob = DateTime.fromJSDate(user.date_of_birth)
  user.age = DateTime.local().diff(dob, 'years').years

  delete user.date_of_birth
  return user
})
```

The above code example is not bad by any means. But imagine writing these transformations everywhere inside your codebase. Well, we can do better than this by using data models.

### Say Hello to Data Models
Data models are defined as JavaScript classes and each class is meant to query a single database table. Instead of using the `Database` object for executing queries, you will make use of the model to create and run SQL queries. For example:

[codegroup]

```ts{}{Defining Model}
import { DateTime } from 'luxon'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column.date()
  public dateOfBirth: DateTime
}
```

```ts{}{Using Model}
import User from 'App/Models/User'

// select all
const users = await User.all()

// using query builder
const user = await User.query().where('username', 'virk').first()
```
[/codegroup]

One of the major differences between **Database query builder** and **Models** is that models return an array of **class instances over plain objects**. This simple distinction makes models way more powerful over the standard query builder.

Coming back to the earlier example of computing user's `age` from the `date_of_birth`. Following is an example of achieving the same result without performing inline transformations inside a loop.

```ts{11,14-17}{}
import { DateTime } from 'luxon'
import { column, computed, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column.date({ serializeAs: null })
  public dateOfBirth: DateTime

  @computed()
  public get age () {
    return DateTime.local().diff(this.dateOfBirth, 'years').years
  }
}
```

```ts
import User from 'App/Models/User'
const users = await User.all()

/**
 * The computed property "age" will be added to the
 * user object during `user.toJSON` call.
 */
return users.map((user) => user.toJSON())
```

### What just happened?
- We begin by defining `serializeAs = null` property on the `dateOfBirth` column. This will fetch the `date_of_birth` from the table **(since we need it for calculation)**, but will remove it during serialization.
- Next, we define a computed property `age` on the model. Computed properties are values that are created on the fly, but doesn't exists in the database.
- The `toJSON` method serializes a model instance to a plain Javascript object and this is where all the magic happens.

As you can see, models make it possible to attach behavior to the rows fetched from the database and this alone will help you cleanup a lot of inline data transformations.

There is a lot more to uncover with Data models. We recommend you to read the [dedicated guide](/guides/models/introduction) for better in-depth understanding.

## Schema migrations
Schema migrations enable you to programmatically **create/alter database tables**. At first, schema migrations may feel trivial, as one can login to a GUI application like Sequel Pro and can manually create tables.

However, the manual process has its own set of shortcomings like-

- Production database must be exposed publicly for a GUI application to connect.
- Schema changes are not tied to deployment workflows and manual intervention is always required.
- There is no history around the evolution of the database.

The schema migrations address all of the above issues by offering a robust layer for managing database as code changes. Make sure to read the [schema migrations](/guides/database/migrations) guide for better understanding. 

## Seeds & Factories
Every application under development needs dummy data at some stage. It can be during tests, or when sharing your code with a colleague. 

One option is to manually insert data using a GUI application, but a better approach is to automate this process and this is where **seeds** and **factories** comes into the picture.

- Seeders allows you insert data to your database by running a single `db:seed` command.
- Based upon the amount of data you want to seed, manually typing values for each row can be tedious. Factories helps you with generating fake data on the fly.
- Combining seeders and factories together, you end up with a very robust system seeding database without manual intervention.

We recommend reading the dedicated guide on [seeds and factories](/guides/database/seeds) for in-depth understanding.
