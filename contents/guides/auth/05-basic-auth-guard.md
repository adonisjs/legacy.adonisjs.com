---
permalink: guides/auth/basic-auth-guard
group: Authentication
---

# Basic Auth Guard

The basic auth guard uses the [HTTP Basic Auth](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Basic_authentication_scheme) for authenticating requests. By the end of this guide, you will be able to authenticate requests using the auth middleware.

## Authenticating requests
There is **no concept of login and logout** with HTTP basic auth. The client is supposed to pass a base64 encoded string containing the user credentials as the `Authorization` header. If the credentials are valid, the request will be permitted. Otherwise, AdonisJS will deny the request with `WWW-Authenticate` response header. 

For demonstration, let's create a dummy route and use the `auth` middleware to force basic authentication.

[note]

Make sure, you have the [Auth middleware setup](/guides/auth/middleware#auth-middleware) properly for your app.

[/note]

```ts{}{start/routes.ts}
Route
  .get('posts', async ({ auth }) => {
    return `You are logged in as ${auth.user!.email}`
  })
  .middleware('auth:basic')
```

First lets use the CURL command to visit the `/posts` route.

```sh{4}
curl -i http://localhost:3333/posts

# HTTP/1.1 401 Unauthorized
www-authenticate: Basic realm="Login", charset="UTF-8"
# content-length: 13
# content-type: text/plain; charset=utf-8
# Date: Mon, 10 Aug 2020 04:29:13 GMT
# Connection: keep-alive

Access denied
```

If you make the same request using a browser, it will prompt you to enter the credentials before showing **Access denied**. The browsers shows the prompt only when the `www-authenticate` header is set.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1597034375/adonisjs.com/adonis-basic-auth_n8ierd.mp4", controls]

## What's next?

- [Understanding the flow](handling-exceptions) of exceptions raised by the auth module.
