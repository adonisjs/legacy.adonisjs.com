---
permalink: releases/core/preview-rc-1_11
group: Core
sidebarTitle: Preview Release 1.11
---

# Preview release `rc-1.11`
We released `@adonisjs/core@5.0.0-preview-rc-1.11` on **July 28th, 2020** and it contains following additions, changes and bug fixes.

## Http Server
- **improvement**: Improving types for `Route.resource` API. [d0736ea6](https://github.com/adonisjs/http-server/commit/d0736ea6cf8ba08781af1913ea64c3c55634acfe)
- **fix**: The `route.redirect().back()` method ignores the query string in the referrer header. [136306cc](https://github.com/adonisjs/http-server/commit/136306cc85458bc6621bed2ca9224dd482e48621)
- **performance**: Small changes for performance gains [d806f22c](https://github.com/adonisjs/http-server/commit/d806f22c82e585973d4515e0128a70baa9153343)

## Validator

- **addition**: Adding `before`, `after`, `beforeField` and `afterField` rules. [39d4bf8f](https://github.com/adonisjs/validator/commit/39d4bf8fef12675e5b0208bbd5367807e83da343), [0a0001f5](https://github.com/adonisjs/validator/commit/0a0001f560cabca7b904d2da885bcd596a3c26f3)
- **fix**: Add `true` and `false` to boolean value. [86f54861](https://github.com/adonisjs/validator/commit/86f54861c73cff8360cce4ae6060ab0c2e18d85c)
- **addition**: Add `range` rule. [53b4b968](https://github.com/adonisjs/validator/commit/53b4b9684c8ddd7df944f38344ecfe81e4f6537d)
- **addition**: Add `schema.object.anyMembers` to accept objects with any key-value pair. [17722eaa](https://github.com/adonisjs/validator/commit/17722eaa1b1f2e733bd074579718fac4b2b803ea)
- **addition**: The `confirmed` rule now also accepts an optional field name. [53c86240](https://github.com/adonisjs/validator/commit/53c862409bb4642effd5edaefce2bde281a797e6)
- **addition**: Add `blacklist` rule. It is opposite of `enum` schema type [c25e22ba](https://github.com/adonisjs/validator/commit/c25e22ba3e2822cc9ef6c825f545d5768e62a18b) 

## Events

- **addition**: Adding support for [trapping events](/guides/events#trapping-events). [464ed300](https://github.com/adonisjs/events/commit/464ed30099ccbfa63678cc7e335f0e934739e7d9)

