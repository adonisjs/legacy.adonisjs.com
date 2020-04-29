---
permalink: guides/models/serializing-models
category: Data Models
group: Database
---

# Serializing Models
If you are creating a RESTful API server, then you would want to serialize your model instances to JSON before sending them back in a response. In this guide, we will go through the serialization API.

## Serializing a model
You can serialize a model to a plain object by using `serialize` or `toJSON` methods. The `toJSON` is just an alias for the former one. For demonstration, lets create a model and serialize it.

```sh
node ace make:model Post
```

Open the newly created file and paste the following contents inside it.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public slug: string

  @column()
  public body: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
```

For the sake of simplicity, we will create an instance locally and then call the `serialize` method.

```ts
const post = new Post()
post.title = 'Adonis 101'
post.slug = 'adonis-101'
post.body = 'Some dummy content'
post.createdAt = DateTime.local()
post.updatedAt = DateTime.local()

console.log(post.serialize())
```

Output

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1587745931/adonisjs.com/lucid-serialize-basic.png)

### Points to note
- The `serialize` method only includes the properties using the `@column` decorator. Everything else is ignored.
- The property names are converted from `camelCase` to `snake_case`, since majority of APIs use `snake_case` property names.
- The Luxon date objects are converted to `ISO` date-time strings.

## Customizing property names
By default, Lucid will convert `camelCase` property names to `snake_case`. However, you can easily customize the property names by using the `serializeAs` option. For example:

```ts
export default class Post extends BaseModel {
  @column.dateTime({
    autoCreate: true,
    // highlight-start
    serializeAs: 'creation_date',
    // highlight-end
  })
  public createdAt: DateTime
}
```

```ts
console.log(post.serialize())

/**
  Output
  {
    ...,
    creation_date: '2020-04-24T21:54:12.727+05:30',
  }
*/
```

## Hiding properties

To hide a property from getting serialized, you can set `serializeAs = null`.

```ts
export default class Post extends BaseModel {
  // highlight-start
  @column({ serializeAs: null })
  // highlight-end
  public slug: string
}
```

```ts
console.log(post.serialize())

/**
  Output
  {
    title: 'Adonis 101',
    body: 'Some dummy content',
    created_at: '2020-04-24T21:54:12.727+05:30',
    updated_at: '2020-04-24T21:54:12.746+05:30'
  }
*/
```

## Customizing value
Along with the serialized property names, you can also customize the value of a given column by defining a custom `serialize` method.

```ts
export default class Post extends BaseModel {
  @column.dateTime({
    autoCreate: true,
    // highlight-start
    serialize: (value?: DateTime) => {
      return value ? value.setZone('utc').toISO() : value
    },
    // highlight-end
  })
  public createdAt: DateTime
}
```

## Serializing relationships
The `serialize` method recursively serializes all the preloaded relationships by invoking the same method on the related models. Consider the following example.

```ts{}{app/Models/User.ts}
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Post from 'App/Models/Post'

export class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}
```

In the above model definition, **a user has many posts**. Lets run a query to select all the posts for a given user and then serialize the user model instance.

```ts
import User from 'App/Models/User'

const user = await User
  .query()
  .where('id', 1)
  .preload('posts') // 👈preloading posts
  .firstOrFail()

console.log(user.serialize())
```

Output

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1587755092/adonisjs.com/lucid-serialize-relations.png)

### Customizing relationship name
You can customize the property name for the serialized relationship.

```ts
export class User extends BaseModel {
  @hasMany(() => Post, {
    // highlight-start
    serializeAs: 'writings'
    // highlight-end
  })
  public posts: HasMany<typeof Post>
}
```

## Computed properties
As stated earlier, the `serialize` method ignores all the model properties except the one using the `@column` decorator. 

There will be time, when you want to include custom properties inside the serialized output, but without defining them inside the database, and this is where the computed properties comes into the picture.

```ts
import { DateTime } from 'luxon'
import truncatise from 'truncatise'
import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Post extends BaseModel {
  @column()
  public body: string

  @computed()
  public get excerpt () {
    return truncatise(this.body, { TruncateLength: 50 })
  }
}
```

The properties using the `@computed` decorator will be included inside the serialized output.

[note]
The serialization process is synchronous and hence you cannot use `async/await` on the computed properties.
[/note]
