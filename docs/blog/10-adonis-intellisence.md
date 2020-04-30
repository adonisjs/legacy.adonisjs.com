---
permalink: blog/adonisjs-3-0-release
title: Adonis + IntelliSense = 💜
group: blog
meta:
  published_on: 2018-09-15
  author: Romain Lanz
---

We read on a daily basis a lot of complaints about Adonis not having any IntelliSense that make it difficult to use for newcomers or even advance user. We are completely aware of this issue and working hard to provide you with a solution.

Before we explain to you how to add IntelliSense to your project, we want to clear your mind about some points.

- JavaScript is a highly dynamic language, that makes **nearly impossible to have an IntelliSense that is 100% accurate**.
- We are rewriting the core of Adonis in TypeScript, but that doesn't mean IntelliSense **will have a better accuracy**.

Now that you are aware of this, let's add IntelliSense to your application!

Here's the pre-requisite to make this work:

- Having the latest dev-release of TypeScript (`3.1.0-dev.20180907` at the time of writing) installed.
- Using VSCode [setup with the latest version of TypeScript](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions).

Since TypeScript 2.3, [we have the possibility to type-check JavaScript file](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html). We are going to use this feature to provide IntelliSense to our project.

To make it works, we can use `JSDoc` syntax.

```js
/** @type {number} */
const x

x. // Number intellisense
```

The latest version of TypeScript let us use a dynamic `import()` statement to declare the type. It means we can import the related file to get IntelliSense working.

```js
/** @type {import('@adonisjs/framework/src/Route/Manager'} */
const Route = use('Route')
```

IMAGE

We can also make it work for the HTTP Context we receive in all controller.

IMAGE

Instead of typing everytime the whole import statement, you can also create a typedef at the beginning of your file.

```js
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

class MyController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */
  index ({ auth, request, view }) {
    // Your code...
  }
}
```

Sometime, you may require to not use an instance but the class itself, like when extending the class. This can be achieved using the `typeof` operator.

```js
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MyModel extends Model {
}
```

IMAGE

Take notes that we are not using a `typedef` in this example. There's currently [an issue in TypeScript](https://github.com/Microsoft/TypeScript/issues/27110) that prevents us from doing so.

The only thing you need to know now is which file you need to import. Here's a list of the most common one.

```js
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */
/** @typedef {import('@adonisjs/framework/src/Env')} Env */
/** @typedef {import('@adonisjs/lucid/src/Factory')} Factory */
/** @typedef {import('@adonisjs/framework/src/Hash')} Hash */
/** @typedef {import('@adonisjs/ignitor/src/Helpers')} Helpers */
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/Route/Manager'} Route */
/** @typedef {import('@adonisjs/lucid/src/Schema')} Schema */
/** @typedef {import('@adonisjs/framework/src/Server')} Server */
/** @typedef {import('@adonisjs/session/src/Session')} Session */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
```

It can happen that IntelliSense is lost when chaining methods. If that the case, please open an issue in the correct repository so we can fix it.
