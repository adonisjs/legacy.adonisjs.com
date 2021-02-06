---
goals:
  - Understanding how controllers are defined
  - The role of controllers
  - Lazy loading controllers and why we opted for string over importing classes
  - Resources should be documented here. They are tied to controllers
  - Controllers as namespaces and not paths
  - Using controllers from a package
  - Know the purpose of controllers and how to use them
---

Controllers are the defacto way of handling HTTP requests in AdonisJS. They enable you to cleanup the routes file by moving all the inline route handlers to their own dedicated controller files.

In AdonisJS, the controllers are stored inside (but not limited to) the `app/Controllers/Http` directory and each file represents a single controller. For example:

```ts{app/Controllers/Http/PostsController.ts}
export default class PostsController {
  public async index() {
    return [
      {
        id: 1,
        title: 'Hello world',
      },
      {
        id: 2,
        title: 'Hello universe',
      },
    ]
  }
}
```

In order to use this controller, you will have to reference it as a route handler inside the `start/routes.ts` file.

```ts
Route.get('posts', 'PostsController.index')
```

#### Points to note

- Controllers are always referenced as a string on the route. This enables AdonisJS to lazy load controllers and keep the routes file free from dozens of import statements
- Since AdonisJS knows that the controllers conventionally lives inside `app/Controllers/Http` directory, you don't have to type the complete path inside your routes file. Just the filename is enough.
- The controller methods receives the [HTTP context](./context.md) as the first argument.

  ```ts
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

  export default class PostsController {
    public async index(ctx: HttpContextContract) {}
  }
  ```

## Make controller command

You can make use of `node ace` to create a new controller. For example:

```sh
node ace make:controller Post

# CREATE: app/Controllers/Http/PostsController.ts
```

If you notice, in the above command we mentioned the word `Post` as signular, whereas the generated file name is in plural form and has a `Controller` suffix.

AdonisJS applies these transformations to ensure that the filenames are consistent through out your project. However, you can instruct the CLI to not apply these transformations at all by using the `--exact` flag.

![Output of "node ace make\:controller --help"](https://res.cloudinary.com/adonis-js/image/upload/f_auto,q_auto/v1611555570/v5/controller-help-exact-flag.png)

## Controller routes reference
As you can notice, the controllers are referenced on routes as a string expression, ie `'Controller.method'`. We opted this approach intentionally in favor of lazy loading controllers and less verbose syntax.

Let's see how the routes file may look like, if we decide **NOT TO use** the string expression.

```ts
import Route from '@ioc:Adonis/Core/Route'
import PostsController from 'App/Controllers/Http/PostsController'

Route.get('/posts', async (ctx) => {
  return new PostsController().index(ctx)
})
```

In the above example, we import the `PostsController` within the routes file. Create an instance of it and run the `index` method, passing the `ctx` object.

Now imagine an application with 40-50 different controllers. Each controller having its set of imports, all getting pulled down inside a single routes file, making the routes file a choke point.

### Lazy loading
Lazy loading the controllers is a perfect solution to the problem mentioned above. There is no need to import everything at the top level, instead import the controllers as they are needed.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('/posts', async (ctx) => {
  const { default: PostsController } = await import(
    'App/Controllers/Http/PostsController'
  )
  return new PostsController().index(ctx)
})
```

Manually importing the controller, instantiating the class instance is still too much code, considering a decent sized application can go over 100 routes.

### Betting on the typescript future
The string based reference provides the best of the both worlds. The controllers are lazy loaded and the syntax is concise. 

However, it comes with a downside of not being type safe. IDE doesn't complain, if the controller or the method is missing or has a typo.

On the brighter side, making the string expression type safe is not totally impossible. Typescript is already making progress in that direction. We need two things to achieve type safety when referencing `'Controller.method'` as a string expression.

- The ability to tokenize the string expression and create a full path to the controller and its method. This is achievable with Typescript 4.1 and onwards. Here is a [proof of concept](https://www.typescriptlang.org/play?ts=4.1.3#code/MYewdgzgLgBASiArlApjAvDA3gKBjAcxSgB4AJAQzABMAbFAJxhQA9UaIZoGBLMAgHwAKAA4UoqBmABcXKL34AaGAAsqdRrMo16DAJSyY2jU1btqnAAYASLHwBmjGAEEAvgDpbDpwCFXlmAB+bDx8GFAweRBaXVlLZxERAHoAYXAomMYIJLIJZNs3S0VQ-ABbYhUQalkfUNcYWUQwAGswEAB3MBxXHF6kpKMQADcnYacoFTQAIgYkVCmYIYpeCgAjehh1LhQ0CfEYdrRlo-XdkBgxBggjuQUCGD4oc6fmlEgcCOgYWeQ0TARfu4iFAhAByJKg5SgsggcppSKzTIMdx8aisUF6IA) for the same.
- Next is the ability to have an Import type with support for generics. There is [an open issue](https://github.com/microsoft/TypeScript/issues/31090) for it and I am positive that it will make its way to the Typescript in the future, as it adheres to the Typescript design goals.

## CRUD operations
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

Here's the list of all the routes to perform CRUD operations.

```ts
Route.get('/posts', () => {
  return 'List all posts'
})

Route.get('/posts/create', () => {
  return 'Display a form to create a post'
})

Route.post('/posts', async () => {
  return 'Handle post creation form request'
})

Route.get('/posts/:id', () => {
  return 'Return a single post'
})

Route.get('/posts/:id/edit', () => {
  return 'Display a form to edit a post'
})

Route.put('/posts/:id', () => {
  return 'Handle post update form submission'
})

Route.delete('/posts/:id', () => {
  return 'Delete post'
})
```

## Resourceful routes and controllers

Since the [above mentioned](#crud-operations) routes are using a pre-defined convention. AdonisJS provides a shortcut to register all the routes together using the `Route.resource` method.

:::note
The `Route.resource` method can only be used with a controller.
:::

```ts
Route.resource('posts', 'PostsController')
```

Following is the list of registered routes.

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,f_auto/v1611651446/v5/routes-list.png)

### Naming routes
As you can notice, each route, registered by the resource is given a name. The route name is created by combining the **resource name** and the **action** performed by the route. For example:

- `posts.create` signifies a route to display the form to create a new post
- `posts.store` signifies a route to create a new post
- and so on.

Using the `.as` method, you can change the prefix before the action name.

```ts
Route.resource('posts', 'PostsController').as('articles')
```

```txt
articles.index
articles.create  
articles.store   
articles.show    
articles.edit    
articles.update  
articles.destroy
```

### Filtering routes
In many situations, you would want to prevent some of the resourceful routes from getting registered. For example: You decide to restrict the users of your blog from **updating** or **deleting** their comments and hence routes for the same are not required.

```ts
Route
  .resource('comments', 'CommentsController')
  .except(['update', 'destroy']) // 👈
```

The opposite of `except` method is the `only` method to only register the routes with the given action names.

```ts
Route
  .resource('comments', 'CommentsController')
  .only(['index', 'show', 'store']) // 👈
```

### API only routes
When creating an API server, the routes to display the forms are redundant, as you will be creating those forms within your frontend or the mobile app. You can remove those routes by calling the `apiOnly` method.

```ts
Route
  .resource('posts', 'PostsController')
  .apiOnly() // 👈
```

### Applying middleware
The `.middleware` method also you to apply middleware on all or selected set of routes, registered by a given resource.

```ts
Route
  .resource('users', 'UsersController')
  .middleware({
    '*': ['auth']
  })
```

Or apply middleware to selected actions only. In the following example, the object key has to be the action name.

```ts
Route
  .resource('users', 'UsersController')
  .middleware({
    create: ['auth'],
    store: ['auth'],
    destroy: ['auth'],
  })
```

## Nested resources
You can also register nested resources by separating each resource with a `dot notation (.)`. For example:

```ts
Route.resource('posts.comments', 'CommentsController')
```

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,f_auto/v1611673295/v5/nested-resource.png)

As you can notice, the parent resource id is prefixed with the resource name. ie `post_id`. You can also override the default paramter names using the `ids` method.

```ts
Route
  .resource('posts.comments', 'CommentsController')
  .ids({
    posts: 'article_id',
    comments: 'thread_id'
  })

// Example route: /posts/:article_id/comments/:thread_id 👈
```

## Shallow resources
In case of nested resources, every child resource is prefixed with the parent resource name and its id. For example:

- `/posts/:post_id/comments`: View all comments for the post
- `/posts/:post_id/comments/:id`: View all comment by id. 

The existence of `:post_id` in the second route is irrelevant, as you can lookup the comment directly by its id.

We can make use of shallow resource, to remove the unneccessary nesting.

```ts
Route.shallowResource('posts.comments', 'CommentsController')
```

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,f_auto/v1612004976/v5/shallow-resource.png)

## Reusing controllers
A lot of developers tend to make a mistake of attempting to re-use controllers by importing them inside other controllers.

If you want to re-use some logic within your application, then that piece of code must be extracted to it's own class or object often known as service objects.

We strongly recommend you to treat your controllers as **traffic hops**, whose job is to **accept the HTTP request**, **assign work** to the other parts of the application and **return a response**. All of the reusable logic must live outside the controller.
