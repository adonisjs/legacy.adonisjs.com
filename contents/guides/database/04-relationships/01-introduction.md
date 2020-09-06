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

```ts{5-6}{app/Models/User.ts}
import { column, BaseModel, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Profile from 'App/Models/Profile'

export default class User extends BaseModel {
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>
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

Similarly, you can use the following decorators and types to define other relationships.

```ts
import {
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
  manytoMany,
  ManyToMany,
  hasManyThrough,
  HasManyThrough
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @manyToMany(() => Skill)
  public skills: ManyToMany<typeof Skill>

  @hasManyThrough(() => Project, () => Team)
  public projects: HasManyThrough<typeof Project>
}
```

## Preloading relationship
Preloading (or eager-loading) is one of the most common tasks you will perform when working with relationships. For example: Fetch all users along with their profile.

```ts
const users = await User
  .query()
  .preload('profile') // 👈

users.forEach((user) => console.log(user.profile))
```

You can also lazy-load relationships for an existing model instance. For example:

```ts
// Reference to logged in user
const user = auth.user

// Preload profile for the user
await user.preload('profile')

// Access profile
console.log(user.profile)
```

### Preloading multiple relations
Call the `preload` method for multiple times to preload multiple relationships.

```ts
const users = await User
  .query()
  .preload('profile') // preload profile
  .preload('emails') // preload emails

users.forEach((user) => {
  console.log(user.profile)
  console.log(user.emails)
})
```

### Relationship constraints
When preloading relationships, you can also define constraints by passing a callback as the 2nd parameter.

When fetching related data, you can also define constraints on the relationship query builder. In the following example, only the **verified emails** will be fetched from the database.

```ts
User.query().preload('emails', (query) => {
  query.where('isVerified', true)
})
```

## Preloading nested relationship
You can preload nested relationships by calling the `preload` method on the relationship query builder. Consider the following example.

```ts
const user = auth.user
await user.preload('profile', (query) => {
  query.preload('address')
})

console.log(user.profile)
console.log(user.profile.address)
```

## Access to the direct query builder
You are not only limited to preloading relationships. You can also get direct access to the relationship query builder as shown in the following example.

[note]

Unlike preloading, the query results are returned directly and not persisted on the parent model instance.

[/note]

```ts
const user = await User.find(1)

const activeEmails = user
  .related('emails')
  .query()
  .where('isActive', true)
```

The same query builder can also be used to delete related rows.

```ts
user.related('emails')
  .query()
  .where('isActive', false)
  .delete()
```

## Querying relationship existence
Lucid simplifies the job of querying the relationship existence without writing the join queries manually by hand. Consider the following example

```ts
const userWithTeams = await User.query().has('team')
```

You can also define the number of rows you expect the join query to return. For example: Select all users, who have enrolled for more than two courses.

```ts
const veterans = await User.query().has('courses', '>', 2)
```

Let's take a step further and also add a constraint to select courses with 100% completion. This time, we will be using `whereHas` instead of `has`.

[tip]

The `wherePivot` method is only available for `manyToMany` relationship and prefixes the pivot table name to prevent column name conflicts.

[/tip]

```ts
const veterans = await User
  .query()
  .whereHas('courses', (query) => {
    query.wherePivot('completion_percentage', 100)
  }, '>', 2)
```

### Other relationship existence methods
Following is the list of other similar methods to query the relationship existence.

- `orHas`: Defines an `or where exists` clause.
- `doesntHave`: Opposite of `has`.
- `orDoesntHave`: Opposite of `orHas`.


- `orWhereHas`: Defines an `orWhere` clause.
- `whereDoesntHave`: Opposite of `whereHas`.
- `orWhereDoesntHave`: Opposite of `orWhereHas`.

## Counting related rows
You can make use of the `withCount` method to count the number of related rows. For example: Count the number of posts a user has written.

```ts
const users = await User.query().withCount('posts')
```

Now, you can access the count of posts as shown below.

```ts
users.forEach((user) => {
  console.log(user.$extras.posts_count)
})
```

Moving forward, you can also define custom constraints to the count query. For example: Count only the number of **published posts** a user has written.

```ts
const users = await User.query().withCount('posts', (query) => {
  query.where('isPublished', true)
})
```

### Custom count alias
You can also define a custom alias for the count query results using the `as` method.

```ts
const users = await User.query().withCount('posts', (query) => {
  query.as('totalPosts')
})

users.forEach((user) => {
  console.log(user.$extras.totalPosts)
})
```

### Custom aggregates
The `withCount` method is not only limited to the number of rows. You can also use a custom SQL aggregate method. For example: Get sum of total marks scored by a user.

```ts
const users = await User.query().withCount('exams', (query) => {
  query.sum('marks').as('totalMarks')
})

users.forEach((user) => {
  console.log(user.$extras.totalMarks)
})
```

## On Query Hook
Every time you define a relationship, you can also attach an `onQuery` hook with it and this can allow you to create variants of your relationship. For example:

```ts{8-11}
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import UserEmail from 'App/Models/UserEmail'

export default class User extends BaseModel {
  @hasMany(() => UserEmail)
  public emails: HasMany<typeof UserEmail>

  @hasMany(() => UserEmail, {
    onQuery: (query) => query.where('isActive', true)
  })
  public activeEmails: HasMany<typeof UserEmail>
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

```ts{9}
const user = new User()
user.email = 'virk@adonisjs.com'
user.password = 'secret'

const profile = new Profile()
profile.avatarUrl = 'foo.jpg'
profile.isActive = true

user.$trx = await Database.transaction()

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

await user.related('profile').updateOrCreate(searchPayload, savePayload)
```
