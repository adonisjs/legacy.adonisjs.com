---
permalink: guides/database/query-builder
group: Database
---

# Query Builder
The Database query builder provides you a fluent Javascript API for constructing SQL queries. By the end of this guide, you will know:

- How to construct and execute SQL queries
- Different types of query builders
- How to debug SQL queries

## Using the Query Builder
You can obtain an instance of query builder using the Database module. For example:

[codegroup]

```ts{}{Select All}
import Database from '@ioc:Adonis/Lucid/Database'

const users = await Database
  .from('users')
  .select('*')
```

```ts{}{Where Clause}
import Database from '@ioc:Adonis/Lucid/Database'

const users = await Database
  .from('users')
  .where('account_status', 'ACTIVE')
```

```ts{}{Limit and Offset}
import Database from '@ioc:Adonis/Lucid/Database'

const users = await Database
  .from('users')
  .where('account_status', 'ACTIVE')
  .limit(20)
  .offset(0)
```
[/codegroup]

Well, above is a very simple example of the query builder. You can also create complex queries using **joins**, **sub queries**, **aggregates** and a lot more.

### Switching Connections
The query builder instances uses the default connection defined inside the `config/database.ts` file. However, you can switch connections before creating a new query builder instance. For example:

```ts
const mysql = Database.connection('mysql')
const users = await mysql
  .query()
  .from('users')
  .select('*')
```

## Types of Query Builders
The `Database.from` method creates a query builder instance for selecting, updating or deleting rows. Also, this method is shortcut for `Database.query().from('<TABLE>')` method. Following is the list different query builders instances.

- Query builder for selecting, updating or deleting rows.
  ```ts
  Database.query().from('users')
  
  // Shortcut
  Database.from('users')
  ```
- Query builder for inserting new rows.
  ```ts
  Database.insertQuery().table('users')

  // Shortcut
  Database.table('users')
  ```
- Raw query builder for executing raw SQL queries. You will learn about raw queries later in this guide.
  ```ts
  Database.rawQuery('select * from users;')
  ```

## Fetching Rows
Fetching rows is as sample as executing a select query using the Database query builder. The result of a query is always an array of objects, even when a single row is returned from the database.

```ts
const users = await Database.query().select('*').from('users')
// an array of users
```

If you always want a single row from the result set, then you can make use of the `first` method.

[note]
The `first` method applies a `LIMIT` clause to the query.
[/note]

```ts
const user = await Database.query().select('*').from('users').first()
```

## Inserting Rows
You make use of the insert query builder for inserting new rows to the database. For example:

```ts
await Database
  .insertQuery() // 👈gives an instance of insert query builder
  .table('users')
  .insert({ username: 'virk', email: 'virk@adonisjs.com' })
```

The return value of the `insert` query is dependent on the database server in use.

- MySQL and SQLite will return the last inserted row id as an array with just one item. For example:
  ```ts
  const [ lastInsertId ] = await Database.table('users').insert({})
  ```
- For PostgreSQL, MSSQL and Oracle, you can make use of the `returning` method. The returning method can return a single column or multiple columns. For example:
  ```ts
  const [ id ] = await Database
    .table('users')
    .returning('id') 👈
    .insert({})

  // multiple columns
  const [{ username, id }] = await Database
    .table('users')
    .returning(['id', 'username']) 👈
    .insert({})
  ```

### Multi Insert
You can also bulk insert rows using the `multiInsert` method.

[note]
MySQL and SQLite only returns the id for the last row and not all the rows.
[/note]

```ts
await Database.table('users').multiInsert([
  { username: 'virk' },
  { username: 'romain' },
])
```

## Updating and Deleting Rows
You can update and delete rows by using the standard query builder. For example:

```ts
await Database
  .from('users')
  .where('username', 'virk')
  .update({ account_status: 'verified' })
```

Or delete

```ts
await Database
  .from('posts')
  .where('slug', 'dummy-post')
  .delete()
```

## Executing Raw Queries
You can also execute raw SQL queries by using the raw query builder.

[note]
Unlike the standard query builder response, the response of the `rawQuery` is not normalized. You must read the documentation of the underlying npm driver for same. 
[/note]

```ts
import Database from '@ioc:Adonis/Lucid/Database'

const user = await Database
  .rawQuery('select * from users where id = ?', [1])
```

## What's Next?
This guide introduces you to the concept of Query builder and how to use it inside your application. However, the API surface of the query builder is quite big and we recommend you reading the [API docs](/api/database/query-builder) for same.
