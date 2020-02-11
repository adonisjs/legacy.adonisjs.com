---
permalink: guides/first-steps/creating-a-new-app
category: First Steps
---

# Creating a New App

Before you begin creating a new AdonisJS application, you will have to install Node.js and npm on your computer. 

You can get the latest version of Node.js for your operating system from the [official website](https://nodejs.org/en/download/). If you are comfortable with command line, then we recommend you to use [nvm](https://github.com/nvm-sh/nvm) for installing Node.js on Mac and Linux.

Also, npm comes pre-bundled with Node.js and hence no seperate installation process is required.

[tip]
AdonisJS requires `node.js >= 12.0.0` along with `npm >= 6.0.0`. 
[/tip]

## Creating a New AdonisJS App
AdonisJS is a collection of multiple npm packages. In theory, you can create a new folder with necessary files, install the required packages from npm, and you are all set. However, the smarter approach is to automate this process by executing the following commands. 

1. Open the terminal.
2. Run `npx create-adonis-ts-app blog` to create a new directory called `blog` and install the required packages.
3. Run `cd blog`.
4. Run `node ace serve --watch` to start the development server.

[video url="https://res.cloudinary.com/adonis-js/video/upload/q_100/v1579935322/adonisjs.com/adonis-new-project_k5mrmu.mp4", controls]

### What just happened?

- The `npx` command comes pre-installed with Node.js. The [purpose of this command](https://hackernoon.com/npx-npm-package-runner-7f6683e4304a) is to run executable packages without installing them on your computer.
- `create-adonis-ts-app` is the name of the executable package that `npx` will install and run.
- `blog` is the project directory name. You can pick anything you want.
- The `node ace serve --watch` command compiles Typescript code and starts the HTTP server. The `--watch` flag tells the `serve` command to re-compile project changes by watching the file system.

### View your website locally

If you now visit [http://localhost:3333](http://localhost:3333), you must the see the welcome page as long as the development server is running.

## Directory Structure
The default project structure may feel overwhelming at first by the number of files and folders inside it.

## Typescript Build Process

The source code of the default application is in Typescript and must be compiled down to Javascript before Node.js can understand and run it. 

One way to compile the code is to make use of the official Typescript compiler `tsc`. However, the typescript compiler has no inherit knowledge of your application and hence it cannot perform any other tasks like starting the HTTP server or copying static files to the build folder.

To overcome this shortcoming, AdonisJS has its own typescript compiler to compile the Typescript code, start the HTTP server and also watch for the file changes at the same time. You can start the compiler in any AdonisJS project by running the following command.

```sh
node ace serve --watch
```

- The `node` is the standard node binary installed on your computer.
- The `ace` is an extension less Javascript file in your project root. This file bootstraps the AdonisJS command line framework to execute commands.
- The `serve` command is responsible for compiling the typescript code.
- Finally, the `--watch` flag enables the file watcher. You must always enable file watcher during development to have a faster feedback loop.

There is a dedicated guide on the build process. But let's keep that aside for now and focus on building something useful in this tutorial. 
