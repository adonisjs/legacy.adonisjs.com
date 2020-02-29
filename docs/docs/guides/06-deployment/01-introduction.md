---
permalink: guides/deployment/introduction
group: Deployment
---

# Introduction
Once you have completed the development of your application. The next natural step is to deploy it in production. In this section of the guides, we will cover different deployment strategies for deploying an AdonisJS application.

## Build Process
Since, the application is written in Typescript, it must be compiled down to Javascript, before you can deploy and run it on a server.

The simplest way to compile Typescript is to use the `tsc` binary that comes with `typescript` package. However, the `tsc` binary has no knowledge of your project apart from just the Typescript source code. For example: 

1. It doesn't know about the your edge templates or css files.
2. It has no knowledge of the `.adonisrc.json` file and so on.

So, whether you have to manually copy these files to the `build` folder or better deploy the original source code along with the build output.

For simple projects, uploading source code and build output together to a production server may not feel that bad. However, think of 100's of microservices bundled inside docker containers, carrying extra weight for no reasons.

### Self Contained Builds
AdonisJS has adopted the concept of self contained builds. It means that you should be able to deploy the `build` output standalone without the source files. This approach can drastically reduce the number of files you have to move on a production server or a docker container.

Creating a build for production is as simple as running the following ace command.

```sh
node ace build --production
```

The above command performs the following operations.

- Compile the Typescript source code to Javascript.
- Copy `.adonisrc.json`, `templates` and other non typescript files to the `build` folder.
- Copy `package.json` and `package-lock.json` to the `build` folder.

At this point, your `build` output is a standalone application of its own. You can now deploy this folder without shipping all the source code and docs you have in your project.

## FAQ's
Following are the answers to some of the frequently asked questions

### How typescript config is managed?
All of your typescript configuration is controlled by the standard `tsconfig.json` file. We do not introduce any new configuration for Typescript and just follow a standard process for compiling the typescript code.

---

### Which files are copied to the build folder?
You might be wondering, how AdonisJS determines the files that get copied to the `build` folder. These files are defined inside the `.adonisrc.json` file under the `metaFiles` array.

```json
{
   "metaFiles": [
    ".env",
    ".adonisrc.json",
    "resources/views/**/*.edge",
    "public/**"
  ],
}
```

You can define an array of file paths or [glob expressions](https://github.com/sindresorhus/globby#globbing-patterns) and AdonisJS will make sure to copy them to the build folder and also preserves the original directory structure.

---

### How to transform files before copying them?
AdonisJS is not a build tool like Webpack and hence we do not support any kind of transformations for the `metaFiles`. In reality, we do not even see enough use cases, in which you want to transform files before copying them.

One use case is to transform your frontend assets like **Sass to Css** or **minify frontend Javascript**. The frontend build process is out of the scope of AdonisJS and you must rely on frontend eco-system for same.

---

### Can I build on my local computer?
Yes. It is perfectly fine to build your project on your local computer and then move the `build` folder to the production server. But, do make sure that you are installing the production dependencies on the server and not locally on your computer.
