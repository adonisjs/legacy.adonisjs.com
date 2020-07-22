---
permalink: guides/model-relations/has-one
category: Relationships
group: Database
---

# Has One
The `HasOne` relationship creates a **one-to-one** relationship between two models.  A great example of this is **a user has one profile**.

## Relationship models
Continuing with the user and the profile example. Following is the User model with the `hasOne` relationship.

```ts{}{app/Models/User.ts}
import { column, BaseModel, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Profile from 'App/Models/Profile'

export default class User extends BaseModel {
  // highlight-start
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>
  // highlight-end
}
```

The Profile model must have a foreign key column `userId` defined on it.

```ts{}{app/Models/Profile.ts}
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {
  // highlight-start
  @column()
  public userId: number
  // highlight-end
}
```

### Custom foreign key
By default, the `foreignKey` is the camelCase representation of the **parent model name** and its primary key.

| Parent Model Name | Primary Key | Foreign Key |
|-------------|-------------|-------------|
| User | id | `userId` |

However, you can also define a custom foreign key.

```ts
@hasOne(() => Profile, {
  foreignKey: 'profileUserId',
})
public profile: HasOne<typeof Profile>
```

### Custom local key
The local key is always the primary key of the **parent model**, but can be defined explicitly.

```ts
@hasOne(() => Profile, {
  localKey: 'uuid',
  foreignKey: 'profileUserId',
})
public profile: HasOne<typeof Profile>
```

## Table structure
Following is an example table describing the relationship at the database level.

[note]
Lucid models doesn't rely on the database level foreign key constraint. It just needs the columns to be present and must be of same data types.
[/note]

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1588081758/adonisjs.com/has-one.png)

## What's next?
The preloading and persistance API for a has one relationship is already covered in the [introduction guide](/guides/model-relations/introduction#preloading-relationship), we recommend reading all of the the sections.
