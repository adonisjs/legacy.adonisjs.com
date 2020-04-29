---
permalink: guides/auth/middleware
group: Authentication
---

# Middleware
The `@adonisjs/auth` package creates some middleware inside your application source code. The purpose of these middleware is to help you remove the repetitive code from your codebase.

## Auth Middleware
In this [last guide](/guides/auth/web-guard#time-to-login), we made use of `auth.authenticate` method within the route handler to authenticate the current request. Now imagine having dozens of routes and each time remembering to call this method. 

Instead, you can make use of a middleware to protect routes from public access. In fact, during the initial setup, we create the `Auth` middleware for you.

The middleware is stored inside `app/Middleware/Auth.ts` file, just make sure to register it inside the `start/kernel.ts` file.

```ts{}{start/kernel.ts}
Server.middleware.registerNamed({
  auth: 'App/Middleware/Auth',
})
```

Once registered, you can apply on the routes.

```ts
Route
  .get('/dashboard', 'DashboardController.index')
  .middleware('auth')
```

The middleware will use the default guard *(configured inside the config file)* to authenticate the current request. However, if your application is using more than one guards, then you can define them manually.

```ts
Route
  .get('/dashboard', 'DashboardController.index')
  .middleware('auth:web,jwt')
```

## Silent Auth Middleware
Along with auth middleware, there is an another middleware stored inside `app/Middleware/SilentAuth.ts` file. 

The purpose of this middleware is to silently check if the user is logged-in or not. If the user is logged-in, then you can access the user instance inside your controllers, otherwise the request will continue as usual.

### When to use this middleware
Imagine, you are creating a website that has a publicly accessible homepage. In the header of the webpage, you want to display the username of the logged-in user, or display a button to login.

In this scenario, you can make use of the `SilentAuth` middleware to fetch the logged-in user without restricting access to public URLs.

The middleware must be registered as a global middleware to silently check every HTTP request.

```ts{}{start/kernel.ts}
Server.middleware.register([
  'App/Middleware/SilentAuth',
])
```
