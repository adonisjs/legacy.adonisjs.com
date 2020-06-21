---
permalink: releases/core/preview-rc-1_7
group: Core
sidebarTitle: Preview Release 1.7
---

# Preview release `rc-1.7`
We released `@adonisjs/core@5.0.0-preview-rc-1.7` on **June 21st, 2020** and it contains following additions, changes and bug fixes.

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

- Added support for [micro templating](/guides/validator/custom-messages#micro-templating) to custom error messages. [9d08a27](https://github.com/adonisjs/validator/commit/9d08a27)
- Cast **"on"** and **"off"** values to a boolean. These strings are set by the `input[type="checkbox"]`. [cd0a401](https://github.com/adonisjs/validator/commit/cd0a4010162288fbca9440f9ad4af490e50d4ae6)
- Added support for `refs`. [Refs](/guides/validator/schema-caching#option-3-using-refs) allows referencing dynamic values inside a cached schema. [88df5b5](https://github.com/adonisjs/validator/commit/88df5b5)
- Allow `space`, `dash` and `underscore` in the alpha rule. [207c4f1](https://github.com/adonisjs/validator/commit/207c4f1)
- Add `distinct` rule. [3d9422a](https://github.com/adonisjs/validator/commit/3d9422a)

## HTTP Server

- Added support for chainable API to the `response.redirect` method. [3bca166](https://github.com/adonisjs/http-server/commit/3bca166e04b2fee6bcf1abba6bac97e4f270707c)
- Fix `response.download` method to set `content-type` when file is not found. [e4fcc8d](https://github.com/adonisjs/http-server/commit/e4fcc8d49088efe9ed6f0f54b56162ae04e8cc98)
- Improve router to raise exception, when a route has duplicate params. [025d60f](https://github.com/adonisjs/http-server/commit/025d60f57315a1ec3b983f57a61c7cb3e64692f7)

## Hash

- Depreciate `hash.hash` in favor of `hash.make`. [b5ac156](https://github.com/adonisjs/hash/commit/b5ac156448983bbbd059e47f285007332edf851b)
- Add support for faking Hash implementation during tests. [75e2f5b](https://github.com/adonisjs/hash/commit/75e2f5b8b724d594b930e952d9ff1cba243bdafc)
