---
permalink: releases/lucid/version-9
group: Lucid
---

# Lucid `8.5 - 9.0`
The release notes contains an aggregated list of chances made between `@adonisjs/lucid@8.5` and `@adonisjs/lucid@9.0`. You can also check [individual releases](https://github.com/adonisjs/lucid/releases) on Github.

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

- **addition**: Accept raw and sub queries in `orderBy` method. [f1a4335c](https://github.com/adonisjs/lucid/commit/f1a4335c472308fe25da5ffc493dad9ac96abb18)
- **addition**: Accept raw queries in `having` method. [5d73de34](https://github.com/adonisjs/lucid/commit/5d73de343f941086575a1234aece699ead4e4434)
- **addition**: Add `whereColumn` method. It allows writing a where clause that uses column names on the both sides [e19bcf05](https://github.com/adonisjs/lucid/commit/e19bcf05138e862cd90bd410fda8c97c90481c04).
  ```ts
  Database.query().whereColumn('users.id', '=', 'user_logins.user_id')
  ```
  The following variations are also added.
  - whereColumn
  - orWhereColumn
  - andWhereColumn
  - whereNotColumn
  - orWhereNotColumn
  - andWhereNotColumn
- **addition**: Add support for conditional queries using `if`, `unless` and `match` methods. [17a94205](https://github.com/adonisjs/lucid/commit/17a9420552c963a00bf0df0f91585d977e534893)

  [codegroup]
  ```ts{}{if}
  Database
    .query()
    .if(auth.user, (query) => query.where('user_id', auth.user.id))
  ```

  ```ts{}{unless}
  Database
    .query()
    .unless(auth.user, (query) => query.where('is_public', true))
  ```

  ```ts{}{match}
  Database
    .query()
    .match(
      [
        auth.user, (query) => query.where('user_id', auth.user.id)
      ],
      [
        !auth.user, (query) => query.where('is_public', true)
      ],
    )
  ```
  [/codegroup]
- **addition**: Introduce `selfAssignPrimarykey` property on models to allow assigning primary key locally. This is useful when using `uuid` as the primary key and not using database to generate one. [7d313122](https://github.com/adonisjs/lucid/commit/7d3131225aafce91efc830b9ca55e0f46493e2b6)
  ```ts
  class User extends BaseModel {
    public static selfAssignPrimarykey = true

    @column({ isPrimary: true })
    public id: string
  }

  const user = new User()
  user.id = uuid.v4()
  await user.save()
  ```
- **improvement**: Improve pretty print output for SQL queries debugging and migrations dry run. [6ac54a2d](https://github.com/adonisjs/lucid/commit/6ac54a2db60c8490e85d2c0219bf0081b05fdf96)
