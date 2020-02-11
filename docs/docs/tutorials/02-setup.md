---
permalink: tutorials/first-steps/setup
category: First steps
---

# Setup

Before you dive into the framework. Let's setup everything you will need in order to sky rocket 😉 your productivity.

## Installing Node.js

Since, AdonisJS is a Node.js framework, it needs Node.js to be installed on your operating system. You can verify the installation of Node.js by running `node -v` command on the command line.

[note]

Continue to follow this section, if Node.js is not installed on your computer or the installed version is not greater than `12.0.0`.

[/note]

### Installing On Windows
It is recommended to use the official [Node.js installer](https://nodejs.org/en/download/) for Windows. After the installation, do make sure that you can access the `node` command from `cmd` or `Powershell`.

```sh
node -v
```

### Installing On Mac & Linux
The users of Mac with [Homebrew](https://brew.sh/) installed can install Node.js by running `brew install node` command. Also, there is an official [Node.js installer](https://nodejs.org/en/download/) for macOS.

Applicable to both Mac and Linux, it is recommended to use [nvm](https://github.com/nvm-sh/nvm). Using nvm, you can install and switch between multiple versions of Node.js on a single computer.

- Run the following command to first install nvm.

    ```sh
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
    ```
    
- Next, make sure that you can access `nvm` from command line. If not, consult the [troubleshooting guide](https://github.com/nvm-sh/nvm#troubleshooting-on-macos).

- Finally, run the following command to install Node.js and make it the default selected version.

    ```sh
    # Install node@12.14.1
    nvm install 12.14.1

    # Tell nvm to always use v12.14.1 as the default version
    nvm use v12.14.1
    
    # Verify Node.js installation
    node -v
    ```

## Creating New AdonisJS app

Now you are ready to create a new AdonisJS application. The framework is simply a collection of multiple npm packages and in theory you can install these packages manually, create the required boilerplate files and you are all set. However, the smarter approach is to automate this process.

[tip]
AdonisJS has an executable package that can create the boilerplate files and also install the required packages. Let's run the following commands in sequence and we will discuss them in-depth later in this tutorial.
[/tip]

1. Open the terminal.
2. Run `npx create-adonis-ts-app blog` to create a new directory called `blog` and install the required packages.
3. Run `cd blog`.
4. Run `node ace serve --watch` to start the development server.

[video url="https://res.cloudinary.com/adonis-js/video/upload/q_100/v1579935322/adonisjs.com/adonis-new-project_k5mrmu.mp4", controls]

### What just happened?

- The `npx` command comes pre-installed with Node.js. The [purpose of this command](https://hackernoon.com/npx-npm-package-runner-7f6683e4304a) is to run executable packages without installing them on your computer.
- `create-adonis-ts-app` is the name of the executable package that `npx` will install and run.
- `blog` is the project directory name. You can pick anything you want.
- The `node ace serve --watch` command compiles Typescript code and start the HTTP server. The `--watch` flag will continue to watch for file changes and re-compiles only the changed code.

### View your website locally

If you now visit [http://localhost:3333](http://localhost:3333), you must the see the welcome page as long as the development server is running.

## Typescript Build Process

The source code of the default application is in Typescript and must be compiled down to Javascript before Node.js can understand and run it. 

One way to compile the code is to make use of the official Typescript compiler `tsc`. However, the typescript compiler has no inherit knowledge of your application and hence it cannot perform any other tasks like starting the HTTP server or copying static files to the build folder.

To overcome this shortcoming, AdonisJS has its own typescript compiler to compile the Typescript code, start the HTTP server and also watch for the file changes at the same time. You can start the compiler in AdonisJS project by running the following command.

```sh
node ace serve --watch
```

- The `node` is the standard node binary installed on your computer.
- The `ace` is an extension less Javascript file in your project root. This file bootstraps the AdonisJS command line framework to execute commands.
- The `serve` command is responsible for compiling the typescript code.
- Finally, the `--watch` flag enables the file watcher. You must always enable file watcher during development to have a faster feedback loop.

There is a dedicated guide on the build process. But let's keep that aside for now and focus on building something useful in this tutorial. 

## VSCode Setup

You can use any text editor of your choice with AdonisJS. Just make sure that it has support for Typescript syntax highlighting. However, we recommend using VsCode, for a more integrated experience.

### Downloading VSCode

Visit the Visual Studio Code website to [download the editor](https://code.visualstudio.com/#alt-downloads) for your operating system.

The VsCode code has inbuilt support for Typescript and hence no extra extensions are required for syntax highlighting or the autocomplete feature.

### Download AdonisJS extension

TBD
