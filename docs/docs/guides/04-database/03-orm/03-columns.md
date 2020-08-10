---
permalink: guides/models/columns
category: Data Models
group: Database
---

# Columns
Columns are the properties defined on a model and are decorated using the `@column` decorator. The `@column` decorator is required to distinguish between the database columns and the other properties of a model. 

By the end of this guide, you will know:

- How columns are defined on a model
- Configuration options for a column
- How to define `date` and `datetime` columns

## Defining columns
The columns are defined using the `@column` decorator. For example:

```ts
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string
}
```

You can also define extra properties or methods on your model and unless they are not using the `@column` decorator, Lucid will ignore them. For example:

```ts
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fullName: string

  // highlight-start
  public get initials () {
    const [first, last] = this.fullName.split(' ')
    return `${first.charAt(0)}${last.charAt(0)}`
  }
  // highlight-end
}
```

The `initials` property doesn't exists inside the database table. It's computed on the fly.

## Column Types
Lucid has a total of three different column types.

### `@column`
The `@column` decorator is used to mark any model property a database table column. There is **no concept of defining database types or constraints** on the models. Lucid follows the approach of keeping the models lean.

```ts
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  /** Number column */
  @column({ isPrimary: true })
  public id: number

  /** String column */
  @column()
  public fullName: string

  /** Boolean column */
  @column()
  public isActive: boolean
}
```

### `@column.date`
The date and date time columns are given special treatment by Lucid. 

- First, you can use the `luxon.DateTime` object instead of using the standard JavaScript date object. Luxon API is much nicer to work with.
- Lucid will automatically convert the Luxon objects to a formatted string before sending the value to the database.
- During fetch, it will convert the database value to an instance of `luxon.DateTime`.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column.date()
  public dob: DateTime
}
```

When creating a new record, you can assign `DateTime` instance to the `dob` column.

```ts
import { DateTime } from 'luxon'
import User from 'App/Models/User'

const user = new User()
user.dob = DateTime.fromISO('1990-11-20')

await user.save()
```

Similarly, when you fetch the user record, the `dob` value will be an instance of `DateTime`

```ts
import { DateTime } from 'luxon'
import User from 'App/Models/User'

const user = await User.find(1)
console.log(user.dob instanceof DateTime) // true
```

### `@column.dateTime`
Similar to the `date` column, the `dateTime` column is used to store values as a datetime. A practical use case of `dateTime` column is the `created_at` and `updated_at` timestamps

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  public updatedAt: DateTime
}
```

The `autoCreate` and the `autoUpdate` options are used to auto generate the values for a date/date time column.

- `autoCreate` means, define the value if its not already defined. Great for the `created_at` column.
- `autoUpdate` means, update the value every time during update. Great for the `updated_at` column.

[note]
The `autoCreate` and `autoUpdate` properties are not limited to the `created_at` and `updated_at` columns. You can use them with any column.
[/note]

## Column Options
The `@column` decorator allows a handful of configuration options.

### `columnName`
By default, Lucid uses the `snake_case` version of your model property as the column names. For example: The property `fullName` on the model will be converted to `full_name` during database queries.

You can customize the column name by defining it explicitly.

```ts
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ columnName: 'user_full_name' })
  public fullName: string
}
```

### `isPrimary`
A flag to mark a property as the primary key for the table. If you do not define any primary key, then Lucid will use `id` as the primary key.


```ts
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ primaryKey: true })
  public userId: number
}
```

### `prepare`
The `prepare` method can be used to transform the property value for database just before the insert or the update query.

A practical example is to encrypt value just before sending it to the database driver.

```ts
import Encryption from '@ioc:Adonis/Core/Encryption'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({
    prepare: (value: string) => Encryption.encrypt(value)
  })
  public ssn: string
}

const user = new User()
user.ssn = '078-05-1120'
await user.save()
```

The `prepare` method doesn't change the local value. It just transforms the value on the object that is sent to the database.

```ts
console.log(user.ssn) // '078-05-1120'
```

### `consume`
The `consume` method is the opposite of the `prepare` method. It is invoked after the fetch query, but before the value is assigned to the model instance.

Continuing with the Encryption example, here's how you will decrypt the value.

```ts{7}
import Encryption from '@ioc:Adonis/Core/Encryption'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({
    prepare: (value: string) => Encryption.encrypt(value),
    consume: (value: string) => Encryption.decrypt(value)
  })
  public ssn: string
}
```

There are two more properties `serialize` and `serializeAs` that can be defined on the `@column` decorator. We recommend reading the serialization docs for better understanding on how to use them.
