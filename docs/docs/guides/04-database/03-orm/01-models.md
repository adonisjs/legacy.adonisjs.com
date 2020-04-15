---
permalink: guides/orm/models
category: Lucid ORM
group: Database
---

# Models
Along with the Database query builder, Lucid also comes with an implementation of [Active record pattern](https://en.wikipedia.org/wiki/Active_record_pattern) to simplify the database interactions. By the end of this guide, you will know:

- More about the Active record pattern
- The API exposed by Lucid to manipulate data stored in a relational database
- Working with dates and times inside Lucid models

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
  user.dob = DateTime.fromJSDate(user.job).toFormat('dd LLL yyyy')
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
return users.toJSON() // date is formatted during `toJSON` call
```

This is just one example, but it does convey the gist of using Models.

## Lucid implementation
Lucid offers you a rich API for modeling your database interactions and relationships using data models. It has the ability to:

1. Define models and persist, fetch or delete their data.
2. Handle relationships between multiple models.
3. Serialize models to JSON with option to customize the serialization process.
4. Hook into the database operations life-cycle to simplify repetitive tasks. 

## Getting Started
Assuming you already have lucid [setup](/guides/database/setup), run the following command to create your first data model.

```sh
node ace make:model User

# ✔  create    app/Models/User.ts
```

Open the newly created file and replace its content with the following code snippet.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
```

- The `User` model will conventionally query the `users` table. You can customize the table name by defining `public static table = 'my_users'` property.
- All properties using `@column` decorator are the table column names. This is required for Lucid to distinguish between standard model properties and the table columns.

The Model itself doesn't
