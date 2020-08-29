---
permalink: guides/model-relations/has-many-through
category: Relationships
group: Database
---

# Has Many Through
The `HasManyThrough` relationship allows you define an indirect relationship between two models. For example: **Users have posts** and **users belongs to a country**, hence you should be able to find posts for a country via user.

## Relationship models
Continuing with the users, countries and posts. You will have to define following three models.

```ts{}{app/Models/Country.ts}
import User from 'App/Models/User'
import Post from 'App/Models/Post'

import {
  column,
  BaseModel,
  hasManyThrough,
  HasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'

export default class Country extends BaseModel {
  @hasManyThrough(() => Post, () => User)
  public posts: HasManyThrough<typeof Post>
}
```

- The `hasManyThrough` decorator needs a total of two models. 
- The first model represents the values to fetch.
- The second model works as a bridge for the through relationship to work.

The `User` model must have the `countryId` foreign key.

```ts{}{app/Models/User.ts}
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column()
  public countryId: number
}
```

The `Post` model must have the `userId` foreign key.

```ts{}{app/Models/Post.ts}
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class Post extends BaseModel {
  @column()
  public userId: number
}
```

## Table Structure
Following is an example table describing the relationship at the database level. As you can notice, there is no direct relationship between countries and posts. However, the users table will work as a bridge for same.

![](https://res.cloudinary.com/adonis-js/image/upload/v1596958724/adonisjs.com/has-many-through_u6gkjr.png)

## Preloading relationship
The preloading API for a has many through relationship is already covered in the [introduction guide](/guides/model-relations/introduction#preloading-relationship).

## Persisting relationship
There is no persistence API for has many through relationship. You must use direct relationships for inserting and updating values.
