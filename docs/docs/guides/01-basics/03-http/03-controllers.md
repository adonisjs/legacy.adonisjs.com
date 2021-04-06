---
permalink: guides/http/controllers
category: Handling HTTP Requests
group: Basics
---

# Controllers

Controllers are the defacto way of handling HTTP requests in AdonisJS. Unlike many other frameworks, controllers in AdonisJS are not magical, infact they are plain JavaScript classes with no logic attached to them.

In this guide, we will go through the API surface of controllers and also answer certain questions around the simplicity of controllers in AdonisJS.

## Using Controllers
Controllers lives inside the `app/Controllers/Http` directory and each file must be used to declare and export a single controller class. Consider the following example of generating a new controller and passing it's reference to a given route.

[codegroup]

```sh{}{Make Controller}
node ace make:controller User
# ✔  create    app/Controllers/Http/UsersController.ts
```

```ts{}{UsersController}
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index () {
    return [{ id: 1, username: 'virk' }]
  }
}
```

```ts{}{Routes}
Route.get('users', 'UsersController.index')
```

[/codegroup]

#### Things to note

- Controllers are always referenced as a string on the route. This enables AdonisJS to lazy load controllers and keep the routes file free from dozens of import statements.
- Since AdonisJS knows that the controllers conventionally lives inside `app/Controllers/Http` directory, you don't have to type the complete path inside your routes file.

[tip]
The Vscode extension of AdonisJS autosuggests the controller and method names as you type them within your routes.
[/tip]

## Reusing Controllers?
A lot of developers tend to make a mistake of attempting to re-use controllers by importing them inside other controllers.

If you want to re-use some logic within your application, then that piece of code must be extracted to it's own class or object often known as service objects.

We strongly recommend you to treat your controllers as traffic hops, whose job is to accept the HTTP request, assign work to the other parts of the application and return a response. All of the reusable logic must live outside the controller.

## What Controllers don't do?
In AdonisJS, controllers are vanilla JavaScript classes with no inherited behavior. The main purpose of controllers is to move the inline route handlers to dedicated classes and keep the code structured.

Many MVC framework also uses controllers as the hotspot for configuring routes and defining middleware using decorators or instance properties. For example:

```ts
class UsersController {

  @get('/users') // The route
  @before(SomeMiddleware) // Middleware
  public async index () {
  }

}
```

[tip]
Re-read the subtitle of this section.
[/tip]

The above approach may seem really good at first glance, however it has certain drawbacks.

- The framework has to load all the controllers during boot and register routes exposed by them. For bigger projects this will increase the boot time of the application.
- A developer working on the codebase for the first time has to scan many controllers in order to get a complete view of the application.
- If controllers are not part of the application code base (registered using 3rd party dependencies), then you may have no idea about the routes registered by them.

The AdonisJS has a simple rule to treat the routes file as the source of truth. One should be able to see all the **registered routes**, **controllers and middleware attached to them** at a single place and then branch out from there to work on individual pieces.
