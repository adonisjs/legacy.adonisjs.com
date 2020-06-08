---
permalink: guides/models/hooks
category: Data Models
group: Database
---

# Hooks
Hooks are the actions that you can perform during a pre-defined life cycle event. Using hooks, you can encapsulate certain actions within your models vs writing them everywhere inside the codebase.

A great example of hooks is password hashing. Instead of hashing the user password everywhere inside your codebase, you can write it as a hook and the guarantee that user passwords will be persisted as plain text.

## Creating your first hook
Lets build on the password hashing example and define a hook to hash the user password before saving it to the database.

```ts{}{app/Models/User.ts}
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public password: string

  // highlight-start
  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.hash(user.password)
    }
  }
  // highlight-end
}
```

- The `beforeSave` hook is invoked before the `insert` and the `update` queries.
- Hooks can be async. So you can use the `await` keyword inside them.
- Hooks are always defined as static functions and receives the instance of the model as the first argument.

### Understanding the `$dirty` property
The `beforeSave` hook is called every time a new user is **created** or **updated** using the model instance. 

During update, it is possible that you have updated other properties and not the user password, hence there is no need to re-hash the existing hash and this is reason behind using the `$dirty` object.

The `$dirty` object only contains the changed values. So, you can check if password was changed and then hash the new value.


## Available Hooks
Following is the list of available hooks. Every hook comes with a `before` and `after` variation.

| Hook | Description |
|-------|------------|
| `beforeSave` | Invoked **before the insert or the update** query. Receives the model instance as the only argument. |
| `afterSave` | Invoked **after the insert or the update** query. Receives the model instance as the only argument.|
| `beforeCreate` | Invoked only **before the insert** query. Receives the model instance as the only argument.|
| `afterCreate` | Invoked only **after the insert** query. Receives the model instance as the only argument.|
| `beforeUpdate` | Invoked only **before the update** query. Receives the model instance as the only argument.|
| `afterUpdate` | Invoked only **after the update** query. Receives the model instance as the only argument.|
| `beforeDelete` | Invoked **before the delete** query. Receives the model instance as the only argument.|
| `afterDelete` | Invoked **after the delete** query. Receives the model instance as the only argument.|

### Example:
Import the required decorators.

```ts
import {
  BaseModel,
  beforeSave,
  afterSave,
  beforeCreate,
  afterCreate,
  beforeUpdate,
  afterUpdate,
  beforeDelete,
  afterDelete,
} from '@ioc:Adonis/Lucid/Orm'
```

Create static methods and use the appropriate decorator

```ts
export default class User extends BaseModel {
  @beforeSave()
  public static async hashPassword (user: User) {
  }

  @beforeDelete()
  public static async handleSoftDeletion (user: User) {
  }

  @afterUpdate()
  public static async createChangeRevision (user: User) {
  }
}
```

### `beforeFind`
The `beforeFind` hook is invoked just before the query is executed to a find a single row. This hook receives the query builder instance and you can attach your own constraints to it.

```ts
import {
  BaseModel,
  beforeFind,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Model'

export default class User extends BaseModel {
  @beforeFind()
  public static ignoreDeleted (query: ModelQueryBuilderContract<typeof User>) {
    query.whereNull('is_deleted')
  }
}
```

### `afterFind`
The `afterFind` event receives the model instance.

```ts
import {
  BaseModel,
  afterFind,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Model'

export default class User extends BaseModel {
  @afterFind()
  public static afterFindHook (user: User) {
  }
}
```

### beforeFetch
Similar to `beforeFind`, the `beforeFetch` hook also receives the query builder instance. However, this hook is invoked whenever a query is executed without using the `first` method.

### afterFetch
The `afterFetch` hook receives an array of model instances.

```ts
import {
  BaseModel,
  afterFetch,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Model'

export default class User extends BaseModel {
  @afterFetch()
  public static afterFetchHook (users: User[]) {
  }
}
```
