---
permalink: guides/model-relations/has-many
category: Relationships
group: Database
---

# Has Many
The `HasMany` relationship creates a **one-to-many** relationship between two models. A great example of this is **a user has many posts**.

## Relationship models
Continuing with the user and the posts example. Following is the User model with `hasMany` relationship.

```ts{5-6}{app/Models/User.ts}
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Post from 'App/Models/Post'

export default class User extends BaseModel {
  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}
```

The Post model must have a foreign key column `userId` defined on it.

```ts{}{app/Models/Post.ts}
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class Post extends BaseModel {
  @column()
  public userId: number
}
```

### Custom foreign key
By default, the `foreignKey` is the camelCase representation of the **parent model name** and its primary key.

| Parent Model Name | Primary Key | Foreign Key |
|-------------|-------------|-------------|
| User | id | `userId` |

However, you can also define a custom foreign key.

```ts
@hasMany(() => Post, {
  foreignKey: 'authorId',
})
public posts: HasMany<typeof Post>
```

### Custom local key
The local key is always the primary key of the **parent model**, but can be defined explicitly.

```ts
@hasMany(() => Post, {
  localKey: 'uuid',
  foreignKey: 'authorId',
})
public posts: HasMany<typeof Post>
```

## Table structure
Following is an example table describing the relationship at the database level.

[note]
Lucid models doesn't rely on the database level foreign key constraint. It just want the columns to be present and must be of same data types.
[/note]

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1588083599/adonisjs.com/has-many.png)

## Preloading relationship
The preloading API for a has many relationship is already covered in the [introduction guide](/guides/model-relations/introduction#preloading-relationship).

## Persisting relationship
Along with the API covered in the [introduction guide](/guides/model-relations/introduction#persisting-relations), a **has many** relationship also has methods for persisting multiple rows.

### `createMany`

```ts
const posts = await user.related('posts').createMany([
  {
    title: 'Adonis 101',
    body: 'Lorem Ipsum is simply dummy text'
  },
  {
    title: 'NodeJS 101',
    body: 'Lorem Ipsum is simply dummy text'
  }
])
```

### `saveMany`
Similar to `createMany`, but instead accepts an array of related model instances.

```ts
const post = new Post()
post.title = 'Adonis 101'
post.body = 'Lorem Ipsum is simply dummy text'

const post1 = new Post()
post1.title = 'NodeJS 101'
post1.body = 'Lorem Ipsum is simply dummy text'

const posts = await user.related('posts').saveMany([post, post1])
```
