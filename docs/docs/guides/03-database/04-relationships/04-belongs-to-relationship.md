---
permalink: guides/model-relations/belongs-to
category: Relationships
group: Database
---

# BelongsTo
The `BelongsTo` relationship creates a **one-to-one** relationship between two models. It is always the inverse of `HasOne` or `HasMany`.

If the foreign key exists on the parent model, then it will always belong to a related model. For example: The `userId` exists on the `Profile` model, so it will have a belongs to relationship with the `User` model.

## Relationship models
Continuing with the profile and the user example. Following is the Profile model with `belongsTo` relationship.

```ts{}{app/Models/Profile.ts}
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Profile extends BaseModel {
  // Foreign key
  @column()
  public userId: number

  // highlight-start
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
  // highlight-end
}
```

The User model just needs the local key (primary key in most cases).

```ts{}{app/Models/User.ts}
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number
}
```

### Custom foreign key
By default, the `foreignKey` is the camelCase representation of the **related model name** and its primary key.

| Related Model Name | Primary Key | Foreign Key |
|-------------|-------------|-------------|
| User | id | `userId` |

However, you can also define a custom foreign key.

```ts
@belongsTo(() => User, {
  foreignKey: 'profileUserId',
})
public user: BelongsTo<typeof User>
```

### Custom local key
The local key is always the primary key of the **related model**, but can be defined explicitly.

```ts
@belongsTo(() => User, {
  localKey: 'uuid',
  foreignKey: 'profileUserId',
})
public user: BelongsTo<typeof User>
```

## Table structure
Following is an example table describing the relationship at the database level.

[note]
Lucid models doesn't rely on the database level foreign key constraint. It just needs the columns to be present and must be of same data types.
[/note]

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1588083599/adonisjs.com/belongs-to.png)

## Preloading relationship
The preloading API for a belongs to relationship is already covered in the [introduction guide](/guides/model-relations/introduction#preloading-relationship).

## Persisting relationship
When working with a belongs to relationship, you are always associating or dissociating models with each other. For example: You never say, **create a user for this profile**. Instead, you say, **link profile to this user**.

In the true spirit of readability, a `belongsTo` relationship does not have `create` or `save` methods. It has `associate` and `dissociate` methods.

### `associate`

```ts
const user = await User.find(1)
const profile = new Profile()

profile.avatarUrl = 'foo.jpg'
profile.isActive = true

// Save profile with the user id of the user
await profile.related('user').associate(user)
```

### `dissociate`

```ts
const profile = await Profile.find(1)
await profile.related('user').dissociate()
```
