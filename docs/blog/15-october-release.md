---
permalink: blog/october-2020-release
title: October Release (2020)
group: blog
meta:
  number: 15
  published_on: 2020-10-25
  author: Harminder Virk
---

Alright! Here we go with another release of AdonisJS. This is a big one in terms of the development workflow you will be using moving forward.

## Highlights

- Add support for [in-memory compilation](#in-memory-typescript-compilation) of Typescript. In other words, the compiled Javascript is not written to the disk anymore.
- Introduce [@adonisjs/repl](#introducing-adonisjs-repl) to quickly test out your application code.
- Add support for [validating Environment variables](#validating-environment-variables).
- Add support for conditional query constraints using the `if`, `unless`, and the `match` helpers.

## Steps to upgrade

Before we dive into the specifics and the motivation behind the changes. Let's quickly talk about the steps you will have to take to upgrade your application.

1. We have recently encapsulated a lot of eco-system dependencies within the [@adonisjs/core](https://github.com/adonisjs/core) package and hence those dependencies can be removed from your project.

   Run the following command to remove `@adonisjs/fold` and `@adonisjs/ace`.

   ```sh
   npm uninstall @adonisjs/fold @adonisjs/ace
   ```

2. Next, upgrade all dependencies to their latest alpha version. Do remember to install with the `@alpha` tag.
3. Now since your application is not using `@adonisjs/ace` as a direct dependency, you must update your local commands inside the `commands` directory to use `@adonisjs/core` for importing the `BaseCommand`.

   ```diff
   - import { BaseCommand } from '@adonisjs/ace'
   + import { BaseCommand } from '@adonisjs/core/build/standalone'
   ```

4. The commands `handle` method has been deprecated in favor of the the `run` method. It feels natural to say **run the command** vs saying **handle the command**.

5. The process started by the command will close itself after the `run` method has finished executing. If you want your commands to stay alive, then you need to use the `stayAlive` flag on the settings object.

   ```ts
   class MyCommand extends BaseCommand {
     public static settings = {
       stayAlive: true,
     }
   }
   ```

6. Also update the `./commands/index.ts` file to use the following code snippet.

   ```ts
   import { listDirectoryFiles } from '@adonisjs/core/build/standalone'
   import Application from '@ioc:Adonis/Core/Application'

   export default listDirectoryFiles(__dirname, Application.appRoot, ['./commands/index'])
   ```

7. If you are using the `@adonisjs/auth` package. You need to update the `config/auth.ts` file to lazy import the models used for finding the users.

   So begin by removing the top level import statement

   ```ts{}{config/auth.ts}
   import User from 'App/Models/User'
   ```

   And move it inline next to the model property as follows:

   ```ts{3}
   provider: {
   driver: 'lucid',
   model: () => import('App/Models/User')
   }
   ```

8. Finally, we have deprecated the `Env.getOrFail` method in favor of the Env validations. You just need to find its usages and replace it with `Env.get` to avoid getting deprecation warnings.

9. Using Japa as your test runner? [Here are the instructions](#using-japa) to upgrade the test runner to run tests using the Typescript source directly.

## In-memory Typescript compilation

I am not a big fan of build tools or adding an additional step to prepare my code for getting executed. However, when using Typescript there is no way to escape the process of compiling Typescript to JavaScript since v8 is meant to run Javascript only.

Initially, we did add a build step in which we compile Typescript to JavaScript before starting the development server.

In the following screenshot, the first five steps involve compiling the code to Javascript and copying some files to the `build` folder to start the HTTP server.

![](https://res.cloudinary.com/adonis-js/image/upload/v1603450209/adonisjs.com/serve.png)

Even though the process seems logical, it has a lot of rough edges that will bite you once in a while. Many users created GitHub discussion threads lately expressing:

- I have updated my migrations code and it is not picked up by the `node ace migration:run` command
- I am getting the error `node ace make:migration` is not a command
- and so on

All this confusion is a result of a stale `build` folder and you have to make sure that one process is always running to keep the build output up to date.

### Let's do something better

I have been banging my head lately to find some alternative which feels more natural and intuitive over this additional build step, and voila there is [ts-node](https://github.com/TypeStrong/ts-node).

Ts-Node is a library to run typescript code directly without transpiling it first. But, I decided to **not use it** and instead [write my version of it](https://github.com/adonisjs/require-ts) for the following reasons.

- I wanted to avoid Type checking completely. No one looks at the terminal for checking the typescript errors. We all rely on our editors to report the errors and hence there is no need to slow down the compilation process.
- Use aggressive caching to make subsequent runs faster. TS node doesn't support caching as of today. There are some open issues to add it, but since they do a lot more than `@adonisjs/require-ts` they have to handle all other use cases as well.
- Creating API for the watchers to invalidate the cache for the changed/updated files.

### How in-memory compilation works?

Now that you are aware of the reasons for not using the ts-node, let's expand upon how in-memory compilation works and also the entire cache mechanism built to make subsequent runs faster.

- Node.js has a thing called [require extensions](https://gist.github.com/jamestalmage/df922691475cff66c7e6). Using this you can tell Node to call a function anytime a file with the given extension is required. Babel, ts-node, and many other libraries use this to hook into the `require` lifecycle of Node.js
- Typescript compiler API has a [transpileModule](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#a-simple-transform-function) method. You can pass the typescript source code as a string to this method and it will return you the compiled Javascript.

So, if you combine the above two you can compile the typescript code on the fly. However, typescript does take some time to compile the code and this can make restarts slow. Let's visualize a standard development workflow.

- You run the `node ace serve --watch` command.
- AdonisJS hooks into the require lifecycle and take control of compiling the `typescript` files.
- As your application is getting ready all the source code imported using the `import` statement is getting compiled on the fly.
- Next, you make some modifications to a given file.
- The file watcher is notified and it restarts the HTTP server and hence all the previously compiled code is destroyed since it was in memory.
- You have changed just one file and now everything needs to be re-compiled again. BUMMER!

### Using cache

On-disk caching is the only solution to avoid re-compiling the entire project after a single file change. The following are the steps we perform for caching.

- Begin by generating the md5 hash of the file contents and use the hash as the filename to save the compiled contents on the disk.
- Next time, if the hash is still the same we read the compiled source from the disk instead of using the typescript compiler API. To our surprise, generating the hash + reading file from the disk is faster than re-compiling the code in many cases.
- If the hash is different we just ignore the cache and use the typescript compiler API.

The term **ignore the cache** is important here. Since we don't remove the old cache there is going to be a time when the cache will end taking a lot of disk space.

To counter that, we [expose an API](https://github.com/adonisjs/require-ts/blob/develop/index.ts#L43) from the `@adonisjs/require-ts` module that the file watchers can use to clear the entire cache or remove a single file from it.

### Result

Finally, we end up with a development workflow that can run Typescript source code directly and uses cache for faster restarts.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1603462870/adonisjs.com/quick-restart_cgjdfa.mp4", controls]

## Validating environment variables

Environment variables play a very important role in our applications. Moreover, environment variables are not in control of our source code and we heavily rely on the outside factors to provide the correct values. For example:

- Using a plain text file `.env` during development.
- Using the control panel of cloud services like Heroku and Cleavr.
- Even during the CI/CD process, the environment variables are injected using the control panel.

We believe that validating the environment variable early in the lifecycle of running the application is a better approach instead of running an unstable system with in-correct or missing values.

To get started, create an `env.ts` file in the root of your application and paste the following code snippet inside it.

```ts{}{env.ts}
import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
})
```

With the above file in place, AdonisJS will automatically load this file to perform the validations.

### Getting intellisense

Since we are already performing the runtime validations, wouldn't it be great if we can also get IntelliSense for the validated environment variables? **Well, we can**:

Begin by creating a new file `contracts/env.ts` and paste the following code snippet inside it.

```ts{}{contracts/env.ts}
declare module '@ioc:Adonis/Core/Env' {
  type CustomTypes = typeof import('../env').default
  interface EnvTypes extends CustomTypes {}
}
```

Now, you will get proper IntelliSense when using the `Env` module.

![](https://res.cloudinary.com/adonis-js/image/upload/v1603465509/adonisjs.com/env-types.png)

- The `Env.rules` method extracts the types from the defined keys and the validation rules.
- Inside the `contracts/env.ts`, we make use of the [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) and extend the `EnvTypes` interface to use the types exported in the `env.ts` file.

## Introducing AdonisJS REPL

REPL stands **read–eval–print loop**, a way to quickly execute single-line inputs and return the result. Node.js also has its REPL and to give it try, you can open up your terminal, type `node`, and press enter.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1603467681/adonisjs.com/node-repl_s6hsuz.mp4", controls]

Similar to the Node.js REPL, AdonisJS now also has its REPL with first-class primitives to let you interact with your application. To begin, install the [@adonisjs/repl](https://github.com/adonisjs/repl) package from the registry.

[codegroup]

```sh{}{npm}
npm i @adonisjs/repl
```

```sh{}{yarn}
yarn add @adonisjs/repl
```

[/codegroup]

Next, run the following command to set up the package.

```sh
node ace invoke @adonisjs/repl
```

That's all! Now you can run the `node ace repl` command to start the REPL session.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1603469977/adonisjs.com/adonis-repl_yiqo3z.mp4", controls]

## Using Japa?

Projects setup to use [Japa test runner](/blog/running-tests-in-adonisjs-v5) also have to update the `japaFile.ts` file.

- Update the files glob to remove the `build` prefix and use `.ts` as the file extension.

  ```ts{}{japaFile.ts}
  configure({
    files: ['test/**/*.spec.ts'],
    // ...
  })
  ```

- Update the path of `ADONIS_ACE_CWD` to use the following value.

  ```ts
  process.env.ADONIS_ACE_CWD = join(__dirname)
  ```

- Finally, update the script responsible for executing tests to run the `japaFile.ts` file directly as follows:

  ```sh
  node -r @adonisjs/assembler/build/register japaFile.ts
  ```

## Release notes

Checkout the following links to learn more about what's included in the release.

- [Preview release rc-2](/releases/core/preview-rc-2)
- [Lucid 8.5 - 9.0](/releases/lucid/version-9)
- [Auth 5.0](/releases/auth/version-5)
- [Shield 4.0](/releases/shield/version-4)
