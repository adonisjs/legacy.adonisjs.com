---
summary: HTTP context is a request specific object that holds information like the `request body`, `cookies`, `authenticated user`, and other related data for a given HTTP request
goals:
 - Here, we talk about the HTTP context in general
 - Explain that Node.js is not a threaded language, and hence we need a per request context
 - Also, how it is different from ExpressJS `req`, `res`
 - One has to pass context by reference
 - Adding custom properties to the context
 - Context instance for testing
---

HTTP context is a request specific object that holds the information like the `request body`, `cookies`, `headers`, the currently `logged in user` and much more for a given HTTP request. For example:

```ts
Route.get('/', (ctx) => {
  /**
   * Request url
   */
  console.log(ctx.request.url())

  /**
   * Request body + query params
   */
  console.log(ctx.request.all())

  /**
   * Send response
   */
  ctx.response.send('hello world')
  ctx.response.send({ hello: 'world' })

  /**
   * Available when auth is configured
   */
  console.log(ctx.auth.user)
})
```

Or use ES6 destructuring to access specific properties from the `ctx` object.

```ts
Route.get('/', ({ request, response, auth }) => {
  console.log(request.url())
  console.log(request.all())

  response.send('hello world')
  response.send({ hello: 'world' })

  console.log(auth.user)
})
```

## Differences from the express `req` and `res` objects?
You will not see any `req` or `res` objects in AdonisJS. Instead, everything, including the request and the response are part of the HTTP context.

- The `ctx.request` gives you access to the current request object.
- And `ctx.response` gives you access to the response object.

:::note
The API of AdonisJS and express are not the same. Also, being compatible with express is not a goal for us.
:::

## Differences from a threaded language
Threaded languages like PHP have an isolated global scope for each request, and hence you can access the request data using global variables like `$_REQUEST`.  

The same is not possible in Node.js due to its single threaded nature and shared global scope. Instead, you have to access and pass the HTTP context around as a reference. For example:

- **Controller** receives `ctx` as the first argument.
  ```ts
  class UsersController {
    public async store(ctx) {}
  }
  ```

- **Middleware** also receives `ctx` as the first argument
  ```ts
  class AuthMiddleware {
    public async handle (ctx) {}
  }
  ```

- **Global exception handler** receives `ctx` as the 2nd argument
  ```ts
  class ExceptionHandler {
    public async handle (error, ctx) {}
  }
  ```

Similarly, if other parts of your application relies on the HTTP context, then you must pass it as a function argument or the constructor argument.

## Http Context Properties
Following is the list of properties available on the HTTP context. As you will install new packages, they may also add more properties to this object.

![Output of ctx.inspect({ depth: 0 })](https://res.cloudinary.com/adonis-js/image/upload/f_auto,q_auto/v1609928565/v5/context-inspect.png)

### request

Reference to the [HTTP request](./request.md)

```ts
Route.get('/', async ({ request }) => {
})
```

### response

Reference to the [HTTP response](./response.md)

```ts
Route.get('/', async ({ response }) => {
})
```

### logger

Reference to the logger instance. A [child logger](../digging-deeper/logger.md#child_logger) instance is created for every HTTP request which contains a unique [request id](./request.md#request-id) for tracing.

```ts
Route.get('/', async ({ logger }) => {
})
```

### route

Reference to the matched route for the current HTTP request. The route object has the following properties.

- `pattern`: The route pattern
- `handler`: The route handler
- `middleware`: An array of route middleware
- `name`: Route name (if any)

```ts
Route.get('/', async ({ route }) => {
})
```

### params

An object of route params. Do not confuse it query params, which you access using the `request.get()` method.

```ts
Route.get('users/:id', async ({ params }) => {
  console.log(params.id)
})
```

### subdomains

An object of route subdomains. Only available when the route is registered with a domain.

```ts
Route
  .group(() => {
    Route.get('/', async ({ subdomains }) => {
      console.log(subdomains.tenant)
    })
  })
  .domain(':tenant.adonisjs.com')
```

### session :span{data-hint="Available when @adonisjs/session is installed" class="hint"}

Reference to the [session object](./session.md).

```ts
Route.get('/', async ({ session }) => {
  session.get('cart_value')
})
```

### auth :span{data-hint="Available when @adonisjs/auth is installed" class="hint"}

Reference to the [auth object](../auth/introduction.md).

```ts
Route.get('/', async ({ auth }) => {
  console.log(auth.user)
})
```

### view :span{data-hint="Available when @adonisjs/view is installed" class="hint"}

Reference to the [view renderer object](../views/introduction.md).

```ts
Route.get('/', async ({ view }) => {
  return view.render('welcome')
})
```

## Extending Context
The HTTP context object is meant to be extended by other packages or your own application code. A common use case is to attach custom properties inside a middleware. For example:

:::note
Read the [middleware guide](./middleware.md) on creating and using middleware in your app.
:::

:::note
Make sure to install the `geoip-lite` and `@types/geoip-lite` packages if you are writing the code alongside
:::

```ts
// highlight-start
import geoip from 'geoip-lite'
// highlight-end
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserLocationMiddleware {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // highlight-start
    ctx.location = geoip.lookup(ctx.request.ip())
    // highlight-end
    await next()
  }
}
```

Here we have added a custom `location` property to the `ctx`, which you can access inside the route handler or the upcoming middlewares.

### Informing typescript about the custom property
The `location` property is added at the runtime, and hence Typescript does not know about it. To inform the Typescript, we will use [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) and add the property to the `HttpContextContract` interface.

Create a new file at path `contracts/context.ts` (the filename is not important) and paste the following contents inside it.

```ts{contracts/context.ts}
declare module '@ioc:Adonis/Core/HttpContext' {
  import { Lookup } from 'geoip-lite'

  interface HttpContextContract {
    location: Lookup | null
  }
}
```

That's all! Now, Typescript will not complain for the missing property on the `ctx` object.

### Using getters and macros
Getters and macros provides another way of adding custom properties to the `ctx` object. In the previous example, we added an **instance property** to the `ctx` object. However, getters and macros add the property on the **prototype of the class**.

Also, there is no need to create a middleware for this since you only need to define the macros/getters only once, and they are available for all the instances of the HttpContext class.

Open the pre-existing `providers/AppProvider.ts` file and paste the following code inside the `boot` method.

:::note
Please read the [providers guide]() to learn more about them.
:::

```ts
// highlight-start
import geoip from 'geoip-lite'
// highlight-end
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  // highlight-start
  public async boot() {
    const HttpContext = this.app.container.use('Adonis/Core/HttpContext')

    HttpContext.getter('location', function location() {
      return geoip.lookup(this.request.ip())
    })
  }
  // highlight-end
}
```

By default, the `getter` will be evaluated every time you access the `ctx.location` property. However, you can mark it as a singleton by passing a 3rd boolean argument to the `getter` method.

```ts
HttpContext.getter(
  'location',
  function location() {
    return geoip.lookup(this.request.ip())
  },
  true // 👈 singleton true
)
```

### Macros
Getters are always accessible as properties. However, macros can be both properties and methods.

```ts
HttpContext.macro('getLocation', function location() {
  return geoip.lookup(this.request.ip())
})

// Access it as
ctx.getLocation()
```

Or attach a literal value.

```ts
HttpContext.macro('pid', process.pid)

// Access it as
ctx.pid
```
