---
permalink: guides/auth/api-guard
group: Authentication
---

# API Guard
The `api` guard uses database backed **opaque tokens** for authenticating users. In this guide, we will discuss about the different authentication strategies, along with the usage of the opaque tokens.

## Authenticating APIs
**The tokens based authentication is mainly targeted towards the API servers**. If you are creating a traditional, server rendered application, then we highly recommend using the [web guard](web-guard), as it is most simplest and the secure way to authenticate users.

The authentication strategy for an API server highly depends upon its consumers.

---

### Frontend application on the same domain/subdomain
If the consumer of your API server is only a frontend application (written in Vue, React and so on) running on the same domain/subdomain, then we recommend using the [web guard](web-guard).

The web guard uses sessions and cookies for authentication. The cookies on the same domain works great with Ajax calls and provides you the best combination of simplicity and security.

---

### Mobile application
If the consumer of your API server is a **self owned mobile app**, then we recommend using **this guard (the api guard)** for authentication. The tokens issued by this guard are persisted inside a database and provides you the complete control over the lifecycle of the issued tokens. For example:

If your mobile app has some security flaws, you can revoke all the tokens on the server and every user will have to login again and obtain a new token.

---

### Frontend app on a different domain
If your frontend application is running on a different domain, then you cannot leverage the use of cookies. You must use **this guard (the api guard)** for authentication.

The tokens issued by the server has to be persisted within the localstorage and you must read the documentation of your frontend framework to keep your applications secure from XSS attacks and also learn about the [Content-Security-Policy](https://content-security-policy.com/)

---

### Third party apps
If you are creating an API server, which is consumed by third party applications, then you must look into [OAuth 2.0
](https://oauth.net/2/) and [OpenID Connect](https://openid.net/connect/). Both of these specifications are written with years of research and answers most of the security related questions.

Unfortunately, there is no first class support for Oauth2 in AdonisJS (as of you today). However, you can use other packages from npm to implement an Oauth2 server.

## Login
Once, the [setup](setup) has been completed, you can use the `api` guard to generate the **oat tokens** for a given user.

Open `start/routes.ts` file and paste the following route declaration inside it.

```ts{}{start/routes.ts}
Route.post('/login', 'AuthController.login')
```

Next, create the `AuthController.ts` file and paste the following contents inside it.

```ts{}{app/Controllers/Http/AuthController.ts}
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login ({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password)
    return token.toJSON()
  }
}
```

Now, start the development server `node ace serve --watch` and make a POST request to `/login` route to receive the api token.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1592800689/adonisjs.com/oat-auth-login_qt8adc.mp4", controls]

- The `auth.use('api')` method selects the API guard.
- The `.attempt` method accepts the user login id and the password. After verifying the credentials, it will issue the api token.
- The token is an instance of [OpaqueToken](https://github.com/adonisjs/auth/blob/develop/src/Tokens/OpaqueToken/index.ts) class and calling `.toJSON` returns an object to be shared in the response.

## Authentication
Once, the token has been issued, the client can use it to authenticate themselves. The token must be passed inside the `Authorization` header. For example:

```markup
Authorization: Bearer token-value-goes-here
```

For demonstration, lets create a new route and protect it from public access. Open the `start/routes.ts` file and add the following route inside it.

```ts
Route.get('dashboard', async ({ auth }) => {
  await auth.authenticate() //  👈 All you need to go

  return {
    hello: 'world',
  }
})

```

Now, lets the visit the `dashboard` route without and with the `Authorization` header.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1592803305/adonisjs.com/oat-authenticate_wlmyri.mp4", controls]

## Expiring tokens
By default, the tokens have life long validity (until deleted). However, you can define expiry for the tokens at the time of the creating one.

[note]
Expired tokens are not deleted from the database automatically. You may have to run write a custom script to do that. However, we have plans to add that script to the package itself.
[/note]

```ts
await auth.use('api').attempt(uid, password, {
  expiresIn: '10 days',
})

// login using user instance
await auth.use('api').login(user, {
  expiresIn: '10 days',
})

// login via id
await auth.use('api').loginViaId(1, {
  expiresIn: '10 days',
})
```

## Giving tokens name
Based upon your usage of the tokens, you may want to give descriptive names to the generated tokens. For example: If you let the users of your application generate tokens from a dashboard (similar to Github), then it may make sense to let them give names to these tokens as well.

```ts
const token = await auth.use('api').generate(user, {
  name: request.input('token_name'),
})
```

## Where tokens are saved?
The storage of tokens is decided by the driver in use. Currently, we only have `database` driver that stores the tokens inside a SQL table called `api_tokens`. You can inspect the config by opening `config/auth.ts` file.

```ts
{
  tokenProvider: {
    driver: 'database',
    table: 'api_tokens',
  },
}
```

The default database connection (defined inside `config/database.ts`) file is used. If you want to use a different connection, you can specify it inside the config.

```ts
{
  tokenProvider: {
    driver: 'database',
    table: 'api_tokens',
    connection: 'a-different-connection' // 👈
  },  
}
```

### Points to note

- The tokens saved inside the database are hashed using `sha-256` algorithm.
- You can access the original token value only at the time of generating a new token. After that, there is no way to retrieve the plain token. **This is how tokens should work**.

## Deleting tokens
You can delete a token using the `auth.logout` method or manually run a delete query. Once the token is deleted, it cannot be used for authentication.

```ts
await auth.use('api').logout()
```

Using the database query builder

```ts
import Database from '@ioc:Adonis/Lucid/Database'

await Database.from('api_tokens').where('id', tokenId).delete()
```

## What's next?

- [Using middleware](middleware) to protect routes from unauthenticated users.
- [Understanding the flow](handling-exceptions) of exceptions raised by the auth module.
