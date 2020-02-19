---
permalink: guides/http/routing
category: Handling HTTP Requests
---

# Routing

This guide covers the HTTP routing capabilities of the framework. By the end of this guide, you will know:

- What are HTTP routes.
- How to define routes following the REST principles
- How to define dynamic routes using parameters.
- Binding controller methods to routes.
- Advanced concepts like shallow resources and pattern matching.

## What are HTTP routes?

The users of your website or web application can visit different URL's like `/`, `/about` or `/contact`.  In order to define these URL's you have to create **routes** with a handler function that will be called every time someone visits the related URL.

The routes are defined inside the `start/routes.ts` file. Let's start by defining the following routes in the same file.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return 'This is the home page'
})

Route.get('/about', async () => {
  return 'This is the about page'
})

Route.get('/contact', async () => {
  return 'This is the contact page'
})
```

[note]

  Make sure to start the HTTP server by running `node ace serve --watch` command. 

[/note]

The website has a total of three URLs and each one will print the value returned by the route handler.

- http://localhost:3333
- http://localhost:3333/about
- http://localhost:3333/contact

If you try to visit a different URL, for example: `/blog`, you will receive a **404 (Page not found)** error.

### Http Methods

You can define routes for different [HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) by calling the equivalent method names on the `Route` object.

| Http method | Route method | 
|------------|--------------|
| GET | `Route.get` |
| POST | `Route.post` |
| PUT | `Route.put` |
| PATCH | `Route.patch` |
| DELETE | `‌Route.delete` |

All of the above methods accepts a route pattern, along with a function to handle the route requests. The function can be an [inline closure](#inline-closure) or reference to a [controller method](#controller-method).

You can also create routes that can respond to multiple HTTP methods using a single route handler. For example:

```ts
Route.route('/', ['GET', 'POST'], async () => {
  return 'Both GET and POST are handled'
})
```

## Dynamic URL's

Not every URL can be as simple as `/about` or `/contact`. Many URL's will need dynamic values in order to be functional. A great example of this is a blog or an e-commerce website, where you want to lookup database records for a given id.

Let's continue with the blog example and see how we can accept the **blog post id** as part of the url and then render the correct blog post.

```ts
Route.get('/posts/:id', async ({ params }) => {
  return `You are viewing a blog post with id ${params.id}`
})
``` 

[note]

  Make sure to start the HTTP server by running `node ace serve --watch` command. 

[/note]

Now, if you will visit the http://localhost:3333/posts/1, you will see the following message.

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1582021556/adonisjs.com/dynamic-urls-static.png)

#### What just happened?

- The `:id` is an expression **(known as route parameters)** that tells AdonisJS to accept any value and store it as `id` under the `params` object.
- You can give any name to the parameter, just make sure that it starts with `:` (a colon).
- The `params` property exists on the `ctx` object. You can access it as `ctx.params` or use the [Javascript destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) as shown in the above example.

### Optional parameters

You can also mark parameters as optional by adding the `?` suffix. Consider the following example:

```ts
                    👇
Route.get('/posts/:id?', async ({ params }) => {
  if (params.id) {
    return `You are viewing a blog post with id ${params.id}`
  } else {
    return `You are viewing all blog posts`
  }
})
```

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1582021461/adonisjs.com/dynamic-urls.gif)

## CRUD Actions

The principles of [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) provides a great way to map CRUD operations with HTTP methods without making the URL's verbose.

For example: The URL `/posts` can be used to **view all the posts** and also to **create a new post**, just by using the correct HTTP method.

```ts
Route.get('/posts', () => {
  return 'List of posts'
})

      👇
Route.post('/posts', () => {
  return 'Create a new post'
})
```

Using the principles of [REST](https://en.wikipedia.org/wiki/Representational_state_transfer), following are the routes to perform CRUD operations on blog posts.

```ts
Route.post('/posts', async () => {
  return 'Perform Create'
})

Route.get('/posts', () => {
  return 'Peform Read'
})

Route.get('/posts/:id', () => {
  return 'Peform Read on a single post'
})

Route.put('/posts/:id', () => {
  return 'Peform Update'
})

Route.delete('/posts/:id', () => {
  return 'Peform Delete'
})
```

Since, the above pattern is so popular and widely used. AdonisJS provides a shortcut to define all the RESTful routes using **Route resources**.

### Route resources

```ts
Route.resource('posts', 'PostsController')
```

The `Route.resource` method registers the following routes along with the appropriate controller methods.

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1582021833/adonisjs.com/list_routes.png)

[note]

The Resourceful routes has two implications.

1. The dynamic parameter name is always `:id`.
2. You always need to assign a controller to a resource.

[/note]

If you notice, the `Route.resource` method creates two extra routes.

- `/posts/create` route is meant to display the form for creating a new post.
- `/posts/:id/edit` route is meant to display the form for updating an existing post.

However, when creating an API server, the routes to display forms are redundant and can be removed using the `apiOnly` method.

```ts
Route
  .resource('posts', 'PostsController')
  .apiOnly() 👈
```

### Filtering Resourceful Routes

In many situations, you would want to prevent some of the resourceful routes from getting registered. For example: You decided to restrict the users of your blog from **updating** or **deleting** their comments and hence routes for the same are not required.

```ts
Route
  .resource('comments', 'CommentsController')
  .except(['update', 'destroy']) 👈
```

The opposite of `except` is the `only` method to whitelist selected routes.

```ts
Route
  .resource('comments', 'CommentsController')
  .only(['index', 'create', 'store', 'show', 'edit']) 👈
```

The `except` and `only` methods takes an array of subset of route names to blacklist or whitelist. When both are applied together, the `only` method will win. 

Learn more about [route names](#naming-routes).    

### Nested resources

Nested resources are registered using the `dot notation (.)`. Even though there is no technical limitation on the nesting level, it is recommended to avoid deeply nested resources.

```ts
Route.resource('posts.comments', 'CommentsController')
```

The above example registers the following routes. The **parent resource id** gets prefixed with the resource name, ie: `post_id`.

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1582022101/adonisjs.com/nested-resource.png)

## Route Groups

AdonisJs provides a great way to group multiple routes of similar nature and bulk configure them instead of re-defining same properties on every route.

A group is created by passing a closure to the `Route.group` method. Routes, declared inside the closure are part of the surrounding group.

```ts
Route.group(() => {
  // All routes here are part of the group
})
```

You can also create nested groups and AdonisJs will merge or override properties based upon the behavior of the applied setting.

### Route Prefix

You can prefix the group routes URL using the `.prefix` method. For example: Adding `/blog` prefix to all blog related routes.

```ts
Route
  .group(() => {
    Route.get('/', 'PostsController.index')
    Route.get('/posts/:id', 'PostsController.show')
  })
  .prefix('/blog')
```

In case of nested groups, all prefixes will be applied starting from the outer to the inner groups. For example

```ts
Route
  .group(() => {
    Route.get('/', 'PostsController.index')
    
    Route
      .group(() => {
        Route.get('/', 'PostsApiController.index')
      })
      .prefix('/api')
  })
  .prefix('/blog')
```

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1582023737/adonisjs.com/nested-groups.png)

You can also define [middleware](#applying-middleware-to-route-groups), [sub-domains](#domains) and [route names](#naming-routes) on a group of routes.

## Route Middleware

[Middleware](middleware) offers an API to execute a series of actions before a given HTTP request reaches the route handler.

AdonisJs provides two layers at which middleware can be executed.

- **Global middleware** are executed for every valid HTTP request.
- **Route middleware** are executed when request for the corresponding route is received.

[note]

 This section focuses on the usage of Middleware with Routes. Make sure to read the [dedicated guide on middleware](middleware) to learn more about them.

[/note]

You can add middleware to the routes using the `middleware` method, as shown below:

```ts
Route
  .get('/users/:id', async () => {
    return 'Show user'
  })
  .middleware(async (ctx, next) => {
    console.log(`Inside middleware ${ctx.request.url()}`)
    await next()
  })
```

![](/route-middleware.gif)

### Middleware Classes

Just like Controllers, you can extract inline middleware functions to their own dedicated classes and keep your routes file clean and tidy.

Creating and using middleware classes involves an extra step of registering middleware aliases and then using the alias as an identifier on the route. The [middleware guide](middleware) covers the concept of aliases in depth.

1. Run the following command to create a new middleware class.

   ```sh
   adonis make:middleware Sample
   ```

2. Copy/paste the following contents inside `app/Middleware/Sample.ts` file.

   ```ts
   import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

   export default class SampleMiddleware {
     public async handle (ctx: HttpContextContract, next) {
      console.log(`Inside middleware ${ctx.request.url()}`)
      await next()
     }
   }
   ```
   
3. Register the middleware namespace with an alias under `start/kernel.ts` file.
  ```ts
  Server.middleware.registerNamed({
    sample: 'App/Middleware/Sample',
  })
  ```
  
4. Reference the registered alias on the route.
  ```ts
  Route
    .get('/users/:id', 'UserController.show')
    .middleware('sample') 👈
  ```
   
### Applying Middleware to Route Groups

You can also apply middleware to a group of routes. The group middleware will be executed before the middleware registered on individual routes.

```ts
Route
 .group(() => {
   Route
    .put('/posts/:id', 'PostsController.update')
    .middleware('postAuthor')
 })
 .middleware('auth')
```

In the above example, the `auth` middleware will executed before the `postAuthor` middleware.

### Applying Middleware to Route Resources

The `Route.resource` method also exposes the API to register middleware on all or selected routes registered by a given resource.

```ts
Route
  .resource('users', 'UsersController')
  .middleware('auth')
```

When selectively applying middleware to certain routes, the object **key is the name of the route** and **value is an array of middleware** to apply.

```ts
Route
  .resource('posts', 'PostsController')
  .middleware({
    store: ['auth'],
    update: ['auth'],
    destroy: ['auth'],
  })
```


## Domains

AdonisJs makes it super easy to create multi domain applications. Using `domains`, you can restrict routes to be accessible only for a given domain.

```ts
Route
  .group(() => {
    // Scoped to blog.adonisjs.com only
  })
  .domain('blog.adonisjs.com')
```

When running your application, AdonisJs will make sure that routes defined inside the above group are only accessible by the `blog.adonisjs.com` domain.

You can also define dynamic parameters within the domain name. For example: Creating a multi-tenant app and accepting the tenant subdomain as part of the URL.

In the following route, you can access the `tenant` value from the `subdomains` object.

```ts
Route
  .group(() => {
    Route.get('/', async ({ subdomains }) => {
      return `tenant: ${subdomains.tenant}`
    })
  })
  .domain(':tenant.myapp.com')
```

## Naming Routes

Even though routes are defined inside a single file `(start/routes.ts)` file, they can be referenced across the application to generate URL's.

For example: You can use the `Route.makeUrl` method to generate URL for a pre-registered route.

```ts
Route.get('/users/:id', 'UsersController.show')
```

Generating the URL.

```ts
Route.makeUrl('/users/:id', { id: 1 }) // /users/1
```

Whenever, you change the above pattern `/users/:id`, a corresponding change for the `makeUrl` method also needs to done and finding references throughout the application can be a tedious task.

To overcome this problem, AdonisJs allows you to give unique names to your routes. When generating the URL, you can use the name instead of the route pattern.

```ts
Route
 .get('/users/:id', 'UsersController.show')
 .as('showUser') 👈
```

Generating the URL using name.

```ts
Route.makeUrl('showUser', { id: 1 }) // /users/1
```

### Naming Resourceful Routes

The routes registered by the `Route.resource` method are automatically named after the resource name. 

For example: The `users` resource will have the following names.

- `users.index`
- `users.create`
- `users.store`
- `users.show`
- `users.edit`
- `users.update`
- `users.destroy`

Similarly the nested resources will be named after the `parent.child` resource.

### Naming Route Groups

Using route groups, you can prefix the routes names for that given group. This is helpful, when you have similar routes outside the group and want to avoid name collisions. For example:

```ts
Route.resource('users', 'UserController')

Route
  .group(() => {
    Route.resource('users', 'UserController')
  })
  .prefix('v1')
```

The above code will not work, since we have two identical resources, both having the same names. We can fix the issue by prefixing the resourceful routes names, declared inside the group.

```ts
Route.resource('users', 'UserController')

Route
  .group(() => {
    Route.resource('users', 'UserController')
  })
  .prefix('v1')
  .as('apiv1') 👈
```

![](/route-group-naming.png)

## Advanced Concepts

In this section, we will explore some of the advanced concepts of routing like **pattern matching**, **shallow resources** and **brisk routes**.

You may not reach for them in every application, but they can improve the overall structure of your API and help you in writing declarative code.

### Pattern Matching

Pattern matching is really helpful, when you want to distinguish between two similar routes. For example: Show a blog post by its `id` and `slug` both.

The traditional approach is to accept the `id` or `slug` as a route parameter and then inside the route handler, you can search the database with an **OR** clause. 

```ts
import Post from 'App/Models/Post'

Route.get('posts/:id', async ({ params }) => {
  return Post.query()
    .where('id', params.id)
    .orWhere('slug', params.id)
    .firstOrFail()
})
```

There are couple of problems with the above code.

1. You have to add an additional `where` clause.
2. One has to read the route handler code to understand that a search is performed both for the `id` and the `slug`. In short, code is not declarative.

Using **pattern matching**, you can write declarative code and also have more certainty inside the route handlers.

```ts
Route
 .get('posts/:id', async ({ params }) => {
   return `Post for id ${params.id}`
 })
 .where('id', /^[0-9]+$/) 👈

Route
 .get('posts/:slug', async ({ params }) => {
   return `Post for slug ${params.slug}`
 })
 .where('slug', /^[a-z0-9-]+$/) 👈
```

![](/pattern-matching.gif)

The `where` method let you define a regex to match the route parameters and invokes the correct handler based upon the user input. If nothing is matched, a standard 404 exception is raised.

The `where` method can also be chained to define regex for multiple route parameters.

### Pattern Matching for Resourceful Routes

You can also define the pattern for resourceful routes in bulk. Consider the following example:

```ts
Route
  .resource('posts', 'PostsController')
  .where('id', /^[0-9]+$/)
```

The `id` for all the routes has to match the defined regex.

### Pattern Matching for Route Groups

The parameters patterns can also be define on a group of routes to avoid re-defining them on every individual route.

[tip]
  
  Patterns defined on the individual routes will get preference over the patterns defined on the group.
 
[/tip]

```ts
Route.group(() => {
  Route.get('posts/:id', async () => {
  })

  Route.get('comments/:id', async () => {
  })

  Route.get('users/:id', async () => {
  })
}).where('id', /^[0-9]+$/)
```

### Shallow Resources

