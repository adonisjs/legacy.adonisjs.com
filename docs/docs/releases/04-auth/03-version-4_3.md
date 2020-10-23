---
permalink: releases/auth/version-4_3
group: Auth
---

# Auth `4.3`
The `v4.3` release adds support for the **basic auth**. [Click here](/guides/auth/basic-auth-guard) for the documentation.

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

- **addition**: Add support for basic auth [9d684e82](https://github.com/adonisjs/auth/commit/9d684e82b2914f506f929a0668efc1e87ae858af)

## Updating Auth Middleware
The Auth middleware stored inside `app/Middleware/Auth.ts` file has been updated to pass the guard name to the [raised exception](https://github.com/adonisjs/auth/blob/develop/templates/middleware/Auth.txt#L54). We recommend upgrading the middleware source for correct behavior.

If you have not made any changes to the middleware, then simply copy/paste the contents from this [stub](https://github.com/adonisjs/auth/blob/develop/templates/middleware/Auth.txt).
