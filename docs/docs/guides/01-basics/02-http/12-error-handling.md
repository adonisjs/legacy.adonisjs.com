---
permalink: guides/http/exception-handling
category: Handling HTTP Requests
group: Basics
---

# Exception Handling
AdonisJS allows you to globally handle exceptions that are occured during an HTTP request. By the end of this guide, you will know:

- How to catch all exceptions at a single location.
- Using exceptions as control flow.
- Raising exceptions that can handle themselves.
- Status pages, development only error pages and more.

## Global Exception Handler
The global exception handler lives inside `app/Exceptions/Handler.ts` file. You can customize it's location by editing the `exceptionHandlerNamespace` value inside `.adonisrc.json` file.

```json{}{.adonisrc.json}
{
  "exceptionHandlerNamespace": "App/Exceptions/Handler"
}
```

The exception handler class extends the `Adonis/Core/HttpExceptionHandler` provided by AdonisJS. All of the functionality we are about to discuss are inherited from the base `HttpExceptionHandler` class.

## The `handle` method
The `handle` method is invoked everytime an unhandled exception is raised within an HTTP request cycle. The handle method receives an error object, along with the [HTTP context](introduction#http-context).

You can let the base exception handler handle the exceptions for you, unless, you want to manually handle a specific exception. For example:

```ts
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  public async handle (error, ctx) {
    // highlight-start
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send(error.messages)
    }
    // highlight-end

    return super.handle(error, ctx)
  }
}
```

## The `report` method
The `report` method is meant to report/log exceptions for debugging. By default, the base exception handler will use the [application logger](logger) to log all exceptions. However, you can also implement this method to manually handle reporting in a different way.

```ts
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  public async report (error, ctx) {
    // Using rollbar instead of application logger
    Rollbar.critical(error)
  }
}
```

## Status Pages
The base exception handler let you to configure templates to be rendered for specific status codes. For example: Defining a template for `404` status code and a template for series of `500` status codes.

```ts
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  // highlight-start
  protected statusPages = {
    '404': 'errors.not-found',
    '500..599': 'errors.server-error',
  }
  // highlight-end

  constructor () {
    super(Logger)
  }
}
```

- The exception handler will render `errors.not-found` template everytime an exception with status code `404` is raised.
- Using the range expression `..`, we assign `errors.server-error` template for `500` to `599` status codes.

By default the status pages are not rendered during development. However, you can turn them on using `disableStatusPagesInDevelopment` flag.

```ts{2}
export default class ExceptionHandler extends HttpExceptionHandler {
  protected disableStatusPagesInDevelopment = false

  protected statusPages = {
    '404': 'errors.not-found',
    '500..599': 'errors.server-error',
  }

  constructor () {
    super(Logger)
  }
}
```

## Error Reporting
The default `report` method will report all the exceptions reaching the global exception handler. Getting notified about every exception can get annoying, specially, when there is no need to act on them. For this very same reason, the base exception handler allows you to blacklist the error codes or the status codes from being reported.

```ts
export default class ExceptionHandler extends HttpExceptionHandler {
  // highlight-start
  protected ignoreCodes = [
    'E_ROUTE_NOT_FOUND'
  ]
  // highlight-end

  // highlight-start
  protected ignoreStatuses = [
    400,
    422,
    401,
  ]
  // highlight-end

  constructor () {
    super(Logger)
  }
}
```

The `ignoreCodes` takes an array of error codes and `ignoreStatuses` takes an array of error statuses to ignore. You can choose either or them, based on your convenience.

## Self Handled Exceptions
AdonisJS provides a great way to raise exceptions that can handle themselves by defining the `handle` method on the exception class itself. A great example of this is the [ValidationException](https://github.com/adonisjs/validator/blob/develop/src/ValidationException/index.ts) raised by the validator.

You can create your own custom exceptions by running the following ace command.

```sh
node ace make:exception UnAuthorized
# ✔  create    app/Exceptions/UnAuthorizedException.ts
```

Open the newly created file in your text editor and implement the `handle` method.

```ts{}{app/Exceptions/UnAuthorizedException.ts}
import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UnAuthorizedException extends Exception {
  constructor (message: string) {
    super(message, 401)
  }

  /**
   * Implement the handle method to manually handle this exception.
   * Otherwise it will be handled by the global exception handler.
   */
  public async handle (error: this, { response }: HttpContextContract) {
    response
      .status(error.status)
      .send('<h1>Sorry you are not allowed to view this page</h1>')
  }
}
```

Finally, create a dummy route to test the exception behavior.

```ts{}{start/routes.ts}
import Route from '@ioc:Adonis/Core/Route'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException'

Route.get('/', async () => {
  throw new UnAuthorizedException('Not allowed')
})
```

If you visit [http://localhost:3333](http://localhost:3333), you must see a message similar to the following screenshot.

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1582479120/adonisjs.com/self-handled-exception.png)
