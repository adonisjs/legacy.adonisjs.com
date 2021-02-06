---
goals:
  - Introduce the session package
  - How it works
  - The storage options
  - Read/writing and deleting session values
  - Flash messages
  - Re-generating the session id
  - Adding a custom driver
  - Talk about session config
  - Readonly session store for views and websockets
  - Get to know the API of working with session
---

The support for sessions is provided by the `@adonisjs/session` package. The package comes pre-configured with the `web` starter template. However, installing and configuring it manually is also very straight forward.

Open the `.adonisrc.json` file and check if `@adonisjs/session` is mentioned inside the list of `providers` array. **IF NOT, then continue with the following steps:**

```sh
npm i @adonisjs/session
```

Run the following `ace` command to configure the project.

```sh
node ace setup @adonisjs/session

# CREATE:  config/session.ts
# UPDATE: .env { "SESSION_DRIVER = cookie" }
# UPDATE: .adonisrc.json { providers += "@adonisjs/session" }
```

Once done, you will be prompted to copy/paste the following line of code inside the `env.ts` file, to validate the `SESSION_DRIVER` environment variable.

```ts{env.ts}
export default Env.rules({
  // ... rest of the variables

  // highlight-start
  SESSION_DRIVER: Env.schema.string(),
  // highlight-end
})
```

## Session configuration

You can configure the sessions behavior by tweaking the `config/session.ts` file. Following is an example config file.

```ts{config/session.ts}
{
  driver: Env.get('SESSION_DRIVER'),
  cookieName: 'adonis-session',
  clearWithBrowser: false,
  age: '2h',
  cookie: {}, // see the cookie driver
  file: {}, // see the file driver
  redisConnection: 'local', // see the redis driver
}
```

- **driver** property defines the driver to use for storing the session data.
- **cookieName** is the name of the cookie that holds the session id. Feel free to change the name to anything you like.
- **clearWithBrowser** property with `true` value creates a temporary cookie. Temporary cookies are removed when you quit the browser.
- **age** property controls the life of the session.

## Session drivers

The session package allows you to choose between one of the available drivers to save the session data.

You can configure the driver inside the `config/session.ts` file. The `driver` property in turn relies on the `SESSION_DRIVER` environment variable.

```ts{config/session.ts}
{
  driver: Env.get('SESSION_DRIVER'),
}
```

### Cookie driver

The cookie driver uses the HTTP cookies for storing the session data. The session data is encrypted inside the cookie, so you don't have to worry about leaking sensitive information.

The cookie driver also works great even when your application is behind a load balancer, since, there is no information stored on the server.

You can tweak the settings for the `cookie` driver inside the `config/session.ts` file.

```ts
{
  /*
  |---------------------------------------------------------------
  | Cookies config
  |---------------------------------------------------------------
  |
  | The cookie settings are used to setup the session id cookie
  | and also the driver will use the same values.
  |
  */
  cookie: {
    path: '/',
    httpOnly: true,
    sameSite: false,
  },
}
```

### File driver

The `file` driver stores the session data on the filesystem itself. You can configure the location of the session files by updating the value of `file.location` property inside the `config/session.ts` file.

:::note
Running an application behind a load balancer with the `file` driver requires you to enable sticky sessions on your load balancer.
:::

```ts
{
  file: {
    location: Application.tmp('sessions'),
  },
}
```

### Redis

The `redis` driver is an ideal choice for keeping the session data on the server only and still run your application behind a load balancer.

:::note
The redis driver relies on the `@adonisjs/redis` package. Make sure to configure it first.
:::

The configuration for the redis driver references one of the pre-defined redis connection inside the `config/redis.ts` file.

```ts{config/session.ts}
{
  driver: 'redis',
  // highlight-start
  redisConnection: 'local',
  // highlight-end
}
```

Next, define a connection named `local` inside the `config/redis.ts` file.

```ts{config/redis.ts}
{
  connections: {
    // highlight-start
    local: {
      host: Env.get('REDIS_HOST'),
      port: Env.get('REDIS_PORT'),
      password: Env.get('REDIS_PASSWORD', ''),
      db: 0,
    }
    // highlight-end
  }
}
```

## Using the session object

The `session` object is available on the HTTP context passed to the route handler, middleware and the global exception handler.

```ts
Route.get('/', async ({ session }) => {
  // Read value from the session
  const cartTotal = session.get('cart_total')

  // With default value
  const cartTotal = session.get('cart_total', 0)
})
```

A read only version of session is also available inside the Edge templates. You can access it using the `session` global helper.

```edge
<p> Cart total: {{ session.get('cart_total', 0) }} </p>
```

Following is the list of available methods to work sessions.

### get

Read the value for a given key from the session store. Optionally, you can define a default value to return when the actual value is `undefined` or `null`.

:::note
The following method is available inside the templates as well
:::

```ts
session.get('cart_total')
session.get('cart_total', 0)
```

### put

Write a key-value pair to the session store. The value should be one of the [cookie supported data types](./cookies.md#supported-data-types).

```ts
session.put('cart_total', 1900)
```

### all

Returns all of the data from the session store. Will always be an object of key-value pair.

:::note
The following method is available inside the templates as well
:::

```ts
console.log(session.all())
```

### forget

Remove value for a given key from the session store.

```ts
// Remove
session.forget('cart_total')

session.get('cart_total') // undefined
```

### increment

Increment the value for a given key. Make sure the original value is always a number. Calling `increment` on a non-numeric value will result in an exception.

```ts
session.increment('page_views')
```

### decrement

Decrement the value for a given key. Make sure the original value is always a number. Calling `decrement` on a non-numeric value will result in an exception.

```ts
session.decrement('score')
```

### clear

Clear the session store to an empty state.

```ts
session.clear()
```

## Session id lifecycle

AdonisJS creates an empty session store and assign it to a unique session id on the first HTTP request, even if the request/response lifecycle doesn't interact with sessions.

Every subsequent request will update the `maxAge` property of the session id cookie to ensure that the cookie doesn't expire. Also, the session driver is notified about the changes (if any) to update and persist the changes.

### sessionId

You can access the value of the session id using the `sessionId` property.

```ts
console.log(session.sessionId)
```

### initiated

Find if the session store has been initiated or not. During an HTTP request, this will always be `true`.

```ts
if (!session.initiated) {
  await session.initiate(false)
}
```

### fresh

Find if the session id has been generated during the current HTTP request. The value is **true** when the session id has been generated for the first time or `session.regenerate` method is called.

```ts
if (!session.fresh) {
  session.regenerate()
}
```

### regenerate

Re-generate the session id and attach existing session data to it. The auth package uses this method to prevent [session hijacking attacks](https://www.netsparker.com/blog/web-security/session-hijacking/).

```ts
session.regenerate()
```

## Session flash messages

Since HTTP is a stateless protocol, there is no native way of passing data between different HTTP requests. However, we do have cookies and sessions which are persisted across requests and can be used for passing messages as well.

### Why use flash messages?

Consider the following flow to perform the user login using standard HTML forms.

- The login form is available on the `GET /login` route.
- The form submission request is sent to `POST /login` route.
- In case of validation errors, we redirect the user back to the form.
- In case of successful login, we redirect the user to the `GET /dashboard` route.

In case of both the error and the success, the request gets redirected to a different URL and hence we need some way to also send a temporary message to that new page. **This is where flash messages comes into the picture**.

### Using flash messages

Flash messages are stored inside the session store and only available for the next HTTP request. You can use them for passing messages between HTTP requests. For example:

```ts
Route.get('/', async ({ session, response }) => {
  // highlight-start
  session.flash('message', 'Hello world')
  // highlight-end
  response.redirect('/see-message')
})

Route.get('/see-message', async ({ session }) => {
  // highlight-start
  return session.flashMessages.get('message')
  // highlight-end
})
```

::video{url="https://res.cloudinary.com/adonis-js/video/upload/v1612414110/v5/flash-message.mp4" controls="true"}

### flash
The `session.flash` method adds a key-value pair to the flash messages. 

```ts
session.flash('errors', {
  title: 'Post title is required',
  description: 'Post description is required'
})
```

You can also pass the object directly to the `flash` method.

```ts
session.flash({
  errors: {
    title: 'Post title is required',
    description: 'Post description is required'
  }
})
```

### flashAll
The `flashAll` method adds the request body to the flash messages. This allows you to get the form data inside your templates and pre-fill the user input after validation failure redirect.

```ts
session.flashAll()
```

### flashOnly
The `session.flashOnly` method is similar to the `flashAll` method. But instead, it allows cherry pick the fields.

```ts
session.flashOnly(['title', 'description'])
```

### flashExcept
The `session.flashExcept` method is the opposite of the `flashOnly` method and allows ignoring the fields.

```ts
session.flashExcept(['_csrf', 'submit'])
```

### Accessing flash messages
You can access the flash messages set by the previous request using the `session.flashMessages` property or the `flashMessages` helper inside the edge templates.

```edge{Inside templates}
{{-- Get value for a given key --}}
{{ flashMessages.get('errors.title') }}

{{-- With optional default value --}}
{{ flashMessages.get('title', '') }}

{{-- Find if a key exists --}}
{{ flashMessages.has('errors.title') }}

{{-- Get all --}}
{{ flashMessages.all() }}

{{-- Find if store is empty --}}
{{ flashMessages.isEmpty }}
```

```ts
Route.get('/', async ({ session }) => {
  // Get value for a given key
  response.flashMessages.get('errors.title')

  // With optional default value
  response.flashMessages.get('title', '')

  // Find if a key exists
  response.flashMessages.has('errors.title')

  // Get all
  response.flashMessages.all()

  // Find if store is empty
  response.flashMessages.isEmpty
})
```

## Other methods/properties
Following is the list of other available methods and properties on the Session class.

### initiate
The `session.initiate` method initiates the session store for the current HTTP request. Optionally, the store can be initiated inside the `readonly` mode.

:::note
This method is [called](https://github.com/adonisjs/session/blob/6fcea7bb144de18028b1ea693bc7e837cd799fdf/providers/SessionProvider.ts#L52-L54) by AdonisJS automatically and hence you won't have to call it manually yourself.
:::

```ts
await session.initiate(false)

// Readonly store
await session.initiate(true)
```

### fresh

Find if the session id has been generated during the current HTTP request. The value is **true** when the session id has been generated for the first time or `session.regenerate` method is called.

```ts
if (!session.fresh) {
  session.regenerate()
}
```

### readonly
Find if the store has been initiated in `readonly` mode or not.

:::note
During HTTP requests, the store is **NEVER** in readonly mode. This flag is reserved for future to have readonly session in Websockets connections.
:::

```ts
if (!session.readonly) {
  session.put('key', 'value')
}
```

### commit
The `commit` method persits the changes with the session driver and update the `maxAge` of the session id cookie. Again the method is [called](https://github.com/adonisjs/session/blob/6fcea7bb144de18028b1ea693bc7e837cd799fdf/providers/SessionProvider.ts#L59-L61) automatically by AdonisJS and you don't have to worry about calling it.

```ts
await session.commit()
```

## Creating a custom session driver
The session package exposes the API to add your own custom session drivers. Every session driver must adhere to the [SessionDriverContract](https://github.com/adonisjs/session/blob/6fcea7bb144de18028b1ea693bc7e837cd799fdf/adonis-typings/session.ts#L58-L63).

```ts
interface SessionDriverContract {
  read(
    sessionId: string
  ): Promise<{ [key: string]: any } | null> | { [key: string]: any } | null
  
  write(
    sessionId: string,
    values: { [key: string]: any }
  ): Promise<void> | void
  
  destroy(sessionId: string): Promise<void> | void
  
  touch(sessionId: string): Promise<void> | void
}
```

- The `read` method receives the `sessionId` and must return the session data or `null`. The return value should be an object, similar to what was passed to the `write` method.

- The `write` method receives the `sessionId` and the `values` object to store. You are free to transform the values object to any other data type you want. For example: The `redis` driver [converts](https://github.com/adonisjs/session/blob/6fcea7bb144de18028b1ea693bc7e837cd799fdf/src/Drivers/Redis.ts#L55) the object to a string using the [message builder](https://github.com/poppinss/utils#message-builder).

- The `destroy` method should remove the session id and its associated data from the storage.

- The `touch` method job is to reset the expiry. This method is only relevant for drivers with in-built expiry. For example: The redis driver updates the `ttl` property of the redis key.

### Extending from outside in
Anytime you are extending the core of the framework. It is better to assume that you do not have access to the application code and dependencies. In other words, write your extensions, as if you are writing a third party package and use dependency injection to rely on other dependencies.

For demonstration purposes, lets create a session driver to store the session in-memory and begin by creating some files & folders.

```sh
mkdir providers/SessionDriver
touch providers/SessionDriver/index.ts
```

The directory structure will look as follows

```
providers
└── SessionDriver
    └── index.ts
```

Open the `SessionDriver/index.ts` file and paste the following contents inside it.

```ts{providers/SessionDriver/index.ts}
import { SessionDriverContract } from '@ioc:Adonis/Addons/Session'

const SESSIONS: Map<string, { [key: string]: any }> = new Map()

export class MemoryDriver implements SessionDriverContract {
  public async read(sessionId: string) {
    return SESSIONS.get(sessionId) || null
  }

  public async write(sessionId: string, values: { [key: string]: any }) {
    SESSIONS.set(sessionId, values)
  }

  public async destroy(sessionId: string) {
    SESSIONS.delete(sessionId)
  }

  public async touch() {}
}
```

Finally, open the `providers/AppProvider.ts` file and add the custom driver inside the `boot` method.

```ts
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const { MemoryDriver } = await import('./SessionDriver')
    const Session = this.app.container.use('Adonis/Addons/Session')

    Session.extend('memory', () => {
      return new MemoryDriver()
    })
  }
}
```

Voila! The `memory` driver is ready now. Just update the `SESSION_DRIVER` property inside the `.env` file and you are good to go.

### Driver lifecycle
A new instance of driver is created for every HTTP request. You can access the HTTP context from the `Session.extend` method callback arguments. For example:

```ts
Session.get('memory', (app, config, ctx) => {
   // incase your driver needs the context
  return new Driver(ctx)
})
```

### Injecting dependencies
As mentioned earlier, the extensions should not rely on the application dependencies directly and instead leverage the dependency injection. For example, your driver needs access to the Encryption module.

:::error{title="Bad practice"}
The following example has a top level import statement for using the Encryption module. However, the Encryption module is not even available before the AdonisJS server is ready.

```ts
import Encryption from '@ioc:Adonis/Core/Encryption'

export class MemoryDriver {
  public async write(sessionId: string, values: { [key: string]: any }) {
    Encryption.encrypt(JSON.stringify(values))
  }
}
```
:::

:::success{title="Use DI instead"}
Here, we are relying on the dependency injection to provide us the encryption module.

```ts
/**
 * The following is type-only import and gets removed
 * once Typescript is compiled to JavaScript.
 *
 * So ideally, you are not relying on any top level
 * imports, just using the interface for type hinting.
 */
import type { EncryptionContract } from '@ioc:Adonis/Core/Encryption'

export class MemoryDriver {
  constructor(private encryption: EncryptionContract) {
  }

  public async write(sessionId: string, values: { [key: string]: any }) {
    this.encryption.encrypt(JSON.stringify(values))
  }
}
```

Finally, you can inject the encryption module during the `Session.extend` call.

```ts
Session.extend('memory', (app) => {
  return new MemoryDriver(app.container.use('Adonis/Core/Encryption'))
})
```
:::

### Driver config
The configuration for the driver must also be injected through the constructor. The `session.extend` method gives you the config saved inside the `config/session.ts` file.

The configuration for the driver is stored inside a property matching the driver name. For example:

```ts{config/session.ts}
{
  // The following object is for the memory driver
  memory: {}
}
```

```ts
Session.extend('memory', (app, config) => {
  /**
   * The config is the value of the "memory" property
   */
  return new MemoryDriver(config)
})
```
