---
goals:
  - Explain the middleware concept
  - The types of middleware in AdonisJS and their purposes
  - Creating inline middleware using closures
  - Creating middleware as class
  - Using middleware as guards
  - Using middleware as data transformation layer
    - Pain points and alternatives
  - Down stream middleware
    - Ceveats here
  - Applying middleware on route groups as high level checks
  - Middleware as namespaces and not paths
  - Register package middleware
---

Middleware are a series of functions that are executed before an HTTP request before it reaches the route handler. Every function in the chain has the ability to end the request or forward it to the `next` function.

You can use middleware for various use cases, like

- A middleware to log HTTP requests.
- An auth middleware to ensure user is authenticated and abort the request for unauthenticated users.
- A middleware to time HTTP requests
- and much more

## Basic Example
The simplest way to test a middleware is to attach it to the route using the `Route.middleware` method. For example:

```ts
Route
  .get('/users/:id', async () => {
    return 'Show user'
  })
  // highlight-start
  .middleware(async (ctx, next) => {
    console.log(`Inside middleware ${ctx.request.url()}`)
    await next()
  })
  // highlight-end
```

::video{url="https://res.cloudinary.com/adonis-js/video/upload/f_auto,q_auto/v1610089298/v5/route-middleware.mp4" controls}

## Middleware classes
Writing middleware as inline closures is fine for some quick testing. However, we recommend extracting them to their own classes and then registering them inside the `start/kernel.ts` file.

### Make middleware command

You can create a middleware by running the following ace command.

```sh
node ace make:middleware LogRequest

# CREATE: app/Middleware/LogRequest.ts
```

### About middleware class
Middleware classes are stored (but not limited to) inside the `app/Middleware` directory and each file represents a single middleware. For example:

```ts{app/Middleware/LogRequest.ts}
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LogRequest {
  public async handle(
    { request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    console.log(`-> ${request.method()}: ${request.url()}`)
    await next()
  }
}
```

- Every middleware must implement the `handle` method.
- The `handle` method receives the HTTP context as the first argument and a `next` function.
- Make sure to always call the `next` function in order to advance the middleware chain.

### Registering middleware

For the middleware to take effect, it must be registered as a **global middleware** or a **named middleware** inside the `start/kernel.ts` file.

Let's register the `LogRequest` middleware as a global middleware. As the name suggest, the global middleware are executed on every HTTP request.

:::note
Global middleware are executed only for the requests with a registered route. In other words, if a request comes in for an non-existing route, then the middleware will not be executed.
:::

```ts{start/kernel.ts}
Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParserMiddleware'),
  // highlight-start
  () => import('App/Middleware/LogRequest')
  // highlight-end
])
```

## Middleware flow

## Middleware as guards

## Middleware as observers

## Middleware as data loaders

## Downstream middleware
