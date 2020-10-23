---
permalink: releases/core/preview-rc-2
group: Core
sidebarTitle: Preview Release 2
---

# Preview release `rc-2`
We have released `@adonisjs/core@5.0.4-preview-rc-2` on **October 23rd, 2020** and it contains following additions, changes and bug fixes.

## Highlights
- Support for in-memory compilition of Typescript. In other words, the development workflow of AdonisJS will no longer write the compiled Javascript to the disk and uses in memory compilition. It has become possible because of the [@adonisjs/require-ts](https://github.com/adonisjs/require-ts) module.
- Ability to validate environment variables. Learn more about it [here]().
- Introducing [@adonisjs/repl](https://github.com/adonisjs/require-ts)

## Http Server
- **addition**: Adding `request.param` and `request.params` methods as an alternative to read the route params. [06c0f0ebc](https://github.com/adonisjs/http-server/commit/06c0f0ebc2b416bddfdc8c2929f867e6a42e67e1)
  ```ts
  Route.get('users/:id', ({ request, params }) => {
    console.log(params.id)

    // Same as the above
    console.log(request.param('id'))
  })
  ```
- **improvement**: Simplify creation of HTTP context instance using `HttpContext.create` method. This is useful when you are trying to unit test a piece of code that needs the HTTP context. For example: Unit testing a middleware. [75fcbc6b0](https://github.com/adonisjs/http-server/commit/75fcbc6b0bfac7cc9356428668b3849127019740)
  ```ts
  class SomeMiddleware {
    public async handle(ctx) {}
  }

  // inside some test file
  import HttpContext from '@ioc:Adonis/Core/HttpContext'

  const ctx = HttpContext.create('users/:id', { id: 1 })
  await new SomeMiddleware().handle(ctx)
  ```
- **improvement**: **POTENTIONAL BREAKING CHANGE** The `response.redirect().withQs()` method now merges the query strings together when called multiple times. Earlier, it used to overwrite the previous values leading to difficulties when trying to append to the current request query string. For example:
  ```ts
  // REQUEST URL: /users?page=1&limit=10

  // EARLIER OUTPUT: /users?sort=popular
  response.redirect().withQs().withQs('sort', 'popular')

  // CURRENT OUTPUT: /users?page=1&limit=10&sort=popular
  response.redirect().withQs().withQs('sort', 'popular')
  ```

  If you want to clean up existing query string, then you can make use of the newly added `cleanQs` method. [545e606ff8](https://github.com/adonisjs/http-server/commit/545e606ff844f5e3f0a7e0dc10123be40cb63fad)

## Env
The [@adonisjs/env](http://github.com/adonisjs/env) package has received a bunch of improvements including the support for validating environment variables.

- **addition**: Support for validating environment variables. Begin by creating `env.ts` file inside the project root. [15985122](https://github.com/adonisjs/env/commit/1598512226723d786b8188af6a0d456fc882fe86).
  ```ts{}{env.ts}
  import Env from '@ioc:Adonis/Core/Env'

  Env.rules({
    APP_KEY: Env.schema.string(),
    HOST: Env.schema.string({ format: 'host' }),
  })
  ```
- **improvement**: Make existence of `.env` file optional. The validations should take care of ensuring that all required environment variables exists. [6e3f2851](https://github.com/adonisjs/env/commit/6e3f2851ee426f87c7de147a555e297fd5228d13).
- **remove**: Depreciate `Env.getOrFail` method and hence validations should handle the existence of a variable. [f555e8a8](https://github.com/adonisjs/env/commit/f555e8a8f2840d8b79489dd499c7e1e94966a20a)

## Validator

- **improvement**: Cache validation schema using LRU cache. The maximum limit is hardcoded to cache a total of 100 schemas (should be enough for majority of applications). [f19a6312e3](https://github.com/adonisjs/validator/commit/f19a6312e335d423b80acb7260e2585d883c7475)
- **fix**: Bug fix for `array.anyMembers`. The method was never implemented but was documented. [866cb452](https://github.com/adonisjs/validator/commit/866cb4522d5e1966cd93dec8ec39633b95119c28)
- **feat**: Expose the validator config to customize certain aspects of the validation. You can define the following object inside the `config/app.ts` file. [12d116f254](https://github.com/adonisjs/validator/commit/12d116f254b7138cbbedc3e2fd0648d273aca990)
  ```ts
  export const validator = {
    bail: true, // stop after first validation error (default to "false")
    existsStrict: true, // only consider undefined and null as missing values (default to "false")
    reporter: async () => {
      return (await import('@ioc:Adonis/Core/Validator')).validator.reporters.api
    }, // define a custom reporter for all validations
  }
  ```
- **feat**: Allow customizing the negotiator function to decide the error reporter when using `request.validate` method. This will allow 3rd party packages like InertiaJS to use a custom function for handling validation failures. [Here's the default implementation](https://github.com/adonisjs/validator/blob/develop/src/Validator/helpers.ts#L170) of the negotiator function.
  ```ts
  class MyProvider {
    public boot() {
      const { validator } = this.app.container.use('Adonis/Core/Validator')
      validator.negotiator((request) => {
        // return an error reporter to be used
      })
    }
  }
  ```

## Application

- **addition**: Add methods to setup the AdonisJS application. Earlier ignitor was responsible for doing this, but we have moved the core the `Application` class. This is useful for developing packages, as you can quickly setup an AdonisJS application and test your package against it. [814500b2](https://github.com/adonisjs/application/commit/814500b23f4d4ae9292f263a0ed25aeb34b6fde1)
- **addition**: Introduce additional `repl` environment. After this, AdonisJS has a total of four environments, i.e: `web`, `console`, `test`, `repl`.

## Logger

- **addition**: Add keywords to format the timestamps for the log messages. [95122405](https://github.com/adonisjs/logger/commit/9512240537562e06fea340fb32900128f757b1c3). The keywords are `iso`, `unix` and `epoch` and can be used inside the `config/app.ts` file as follows:
  ```ts
  export const logger = {
    enabled: true,
    timestamp: 'iso'
  }
  ```
  
  Alternatively, you can define a custom function as well.

  ```ts
  timestamp: () => `,"time":${Date.now()}`
  ```
