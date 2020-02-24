---
permalink: guides/quick-start
group: Basics
---

# Quick Start

The quick start is intended for users familiar with Node.js and AdonisJS. If you are new to the framework, we recommend reading the [getting started tutorial](tutorials/getting-started/introduction) first.

[video url="blob:https://egghead.io/b2292c57-a44b-4a35-85f3-90fa32fa5162"]

## Creating a New Project
AdonisJS requires `Node.js >= 12.0.0`, along with `npm >= 6.0.0`. You can also use yarn, but do note, that AdonisJS is not tested against the pnp feature of yarn 2 yet.

Run the following command to create a new project.

[codegroup]
```sh{}{npx}
npx create-adonis-ts-app blog
```

```sh{}{yarn}
yarn create adonis-ts-app blog
```
[/codegroup]

1. The `npx` command will setup a new project structure and installs all required dependencies.
2. If you are creating an API server, then do choose `Api project` in the boilerplate prompt.
3. `cd` into the newly created directory.
4. And run `node ace serve --watch` to start the development server.

## Available Project Structures
When creating a new project, you can choose between

1. An API server
2. Or, a Web application

A web application project structure is packed with all the required components to create a fully fledged server render application. Along with the framework core, it comes with

- The AdonisJS template engine `@adonisjs/view`
- The sessions module `@adonisjs/session`
- Support for static assets is enabled.
- The web security & CSRF protection module `@adonisjs/shield`.

On the other hand, the API server is more tailored towards creating JSON API servers and doesn't include all of the above mentioned packages. However, the following configuration options are tweaked

- The `config/cors.ts` file enables the support for CORS.
- Content negotiation is forced to JSON inside `config/app.ts` file, using `forceContentNegotiationToJSON` flag.

## Starting the Development Server
You can start the development server by running the following `ace` command.

```sh
node ace serve --watch
```

The `serve` command first compiles the typescript code to Javascript and then starts the HTTP server from the compiled code. The `--watch` flag is meant to watch the file system for changes.

[note]
Since all of the AdonisJS runtime behavior relies on the compiled Javascript code. It is advised to always have a terminal session compiling the Typescript source.
[/note]

## Compiling For Production
AdonisJS uses the concept of standalone builds. It means, that you can deploy the compiled output independently of the source files. This approach has a lot of benefits, which are discussed in the [standalone builds]() guide. For now, just run the following command to create a production build.

```sh
node ace build --production
```

The above command performs the following steps in sequence.

1. Compile Typescript source files.
2. Copy `metaFiles` mentioned inside `.adonisrc.json` to the `build` folder.
3. Copy `package.json`, along with `package-lock.json` or `yarn.lock` inside the `build` folder.
4. Install production dependencies inside the `build` folder.

## CLI Help
You can view the help for all the available commands by running the following ace command.

```sh
node ace --help
```

The help for an individual command can be seen as follows:

```sh
node ace make:controller --help
```
