---
permalink: blog/adonis-4-0-dev-release
title: Adonis 4.0 Dev Release
group: blog
meta:
  number: 5
  published_on: 2017-08-25
  author: Harminder Virk
---

Adonis4.0 has been much-awaited release for AdonisJs so far. The framework is full of new and fresh ideas to make you even more productive.

The documentation for dev release is available at [dev.adonisjs.com](http://dev.adonisjs.com/). The API is 100% final, so feel free to start new or upgrade your existing apps.

## NPM organization and scope packages

Since [npm orgs](https://www.npmjs.com/docs/orgs/) are now available to open source projects for free, it is the right time to move all packages to an organization and scope them with `@adonisjs` prefix. This way it is easier to spot the official packages from the community ones.

## Speed improvements

Adonis4.0 is almost **4 times faster** than the earlier versions of AdonisJs. Here are the [benchmarks](https://github.com/thetutlage/adonis4-benchmarks).

This has been possible due to the usage of `async/await` which is inherently faster than `generators`.

Also, the code for HTTP request/response lifecycle has been simplified too.

## ES6 features

Javascript is going through an exciting phase with ECMAScript updates, also Node.js has implemented 99% of the [language features](http://node.green/).

So this is the right time to upgrade the code base and build API around exciting new features.

AdonisJs 4.0 makes extensive use of `async/await` and [ES6 Object destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring). Writing code using new language features feels a breath of fresh air.

## Start lean and grow big

A common misconception majority of users had, that AdonisJs is meant to write only **full stack applications**.

New [slim](https://github.com/adonisjs/adonis-slim-app) and [API only](https://github.com/adonisjs/adonis-api-app) application boilerplates will give you enough space to stay lean, but still, enjoy AdonisJs rich eco-system at the same time.

## Install command

tarting lean is great but it’s **frustrating** when you have to spend time configuring everything manually from creating config files to verifying that everything works great.

Adonis CLI now ships with a `install` command, that installs the module from npm, but at the same time creates the **config files**, **required models**, **migrations** etc.

GIF

## Forum

AdonisJs has been a small community ( we still are ). I decided to stick to few communication channels and choose [Gitter](https://gitter.im/adonisjs/adonis-framework) as a medium to interact.

Over the past few months, Gitter timeline is growing rapidly that staying offline for few hours results in hundreds of unread messages and of course majority of them goes unanswered.

Finally, the time is to create a [forum](https://forum.adonisjs.com/) and have persisting conversations around specific topics. Feel free to create threads in appropriate categories.

## What’s next?

After the final release I will spending time on:

- Writing more documentation.
- Generating learning material for beginners and advanced users.
- Improving AdonisJs tooling for code editors like Sublime, Atom and VsCodeetc. If you are interested in writing extensions for any of these editors, please feel free to have a quick chat with me.
