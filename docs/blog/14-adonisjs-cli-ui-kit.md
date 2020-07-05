---
permalink: blog/adonisjs-cli-ui-kit
title: Sharing AdonisJS CLI UI Kit
group: blog
meta:
  number: 14
  published_on: 2020-07-02
  author: Harminder Virk
---

Over the past few days, I worked on the CLI UI Kit for all AdonisJS command line. 

Aside from sharing AdonisJS tips, I thought it will be fun to also share the work, we are doing behind the scenes and maybe you can learn one or two things from it.

![](https://res.cloudinary.com/adonis-js/image/upload/v1593614024/adonisjs.com/adonis-cli-ui-kit_oyxf4a.png)

## Why AdonisJS needs CLI UI Kit?

As a backend framework, majority of your interactions with AdonisJS is via command line. Be it a **command to create a new project**, or a **command to setup a package**.

Even though, the usage of command line is pretty high, we as developers do not look at the UI of terminal from the same lens as we look at the Webpages or Admin dashboards.

One of the reasons is the simplicity of command line. Unlike web, there is not much scope to customize the layouts or adjust spacing for different components.

However, still there are many areas in which, we can improve the experience of a command line tool.

## Consistency
Since, there was no UI KIT in place, every command  ended up adding its own flavor to the output. Whatever, that felt beautiful at the time of writing the command was adopted. For example: 

In the following screenshot, the fourth message has a tick symbol and an underline on the `create` label, whereas the first three have identical styling.

![](https://res.cloudinary.com/adonis-js/image/upload/v1593608084/adonisjs.com/ui-inconsistent_fo3e5d.png)


## Configuration free

## Getting rid of too many color libraries

We use [kleur](https://www.npmjs.com/package/kleur) as our main library to add colors to the log messages. But then, we also use:

- `boxen` and `ora`, which relies on [chalk](https://www.npmjs.com/package/chalk)
- And `cli-table3`, which relies on [colors](https://www.npmjs.com/package/colors)

**Finally, we ended up using three different color libraries**. Having multiple color libraries does impact the peformance. However, the main drawback is that these libraries uses different mechanisms for enabling/disabling colors. For example:

Kleur does not perform color detection and you relies on you to manually enable/disable colors. On the other hand, chalk has in-built color detection and you can force it to always output colors using the `FORCE_COLOR` environment variable.

## Ability to test logs output

The color libraries and `console.log` statements are not testing friendly. For example:

```ts
function info (message) {
  return kleur.cyan(message)
}

// FAILS
assert.equal(info('hello'), 'hello') 
```
