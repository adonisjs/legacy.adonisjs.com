---
permalink: guides/models/crud-operations
category: Data Models
group: Database
---

# CRUD Operations
CRUD is an acronym for **Create**, **Read**, **Update** and **Delete**. Lucid models out of the box comes with the API required to perform CRUD operations. By the end of this guide, you will know:

- How to perform basic CRUD operations
- Using the query builder with Models to construct advanced queries
- How and when to use methods like `findOrCreate`, `createOrUpdate` and so on.

## Create
You can insert new rows to the database by using the `Model.create` method or by assigning properties to the model instance. For example:

```ts
import User from 'App/Models/User'

const user = new User()
user.username = 'virk'
user.email = 'virk@adonisjs.com'

await user.save()
console.log(user.$isPersisted) // true
```

- The `user.save` method will perform the insert query. 
- The `user.$isPersisted` flag returns `true` when the values has been persisted to the database.

Another option is to make use of the `create` method on the Model class itself.

```ts
import User from 'App/Models/User'

const user = await User.create({
  username: 'virk',
  email: 'virk@adonisjs.com',
})
console.log(user.$isPersisted) // true
```

## Read
The read operations can be performed using the shortcut methods defined on the Model or by using the query builder. Let's explore both

[note]
All queries executed using a Model returns an **array of Model instances** and **not plain JavaScript objects**. This is one of the differences between the standard query builder and the Model query builder.
[/note]

### Using shorthand methods
Following are some of the shorthand methods to query the table associated with the model.

```ts
const user = await User.all()
// SQL: SELECT * from "users" ORDER BY "id" DESC;
```

```ts
const user = await User.find(1)
// SQL: SELECT * from "users" WHERE "id" = 1 LIMIT 1;
```

```ts
const user = await User.findBy('email', 'virk@adonisjs.com')
// SQL: SELECT * from "users" WHERE "email" = 'virk@adonisjs.com' LIMIT 1;
```

```ts
const user = await User.first()
// SQL: SELECT * from "users" LIMIT 1;
```

All of the above methods except `all` comes with a `orFail` variation. Normally, when a row is not found, the query will return `null`. However, you can make it raise an exception instead of returning `null`.

```ts
const user = await User.findOrFail(1)
const user = await User.firstOrFail()
const user = await User.findByOrFail('email', 'virk@adonisjs.com')
```

The `orFail` variation will raise an `E_ROW_NOT_FOUND` exception with `404` statusCode. You can also [manually handle](/guides/http/exception-handling#the-handle-method) this exception to convert it to a desired response.

### Using the Query Builder
You can also use the standard query builder API with your models, and this makes models a lot more powerful, since you are not only limited to a handful of opinionated methods.

[note]
Even when using the query builder, the result will always contain **model instance(s)** and not plain JavaScript object(s).
[/note]

You can get an instance of query builder for your model using the `.query` method.

```ts
const users = await User
  .query() // 👈now have access to all query builder methods
  .where('country_code', 'IN')
  .orWhereNull('country_code')
```

To fetch a single row, you can make use of the `.first` method. There is also a `firstOrFail` method.

```ts
const users = await User
  .query()
  .where('country_code', 'IN')
  .orWhereNull('country_code')
  .first() // 👈 Adds `LIMIT 1` clause
```

## Update
The standard way to perform updates using the model is to first lookup the record and then update/persist it to the database.

```ts
const user = await User.findOrFail(1)
user.last_login_at = DateTime.local() // Luxon dateTime is used

await user.save()
```

### Why not use the update query directly
Another way to update the records is to manually perform an update using the query builder. For example:

```ts
await User.query().where('id', 1).update({ last_login_at: new Date() })
```

When using the above approach, you will miss a lot of models niceties.

- You will not be able to use the hooks API.
- You cannot use the luxon `DateTime` helpers.
- The `updated_at` column will not be updated, unless you manually update it or use a database level trigger.

We recommend not stressing much on the extra `select` query unless you are dealing with millions of updates per second and happy leaving the models features. 

## Delete
Similar to the `update` operation, in order to delete a row, you first fetch it from the database. For example

```ts
const user = await User.findOrFail(1)
await user.delete()
```

Again, in order for hooks to work, Lucid needs the instance of the model first. If you decide to use the query builder directly, then no hooks will be fired.

However, the direct query builder approach can be helpful for performing bulk deletes.

```ts
await User.query().where('is_verified', false).delete()
```

## Find Or Create
Models comes a lot of helpful methods to simplify the record creation by first finding them inside the database and performing the create query, only when the record doesn't exists.

### `firstOrCreate`
Search for record inside the database and create a new one, when the lookup fails. 

In the following example, we attempt to search a user with an email, but persist both the `email` and the `password`, when the initial lookup fails. In other words, the `searchPayload` and the `savePayload` are merged during the create call.

```ts
import User from 'App/Models/User'

const searchPayload = { email: 'virk@adonisjs.com' }
const savePayload = { password: 'secret' }

await User.firstOrCreate(searchPayload, savePayload)
```

### `fetchOrCreateMany`
The `fetchOrCreateMany` is similar to the `firstOrCreate` method, but instead you can create more than one rows. **This method is great for creating missing records**.

- You need to define a unique key as the first argument. The value for this key is used to determine, if the record exists in the database or not.
- The 2nd argument is an array of records to persist, but only the missing one's.

```ts
import User from 'App/Models/User'

const usersToCreate = [
  {
    email: 'foo@example.com',
  },
  {
    email: 'bar@example.com',
  },
  {
    email: 'baz@example.com',
  }
]

await User.fetchOrCreateMany('email', usersToCreate)
```

## Update Or Create
The update or create operations are similar in nature to the find or create, but instead, the existing rows inside the database are also updated.

### `updateOrCreate`
Search for record inside the database and update it, or create a new one, when no record has been found.

```ts
import User from 'App/Models/User'

const searchPayload = { email: 'virk@adonisjs.com' }
const persistancePayload = { password: 'secret' }

await User.updateOrCreate(searchPayload, savePayload)
```

### `updateOrCreateMany`
The `updateOrCreateMany` method is a great candidate for sync rows by avoid duplicate entries.

- You need to define a unique key as the first argument. The value for this key is used to determine, if the record exists in the database or not.
- The 2nd argument is an array of records to persist.

```ts
import User from 'App/Models/User'

const usersToCreate = [
  {
    email: 'foo@example.com',
  },
  {
    email: 'bar@example.com',
  },
  {
    email: 'baz@example.com',
  }
]

await User.updateOrCreateMany('email', usersToCreate)
```
