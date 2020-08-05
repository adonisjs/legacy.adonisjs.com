---
permalink: guides/model-relations/introduction
category: Relationships
group: Database
---

# Introduction
The data models in Lucid has out of the box support for working with relationships. You don't have to worry about writing complex SQL joins by yourself, just setup the relationships on your models and everything will work as expected.

By the end of this guide, you will know:

- The types of relationships supported by Lucid
- How to define and query relationship
- How to preload relationships

## Supported relationships
Lucid supports the following relationships

- **HasOne**: User has one profile.
- **HasMany**: User has many posts.
- **BelongsTo**: A post belongs to a user.
- **ManyToMany**: A post has many tags. Also a tag belongs to many post.
- **HasManyThrough**: A team has many posts through the users of that team.

## Defining relationships
Lets begin by creating two models and then define relationships between them. We will be using a `hasOne` relationship in this example. However, the process of defining relationship is same for every other relationship type.

```sh
node ace make:model User
node ace make:model Profile
```

The User model.

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

The Profile model. It must have a `userId` foreign key column for the relationship to work.

```ts{}{app/Models/Profile.ts}
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {
  public userId: number
}
```

### Points to note
- The `User` model uses the `hasOne` decorator to setup the relationship with the `Profile` model.
- It also uses a `HasOne` type on the `profile` property. It is required to **distinguish between relationships and other model properties** for better intellisense support.
- The `Profile` model must have the `userId` foreign key column.

## Preloading relationship
Most of the times, you will find yourself eager-loading relationships. For example: Fetch all users, along with their profile.

```ts
const users = await User.query().preload('profile')
users.forEach((user) => console.log(user.profile))
```

You can also lazy-load relationships from a given model instance. For example: You already have access to the `user` model instance from the auth module and you want to preload the profile.

```ts
const user = auth.user
await user.preload('profile')

console.log(user.profile)
```

## Preloading nested relationship

Imagine you user model has a relation to profile, and profile model has a relation to address. You can preload an element of a relationship by passing a preload function as a second argument:

```ts
const user = auth.user
await user.preload('profile', (query) => {
  query.preload('address')
})

console.log(user.profile)
```

### Multiple relations
You can also preload multiple relations, by calling the method for multiple times.

```ts
const users = await User.query().preload('profile').preload('emails')

users.forEach((user) => {
  console.log(user.profile)
  console.log(user.emails)
})
```
If you already have loaded a module, you can preload multiple relations by passing a function to preload method:

```ts
const user = auth.user
await user.preload((query) => {
  query.preload('profile').preload('emails')
})

console.log(user.profile)
```

### Relationship constraints
When fetching related data, you can also define constraints using the relationship query builder.

```ts
User.query().preload('emails', (query) => {
  query.where('isVerified', true)
})
```

As you can notice, the `preload` method accepts a callback, which receives a standard query builder instance and you can modify the query as you want.

## Access to the direct query builder
You are not only limited to preloading relationships. You can also access have direct access to the relationship query builder. For example:

```ts
const user = await User.find(1)

const activeEmails = user
  .related('emails')
  .query()
  .where('isActive', true)
```

When you access the relationship query builder directly, then the output of that query is return directly and not defined on the parent model.

## On Query Hook
Every time you define a relationship, you can also attach an `onQuery` hook with it and this can allow you to create variants of your relationship. For example:

```ts
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import UserEmail from 'App/Models/UserEmail'

export default class User extends BaseModel {
  @hasMany(() => UserEmail)
  public emails: HasMany<typeof UserEmail>

  // highlight-start
  @hasMany(() => UserEmail, {
    onQuery: (query) => query.where('isActive', true)
  })
  public activeEmails: HasMany<typeof UserEmail>
  // highlight-end
}
```

As you can notice, we have defined two relationships on the same model. However, the `activeEmails` relationship adds a `where` constraint to limit the results to only active emails.

```ts
await User.query().preload('activeEmails')

// direct access
const user = await User.find(1)
const activeEmails = user.related('activeEmails').query()
```

## Persisting relations
Lucid persist relationships as actions and not trees. Using actions allows you to tweak the persistance behavior by passing runtime arguments, whereas with trees, the behavior is always static.

Here's an example of creating the user and their profile.

```ts
const user = new User()
user.email = 'virk@adonisjs.com'
user.password = 'secret'

const profile = new Profile()
profile.avatarUrl = 'foo.jpg'
profile.isActive = true

await user.related('profile').save(profile)
```

The `related().save` method will wrap both the insert calls inside a transaction. However, you can also define a custom transaction by setting it on the parent model. For example:

```ts
const user = new User()
user.email = 'virk@adonisjs.com'
user.password = 'secret'

const profile = new Profile()
profile.avatarUrl = 'foo.jpg'
profile.isActive = true

// highlight-start
user.$trx = await Database.transaction()
// highlight-end

try {
  await user.related('profile').save(profile)
  await user.$trx.commit()
} catch (error) {
  await user.$trx.rollback()
}
```

When the transaction object is created by you, then the internals of Lucid will not `commit` or `rollback` that transaction and hence you must do it.

### Using `create` method
There is also a shorthand to persist relationships, without creating an instance of the related model.

```ts
const user = new User()
user.email = 'virk@adonisjs.com'
user.password = 'secret'

await user.related('profile').create({
  avatarUrl: 'foo.jpg',
  isActive: true
})
```

In the above example, we have replaced the `save` method with the `create` method. Also, instead of passing an instance of the `profile` model, you can pass a plain object to the `create` method.

## Avoid duplicates during persistance
Since, Lucid makes use of actions for persisting relationships. You can use methods like `firstOrCreate`, `updateOrCreate` and so on, to avoid creating duplicate rows.

### `firstOrCreate`
Search for record inside the database and create a new one, when the lookup fails. This method is a perfect choice for persisting `hasOne` relationships.

[note]
The method behaves similar to the model's [firstOrCreate](/guides/models/crud-operations#find-or-create) method.
[/note]

In the following example, the profile will only be created, if it doesn't already exists.

```ts
const user = new User()
user.email = 'virk@adonisjs.com'
user.password = 'secret'

const searchPayload = {}
const savePayload = {
  avatarUrl: 'foo.jpg',
  isActive: true,
}

await user.related('profile').firstOrCreate(searchPayload, savePayload)
```

### `updateOrCreate`
Similar to the `firstOrCreate`, this method also updates the existing row, instead of fetching it.

```ts
const user = new User()
user.email = 'virk@adonisjs.com'
user.password = 'secret'

const searchPayload = {}
const savePayload = {
  avatarUrl: 'foo.jpg',
  isActive: true,
}

await user.related('profile').updateOrCreate()
```
