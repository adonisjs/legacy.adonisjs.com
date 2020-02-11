---
permalink: guides/first-steps/introduction
category: First Steps
---

# Introduction

Welcome to AdonisJS! We're glad you are here. This is the introductory guide that you must read if you are new to AdonisJS. The focus of this guide is to hand hold you as you take your first steps towards learning the framework. By the end of this guide, you will know:

1. What is AdonisJS and how it stands different from other frameworks.
2. How to create and run a new AdonisJS application.
3. A comprehensive understanding of the directory structure.
4. Understanding of **Routing**, **Controllers** and **Views**.
5. Using the **Lucid ORM** to interact with SQL databases.
6. Finally, deploying the application to Digital Ocean.

## What is AdonisJS?

AdonisJS is a MVC framework for Node.js. If you have prior experience with languages like Ruby, PHP or Python, then you will find AdonisJS in the leauge of frameworks like **Ruby on Rails**, **Laravel** or **Django**.

The goal of the framework is to focus on developer ergonomics, while maintaining a balance with speed and performance. Being a Typescript first framework, we make sure that all of our packages and tooling offer complete type safety starting from handling the HTTP requests to sending response.

Since, the focus of this guide is to help you learn the framework. We will not turn this section into a sales pitch for AdonisJS and recommend you to read [Why AdonisJS guide]() for same.

## Typescript First
As mentioned earlier, AdonisJS is a Typescript first framework. It means that majority of our documentation, tooling and decisions will be made by keeping Typescript in focus.

Even though AdonisJS applications can technically work with plain Javascript, you will have a far better developer experience if you decide to use Typescript.

If this is your first time using Typescript, then we recommend [learning](https://www.youtube.com/watch?v=BwuLxPH8IDs) a bit more about it before you continue using the framework.

[note]
AdonisJS doesn't require you to have mastery in Typescript. It's just that the Typescript code should not feel alien to you.
[/note]

## Development Setup

You need a **text editor** and some familarity with the **terminal** in order to use AdonisJS. Even though you can use any text editor that has support for Typescript syntax, we recommend using one of the following.

### VsCode
VsCode has first class support for Typescript and hence no extra plugins are required. However, you must install the following extensions for a proper development experience.

- [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for linting the source files within the text editor.
- [Edge template support](https://marketplace.visualstudio.com/items?itemName=luongnd.edge) for adding syntax highlighting to Edge templates (the template engine used by AdonisJS).
- [DotEnv](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) for adding syntax highlight to `.env` files.

### Sublime Text
Sublime Text does require an additional package for Typescript.

- [Typescript Sublime Plugin](https://packagecontrol.io/packages/TypeScript) is the language server plugin for Sublime text and also provides the syntax highlighting.
- [EsLint](https://github.com/SublimeLinter/SublimeLinter-eslint) for linting the source files within the editor.
- [Edge template support](https://github.com/poppinss/edge-sublime-syntax) for adding syntax highlighting to Edge templates (the template engine used by AdonisJS).
- [DotEnv](https://packagecontrol.io/packages/DotENV) for adding syntax highlight to `.env` files.
