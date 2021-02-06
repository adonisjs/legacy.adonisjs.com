---
summary: AdonisJS router exposes the API to register static routes, routes that accepts dynamic parameters, route groups, subdomains routes and a lot more.
goals:
  - Sending response and different ways to do it
  - Set headers, cookies
  - Redirects
  - Pipe streams
  - Downloads
  - Attachments
  - Extending response class
  - Talking about the available config options
  - Finding everything they need related to the response
  - Callbacks are not supported, one must use promises
---

The instance of the [response class](https://github.com/adonisjs/http-server/blob/develop/src/Response/index.ts) allows you to respond to the HTTP requests. AdonisJS out of the box supports sending **HTML fragments**, **JSON objects**, **streams** and much more.

You can access the `response` object from the HTTP context instance passed to the route handler, middleware and the exception handler.

```ts
Route.get('/', (ctx) => {
  ctx.response.send('hello world')
})
```

## Sending response
The simplest way to send response is to return a value from the route handler.

```ts
Route.get('/', () => {
  /** Plain string */
  return 'This is the homepage'

  /** Html fragment */
  return '<p> This is the homepage </p>'

  /** JSON response */
  return { page: 'home' }

  /** Converted to ISO string */
  return new Date()
})
```

Along with returning a value, you can also make use of the `response.send` method to send the response. The first argument is the response body (same as the return value). Optionally you can pass a second argument to generate and set the [etag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag).

:::note
You can also enable etag generation for all responses by enabling `http.etag` property inside the `config/app.ts` file.
:::

```ts
response.send({ hello: 'world' })

// With etag
response.send({ hello: 'world' }, true)
```

### Serializing response body
Following is the list of data types serialized by the response class.

- **Arrays** and **Objects** are stringified using the [safe stringify function](https://github.com/poppinss/utils/blob/develop/src/safeStringify.ts). The method is similar to `JSON.stringify` but removes the circular references.
- The **number** and **boolean** values are casted to a string.
- Instance of **Date** is converted to a string by calling the `toISOString` method on it.
- **Regular expressions** and **error** objects are converted to string by calling the `toString` method on them.
- Any other data type results in an exception.

### Content type inference
The response class automatically sets the `content-type` and `content-length` headers based upon the response value. This is how it works

:::note
The automatic **content type** header is only defined when you don't set it explicitly during the request lifecycle.
:::

- Content type is set to `application/json` for arrays and objects.
- It is set to `text/html` for HTML fragements.
- JSONP responses are sent with the `text/javascript` content type.
- For everything else, we set the content type to `text/plain`.

## Lazy Response
Many Node.js frameworks writes the response to the outcoming stream as soon as you call the `response.send` method. AdonisJS **does not** do the same, instead, we wait for the route handler and all the middleware calls to finish before writing the final response to the stream.

This approach ensures that the last call to `response.send` always wins. In most cases, this behavior doesn't impact you or your applications at all. However, it allows you to post process the response inside a middleware.

Following is an example of converting the `camelCase` object keys to `snake_case`.

:::note
The following example is not the best way to transform response. It is just a demonstration of how post processing a response looks like
:::

```ts
// highlight-start
import snakeCaseKeys from 'snakecase-keys'
// highlight-end

Route.get('/', async ({ response }) => {
  response.send({ fullName: 'Harminder Virk' })
}).middleware(async ({ response }, next) => {
  await next()

  // highlight-start
  /**
   * Following code is executed after the route handler.
   * Read the middleware guide to learn how it works
   */
  const existingBody = response.lazyBody[0]
  if (!existingBody || existingBody.constructor !== Object) {
    return
  }

  response.send(snakeCaseKeys(existingBody))
  // highlight-end
})
```

## Response status and headers
Following are the methods to work with the response headers and the response status.

### header
The `response.header` method defines the HTTP response header. Using this method overwrites the existing header (if any).

```ts
response.header('Content-type', 'text/html')
```

### append
The `response.append` method is similar to the `header` method. However, it appends to the existing header value (if any).

```ts
response.append('Set-cookie', 'cookie-value')
```

### removeHeader
The `response.removeHeader` allows removing an existing response header.

```ts
response.removeHeader('Content-type')
```

### getHeader
The `response.getHeader` method returns the value of an existing header.

```ts
const cookie = response.getHeader('Set-cookie')
```

### safeHeader
The `response.safeHeader` method is similar to the `header` method. However, it only defines the header, if its not defined already.

```ts
response.safeHeader('Content-type', 'application/json')
```

### status
The `response.status` defines the status for the HTTP response.

```ts
response.status(401)
```

### safeStatus
Similar to the `status` method, the `response.status` only defines the status, if its not defined already.

```ts
response.safeStatus(401)
```

## Streams & file downloads
AdonisJS has first class support for piping streams and file downloads.  Also, we make sure to properly cleanup streams in case of errors.

### stream
The `response.stream` method allows piping the stream to the response. This method does not set the **content-type** and the **content-length** headers. You must do it yourself.

```ts
const image = fs.createReadStream('./some-file.jpg')
response.stream(image)
```

In case on errors, A 500 response is sent to the client. However, you can send a custom status code and message by define a `callback` as the second parameter.

```ts
response.stream(image, (error) => {
  return ['Unable to send file', 400]
})
```

### download
The `download` method streams the file to the client by manually reading it from the disk. Unlike the stream method, the `download` method does set the **content-type** and the **content-length** headers.

```ts
const filePath = Application.tmpPath('uploads/some-file.jpg')
response.download(filePath)
```

Optionally, you can also define the etag for the file.

```ts
const filePath = Application.tmpPath('uploads/some-file.jpg')
response.download(filePath, true)
```

A custom status code and a message can be defined by passing a `callback` as the third parameter.

```ts
const filePath = Application.tmpPath('uploads/some-file.jpg')

response.download(filePath, true, (error) => {
  if (error.code === 'ENOENT') {
    return ['File does not exists', 404]
  }

  return ['Cannot download file', 400]
})
```

### attachment
The `response.attachment` is similar to the `download` method. However, it allows customizing the downloaded file name and also defines the [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) header.

```ts
const filePath = Application.tmpPath('uploads/some-file.jpg')
response.attachment(filePath)

// define custom name
response.attachment(filePath, 'foo.jpg')

// define custom disposition
response.attachment(filePath, 'foo.jpg', 'inline')
```

## Redirects
The response class exposes a rich API to work with redirects, including the ability to redirect users to a route, redirect back to the previous page and forward the existing query string. 

You can get an instance of the [Redirect class](https://github.com/adonisjs/http-server/blob/develop/src/Redirect/index.ts) using the `response.redirect()` method.

```ts
// Redirect back
response.redirect().back()

// Redirect to a url
response.redirect().toPath('/some/url')
```

### Custom status code
By default, a `302` status code is used. You can override it using the `.status` method.

```ts
response
  .redirect()
  .status(301)
  .toPath('/some/url')
```

### Redirect to a route
You can also redirect the request to a named route using the `.toRoute` method.

```ts
response
  .redirect()
  .toRoute('PostsController.show', { id: 1 })
```

### Define/forward query string
The `.withQs` allows you to forward the existing query string or define custom query string during redirect.

```ts
response
  .redirect()
  .withQs() // 👈 forwardes the existing qs
  .back()

response
  .redirect()
  .withQs({ sort: 'id' }) // 👈 custom
  .back()
```

### withQs with params

Calling the `.withQs` method with custom object multiple times merges the objects together. However, you can combine it with `.clearQs` method to clear the existing objects. For example:

```ts
response
  .redirect()
  .withQs({ sort: 'id' })
  .clearQs()
  .withQs({ filters: { name: 'virk' } })
  .toPath('/users')

// URL: /users?filters[name]=virk
```

### withQs without params
Calling the `withQs` method without any parameters will forward the existing query string to the redirected url. If you redirect the user back to the old page, then the query string from the `referrer` header URL will be used.

```ts
response
  .redirect()
  .withQs()
  .back() // 👈 referrer header qs is used
```

```ts
response
  .redirect()
  .withQs()
  .toPath('/users') // 👈 current URL qs is used
```

## Abort and respond
The response class allows you abort the current HTTP request using the `response.abort` or `response.abortIf` methods.

### abort
The `response.abort` method aborts the current request by raising an [AbortException](https://github.com/adonisjs/http-server/blob/develop/src/Response/index.ts#L44)

The method accepts a total of two arguments. ie, the response body and an optional status.

```ts
if (!auth.user) {
  response.abort('Not authenticated')

  // with custom status
  response.abort('Not authenticated', 401)
}
```

### abortIf
The `response.abortIf` method accepts a condition and aborts the request when the condition is true.

```ts
response.abortIf(!auth.user, 'Not authenticated', 401)
```

### abortUnless
The `response.abortUnless` method is the opposite of the abortIf method.

```ts
response.abortUnless(auth.user, 'Not authenticated', 401)
```

## Other methods and properties
Following is the list of other methods and properties available on the response class.

### finished
Find if the response has been written to the outgoing stream.

```ts
if (!response.finished) {
  response.send()
}
```

### headersSent
An alias for the Node.js [res.headersSent](https://nodejs.org/dist/latest-v15.x/docs/api/http.html#http_response_headerssent) property.

### isPending
The property is the opposite of the `response.finished` property.

```ts
if (response.isPending) {
  response.send()
}
```

### vary
A shortcurt to define the [HTTP vary header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary). Calling the `vary` method multiple times will append to the list of existing header.

```ts
response.vary('Origin')

// Set multiple headers
response.vary('Accept, User-Agent')
```

### location
A shortcut to set the [HTTP location header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location).

```ts
response.location('/dashboard')
```

### type
A shortcut to set the [HTTP content type header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type).

```ts
response.type('application/json')
```

You can also make use of the keywords for defining the content type. For example:

```ts
response.type('json') // defines content-type=application/json
response.type('html') // defines content-type=text/html
```

### Descriptive response methods
The response class has a bunch of descriptive methods (one of each HTTP status) to send the response body and set the status at the same time. For example:

```ts
response.badRequest({ error: 'Invalid login credentials' })
response.forbidden({ error: 'Unauthorized' })
```

[Here's](https://github.com/adonisjs/http-server/blob/ea55c2a65fd388373d0b4e35ae45bee9cb096d02/src/Response/index.ts#L937-L1145
) the list of all the available methods.

## Extending Response class
You can extend the Response class using macros or getters. The best place to extend the response is inside a custom service provider.

Open the pre-existing `providers/AppProvider.ts` file and write the following code inside the `boot` method.

```ts
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true
  constructor(protected app: ApplicationContract) {}

  // highlight-start
  public async boot() {
    const Response = this.app.container.use('Adonis/Core/Response')

    Response.macro('flash', function (messages) {
      this.ctx!.session.flash(messages)
      return this
    })
  }
  // highlight-end
}
```

In the above example, we have added the `flash` method to the response class. It sets the flash messages by internally calling the `session.flash` method.

You can use the newly added method as follows.

```ts
Route.post('users', ({ response }) => {
  response.flash({ success: 'User created' })
})
```

### Informing typescript about the method
The `flash` property is added at the runtime, and hence Typescript does not know about it. To inform the Typescript, we will use [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) and add the property to the `ResponseContract` interface.

Create a new file at path `contracts/response.ts` (the filename is not important) and paste the following contents inside it.

```ts{contracts/response.ts}
declare module '@ioc:Adonis/Core/Response' {
  interface ResponseContract {
    flash(messages: any): this
  }
}
```

## Additional reading
Following are some of the additional guides to learn more about the topics not covered in this document.

- [Cookies](./cookies.md)
- [Session](./session.md)
