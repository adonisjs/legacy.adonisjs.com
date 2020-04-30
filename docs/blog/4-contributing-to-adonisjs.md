---
permalink: blog/contributing-to-adonisjs
title: Contributing to AdonisJs
group: blog
meta:
  published_on: 2017-05-10
  author: Harminder Virk
---

Quite often I am asked on how to contribute to AdonisJs and it is so important to have some clarity on same since contributors are the force behind any open source project.

This post gives an overview on how you can get started contributing to AdonisJs based upon your interests and skill level.

## Documentation

[AdonisJs docs](https://adonisjs.com/docs) are far better than most of the other open source projects, but they are not the best. Documentation is the area which needs **lots of love** and **care** to make them beginners friendly and document every possible use case.

If you enjoy writing technical documentation and wants to help AdonisJs grow, then feel free to clone [adonisjs/docs](https://github.com/adonisjs/docs) repo and create a PR with your changes.

Documentation is written using [Asciidoctor](http://asciidoctor.org/) and get processed before deploying to the server.

## Small Wins

Just by spending a small portion of your time you can help AdonisJs grow.

### Clearing Issues

Good amount of issues created across all the repos are simple confusions or something not supported by AdonisJs. Clearing these issues by answering queries will make the issues list clean and small.

### Verifying Bugs

At times issues reported are bugs. If you can spend some time to reproduce the issue and leave a comment confirming the bug. It will save me time and work on the fix directly.

### Educating Everyone

Majority of AdonisJs users are new to Node.js and the wave of ES.Next confuses them on when to use **Promises** or when to use **Callbacks**. It will be nice to encourage everyone to use promises and explain why it is not possible to use **ES6 Generators** inside plain closures.

### Help In Redesign

AdonisJs website design is something I scaffolded in couple of days and always looking for a better layout. If you are **UI/UX designer** and wants to design AdonisJs website, you are more than welcome.

Before getting started consider having a word, so that we can talk about the layout and I can share some wireframes.

### Let’s Write Some Code

It’s always nice to have more contributors, contributing to the core of the framework.

But it is not as easy as it sounds, since **great power comes with great responsibility**. When contributing to the codebase you have to follow some guidelines and develop a sense of what needs to be delivered.

It is very important that code base has a consistent code style, since it is harder to maintain code bases with different coding styles.

- We lint our code using [StandardJs](https://standardjs.com/).
- Always make sure to write enough tests for the feature you are building.
- Create a separate PR for the docs.

### Discussing Features

Before you dive into writing code, it’s always nice to discuss the feature by creating an issue on [github](https://github.com/adonisjs/discussion/issues). If you think your ideas are not well thought, feel free to reach me personally on Gitter and we have a chat about it.
