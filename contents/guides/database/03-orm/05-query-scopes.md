---
permalink: guides/models/query-scopes
category: Data Models
group: Database
---

# Query Scopes
Query scopes helps you extract fragments of a SQL query to their own methods. They are usually helpful in moving complex SQL queries behind 

## Creating a query scope
query scopes are defined as static functions on the model itself. For example:

```ts{10-12}{app/Models/Post.ts}
import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  scope // 👈 import scope
} from '@ioc:Adonis/Lucid/Orm'

export default class Post extends BaseModel {

  public static published = scope((query) => {
    query.where('publishedOn', '<=', DateTime.utc().toSQLDate())
  })

}
```

Now, you can use it as follows:

```ts
Post.query().apply((scopes) => scopes.published())
```

The query scopes can also accept arguments. For example: Creating a scope that accepts a user object to scope the projects they can view.

```ts
import { DateTime } from 'luxon'
import User from 'App/Models/User'
import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Project extends BaseModel {

  public static visibleTo = scope((query, user: User) => {
    if (user.isAdmin) {
      return
    }

    /**
     * Non-admin users can only view their own team's projects
     */
    query.where('teamId', user.teamId)
  })

}
```

You can use above defined scope as follows:

```ts
Project.query().apply((scopes) => scopes.visibleTo(auth.user))
```
