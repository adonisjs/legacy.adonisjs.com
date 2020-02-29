---
permalink: guides/database/query-builder
group: Database
---

# Query Builder
The Database query builder provides you the Javascript API for constructing single to advanced SQL queries. By the end of this guide, you will know:

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

Well, above is a very simple example of the query builder. You can also create complex queries using **joins**, **sub queries**, **aggregates** and lot more.

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

## Selecting Columns
