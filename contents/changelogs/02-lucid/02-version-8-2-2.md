---
permalink: releases/lucid/version-8_2_2
group: Lucid
---

# Lucid `8.0 - 8.2.2`
The release notes contains an aggregated list of chances made between `@adonisjs/lucid@8.0` and `@adonisjs/lucid@8.2.2`. You can also check [individual releases](https://github.com/adonisjs/lucid/releases) on Github.

Upgrade using the following command

[codegroup]
```sh{}{npm}
npm i @adonisjs/lucid@alpha
```

```sh{}{yarn}
yarn add @adonisjs/lucid@alpha
```
[/codegroup]

## Highlights

- **addition**: Add support for [Model factories](/guides/database/factories). [5c65731](https://github.com/adonisjs/lucid/commit/5c65731596891c5e37e233712395eed21f4381bd)
- **addition**: Add support for [Database seeders](). [a213661](https://github.com/adonisjs/lucid/commit/a213661ef48f457ad0a3471d113f22a401372c84)
- **addition**: Add support for defining `groupLimit` on preloaded relationships. [def372c](https://github.com/adonisjs/lucid/commit/def372c654888e3b5c2f11b5d9efa8fdb3b9cdb0)
  ```ts
  // Fetch 5 comments for each post

  await Post.query().preload('comments', (query) => {
    query.groupLimit(5)
  })
  ```

## Changes

- **improvement**: Add `useTransaction` and `useConnection` to model instance. [789f038](https://github.com/adonisjs/lucid/commit/789f038c044da992dabbf4a0d6d6932a8290eec0)
- **improvement**: Add support for `whereNot` to the [unique rule](rulesunique). [1bdf5e6](https://github.com/adonisjs/lucid/commit/1bdf5e698960e5e0f9a8e766ccfb4d748ae5c7b6)
- **improvement**: Add support for defining keys to `pick` or `omit` during model serialization. [d3d4f92](https://github.com/adonisjs/lucid/commit/d3d4f92ca712bbcd8fcd26ebfd9abfc37cf2aad8)
- **addition**: Add support for `beforePagination` and `afterPagination` hooks. [1f9b1d3](https://github.com/adonisjs/lucid/commit/1f9b1d3d885f7d51328393b68ed7e477b8e5b4fb)
- **fix**: Cast pagination `page` and `limit` values to number. [bd38a5d](https://github.com/adonisjs/lucid/commit/bd38a5d8bb09b392cc561a41bc49e86b79992ce2)
- **addition**: Add `toObject` method to the model. It serializes models into a Javascript object, where the object keys are model property names and not the `serailizeAs` name. [fa8ae6e](https://github.com/adonisjs/lucid/commit/fa8ae6efeaa2087f616e2621a0834dfc4f508d2f)
- **improvement**: Make model methods `save`, `merge` and `fill` chainable. [7a518d8](https://github.com/adonisjs/lucid/commit/7a518d8999b0b647b741960d18a8fa8c3974efb6)
- **fix**: `query.whereBetween` now accepts numeric `0` value. [2d2e7cb](https://github.com/adonisjs/lucid/commit/2d2e7cb2372624b13e0eb11d0184c5e6113c4022)
