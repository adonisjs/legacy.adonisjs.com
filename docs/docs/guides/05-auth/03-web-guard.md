---
permalink: guides/auth/web-guard
group: Authentication
---

# Web Guard

The web guard uses `sessions` to login and authenticate users. By the end of this guide, you will know: 

- When to use the web guard
- How to register and login user
- How to authenticate requests after the login
- Using the remember me token for long lived sessions


## When to use the web guard?
The web guard relies on the sessions for managing the state of an authenticated user. It is a great fit:

- For applications running on a single domain or subdomains.
- An API server serving the frontend application on the same domain or subdomain.

If you creating an API server, that needs to support **mobile applications** or **3rd party web applications**, then we recommend using the `jwt` guard.

## Register new users
Let's begin by defining the required routes and create the HTML form to register new users. 

```ts{}{start/routes.ts}
Route.on('register').render('register')
Route.post('register', 'AuthController.register')
```

Make the auth controller

```sh
node ace make:controller Auth

# ✔  create    app/Controllers/Http/AuthController.ts
```

Create the `register.edge` view

```sh
node ace make:view register

# ✔  create    resources/views/register.edge
```

Open the newly created `register.edge` file and paste the following code snippet inside it.

```html{}{resources/views/register.edge}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register</title>
</head>
<body>

  <form action="{{ route('AuthController.register') }}" method="post">
    <div>
      <label for="email">Email</label>
      <input type="text" name="email" value="{{ flashMessages.get('email') || '' }}" />
      <p>{{ flashMessages.get('errors.email') || '' }}</p>
    </div>

    <div>
      <label for="password">Password</label>
      <input type="password" name="password" />
      <p>{{ flashMessages.get('errors.password') || '' }}</p>
    </div>

    <div>
      <label for="password_confirmation">Re-Enter Password</label>
      <input type="password" name="password_confirmation" />
      <p>{{ flashMessages.get('errors.password_confirmation') || '' }}</p>
    </div>

    <div>
      <button type="submit">Create Account</button>
    </div>
  </form>

</body>
</html>
```

- The HTML form uses the `route` helper to lookup the form action URL.
- It contains the `email`, `password` and the `password_confirmation` fields.
- Uses flash messages to show the validation errors. If you are not aware of the flash messages, then we recommend reading the [form submissions guide](/guides/http/form-submissions) first.

### Handle form submission
The final step is to handle the registration form submission to create a new user account and also login them immediately.

Open `app/Controllers/Http/AuthController.ts` file and paste the following code snippet inside it.

```ts{}{app/Controllers/Http/AuthController.ts}
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async register ({ request }: HttpContextContract) {
    /**
     * Validate user details
     */
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [
        rules.confirmed(),
      ]),
    })

    const userDetails = await request.validate({
      schema: validationSchema,
    })

    /**
     * Create a new user
     */
    const user = new User()
    user.email = userDetails.email
    user.password = userDetails.password
    await user.save()

    return 'Your account has been created'
  }
}
```

- Using the `request.validate` method, we validate the email address and ensure that it is unique inside the `users` table.
- After validation, we create a new user using the `User` model and return a success message as a string.

### Time to login

So far, we have not done anything related to auth. So, let's open the `AuthController` file again and make the following modifications to it.

1. Get reference to the `auth` and the `response` object from the HTTP request context.
    ```ts{1}
    public async register ({ request, auth, response }: HttpContextContract) {
      // ....
    }
    ```

2. Replace the `Your account has been created` line with the following code snippet.
    ```diff
    - return 'Your account has been created'
    + await auth.login(user)
    + response.redirect('/dashboard')
    ```

3. Finally create a dummy `/dashboard` route to show the details of the logged in user.
    ```ts{}{start/routes.ts}
    Route.on('register').render('register')
    Route.post('register', 'AuthController.register')

    Route.get('/dashboard', async ({ auth }) => {
      const user = await auth.authenticate()
      return `Hello user! Your email address is ${user.email}`
    })
    ```

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1587897981/adonisjs.com/register-auth_n2mvxi.mp4", controls]

### How it works?

- The `auth.login` method accepts the user model instance to login the user. Yes, that's all you need to do to login a user.
- The `auth.authenticate` method validates the current request session and returns an instance of the logged in user. The request will be redirected to the `/login` page, if the user is not logged in.

## Login users
Let's take a step further and also setup the `/login` route. This time, we just need to verify the user credentials and login.

```ts{}{start/routes.ts}
Route.on('login').render('login')
Route.post('/login', 'AuthController.login')
```

Create the `login.edge` view

```sh
node ace make:view login

# ✔  create    resources/views/login.edge
```

Open the newly created file and paste the following code snippet inside it.

```html{}{resources/views/login.edge}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
</head>
<body>

  <form action="{{ route('AuthController.login') }}" method="post">
    <div>
      <label for="email">Email</label>
      <input type="text" name="email" value="{{ flashMessages.get('email') || '' }}" />
      <p>{{ flashMessages.get('auth.errors.uid') || '' }}</p>
    </div>

    <div>
      <label for="password">Password</label>
      <input type="password" name="password" />
      <p>{{ flashMessages.get('auth.errors.password') || '' }}</p>
    </div>

    <div>
      <button type="submit">Login</button>
    </div>
  </form>

</body>
</html>
```

### Handle form submission
Finally, we need to implement the `login` method on the existing `AuthController` to login the user.

```ts{}{app/Controllers/Http/AuthController.ts}
export default class AuthController {
  public async login ({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    await auth.attempt(email, password)
    
    response.redirect('/dashboard')
  }
}

```

- Instead of using the `auth.login` method, we make use of the `auth.attempt` method. 
- This method accepts a `uid` and the `password`. It will self handle the process of finding the user and verifying their password.
- If the credentials are valid, the user will be logged in automatically.
- If the credentials are not valid, then the user will be redirected back to the login form with the errors.

Voila 🎉 You have just implemented a fully working registration and login flow. Also, you have the complete freedom to self design the HTML pages and setup the routes as you want.

## Remember Me
The `web` guard has first class support for the remember me feature. All of you need to do is, pass a boolean flag to the `auth.attempt` or the `auth.login` methods.

```ts
const email = request.input('email')
const password = request.input('password')
const rememberUser = !!request.input('remember_me')

await auth.attempt(email, password, rememberUser)

// Or
await auth.login(user, rememberUser)
```

## Logout
In order to logout a user, you just need to call the `auth.logout` method and the user session will be invalidated.

```ts
await auth.logout()
```

## Handling exceptions
All of the exceptions raised by the auth module are [self handled](guides/http/exception-handling#self-handled-exceptions) and you may never have to handle them manually. However, lets understand the default behavior of the exceptions.

### `InvalidCredentialsException`
The `auth.attempt` method raises the `InvalidCredentialsException` when unable to lookup a user or not able verify the password. If not handled manually:

- The request will be redirected back to the **previous page**, along with error messages.
- Ajax requests or requests with `accept = application/json` header will receive errors as JSON instead of the redirect.

```ts
try {
  await auth.attempt(email, password)
} catch (error) {
  if (error.code === 'E_INVALID_AUTH_UID') {
    // unable to find user using email address
  }

  if (error.code === 'E_INVALID_AUTH_PASSWORD') {
    // password mis-match
  }
}
```

### `AuthenticationException`
The `auth.authenticate` method raises the `AuthenticationException` when unable to find a valid session or unable to lookup the user from the session id. If not handled manually:

- The request will be redirected back to the login page.
- Ajax requests or requests with `accept = application/json` header will receive an error with 401 status code.

```ts
try {
  await auth.authenticate()
} catch (error) {
  // invalid session
}
```
