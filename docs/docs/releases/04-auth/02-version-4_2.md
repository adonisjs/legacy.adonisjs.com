---
permalink: releases/auth/version-4_2
group: Auth
---

# Auth `4.2`
The `v4.2` release adds support for the database backed opaque tokens to implement authentication for restful APIs. [Click here](/guides/auth/api-guard) for the documentation.

Upgrade using the following command

[codegroup]
```sh{}{npm}
npm i @adonisjs/auth@alpha
```

```sh{}{yarn}
yarn add @adonisjs/auth@alpha
```
[/codegroup]

## Commits

- **addition**: Add support for oat tokens [f59a1e0](https://github.com/adonisjs/auth/commit/f59a1e05aaaebcefd9ecf448631a8805c9331c8f)
- **change**: Instructions to setup config and contracts file for the tokens auth [a77b124](https://github.com/adonisjs/auth/commit/a77b12403416fb16367da5d3427bbf1a14e3406f)
- **improvement**: Add support for adding expiry to oat tokens [6fbfa64](https://github.com/adonisjs/auth/commit/6fbfa64aeb52db380311b5ec5252e0f637fb8f52)
