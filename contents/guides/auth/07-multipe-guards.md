---
permalink: guides/auth/multiple-guards
group: Authentication
draft: true
---

# Multiple guards
Most of the applications usually make use of a single guard to login/authenticate users. However, there can be times, when you want to use multiple guards. For example:

- Using the `api` guard to authenticate requests from the mobile app and using the `web` guard for the browser client.
- Using two variants of the web guard for authenticating regular users and admins. However, we recommend using roles for this scenario.

## Defining multiple guards
The first step is to define all the guards you are planning to use inside the `contracts/auth.ts` file.

```ts{16-19}
import User from 'App/Models/User'

declare module '@ioc:Adonis/Addons/Auth' {
  interface ProvidersList {
    user: {
      implementation: LucidProviderContract<typeof User>,
      config: LucidProviderConfig<typeof User>,
    },
  }

  interface GuardsList {
    web: {
      implementation: SessionGuardContract<'user', 'web'>,
      config: SessionGuardConfig<'user'>,
    },
    basic: {
      implementation: BasicAuthGuardContract<'user', 'basic'>,
      config: BasicAuthGuardConfig<'user'>,
    }
  }
}
```

As you can notice, **multiple guards can use the same provider**. However, **one guard cannot use multiple providers**. For example: If you have two providers, one for the users and another one for admins, then you will have to create two guards as well. 

As soon as you define the guards inside the `contracts/auth.ts` file. The Typescript compiler will complain that the guard is missing the config inside the `config/auth.ts` file.
