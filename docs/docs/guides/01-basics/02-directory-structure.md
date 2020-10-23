---
permalink: guides/directory-structure
group: Basics
---

# Directory Structure
The default project structure of AdonisJS serves as a great getting started point to develop new applications. AdonisJS ships with a conventional set of files and directories to speed the development process and eliminate the need of wiring the application by hand.

By the end of this guide, you will have a fairly good understanding of the project structure and the purpose of different files.

## Structure Preview

```sh
.
├── app
├── commands
├── config
├── contracts
├── providers
├── public
├── resources
│   └── views
├── start
│   ├── kernel.ts
│   └── routes.ts
├── .env
├── .adonisrc.json
├── ace
├── ace-manifest.json
├── env.ts
├── package-lock.json
├── package.json
├── server.ts
└── tsconfig.json
```

## The Project Root
The root of the project has all the necessary config/meta files to setup the development workspace. Let's go through the folder structure and understand the purpose of every file/directory.

#### tsconfig.json
The `tsconfig.json` contains the configuration for the [TypeScript compiler](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html). This file must exist in order for AdonisJS to compile your code to JavaScript. Also, your text editor may use this same file for features like intellisense, auto imports, error detection and so on.

#### .adonisrc.json
The `.adonisrc.json` file configures the workspace for your AdonisJS projects. The application runtime, the CLI commands and your project dependencies rely on this file to understand the requirements of your project.

This file contains the bare minimum config required to run the application. However, you can execute the following command to see the possible configuration options and their default values.

```sh
node ace dump:rcfile
```

#### env.ts

#### .env
AdonisJS relies on environment variables to hold the environment specific configuration. 

For example: The database credentials on your local machine will always be different from the one in production and hence you must use the environment variables to configure them.

During development, you can define these variables inside the `.env` file as **key-value pairs**.

```bash
NODE_ENV=development
MYSQL_USERNAME=adonisjs
```

Since you never commit `.env` file to the version control systems like GIT. We create an additional `.env.example` file to work as a template for your environment variables with just keys and no values. Using the `.env.example` file, your team mates can create their own `.env` file.

```bash
NODE_ENV=
MYSQL_USERNAME=
```

#### .editorconfig

The [.editorconfig](https://editorconfig.org/) file makes it possible to use consistent coding styles when collaborating on a single project. 

Instead of asking every developer in your team to re-configure their editor settings, you can create an `.editorconfig` file in your project root and many modern editors will adjust themselves based on this file.

AdonisJS creates this file with the settings used by the core team. However, you are free to change it as per you or your team preference.

## The `app` directory
The `app` directory contains the source files for your application. **Controllers**, **Models**, **Services**, all are stored inside this directory.

## The `config` directory
All of the application runtime configuration is stored inside the `config` directory. AdonisJS ships with a bunch of well documented configuration files used by the core of the framework.

As your application will grow, you can also use this directory to store additional configuration files.

## The `contracts` directory
Applicable to TypeScript projects. The `contracts` directory stores the **interfaces**, **types**, **enums** or any other TypeScript constructs.

## The `start` directory
The `start` directory contains the files that must be loaded only once during the initial boot process.

Even though the framework doesn't automatically load these files, keeping them in a separate directory indicates a clear purpose.

## The `resources` directory
The `resources` directory is dedicated for storing view templates, uncompiled/raw frontend assets like **SASS files** or **frontend JavaScript** and so on.

After compiling the frontend assets, you must move them to the `public` directory, since the `resources` directory is not exposed to the internet.

## The `public` directory
All of the files inside the `public` directory are accessible by typing their path as part of the URL. For example:
You can access `./public/style.css` file by visiting [http://localhost:3333/style.css](http://localhost:3333/style.css) URL.

## The `database` directory
The `database` directory holds the database migrations and seed files. Just like the `start` directory, the `database` directory is created to indicate a clear purpose for the given files.

## The `providers` directory
The `providers` directory holds the Service providers local to your application. Always make sure to register the provider inside `.adonisrc.json` file. Alternatively, you can also run the following command to create the provider and also register it at the same time.

```sh
node ace make:provider MySampleProvider
```

## The `ace` file and the `commands` directory
AdonisJS is the only Node.js framework, that ships with an embedded command line framework called `ace`. The `ace` file in the project root is the starting point for executing CLI commands that are part of your source code or added by the dependencies of your project.

The commands local to your project are stored inside the `commands` directory. You can create a new command by running the following instruction.

```sh
node ace make:command Greet
```

## The `server.ts` file
The `server.ts` is the entry point for booting the application and starting the HTTP server. If required, you can also start the HTTP server by running this file directly. However, do make sure to compile the TypeScript source to JavaScript first. For example:

```sh
node ace build
node build/server.js # Starts the server
```

## API Server Exclusions
The API Server boilerplate has following exclusions. 

- The `resources` directory.
- The `public` directory. Also, the static files server is disabled for API only projects.
