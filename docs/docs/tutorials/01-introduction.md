---
permalink: tutorials/first-steps/introduction
category: First steps
---

# Introduction

Welcome to AdonisJS! A framework that highly focuses on **developer ergonomics**, **well architected abstractions** over everything else. The goal of this tutorial is to hand hold you, while you take your first steps towards learning the framework.

As we walk through this tutorial, we will learn about the key parts of the framework. i.e. The [MVC pattern](), [Routing](), [Database and ORM]() and will finally deploy the application to Digital Ocean.

## About Node.js

Node.js is a Javascript runtime environment to create server side applications. Over the years, you have been able to run Javascript in the browser using the browser API's. Using, Node.js you can now re-use your existing Javascript skills and develop server side applications.

- Node.js itself is not a language. It provides you a set of API's that you can use to perform various tasks. For example: The HTTP module of Node.js exposes API to handle incoming request and respond to them.
- There are no threads in Node.js. It runs on a single process and then uses the [Event loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/) to schedule time consuming (asynchronous) tasks without blocking the main process. The event driven architecture of Node.js makes it one of the best contender for building highly scalable systems.

## About Npm

Npm is a package manager for Node.js. Just like composer is for Php and Bundler is for Ruby, we have got npm.

AdonisJS is also a package published on npm and when you create a new AdonisJS project, it will use npm to download required dependencies.

## About Typescript

[Typescript](https://www.typescriptlang.org/) is a superset of Javascript with support for static types. A lot of Javascript superset languages have come and gone over the years, but Typescript is different, has lot to offer and that is the reason, we (at AdonisJS) decided to make Typescript a first class citizen in the framework.

- The compiler of Typescript `tsc` just works. You don't have to get into the madness of download a gazillion of plugins just to compile a `hello world` program. Infact, there is no direct plugins eco-system and this makes Typescript fun to work with.
- The type system is pretty advanced. Using [unions](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types), [generics](https://www.typescriptlang.org/docs/handbook/generics.html), [conditional types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#conditional-types) and [type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html), you can create pretty far with types. In other words, Typescript is not a toy project and created with real world use cases in mind.   


## About this tutorial

This tutorial is focused on individuals using AdonisJS or even Node.js for the first time. We will not get into the depth of every topic and will only explain the necessary concepts required in this tutorial.

You must read the [guides]() for in-depth understanding of the framework.
