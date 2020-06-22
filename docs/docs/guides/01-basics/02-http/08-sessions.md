---
permalink: guides/http/sessions
category: Handling HTTP Requests
group: Basics
---

# Sessions
Just like any other Web framework, AdonisJS also has first class support for working with sessions and cookies.

By the end of this guide, you will know:

1. How to store and read data from user session.
2. How to configure and use different session storage engines.
3. The concept of flash messages and how to use them.

## Available drivers
The session module of AdonisJS ships with the following storage drivers.

[note]
You can change the active driver and its settings inside `config/session.ts` file.
[/note]

- **Cookies (default)** are great when you are not storing multi megabytes of data. Cookies are encrypted by default and hence there is no concern of data security.
- **File System** can be used to keep the sessions data on the server side. However, horizontally scaling and sharing sessions is impossible. Also there can be data loss, when code is running inside containers, like Docker.
- **Redis** is the best of both. You can store large chunks of data and also share it across multiple servers. 

You can configure the session storage by choosing between one of the available session drivers. They are:

- `cookie`
- `file`
- `redis`

## Setup
The sessions package of AdonisJS is pre-configured for Web application boilerplate created using `npx` or `yarn create`. Open `.adonisrc.json` file and check if `@adonisjs/session` is registered under the providers array or not.

```json{4}
{
  "providers": [
    "@adonisjs/core",
    "@adonisjs/session"
  ]
}
```

### Install the Package
Install the `@adonisjs/session` package from npm registry using the following command.

[codegroup]

```sh{}{npm}
npm i @adonisjs/session@alpha
```

```sh{}{yarn}
yarn add @adonisjs/session@alpha
```

[/codegroup]

### Invoke Generator
AdonisJS packages can configure themselves by running the post install instructions. Run the following command to setup `@adonisjs/session` package.

```sh
node ace invoke @adonisjs/session

# ✔  create    config/session.ts
#    update    .env
#    update    .adonisrc.json
# ✔  create    ace-manifest.json
```

## Using sessions
As soon as the package is configured, you can access the `session` object on the [HTTP context](introduction#http-context). For demonstration, lets create a dummy app to store the user language preference inside the session.

1. Register the route to render the `welcome` view and pass the user language by reading it from the session.
  ```ts{3}{}
  Route.get('/', async ({ session, view }) => {
    return view.render('welcome', {
      userLanguage: session.get('userLanguage'),
    })
  })
  ```
2. Setup the view to show the current language, along with the links to change the current language.
  ```edge
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> AdonisJS </title>
  </head>
  <body>
      <p> Your current language is {{ userLanguage || 'not set' }} </p>
      <hr />

      <ul>
        <li><a href="language/en"> Change to English </a></li>
        <li><a href="language/fr"> Change to French </a></li>
        <li><a href="language/it"> Change to Italian </a></li>
      </ul>
  </body>
  </html>
  ```

3. Finally setup the route to update the user language inside the session store and redirect them back.
  ```ts{2}
  Route.get('/language/:name', async ({ session, params, response }) => {
    session.put('userLanguage', params.name)
    response.redirect('back')
  })
  ```

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1582442759/adonisjs.com/session-language-change.gif)

## Flash Messages
The session flash messages are cleared with each request. This means, you can use them for passing data between two requests for things like displaying **error and success messages**.

```ts{5,8-10}
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {
  public async store ({ session }: HttpContextContract) {
    session.flash('success', 'Post has been created')

    // or pass an object
    session.flash({
      success: 'Post has been created',
    })
  }
}
```

A standard practice is to redirect the request after you have set the flash messages. After the redirect, the new request can access the previously set flash messages inside the controllers or the views templates.

### Access Flash Messages inside Controllers 

```ts{2-4}
public async create ({ view, session }: HttpContextContract) {
  console.log(session.flashMessages.all())
  console.log(session.flashMessages.get('errors'))
  console.log(session.flashMessages.has('success'))

  return view.render('posts/create')
}
```

### Access Flash Messages inside Templates

```edge
{{ inspect(flashMessages.all()) }}
{{ flashMessages.get('errors.title') }}
```

## What's Next?
This guide covers the basic usage of sessions and flash messages. It recommended to read the following resources as well.

- [Session API Docs]()
- [Sessions Security]()
- [Adding custom session drivers]()
