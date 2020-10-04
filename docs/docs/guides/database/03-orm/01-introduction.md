---
permalink: guides/models/introduction
category: Data Models
group: Database
---

# Introduction
Along with the Database query builder, Lucid also comes with an implementation of [Active record pattern](https://en.wikipedia.org/wiki/Active_record_pattern) to simplify the database interactions. By the end of this guide, you will know:

- More about the Active record pattern
- Difference between Data models and Database query builder
- The API exposed by Lucid to manipulate data stored in a relational database

## What is Active record pattern?
Active Record is also the name of the ORM used by Ruby on Rails. However, the Active record pattern is a broader concept that can be implemented by any programming language or framework.

[note]
Whenever we say the term **Active record**, we are pointing towards the pattern itself and not the implementation of Rails.
[/note]

The Active record pattern advocates to encapsulate the database interactions to language specific objects or classes. Each database table gets its own model and each instance of that class represents a database row.

The data models cleans up a lot of database interactions, since you can encode most of the behavior inside your models vs writing it everywhere inside your codebase. 

For example: Your `users` table has a date field and you want to format that before sending it back to the client. **This is how your code may look like without using data models**.

```ts
import { DateTime } from 'luxon'
const users = await Database.from('users').select('*')

return users.map((user) => {
  user.dob = DateTime.fromJSDate(user.dob).toFormat('dd LLL yyyy')
  return user
})
```

When using data models, you can encode the date formatting action within the model vs writing it everywhere you fetch and return users.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
  @column.date({
    serialize: (value) => value.toFormat('dd LLL yyyy')
  })
  public dob: DateTime
}
```

And use it as follows:

```ts
const users = await User.all()
return users.map((user) => user.toJSON()) // date is formatted during `toJSON` call
```

This is just one example, but it does convey the gist of using Models.

## Lucid implementation
Lucid offers you a rich API for modeling your database interactions and relationships using data models. It has the ability to:

1. Define models and **persist**, **fetch** or **delete** their data.
2. Handle relationships between multiple models.
3. Serialize models to JSON with option to customize the serialization process.
4. Exposes API to hook into the database operations life-cycle.

## Creating your first model
Assuming you already have lucid [setup](/guides/database/setup), run the following command to create your first data model.

```sh
node ace make:model User

# ✔  create    app/Models/User.ts
```

The `make:model` command creates a new model inside `app/Models` directory with the following contents inside it.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
```

- Every model must extend the `BaseModel` class.
- The table name is the **all lowercase** and **plural form** of the model name. However, you can define it manually as well.
  ```ts
  export default class User extends BaseModel {
    public static table = 'auth_users'
  }
  ```  
- The properties using the `@column` decorator are the table column names. They are defined as `camelCase` inside the model and as `snake_case` inside the table, but can also be customized.
  ```ts
  export default class User extends BaseModel {
    @column({ isPrimary: true, columnName: 'user_id' })
    public id: number
  }
  ```

## FAQ's

[collapse title="Does models creates the database tables automatically?"]
  No. We do not sync your models with the database. Creating/altering tables must be done using [migrations](/guides/database/migrations). Here are some of the reasons for not using models to create database schema.

  1. Generating database tables from models means will make them bloated with all the database level configuration that you don't even need after generating table.
  2. Not every database change is as simple as renaming a column. There are scenarios, in which you want to migrate data from one table to another during re-structuring and this cannot/should not be expressed within models.
[/collapse]

[collapse title="I am coming from TypeORM, how should I define column types?"]
  You do not. We follow the approach of **lean models** and do not define database level types and constraints inside models.
[/collapse]
