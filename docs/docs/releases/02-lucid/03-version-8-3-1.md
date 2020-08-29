---
permalink: releases/lucid/version-8_3_2
group: Lucid
---

# Lucid `8.2.2 - 8.3.2`
The release notes contains an aggregated list of chances made between `@adonisjs/lucid@8.2.2` and `@adonisjs/lucid@8.3.2`. You can also check [individual releases](https://github.com/adonisjs/lucid/releases) on Github.

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

- **addition** Add support for checking [relationship existence](/guides/model-relations/introduction#querying-relationship-existence) using `has` and `whereHas` methods. [b159609](https://github.com/adonisjs/lucid/commit/b159609774720e1d0a040a5f2a236ecac662e694)
- **addition** Add support for [counting related rows](/guides/model-relations/introduction#counting-related-rows) using the `withCount` method. [469f193](https://github.com/adonisjs/lucid/commit/469f193d3eb6e147148cad8282caf23b9449c7fa)

## Changes

- **fix**: correct type for pg ssl (#578) [f77c7f8](https://github.com/adonisjs/lucid/commit/f77c7f8530434fb674d8b26f42bf7f7ed9440cb9)
- **fix**: allow dateTime columns to be optional [853822a](https://github.com/adonisjs/lucid/commit/853822a279a37136df1b568f55549be474c63bac)
- **addition**: allow `unique` and `exists` rules to match for case in-sensitive values [29f7dfc](https://github.com/adonisjs/lucid/commit/29f7dfc4374b41e2b6727cf1bf2650f2234cb9ab)
- **fix**: update method handle use case where values are falsy [232f16a](https://github.com/adonisjs/lucid/commit/232f16aef61cf5cbc5ca723eb06d2ae163a7c54b)
