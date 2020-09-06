---
permalink: guides/database/transactions
group: Database
---

# Transactions
Being a SQL ORM, Lucid has first class support for Transactions and save points. By the end of this guide, you will know:

- How to create and manage transactions
- How to create nested transactions (aka save points)
- Using transactions with Lucid models
- Persisting relationships inside a transaction

## Working with Transactions
Creating a new transaction is as simple as executing the `database.transaction` method.

```ts
import Database from '@ioc:Adonis/Lucid/Database'
const trx = await Database.transaction() // notice it is an async method
```

Once you have received the transaction instance, you can use it to execute queries.

[codegroup]

```ts{}{Insert}
await trx
  .insertQuery()
  .table('users')
  .insert({ username: 'virk' })
```

```ts{}{Select}
await trx
  .query()
  .select('*')
  .from('users')
```

[/codegroup]

Finally, make sure to `commit` or `rollback` the transaction. For example:

```ts
const trx = await Database.transaction()

try {
  await trx
    .insertQuery()
    .table('users')
    .insert({ username: 'virk' })

  await trx.commit()
} catch (error) {
  await trx.rollback()
}
```

Voila! You have just created and used a transaction.

### Points to Note
- Just like the `Database` object, you can also use the `trx` object to create new instances of the query builder.
- The `trx.commit` and `trx.rollback` methods are async, so do make sure to put `await` in front of them.
- Lucid reserves a dedicated connection as soon as `Database.transaction()` method is called and releases the connection after commit or rollback actions.

## Managed Transactions
The above example expects you to manually `commit` or `rollback` transactions by wrapping your code inside a `try/catch` block. A managed transaction does this automatically for you. For example:

```ts
await Database.transaction(async (trx) => {
  await trx
    .insertQuery()
    .table('users')
    .insert({ username: 'virk' })
})
```

- Passing a `callback` to the `Database.transaction` method starts a managed transaction.
- The transaction auto commits after executing the callback.
- If callback raises an exception, the transaction will be rolled back automatically and re-throws the exception.
- You can also return a value from the callback and then access it at the top level scope. For example:
  ```ts
  const userId = await Database.transaction(async (trx) => {
    const response = await trx
      .insertQuery()
      .table('users')
      .insert({ username: 'virk' })

    return response[0] // 👈 return value
  })
  ```

## Passing Transaction as a Reference
The transactions API is not only limited to creating a query builder instance from a transaction object. You can also pass it around to existing query builder instances or models.

```ts
import Database from '@ioc:Adonis/Lucid/Database'
const trx = await Database.transaction()

Database
  .insertQuery({ client: trx }) 👈
  .table('users')
  .insert({ username: 'virk' })
```

Or pass it at a later stage using `useTransaction` method.

```ts
import Database from '@ioc:Adonis/Lucid/Database'
const trx = await Database.transaction()

Database
  .insertQuery()
  .table('users')
  .useTransaction(trx) 👈
  .insert({ username: 'virk' })
```

## Save points
Every time you create a nested transaction, Lucid behinds the scenes creates a new [savepoint](https://en.wikipedia.org/wiki/Savepoint). Since transactions needs a dedicated connection, using savepoints reduces the number of required connections.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

// Transaction is created
const trx = await Database.transaction()

// This time a save point is created
const savepoint = await trx.transaction()

 // also rollbacks the savepoint
await trx.rollback()
```

## Using Transactions with Lucid Models
You can also make use of transactions when persisting or fetching rows using a Lucid model. For example:

```ts{8-9}
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

await Database.transaction(async (trx) => {
  const user = new User()
  user.username = 'virk'

  user.useTransaction(trx)
  await user.save()
})
```

As soon as the transaction is completed, the Model will release the `trx` reference.

### Model Query Builder
Just like the standard query builder, you can also pass the transaction to the model query builder.

```ts
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

const trx = await Database.transaction()

const users = await User
  .query({ client: trx }) 👈
  .where('is_active', true)
```

### Persisting Relationships Inside a Transaction
The most common use case for transactions is to persist relationships. Consider the following example of **creating a new user** and **their profile** by wrapping them inside a single transaction.

```ts{11-14}
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

await Database.transaction(async (trx) => {
  const user = new User()
  user.username = 'virk'

  user.useTransaction(trx)
  await user.save()

  await user.related('profile').create({
    fullName: 'Harminder Virk',
    avatar: 'some-url.jpg',
  })
})
```

In the above query, the `related('profile').create` method will automatically use the transaction object assigned to the `User` model.
