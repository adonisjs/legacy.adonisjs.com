---
permalink: guides/auth/handling-exceptions
group: Authentication
---

# Handling exceptions
All of the exceptions raised by the auth module are [self handled](/guides/http/exception-handling#self-handled-exceptions) and you may never have to handle them manually. However, lets understand the default behavior of the exceptions.

## `InvalidCredentialsException`
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

## `AuthenticationException`
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
