---
permalink: guides/database/factories
group: Database
---

# Model factories
Have you ever written tests, in which the first **15-20 lines** of each test are dedicated to just setting up the database state by using multiple models? With model factories, you can extract all this setup to a dedicated file and then write the bare minimum code to setup the database state.

By the end of this guide, you will know:

- How to create and use factories
- How to define factory states
- Working with model relationships
- Using the faker API to generate and use random data

## Creating factories

Model factories are stored inside `databases/factories` directory. You can define all factories within a single file or create dedicated files for each model, the choice is yours.

Unlike seeders or models, the factories are declarative in nature as shown in the following example:

```ts{}{database/factories/index.ts}
import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .build()
```

- The `Factory.define` method accepts a total of two arguments.
- The first argument is reference to the Lucid model.
- The second argument is a callback that returns an object of properties to be used when persisting the model instance. Make sure that you return an object with all the required properties, otherwise the database will raise `not null` exceptions.
- Finally, make sure to call the `build` method.

## Using factories
Using factories is quite simple. Just `import` the file and use the exported factories.

```ts
import { UserFactory } from 'Database/factories'

const user = await UserFactory.create()
```

In order to create multiple instances, you can make use of the `createMany` method.

```ts
const users = await UserFactory.createMany(10)
```

## Merging attributes
You can override the default set of attributes using the `.merge` method. For example:

```ts
await UserFactory
  .merge({ email: 'test@example.com' })
  .create()
```

When creating multiple instances, you can define an array of attributes and they will merge based upon their indexes. For example:

```ts
await UserFactory
  .merge([
    { email: 'foo@example.com' },
    { email: 'bar@example.com' },
  ])
  .createMany(3)
```

In the above example

- The first user will have the email of `foo@example.com`.
- The second user will have the email of `bar@example.com`.
- And, the third user will use the default email address, since the merge array has a length of 2.

## Factory states
Factory states allows you to define variations of your factories as states. For example: On a `Post` factory, you can have different states to **represent published and draft posts**.

```ts
import Factory from '@ioc:Adonis/Lucid/Factory'
import Post from 'App/Models/Post'

export const PostFactory = Factory
  .define(Post, ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(4),
      status: 'DRAFT',
    }
  })
  .state('published', (post) => post.status = 'PUBLISHED') // 👈
  .build()
```

By default, all posts will be created with `DRAFT` status. However, you can explicitly apply the `published` state to create posts with `PUBLISHED` status.

```ts
await PostFactory.apply('published').createMany(3)
await PostFactory.createMany(3)
```

## Relationships
Model factories makes it super simple to work with relationships. Consider the following example:

```ts
export const PostFactory = Factory
  .define(Post, ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(4),
      status: 'DRAFT',
    }
  })
  .build()

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .relation('posts', () => PostFactory) // 👈
  .build()
```

Now, you can create a `user` and its `posts` all together in one call.

```ts
const user = await UserFactory.with('posts', 3).create()
user.posts.length // 3
```

### Points to note
- The factory will find the type of relationship by inspecting the Lucid model. For example: If your model defines a `hasMany` relationship on `posts`, then factory will infer the same.
- A relationship first needs to be defined on the model and then only it can be defined on the Factory.
- Lucid will internally wrap all the database operations inside a transaction. So if a relationship persistance fails, the parent model persistance will be rolled back too.

### Applying relationship states
You can also apply states on a relationship by passing a callback to the `with` method.

```ts
const user = await UserFactory
  .with('posts', 3, (post) => post.apply('published'))
  .create()
```

Similarly, if you want, you can create few posts with the `published` state and few without it.

```ts
const user = await UserFactory
  .with('posts', 3, (post) => post.apply('published'))
  .with('posts', 2)
  .create()

user.posts.length // 5
```

Finally, you can also create nested relationships. For example: Create a user with **two posts** and **five comments for each post**.

```ts
const user = await UserFactory
  .with('posts', 2, (post) => post.with('comments', 5))
  .create()
```

## Stubbing database calls
In some cases, you may prefer to stub out the database calls and just want to create in-memory model instances. This is can achieved using the `makeStubbed` and `makeStubbedMany` methods.

```ts
const user = await UserFactory
  .with('posts', 2)
  .makeStubbed()

console.log(user.id) // <some-id>
console.log(user.$isPersisted) // false
```

The stubbed calls will never hit the database and will assign an in-memory numeric `id` to the model instances.

### Customizing stub id

[note]
When we say `id`. We mean the primary key of a model and not a fixed named attribute `id`.
[/note]

The stub id is just an in-memory counter, that keeps on increasing with every call. If required, you can define a custom method to generate stub ids in a different manner.

For example: Generating ids as a `BigInt` when using PostgreSQL `bigInteger` data type.

```ts
import Factory from '@ioc:Adonis/Lucid/Factory'

Factory.stubId((counter, model) => {
  return BigInt(counter)
})
```

You can make use of the `makeStubbed` hook to customize the id generation behavior for an individual factory.
```ts
Factory
  .define(Post, () => {
    return {}
  })
  .before('makeStubbed', (_, model) => {
    model.id = uuid.v4()
  })
```

## Runtime context
Every time you create a model instance from a factory, a runtime context is also created at the same time. The context is then passed to all the hooks, the `define` method callback and also the relationships.

Most of the time, you just want to access the `faker` object from the context. However, following are the available properties.

- **isStubbed**: A boolean to know, if the factory was instantiated in stub mode.
- **$trx**: A transaction object, under which all the database operations are wrapped. If you are running any database queries inside the factory hooks, then make sure to also wrap them inside the transaction.

Following is an example showcasing the callbacks that receives the runtime context `(ctx)`.

```ts
Factory
  .define(User, (ctx) => {
  })
  .before('create', (factory, model, ctx) => {
  })
  .after('create', (factory, model, ctx) => {
  })
  .state('admin', (model, ctx) => {
  })
  .build()
```

## Hooks
The factory exposes the following hooks to perform actions `before` or `after` certain events. You can also define multiple hooks for a single event.

```ts
Factory
  .define(Post, () => {})
  .before('create', () => {})
  .after('create', () => {})
```

| Lifecycle | Event | Description |
|-----------|-------|-------------|
| `before` | `create` | Invoked **before the insert** query. |
| `after` | `create` | Invoked **after the insert** query. |
| `before` | `makeStubbed` | Invoked **before the stubbed** call. |
| `after` | `makeStubbed` | Invoked **after the stubbed** call. |
| `after` | `make` | Invoked only **after** the model instance has been created. This hook is also invoked before the **before create** and **before makeStubbed** hooks. |

## Custom connections
Factories allows you to define a custom connection or query client at the time using them. For example:

```ts
await Factory.connection('tenant-1').create()
```

Also, you can pass a custom query client instance.
```ts
const queryClient = Database.connection('tenant-1')
await Factory.client(queryClient).create()
```

For the sake of API uniformity among the factories and the Lucid models, you can also define the `connection` or the `client` using the `query` method.

```ts
await Factory.query({ connection: 'tenant-1' }).create()
```

## Customizations
Finally, you can optionally customize the behavior of certain operations performed under the hood.

### `newUp`
By defining the `newUp` handler, you can customize the process of instantiating a model instance for a given factory.

```ts
Factory
  .define(User, () => {

  })
  .newUp((attributes, ctx) => {
    const user = new User()
    user.fill(attributes)

    return user
  })
  .build()
```

### `merge`
By defining the `merge` handler, you can customize the merge behavior.

```ts
Factory
  .define(User, () => {

  })
  .merge((user, attributes, ctx) => {
    user.merge(attributes)
  })
  .build()
```
