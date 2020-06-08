---
permalink: api/database/query-builder
group: Database
sidebarTitle: DatabaseQueryBuilder
---

# `class DatabaseQueryBuilder`
Database query builder exposes the API to construct SQL query using fluent chainable API. The query is executed implicitly and hence it is recommended to chain the `.then` and `.catch` promise methods or make use of the `await` keyword.

You can access an instance of the query builder using the `Database.query()` method.

```ts
import Database from '@ioc:Adonis/Core/Database'
Database.query() // DatabaseQueryBuilder
```

## Properties
- `hasAggregates`: A boolean to know if the query has aggregates or not.
- `hasGroupBy`: A boolean to know if the query has group by clauses or not.
- `hasUnion`: A boolean to know if the query has a union clause or not.
- `client`: Reference to the [QueryClientContract](QueryClientContract)

## Methods
[include path="./partials/_chainable_methods.md"]

### `clone`

### `first`

### `del`

### `delete`

### `forPage`

### `paginate`

### `update`

### `increment`

### `decrement`

### `count`

### `countDistinct`

### `min`

### `max`

### `sum`

### `avg`

### `avgDistinct`

[include path="./partials/_executable_methods.md"]
