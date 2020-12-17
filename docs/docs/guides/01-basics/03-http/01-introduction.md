---
permalink: guides/http/introduction
category: Handling HTTP Requests
group: Basics
---

# Introduction

AdonisJS being a complete Web Framework offers a lot of tooling around handling HTTP requests. When coming from a different framework, you may already be familiar with certain terminologies. If not, understanding every part of the framework might take a while, but that's ok.

In this guide, you will get a birds eye view of handling HTTP requests and how different pieces of the framework works together.

## Router

Routes are the starting point for your application. Using Routes, you define the URLs for your website and hence without registering any routes, your application is not accessible to the outside world.

You can register routes using the Router module of AdonisJS as shown in the following example:

:::note
Routes are registered inside `start/routes.ts` file
:::

```ts{}{start/routes.ts}
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return 'Home page'
})

Route.get('/about', async () => {
  return 'About page'
})
```

The output of the handler function is sent back as response. You can send **HTML**, **JSON**, **XML** and many other data types from the route handler and AdonisJS will handle them properly.

#### Rendering views

:::codegroup

```ts{4}{Route}
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('home')
})
```

```html{}{Template}
<html>
  <head>
  </head>

  <body>
    <h1> Home page </h1>
  </body>
</html>
```

:::

#### JSON Response

You can send JSON response by simply returning a JavaScript object from the route handler.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return {
    id: 1,
    username: 'virk',
    email: 'virk@adonisjs.com',
  }
})
```

[Learn more](/guides/http/routing) about routes

## Controllers

AdonisJS follows the **MVC (Model-View-Controller) architecture**. The job of Controllers is to handle and fulfill the HTTP requests by working with the other parts of the application. For example: Using the database model to load the data and then passing it to the view for rendering the HTML.

:::codegroup

```ts{}{Route}
import Route from '@ioc:Adonis/Core/Route'

Route.get('posts', 'PostsController.index')
```

```ts{}{Controller}
import Post from 'App/Models/Post'

export default class PostsController {

  public async index ({ view }) {
    const posts = await Post.all()
    return view.render('posts', { posts })
  }

}
```

```edge{}{Template}
@each(post in posts)
  <h2> {{ post.title }} </h2>
  <p> {{ post.body }} </p>
@endeach
```

:::

[Learn more](/guides/http/controllers) about controllers

## Views

The views layer of AdonisJS is powered by [Edge](https://edge.adonisjs.com) template engine. Think of it as HTML with the ability to write logic and render dynamic data. For example:

```edge
<body>
  @set('users', [
    { username: 'virk' },
    { username: 'tobi' },
    { username: 'romain' }
  ])

  <ul>
    @each(user in users)
      <li>{{ user.username }}</li>
    @endeach
  </ul>
</body>
```

All that fancy syntax `@set`, `@each` are part of the Edge templating syntax. Make sure to read the [views documentation](/guides/http/views-and-templates) for better understanding.

## Models

Models represents the database layer of your application. AdonisJS has inbuilt support for data models built on top of [Active Record pattern](https://en.wikipedia.org/wiki/Active_record_pattern). You can describe your database tables as JavaScript classes and use JavaScript methods for reading, writing and deleting rows. For example:

:::codegroup

```ts{}{Declaring a Model}
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string
}
```

```ts{}{Using Models}
import User from 'App/Models/User'

await User.all() // fetch all
await User.find(1) // find where id = 1

await User.query().where('age', '>', 18) // find where age > 18

// Creating new user
const user = new User()
user.username = 'virk'
user.email = 'virk@adonisjs.com'

await user.save()
```

:::

Along with Models, AdonisJS also gives you robust API for [database migrations](/guides/database/migrations), [seeders](/guides/database/seeds) and ability to construct and execute queries using the [Database query builder](/guides/database/query-builder).

## Middleware

Middleware is an established terminology used by many frameworks across multiple programming languages. Some frameworks might also call them Pipelines.

In AdonisJS, the middleware are executed before the request reaches the route handler. Middleware can perform various tasks of different nature. For example:

- Perform authentication and abort request when the user is not logged in.
- Preload data using Models.
- Perform usage monitoring by tracking every HTTP request.

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class AuthMiddleware {
  public async handle ({ session, response }: HttpContextContract, next) {
    if (!session.userId) {
      return response.status(401).send('Unauthorized')
    }

    await next()
  }
}
```

[Learn more](/guides/http/middleware) about middleware.

## Http Context

AdonisJS creates a unique context object for every HTTP request it receives. The Context (aka `ctx`) is then passed to every middleware and finally to the route handler.

The purpose of the context is to hold the information related to the current request. For example:

- The current request url, body, headers, cookies and so on.
- Currently logged in user.
- Session module to store and read session values.
- Template engine object to render views in context of current request, and much more.

You also can attach additional properties to the context. For example: A multitenant application can preload tenant details inside a middleware and then pass is around using the request context.

### Reference to Context

Following is an abstract example of accessing the context inside the route handler.

```ts
Route.get('/', async (ctx) => {
  console.log(ctx.inspect())
})
```

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1582007013/adonisjs.com/context.png.png)

## Summary

In this guide you briefly learned about the concepts and terms used by AdonisJS. The entire framework revolves around the same concepts and hence being familiar with them is very important.

In the upcoming guides, you will learn about the same terms and concepts in more depth along with their practical use cases.
