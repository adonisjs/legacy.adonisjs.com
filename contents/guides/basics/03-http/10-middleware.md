---
permalink: guides/http/middleware
category: Handling HTTP Requests
group: Basics
---

# Middleware
Middleware are a series of functions that are executed before an HTTP request reaches the route handler. Using middleware, you can perform different actions like:

1. An auth middleware to check whether a user is logged in or not. If not, then cancel the request, before it reaches the controller.
2. A middleware to find the user country from their ip address and then pass it along to the controller.
3. A middleware to log HTTP requests.
4. Or a middleware to transform the response body.

## Middleware Flow

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1582969262/adonisjs.com/http-middleware_wvb8mg.png)

- Middleware are executed on every new HTTP request.
- They are executed in sequence from left to right. 
- If one middleware decided to abort the request, then all other middleware along with the route handler are not executed.

## Global middleware
Global middleware are executed on every HTTP request in the same order as they are registered. You create global middleware for actions that you want to execute on every request.

[note]
AdonisJS does not execute global middleware for requests that does not have a registered route. This means, if you create a global middleware and a request comes in for an non-existing route, then the middleware will never be executed.
[/note]

For demonstration, let's create a middleware for finding the user country from their IP address. The middleware lives inside `app/Middleware` directory and just like controllers, they are also vanilla JavaScript classes.

1. Run the following ace command to create a new middleware file.
  ```sh
  node ace make:middleware DetectUserCountry

  # ✔  create    app/Middleware/DetectUserCountry.ts
  ```

2. Install `geoip-lite`. An npm dependency to lookup user location from Ip Address.
  ```sh
  npm i geoip-lite @types/geoip-lite
  ```

3. Open the newly created file and replace its contents with the following code snippet.
  ```ts{}{app/Middleware/DetectUserCountry.ts}
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  import geoip from 'geoip-lite'

  export default class DetectUserCountry {
    public async handle ({ request }: HttpContextContract, next: () => Promise<void>) {
      const ip = request.ip()

      const country = geoip.lookup(ip)
      request.country = country?.country
      
      await next()
    }
  }
  ```

4. Register the middleware inside `start/kernel.ts` file.
  ```ts{3}{start/kernel.ts}
  Server.middleware.register([
    'Adonis/Core/BodyParserMiddleware',
    'App/Middleware/DetectUserCountry',
  ])
  ```

5. Finally, create a route to display the user detected country.
  ```ts{}{start/routes.ts}
  Route.get('/', async ({ request }) => {
    return request.country
      ? `Your country is ${request.country}`
      : 'Unable to detect country'
  })
  ```

#### What just happened?
A lot is going on above, let's decode it step by step.

- Using the `geoip-lite`, we attempt lookup the user country from their ip address.
- Next, we set the `country` on the `request` object. You will get a TypeScript error when trying to add a dynamic property, but let's ignore that for now and we will fix it later.
- After the job of middleware is completed, you must call the `next` function. Doing so, will execute the next middleware in the chain and finally the route handler.
- Finally, you will have to register the middleware inside the `start/kernel.ts`. Just like controllers, there is no need to import the middleware file, you can pass it as a string reference.

## Extending Types
If you are following along this guide, you would have noticed that TypeScript complains when trying to add a runtime property `country` to the request object as shown in the following image.

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1582462569/adonisjs.com/TypeScript-request-extend-complain.png)

If you have used TypeScript previously, you may have faced a similar situation when trying to extend values at runtime. Infact, this is true for any statically typed language.

Since, one of the goals of AdonisJS is to be extensible, we have put enough thoughts into letting you easily extend static types. To do so, let's create a new file `request.ts` inside the `contracts` folder.

```sh
touch contracts/request.ts
```

Open the newly created file and paste the following code snippet inside it. After that, TypeScript will stop complaining.

```ts
declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    country?: string
  }
}
```

#### How it works?

- In order for any object or a class to be extendible, you will have to type it to an interface. This concept is also known as **programming to an interface** or **loosely coupled code**.
- Next, you can leverage the [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) feature of TypeScript to merge properties of two interfaces that belongs to a single module and has same name.
- Voila!, you have successfully extended a type. All of the AdonisJS codebase is loosely coupled and can be extended in the same fashion.

## Route Middleware
Route middleware works the same way as the global middleware, its just that you execute them on specific routes vs executing them on every single HTTP request.

A great candidate of this is an Access control middleware, that you want to apply only on a subset of routes. For demonstration, let's create a middleware to selectively enforce access control.

The first step is to create and register the middleware inside `start/kernel.ts` file. This time we need to register it as a named middleware.

1. Run the following command to create a new middleware
  ```sh
  node ace make:middleware Acl

  # ✔  create    app/Middleware/Acl.ts
  ```

2. Open the newly created middleware file and paste following contents to it.
  ```ts{7}{app/Middleware/Acl.ts}
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

  export default class Acl {
    public async handle (
      { request }: HttpContextContract,
      next: () => Promise<void>,
      allowedRoles: string[],
    ) {
      console.log(`"${request.url()}" enforces "${allowedRoles}" roles`)
      await next()
    }
  }
  ```

3. Register it as a named middleware. The object key is the alias that we will later reference on the route and object value is the namespace to the middleware class.
  ```ts{}{start/kernel.ts}
  Server.middleware.registerNamed({
    acl: 'App/Middleware/Acl',
  })
  ```

4. Finally, create couple of dummy routes to test the functionality.
  ```ts
  Route
    .get('posts', async () => {
      return 'List posts'
    })
    .middleware('acl:user,moderator')

  Route
    .get('subscribers', async () => {
      return 'List subscribers'
    })
    .middleware('acl:moderator,admin')
  ```

[video url="https://res.cloudinary.com/adonis-js/image/upload/q_80/v1582467510/adonisjs.com/route-named-middleware.mp4", controls]

### How it works?

- A route middleware has to be registered first using `Server.middleware.registerNamed` method and then you can use it on routes.
- When calling `Route.middleware`, you can pass arguments to the middleware by seperating them with a colon `:` expression.
- The arguments are passed to the `handle` function as a 3rd argument.
