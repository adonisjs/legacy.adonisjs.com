### from
[signature args="(table: string)", returns="this"]
[signature args="(table: Dictionary<string, string>)", returns="this"]
[signature args="(table: QueryCallback<Builder>)", returns="this"]
[signature args="(table: ChainableContract)", returns="this"]

---

Define the query table. The `from` method accepts a single argument, which can be one of the following values:

```ts
Database.query().from('users')
Database.query().from('users as u')
```

An object to select the table and define an alias. The `key` is the alias and the `value` is the table name.

```ts
Database.query().from({ u: 'users' })
```


Define a sub-query from a callback

```ts
Database.query().from((query) => {
})
```

Define query builder instance as a sub query

```ts
Database.query().from(
  Database.query()
)
```

### select
[signature args="(columns: Dictionary<string, string>)", returns="this"]
[signature args="(columns: ValueWithSubQueries<string>[])", returns="this"]
[signature args="(...columns: ValueWithSubQueries<string>[])", returns="this"]
[signature args="(column: '*')", returns="this"]

---

Select one or more table columns.

```ts
Database.query().select('*')
Database.query().select(['id', 'title', 'content'])
Database.query().select('id', 'title', 'content')
```

You can also define a sub query

```ts
Database.query().select(
  Database.query().count('* as total').from('comments')
)
```

### where `()` **this**

### `orWhere`

### `andWhere`

### `whereNot`

### `orWhereNot`

### `andWhereNot`

### `whereIn`

### `orWhereIn`

### `andWhereIn`

### `whereNotIn`

### `orWhereNotIn`

### `andWhereNotIn`

### `whereNull`

### `orWhereNull`

### `andWhereNull`

### `whereNotNull`

### `orWhereNotNull`

### `andWhereNotNull`

### `whereExists`

### `orWhereExists`

### `andWhereExists`

### `whereNotExists`

### `orWhereNotExists`

### `andWhereNotExists`

### `whereBetween`

### `orWhereBetween`

### `andWhereBetween`

### `whereNotBetween`

### `orWhereNotBetween`

### `andWhereNotBetween`

### `whereRaw`

### `orWhereRaw`

### `andWhereRaw`

### `join`

### `innerJoin`

### `leftJoin`

### `leftOuterJoin`

### `rightJoin`

### `rightOuterJoin`

### `fullOuterJoin`

### `crossJoin`

### `joinRaw`

### `having:`

### `orHaving`

### `andHaving`


### `havingIn`

### `orHavingIn`

### `andHavingIn`


### `havingNotIn`

### `orHavingNotIn`

### `andHavingNotIn`


### `havingNull`

### `orHavingNull`

### `andHavingNull`


### `havingNotNull`

### `orHavingNotNull`

### `andHavingNotNull`


### `havingExists`

### `orHavingExists`

### `andHavingExists`


### `havingNotExists`

### `orHavingNotExists`

### `andHavingNotExists`


### `havingBetween`

### `orHavingBetween`

### `andHavingBetween`


### `havingNotBetween`

### `orHavingNotBetween`

### `andHavingNotBetween`


### `havingRaw`

### `orHavingRaw`

### `andHavingRaw`


### `distinct`


### `groupBy`

### `groupByRaw`


### `orderBy`

### `orderByRaw`


### `union`

### `unionAll`


### `intersect`


### `with`

### `withRecursive`


### `withSchema`

### `as`


### `offset`

### `limit`


### `clearSelect`

### `clearWhere`

### `clearOrder`

### `clearHaving`

### `clearLimit`

### `clearOffset`


### `forUpdate`

### `forShare`


### `skipLocked`

### `noWait`
