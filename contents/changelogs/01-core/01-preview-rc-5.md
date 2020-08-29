---
permalink: releases/core/preview-rc-5
group: Core
sidebarTitle: Preview Release 1.5
---

# Preview release `rc-1.5`
We released `@adonisjs/core@5.0.0-preview-rc-1.5` on **April 29th, 2020** and it contains following additions, changes and bug fixes.

Upgrade using the following command

[codegroup]
```sh{}{npm}
npm i @adonisjs/core@alpha
```

```sh{}{yarn}
yarn add @adonisjs/core@alpha
```
[/codegroup]

## Validator

- **addition**: New `regex` rule added [PR#81](https://github.com/adonisjs/validator/pull/81)
- **addition**: New `uuid` rule added [PR#80](https://github.com/adonisjs/validator/pull/80)
- **addition**: New `confirmed` rule added [176d6bc](https://github.com/adonisjs/validator/commit/176d6bcb2d35bd479bf9608223d012ab84b74048)
- **improvement**: The validator returns error messages as JSON, when the form was submitted as an Ajax request. [aa99e00](https://github.com/adonisjs/validator/commit/aa99e00c38f32d5dff596ae3ab3cb46fd12047f0)
- **breaking**: Making validator API consistent and less verbose. Please read the [release notes](https://github.com/adonisjs/validator/releases/tag/v7.0.0) of `@adonisjs/validator`

## HTTP Server

- **security**: We have improved the cookies security in this release. Now, the values of two cookies cannot be swapped with each other. Check [release notes](https://github.com/adonisjs/http-server/releases/tag/v2.0.0)
- **addition**: Added `ctx.routeKey` property. It is the unique reference to the `route + http method`. Can be used as a cache key for caching compiled validator schema.
- **improvement**: The `makeUrl` and `makeSignedUrl` now can accept the `params` as top level objects. Earlier they were nested and makes the syntax verbose.
    ```ts
    // earlier
    Route.makeUrl('/users/:id', {
      params: { id: 1 },
    })

    // now
    Route.makeUrl('/users/:id', { id: 1 })
    ```

## Encryption

- **security**: The encryption module has received a re-write (without breaking changes) and addresses some of security concerns like JSON poisoning. Check [release notes](https://github.com/adonisjs/encryption/releases/tag/v2.0.0)
