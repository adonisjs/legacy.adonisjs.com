---
summary: AdonisJS router exposes the API to register static routes, routes that accepts dynamic parameters, route groups, subdomains routes and a lot more.
goals: 
  - Here we begin by explaining the routing as a concept
  - Next show basic routing with an example and demo
  - Talk about the covered HTTP methods and the `route.route` method to register all sorts of routes
  - Talk about routing for SPAs
  - Route resources
  - Grouping routes and purpose
  - Request route
  - Making URLs to routes
  - Finally onto the routes API which is huge
  - Tell everything one can achieve with the router
---

The users of your website or web application can visit different URL's like `/`, `/about` or `/posts/1`. In order to make these URLs work, you will have to define them as routes.

In AdonisJS, the routes are usually defined (but not limited to) inside the `start/routes.ts` file using the Route module. For example:

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return 'Hello world'
})
```

:::note
You can try the above example by copy/pasting the snippet inside the routes file, start the development server by running `node ace serve --watch` command and then visit http://localhost:3333
:::

In the above example, we import the `Route` module and then use the `Route.get` method to register a route. A typical route accepts a total of two arguments.

- First is the route pattern. The pattern can be a static URL or a URL that accepts dynamic parameters.
- The 2nd argument is the route handler. It can be an inline closure (as shown in the above example) or a string reference to a [controller](./controllers.md) method.

## Default routes file
Conventionally the routes are registered inside the `start/routes.ts` file, which is then preloaded by AdonisJS when booting the application. However, this is not a hard restriction and you can keep your routes in a separate file as well.

Let's see some different ways to structure and load routes from different files.

### Imports inside the `routes.ts` file
One approach is to define your routes in different files as per your application structure and then import all those files inside the `start/routes.ts` file.

```ts{start/routes.ts}
import 'App/Modules/User/routes'
import 'App/Modules/Cart/routes'
import 'App/Modules/Product/routes'
```

### Register as a preload file
Another approach is to get rid of the routes file altogether and use a custom filepath to register routes. In this scanerio do make sure to register the path inside the `.adonisrc.json` file under the `preloads` array.

```json{.adonisrc.json}
{
  "preloads": [
    // delete-start
    "./start/routes",
    // delete-end
    "./start/kernel",
    // insert-start
    "add-path-to-your-routes-file"
    // insert-end
  ]
}
```

## List routes
You can view the registered routes by running the following ace command.

```sh
node ace list:routes
```

The default output lists the routes inside a structured table. However, you can also get them as JSON by passing `--json` flag.

```sh
node ace list:routes --json > routes.json
```

## HTTP methods
The `Route.get` method registers a route to handle the requests for the **`GET` HTTP method**. Similarly, you can use the following methods to handle requests for a different HTTP methods.

```ts
Route.post('posts', async () => {
  // create a new post
})

Route.put('posts/:id', async () => {
  // replace an existing post
})

Route.patch('posts/:id', async () => {
  // update an existing post
})

Route.delete('posts/:id', async () => {
  // delete an existing post
})
```

HTTP has around [39 different methods](http://www.iana.org/assignments/http-methods/http-methods.xhtml) and AdonisJS doesn't provide a shortcut for all of them. However, you can use the `Route.route` method to define the HTTP methods manually.

```ts
Route.route('/', ['OPTIONS', 'HEAD'], async () => {
})
```

You can also make use of the `Route.any` method to handle requests for multiple common HTTP methods. The following example will register the route for  `HEAD`,`OPTIONS`,`GET`,`POST`,`PUT`,`PATCH`,`DELETE` methods.

```ts
Route.any('csp-report', async () => {
})
```

## Route parameters
Route parameters provides a way to register URLs that can accept dynamic values as part of the URL. For example:

```ts
Route.get('/posts/:id', async ({ params }) => {
  return `Viewing post with id ${params.id}`
})
```

- Parameters are prefixed with a colon `:`
- You can define multiple parameters separated by a `/`. For example: `/posts/:post_id/comments/:id`
- All parameters for a given route must have unique names

### Optional params
You can also mark parameters as optional by appending a `?` to the name.

```ts
Route.get('/posts/:id?', async ({ params }) => {
  if (params.id) {
    return `Viewing post with id ${params.id}`
  }
  return 'Viewing all posts'
})
```

:::error{title="Won't work"}

In the following example, the `slug` is a required parameter and it cannot come after an optional `id` parameter.
The constraint is very similar to the nature of Javascript function arguments.

```ts
Route.get('/posts/:id?/:slug', 'PostsController.show')
```

:::

### Wildcard params
The parameters can also be a wildcard that accepts an infinite number of URL segments. For example:

```ts
Route.get('docs/*', ({ params }) => {
  console.log(params['*'])
})
```

| URL | Wildcard param | 
|-----|----------------|
| `/docs/http/introduction` | `['http', 'introduction']`
| `/docs/api/sql/orm` | `['api', 'sql', 'orm']`

You can also have named parameters along side the wildcard parameter. However, do make sure that the wildcard param is the last one - Again, the constraint is similar to the [rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters#Quick_reference) in Javascript.

```ts
Route.get('docs/:category/*', ({ params }) => {
  console.log(params.category)
  console.log(params['*'])
})
```

### Params matchers
Params matchers allows you validate the params against a given regular expression. If the check fails, the route will be skipped.

Consider the following example in which we want to lookup a post by its `id` and `slug` both.

```ts
Route
  .get('/posts/:id', async ({ params }) => {
    return `Viewing post using id ${params.id}`
  })
  .where('id', ^/[0-9]+/$)

Route
  .get('/posts/:slug', async ({ params }) => {
    return `Viewing post using slug ${params.id}`
  })
  .where('slug', ^/[a-z0-9_-]+/$)
```

- The requests passing a numeric id to the `/posts` url will be forwaded to the first route. For example: `/posts/1` or `/posts/300`
- Whereas the request matching the slug regex will be forwaded to the second route. For example: `/posts/hello_world` or `/posts/adonis-101`.
- A 404 will be returned, if all of the regex matches fails.

The params matchers can also be defined globally for all the routes. For example:

```ts
Route.where('id', ^/[0-9]+/$)
```

Now the `:id` param on all the routes will be matched against the above defined regex, unless overridden specifically at the route level.

### Params casting
Parameters part of the URL are always represented as string. For example: In the URL `/posts/1`, the `1` is a string value and not a number, since there is no direct way to infer data types for the URI segments.

However, you can manually cast the params to their actual Javascript data type by defining a `cast` property with the param matcher.

```ts
Route
  .get('posts/:id', 'PostsController.show')
  .where('id', {
    matches: ^/[0-9]+/$,
    cast: (id) => Number(id),
  })
```

Defining the `matches` property is important here, as it acts as a runtime validation for the param.

## URL generation
Instead of hardcoding the URLs everywhere in your app, you can leverage URL generation to generate URLs for pre-registered routes. For example:

```ts
Route.get('/users/:id', 'UsersController.show')

// Generate URL
Route.makeUrl('/users/:id', { id: 1 }) // /users/1
```

You can also make use of the `Controller.method` to reference the route.

```ts
Route.makeUrl('UsersController.show', { id: 1 })
```

Finally, you can also name your routes uniquely to generate URLs for them. For example:

```ts
Route
  .get('/users/:id', 'UsersController.show')
  .as('showUser') // 👈 Route name

// Generate URL
Route.makeUrl('showUser', { id: 1 })
```

### URL generation within views
AdonisJS shares a `route` helper method with all of your views to generate URLs. The `route` helper is same as the `makeUrl` method.

```ts
Route
  .post('posts', 'PostsController.store')
  .as('posts.create')
```

```edge
<form method="POST" action="{{ route('posts.create') }}">
</form>
```

### URL generation during redirects
You can also generate URL to a pre-registered route when redirecting the request.

```ts
Route
  .get('/users/:id', 'UsersController.show')
  .as('users.show')
```

```ts
Route.post('users', async ({ response }) => {
  // Create user
  // highlight-start
  response.redirect().toRoute('users.show', { id: user.id })
  // highlight-end
})
```

## Routing for SPA
The flow may look as follows when serving an SPA from the same routing layer as your AdonisJS app.

- The first request hit the AdonisJS application
- You load an HTML layout with your frontend scripts and styles
- From there on the routing and rendering is handled by a frontend framework

With this flow in place, you would want AdonisJS to always load the same HTML file regardless of the URL, as routing logic is placed inside a frontend application.

You can achieve this result by defining a wildcard route.

```ts{start/routes.ts}
Route.get('*', async ({ view }) => {
  return view.render('app')
})

// Shorter version
Route.on('*').render('app')
```

All other AdonisJS specific routes (maybe your API) should be defined above the wildcard route.

```ts
Route.get('/api/users', 'UsersController.index')
Route.get('/api/posts', 'PostsController.index')

// SPA route
Route.on('*').render('app')
```

Or better group the API routes with the `/api` prefix.

```ts
Route.group(() => {
  Route.get('/users', 'UsersController.index')
  Route.get('/posts', 'PostsController.index')
}).prefix('/api')

// SPA route
Route.on('*').render('app')
```

## Route groups
AdonisJS provides a great way to group multiple routes of similar nature and bulk configure them instead of re-defining same properties on every route.

A group is created by passing a closure to the `Route.group` method. Routes, declared inside the closure are part of the surrounding group.

```ts
Route.group(() => {
  // All routes here are part of the group
})
```

You can also create nested groups and AdonisJS will merge or override properties based upon the behavior of the applied setting.

### Prefix routes
All of the following routes inside the group closure will be prefixed with the `/api` string.

```ts
Route.group(() => {
  Route.get('/users', 'UsersController.index')
  Route.get('/posts', 'PostsController.index')
}).prefix('/api')
```

In case of nested groups, the prefix will be applied from the outer to the inner group.

```ts
Route.group(() => {
  Route.group(() => {
    Route.get('/users', 'UsersController.index') // /api/v1/users
    Route.get('/posts', 'PostsController.index') // /api/v1/posts
  }).prefix('/v1')
}).prefix('/api')
```

### Apply middleware
You can apply middleware to a group of routes by using the `.middleware` method. The group middleware are executed before the route own middleware.

:::note
Read the [middleware](./middleware.md) guide to learn more about middlewares.
:::

```ts
Route.group(() => {

  Route
    .get('users', async () => {
      return 'handled'
    })
    .middleware('can:view_users')

}).middleware('auth')
```

### Naming routes
Using route groups, you can prefix the routes names for that given group. This is helpful, when you have 
routes with the same name outside the group as well.

:::error{title="Won't work"}

In the following example, we have two identical resources and hence they will have same names as well.

```ts
Route.resource('users', 'UserController')

Route
  .group(() => {
    Route.resource('users', 'UserController')
  })
  .prefix('v1')
```

:::

:::success{title="Works"}

We can fix the issue by prefixing the resourceful routes names, declared inside the group.

```ts
Route.resource('users', 'UserController')

Route
  .group(() => {
    Route.resource('users', 'UserController')
  })
  .prefix('v1')
  .as('api') // 👈 Prefix all route names with `api`
```

:::

## Brisk routes
Brisk routes are defined without any explicit route handler. You can think of them as a shortcut for certain behaviors.

### render
In the following example, we render the view `welcome` by chaining the `.render` method.

```ts
Route.on('/').render('welcome')
```

The `.render` accepts the template data as the 2nd argument.

```ts
Route
  .on('/')
  .render('welcome', { greeting: 'Hello world' })
```

### redirect
The `.redirect` method, redirects the request to the pre-defined route. It will use the **route params** from the actual request to make the url for the redirect route.

```ts
Route.on('/posts/:id').redirect('/articles/:id')

// Inline params
Route.on('/posts/:id').redirect('/articles/:id', { id: 1 })

// Custom status
Route.on('/posts/:id').redirect('/articles/:id', undefined, 301)
```

### redirectToUrl
To redirect to an absolute URL, you can make use of the `redirectToUrl` method.
  
```ts
Route
  .on('/posts/:id')
  .redirectToUrl('https://medium.com/my-blog')

// Custom status
Route
  .on('/posts/:id')
  .redirectToUrl('https://medium.com/my-blog', 301)
```

## Access registered routes
You can access the registered routes by calling the `Route.toJSON` method. However, calling this method inside the **routes file** returns an empty array, because the routes are compiled just before starting the HTTP server.

You can run the `Route.toJSON()` method inside a **middleware**, **controller** or the **service provider's `start` method**. The rule of thumb is to avoid accessing routes before the HTTP server is ready.

```ts{providers/AppProvider.ts}
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true
  constructor(protected app: ApplicationContract) {}

  public async ready() {
    const Route = this.app.container.use('Adonis/Core/Route')
    console.log(Route.toJSON())
  }
}
```

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,f_auto/v1611994181/v5/routes-to-json.png)

## Extending Router
The Router is a combination of [multiple classes](https://github.com/adonisjs/http-server/tree/develop/src/Router) and you can add custom properties/methods to all the class using the **macros** or **getters**.

The best place to extend the router is inside the `boot` method of a  custom service provider. Open the `providers/AppProvider.ts` file and write the following code inside it.

```ts
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  // highlight-start
  public async boot() {
    const Route = this.app.container.use('Adonis/Core/Route')

    Route.Route.macro('mustBeSigned', function () {
      this.middleware(async (ctx, next) => {
        if (!ctx.request.hasValidSignature()) {
          ctx.response.badRequest('Invalid signature')
          return
        }

        await next()
      })

      return this
    })
  }
  // highlight-end
}
```

In the above example, we have added the `mustBeSigned` method to the Route class, which internally registers a middleware to verify the [request signature](./../security/signed-urls.md).

Now, open the `start/routes.ts` file to use this method.

```ts{start/routes.ts}
Route
  .get('email/verify', 'OnboardingController.verifyEmail')
  .mustBeSigned()
```

### Informing typescript about the method
The `mustBeSigned` property is added at the runtime, and hence Typescript does not know about it. To inform the Typescript, we will use [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) and add the property to the `RouteContract` interface.

Create a new file at path `contracts/route.ts` (the filename is not important) and paste the following contents inside it.

```ts{contracts/route.ts}
declare module '@ioc:Adonis/Core/Route' {
  interface RouteContract {
    mustBeSigned(): this
  }
}
```

### Extending route resource
You can extend the `RouteResource` class as follows:

```ts{Add macro}
Route.RouteResource.macro('yourMacroName', fn)
```

```ts{Extend interface}
declare module '@ioc:Adonis/Core/Route' {
  interface RouteResourceContract {
    yourMacroName(): this
  }
}
```

```ts{Use macro}
Route.resource().yourMacroName()
```

### Extending route group
You can extend the `RouteGroup` class as follows:

```ts{Add macro}
Route.RouteGroup.macro('yourMacroName', fn)
```

```ts{Extend interface}
declare module '@ioc:Adonis/Core/Route' {
  interface RouteGroupContract {
    yourMacroName(): this
  }
}
```

```ts{Use macro}
Route.group().yourMacroName()
```

### Extending brisk route
You can extend the `BriskRoute` class as follows:

```ts{Add macro}
Route.BriskRoute.macro('yourMacroName', fn)
```

```ts{Extend interface}
declare module '@ioc:Adonis/Core/Route' {
  interface BriskRouteContract {
    yourMacroName(): this
  }
}
```

```ts{Use macro}
Route.on('/').yourMacroName()
```

## Additional reading
Following are some of the additional guides to learn more about the topics not covered in this document.

- [Resourceful routes](./controllers.md#resourceful-routes-and-controllers)
- [Route middleware](./middleware.md)
- [Signed routes](./../security/signed-urls.md)
