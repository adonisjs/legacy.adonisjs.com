---
permalink: tutorials/first-steps/routing
category: First Steps
group: Tutorials
author: Chimezie Enyinnaya
---

# Routing

Like I said above, routes are the entry point of an AdonisJS application. Every URI of our application must have a corresponding route definition describing how incoming HTTP request for a particular route should be handled. All routes must be defined inside `start/routes.ts`. Although we can define routes in different files provided we import them inside `start/routes.ts`.

A typical route definition should handle a corresponding HTTP request such as: `GET`, `POST`, `PATCH`, `PUT` and `DELETE`. A typical route accepts two arguments: the URI of the route and the route handler. A route handler can either be inline or using a controller.

## Inline handler

To properly understand the inline route handler, let’s rewrite the default route as below:

```ts
// start/routes.ts

Route.get('/', async ({ view }) => {
  return view.render('welcome')
)
```

Refreshing our application, we result in the same output as before. When using inline handler, a closure is passed as the second argument to the route. Then within the closure we add the implementation to handle the route.

[tip]
  It recommended to use `Route.on('').render('')` when defining a route that simply renders a view with static content.
[/tip]

We are not limited to just rendering views in route handler. It can also conatain our application business logic:

```ts
// start/routes.ts

Route.post('/', async () => {
  // business logic here
)
```

## Using controller

While it’s totally fine to use inline handler, but this can make `routes.ts` to become messy. Hence, it is recommended to move route handling implementation out of the routes file to a dedicated file called controller.

So let’s create a controller. We can can create a controller using the `make:controller` command:

```bash
node ace make:controller TasksController
```

This is will create a new `Controllers` directory and inside it an `Http` controller and finally a `TasksController.ts` file inside the `Http` directory.

[tip]
  You can leave out “Controller” in the controller name and the `make:controller` command will add automatically for you.
[/tip]

Now, we can update `routes.ts` to make use of the `TasksController`:

```ts
// start/routes.ts

Route.get('/', 'TasksController.index')
```

Now, the second argument is string containing the name of the controller and the name of the method separated by a `.`. The method will contain the implementation to handle the route. In this case, the controller name is `TasksController` and the method is `index`.

We need to create the `index()` in the `TasksController`, which will contain the actual implementation:

```ts
// app/Controllers/Http/TasksController.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TasksController {
  public index ({ view }: HttpContextContract) {
    return view.render('welcome')
  }
}
```

Just like before we should still get the same output upon refreshing our application.
