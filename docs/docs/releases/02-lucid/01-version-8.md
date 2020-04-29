---
permalink: releases/lucid/version-8
group: Lucid
---

# Lucid `7.5 - 8.0`
The release notes contains an aggregated list of chances made between `@adonisjs/lucid@7.5` and `@adonisjs/lucid@8.0`. You can also check [individual releases](https://github.com/adonisjs/lucid/releases) on Github.

Upgrade using the following command

[codegroup]
```sh{}{npm}
npm i @adonisjs/lucid@alpha
```

```sh{}{yarn}
yarn add @adonisjs/lucid@alpha
```
[/codegroup]

## Changes

- **addition**: Add pagination support using simple paginator (uses offset based approach). [d3584fe](https://github.com/adonisjs/lucid/commit/d3584fe720791ba885906728ef981fae54d7a2d2)
- **addition**: Add `ref` and `raw` methods to create raw query builder instances that cannot be executed, but used as a reference on existing queries. Check [release notes](https://github.com/adonisjs/lucid/releases/tag/v7.6.0)
  ```ts
  Database.query().table('users').select(
    Database.raw('count(*) as user_count, status')
  )
  ```
- **addition**: Add support for global transactions. Helpful when writing tests, since each test can start and rollback a global transaction to always start from a clean state. Check [release note](https://github.com/adonisjs/lucid/releases/tag/v7.6.1)
- **addition**: Define model hooks using decorators [ae2f398](https://github.com/adonisjs/lucid/commit/ae2f398eed5e13569b60c02487675b22a4d6dafb)
  ```ts
  import Hash from '@ioc:Adonis/Core/Hash'
  import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

  export default class User extends BaseModel {
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
- **addition**: Add `unique` and `exists` validation rules. [4768c3c](https://github.com/adonisjs/lucid/commit/4768c3c7a433d944e273c45b03bf87d334ac88fb)
- **chore**: Run whole test suite on `MSSQL` as well [5c35853](https://github.com/adonisjs/lucid/commit/5c358532b244655f2b8d0a0ecf90946159af03c2), [6874d59](https://github.com/adonisjs/lucid/commit/6874d5979fe3fc173cbf85a6aa174763319e9f1d)
- **addition**: Add support for `query scopes`. [88cf86b](https://github.com/adonisjs/lucid/commit/88cf86bd7c0b2527c607dc4a1530100fe08965ff)
- **addition**: Add `onQuery` hook property on relationship options. [9b58684](https://github.com/adonisjs/lucid/commit/9b58684bbae065bf3240c287eec52a8476f0a4b0)
  ```ts
  import { column, hasOne, HasOne, BaseModel } from '@ioc:Adonis/Lucid/Orm'

  export default class User extends BaseModel {
    @hasOne(() => Profile, {
      onQuery: (query) => query.where('is_active', true)
    })
    public profile: HasOne<typeof Profile>
  }  
  ```
- **addition**: Add `(before/after)Find` and `(before/after)Fetch` hooks. [5e125f9](https://github.com/adonisjs/lucid/commit/5e125f977cf8331766b33a7f80314bbf2e42474a)
- **addition**: Implement universal query logger that emits `db:query` event for all queries. [1466b31](https://github.com/adonisjs/lucid/commit/1466b319e5ca7c91a531e5c5c731bbd1bb6f409c)
- **addition**: Add pretty printer to print SQL queries with colors and context. Goes hand in hand with the `db:query` event. [4281d1f](https://github.com/adonisjs/lucid/commit/4281d1fb3fdc8ef88f019ad090b3fd3c6c336266)
- **addition**: Add self managed transactions. [0e2f6ee](https://github.com/adonisjs/lucid/commit/0e2f6eea7429170341d454ce80964f698844b729). Read more about it in [guides](/guides/database/transactions#managed-transactions).
