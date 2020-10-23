---
permalink: releases/auth/version-5
group: Auth
---

# Auth `5.0`
The release notes contains an aggregated list of chances made between `@adonisjs/auth@4.3` and `@adonisjs/auth@5.0`. You can also check [individual releases](https://github.com/adonisjs/auth/releases) on Github.

Upgrade using the following command

[codegroup]
```sh{}{npm}
npm i @adonisjs/auth@alpha
```

```sh{}{yarn}
yarn add @adonisjs/auth@alpha
```
[/codegroup]

## Changes

- **improvement**: The model used for authentication can now exist without a password column. However, it is the user responsibility to not call `auth.attempt` to validate the user credentials and instead fetch the user before hand and call `auth.login`. [c8820c6ec](https://github.com/adonisjs/auth/commit/c8820c6ece64dca30f93c7ca4e5460d55995b0d1)
- **breaking change**: Due to changes in the AdonisJS boot lifecycle. The `User` model import inside the `config/auth.ts` file has to be lazy. Begin by removing top level import statement and move it inline as shown below. [851db569](https://github.com/adonisjs/auth/commit/851db569e5f78d9a67418d59720e7159aab9a3b8)
  ```ts{}{config/auth.ts}
  provider: {
    driver: 'lucid',
    model: () => import('App/Models/User')
  }
  ```
- **improvement**: The User model created after running `node ace invoke @adonisjs/auth` now hides the password from getting serialized. [992f524a](https://github.com/adonisjs/auth/commit/992f524a9e05953368e5e8c45358522f68ade6c4)
