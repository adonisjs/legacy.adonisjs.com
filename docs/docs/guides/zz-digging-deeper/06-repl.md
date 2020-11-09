---
permalink: guides/repl
group: Digging Deeper
---

# AdonisJS REPL

REPL stands for **read–eval–print loop** , a way to quickly execute single-line inputs and return the result. Node.js also has its REPL and to give it try, you can open up your terminal, type node, and press enter.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1603467681/adonisjs.com/node-repl_s6hsuz.mp4", controls]

Similar to Node.js, AdonisJS has its own application aware REPL that gets started after booting the app and therefore you have access to everything inside the REPL.

## Features

Following features over the standard Node.js REPL are supported.

- Ability to use the `await` keyword anywhere inside the REPL session. Also known as **top level await**.
- Support for typescript imports.
- Transparently compiles the typescript source to Javascript.

## Usage

Run the following ace command to start the REPL session.

```sh
node ace repl
```

Lets import the Encryptioon module and try encrypting/decrypting a string value.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1604936668/adonisjs.com/adonis-repl_ibios2.mp4", controls]

## Helper methods

We have observed that writing the `import` statements in the REPL requires a bit of typing and therefore we have added a bunch of shortcut methods for importing some of the commonly required modules.

Let's test the encryption module again, but this time we will use the shortcut method to import the module.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1604937463/adonisjs.com/adonis-repl-shortcuts_jcyxay.mp4", controls]

You can view all of the helper methods by typing the `.ls` command.

![](https://res.cloudinary.com/adonis-js/image/upload/v1604938942/adonisjs.com/Screenshot_2020-11-09_at_9.50.06_PM_hekkxu.png)

Just like everything else, the REPL also has an extensible API and as you will install new packages you will see the list of helper methods growing.

For example: The Lucid ORM comes with the `loadModels` helper to recursively load models from the `app/Models` directory.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1604939564/adonisjs.com/repl-load-models_ye0rdy.mp4", controls]

## Adding custom helpers

You can add your own custom helpers by creating a preload file inside the `start` directory. Begin by creating a new file by running the following command.

[note]
Make sure to select environment as `repl` by pressing the `<SPACE>` key and hit enter.
[/note]

```sh
node ace make:prldfile repl
```

Next, open the newly created file and paste the following contents inside it.

```ts{}{start/repl.ts}
import Repl from '@ioc:Adonis/Addons/Repl'

Repl.addMethod(
  'sayHi',
  (repl) => {
    console.log(repl.colors.green('hi'))
  },
  { description: 'A test method that prints "hi"' }
)
```

Finally, start the repl session and type `sayHi()` to execute the method. Currently we are writing to the console, however you can perform any action inside this function.
