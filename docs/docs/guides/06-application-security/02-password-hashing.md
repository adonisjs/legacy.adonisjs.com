---
permalink: guides/security/password-hashing
group: Application Security
---

# Password Hashing
AdonisJS uses the industry standard algorithms **bcrypt** and **argon2** to hash user passwords. Hashing is not same as encryption, since the hashed value cannot be converted back to original value and hence highly recommended for storing passwords.

## Available drivers
AdonisJS out of the box comes with the support for `bcrypt` and `argon2`. However, you must install their respective drivers for npm.

- Run `npm i @phc/bcrypt` for bcrypt.
- And `npm i @phc/argon2` for argon2.

The configuration for the hash module is stored inside the `config/hash.ts` file. Feel free to tweak it as per your requirements.

## Hashing values
Following is an example of creating a hash of a value.

```ts
import Hash from '@ioc:Adonis/Core/Hash'
const hashedValue = await Hash.hash('secure-user-password')
```

## Verify against the existing hash
As stated earlier, you cannot convert the hash back to its original value. However, you can verify the plain value against the existing hash.

```ts
import Hash from '@ioc:Adonis/Core/Hash'
if (await Hash.verify(existingHash, 'secure-user-password')) {
  // is valid
}
```

## Switching drivers
You can switch between drivers using the `use` method.

```ts
import Hash from '@ioc:Adonis/Core/Hash'

Hash.use('argon2').hash()
Hash.use('bcrypt').hash()
```

## Hash user password
In order to hash the user password, you can make use of the Lucid models hooks and hash it before creating the user record or before updating their password.

Following is an example of the model hook

```ts
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.hash(user.password)
    }
  }
}
```
