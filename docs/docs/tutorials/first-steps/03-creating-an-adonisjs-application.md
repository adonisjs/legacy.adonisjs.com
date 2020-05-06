---
permalink: tutorials/first-steps/03-creating-an-adonisjs-application
category: First Steps
author: Chimezie Enyinnaya
---

# Creating an AdonisJS application

To get started, let’s create a new AdonisJS application. For that we will be making use of `npx`:

```bash
npx create-adonis-ts-app tasks
```

When prompted to select the project structure, we’ll choose `Web Application` then leave the default project name and lastly we’ll type `y` to set up ESLint.

[https://res.cloudinary.com/adonis-js/image/upload/v1583319675/adonisjs.com/Screen_Shot_2020-02-19_at_10.48.47_AM_xbomdw.png](https://res.cloudinary.com/adonis-js/image/upload/v1583319675/adonisjs.com/Screen_Shot_2020-02-19_at_10.48.47_AM_xbomdw.png)

This will create a new AdonisJS application called `tasks` and install the necessary dependencies. Once that’s done, we can start the application to make sure everything is working as expected:

```bash
cd tasks
node ace serve --watch
```

First, we move into the directory of our AdonisJS application. Then we run the `serve` command, which will copy the necessary files as well as compile the TypeScript code into a `build`  directory then start the application. The `--watch` flag will watch our application files for changes and automatically re-compile the TypeScript code and restart the application.

[https://res.cloudinary.com/adonis-js/image/upload/v1583319701/adonisjs.com/Screen_Shot_2020-02-19_at_10.55.03_AM_zvms00.png](https://res.cloudinary.com/adonis-js/image/upload/v1583319701/adonisjs.com/Screen_Shot_2020-02-19_at_10.55.03_AM_zvms00.png)

Now, we should be able to access our application on [http://0.0.0.0:3333](http://0.0.0.0:3333). Upon visit of the URL, we should see AdonisJS default landing page as below:

[https://res.cloudinary.com/adonis-js/image/upload/v1583319596/adonisjs.com/screenshot-127.0.0.1_3333-2020.03.04-11_43_35_zkqmtk.png](https://res.cloudinary.com/adonis-js/image/upload/v1583319596/adonisjs.com/screenshot-127.0.0.1_3333-2020.03.04-11_43_35_zkqmtk.png)

We are going to leave the server running and open a new tab/terminal where we’ll run subsequent commands.

## Understanding how the default AdonisJS application works

Before we start building our application, let’s try to understand how our newly created AdonisJS application works. The entry point of an AdonisJS application are routes, which are defined inside `start/routes.ts`:

```ts
// start/routes.ts

Route.on('/').render('welcome')
```

Upon visit of our application homepage, which is represented by the `/` route, a view file called `welcome` is rendered, which is AdonisJS default landing.
