---
permalink: guides/quick-start
group: Basics
---

# Quick Start
Welcome to AdonisJS! The guides are designed to help you get up and running with AdonisJS, even if this is your first time using it. Couple of points to note, before we get started.

- The guides only covers the topics which are ready and shipped for the v5 preview release.
- The code examples are in TypeScript, so we expect you to have some familarity with it.

[note]
The core of the framework is under the preview release. It is **quite stable and ready for production use**.

However, some AdonisJS v4 packages are not migrated to work with new core and few parts are missing documentation.
[/note]

## Creating a New Project
AdonisJS requires `Node.js >= 12.0.0`, along with `npm >= 6.0.0`. You can check the version of Node.js and npm by running the following commands.

```sh
node -v
# v12.14.1

npm -v
# 6.13.7
```

You can create a new AdonisJS project by using [npm init](https://docs.npmjs.com/cli/init) or [yarn create](https://classic.yarnpkg.com/en/docs/cli/create/). 

Both of these tools are meant to install a package and then immediately execute the main command exposed by the installed package. So think of it as a shortcut to install a package globally and then run it as an executable.

[codegroup]
```sh{}{npm}
npm init adonis-ts-app blog
```

```sh{}{yarn}
yarn create adonis-ts-app blog
```
[/codegroup]

1. The command will setup a new project structure and installs all required dependencies.
2. If you are creating an API server, then do choose `API Project` in the boilerplate prompt.
3. `cd` into the newly created directory.
4. And run `node ace serve --watch` to start the development server.

## Available Project Structures
When creating a new project, you can choose between

1. An API server
2. Or, a Web application

### Web Application

A web application project structure is packed with all the required components to create a fully fledged server render application. Along with the framework core, it comes with

- The AdonisJS template engine `@adonisjs/view`
- The sessions module `@adonisjs/session`
- Support for static assets is enabled.
- The web security & CSRF protection module `@adonisjs/shield`.

### API Server

On the other hand, the API server is more tailored towards creating JSON API servers and doesn't include all of the above mentioned packages. Also, the following configuration options are tweaked

- The `config/cors.ts` file enables the support for CORS.
- Content negotiation is forced to JSON inside `config/app.ts` file, using `forceContentNegotiationToJSON` flag.

## Starting the Development Server
You can start the development server by running the following `ace` command.

```sh
node ace serve --watch
```

The `serve` command will start the HTTP server and performs in-memory compilition of Typescript to Javascript. The `--watch` flag is meant to watch the file system for changes and re-start the server automatically.

## Compiling For Production
AdonisJS uses the concept of standalone builds. It means, you can deploy the compiled output without moving the source files to the production server. The standalone builds are really helpful in creating slim docker images.

Run the following command to create a production build.

```sh
node ace build --production
```

The above command performs the following steps in sequence.

1. Compile TypeScript source files to Javascript.
2. Copy `metaFiles` mentioned inside `.adonisrc.json` to the `build` folder.
3. Copy `package.json`, along with `package-lock.json` or `yarn.lock` inside the `build` folder.

At this stage, you can upload the `build` folder to your production server, install the dependencies and run `node server.js` to start the server.

## CLI Help
You can view the help for all the available commands by running the following ace command.

```sh
node ace --help
```

The help for an individual command can be seen as follows:

```sh
node ace make:controller --help
```
