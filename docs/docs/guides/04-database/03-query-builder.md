---
permalink: guides/database/query-builder
group: Database
---

# Query Builder
The Database query builder is the first step towards constructing and executing SQL queries. Instead of writing SQL DSL by hand, you make use of the Javascript API for constructing queries.

By the end of this guide, you will know:

- How to construct and execute SQL queries
- Using different types of query builders for executing insert, select or raw queries

## Using the Query Builder
You can get an instance of query builder using the Database module. For example:

```ts
import Database from '@ioc:Adonis/Lucid/Database'
const users = await Database.query().select('*').from('users')
```

- The `Database.query` method creates a new query builder instance.
- The `select` method is used to select the columns.
- Finally the `from` method specifies the database table for the query.
- The result of the query is always an array of objects, unless the `.first` method is used.

Just like the `select` and the `from` methods, there are many more methods on the query builder to construct advanced and complex SQL queries.

## Types of Query Builders
The `Database.query` method creates a query builder instance for **selecting**, **updating** or **deleting** rows. Whereas, to insert new data, you have to make use of the `insert query builder`.

Following is the list different query builders instances.

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
- For PostgreSQL, MSSQL and Oracle, you can make use of the `returning` method. The returning method can return value for a single column or multiple columns. For example:
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
You can also perform bulk inserts using the `multiInsert` method.

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
Raw queries allows to execute a SQL from a string input. This is usually helpful, when you want to execute complex queries that are not supported by the standard query builder.

[note]
Unlike the standard query builder response, the response of the `rawQuery` is not normalized. You must read the documentation of the underlying npm driver for same.
[/note]

```ts
import Database from '@ioc:Adonis/Lucid/Database'

const user = await Database
  .rawQuery('select * from users where id = ?', [1])
```

## Aggregates
The aggregate methods like `count`, `min`, `avg` returns an array with the aggregate key and its value. For example:

```ts
const total = Database.query().count('*').from('users')

// SQLITE: [{ "count(*)": 4 }]
// POSTGRESQL: [{ "count": "4" }]
```

As you can notice, the output of `PostgreSQL` and `SQLite` is different and hence not predictable. To encounter this issue, it is recommended to always alias your aggregates.

```ts
await Database.query().count('* as total').from('users')

// SQLITE: [{ "total": 4 }]
// POSTGRESQL: [{ "total": "4" }]
```

## What's Next?
This guide introduces you to the concept of Query builder and how to use it inside your application. However, the API surface of the query builder is quite big and we recommend you reading the [API docs](/api/database/query-builder) for same.
