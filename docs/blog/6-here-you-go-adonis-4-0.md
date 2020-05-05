---
permalink: blog/here-you-go-adonis-4-0
title: Here you go - Adonis 4.0 ?
group: blog
meta:
  number: 6
  published_on: 2017-11-08
  author: Harminder Virk
---

Version 4.0 of AdonisJs is officially out and not only it is ready to be used in production, but you can also invest your time to build long-term projects, and there are reasons behind such a strong voice.

- Javascript as a language has seen new changes almost every morning and being a pure Javascript framework; Adonis has to support all these features. Since significant parts of the language like `async/await`, `proxies` are fully implemented, we are not expecting any big changes forcing a re-write of the framework.
- After the dev release, I successfully got AdonisJs running in production inside Kayako ( the company I work for ). That means I use it every day at work, taking out more time to improve it and build tooling around the framework.
- I am happy to accept that we are a small community ( not as big as React ) but it is changing. Every morning I get at-least **10 new PR’s** and a bunch of issues around edge cases.

## Where to get it?

Head over to http://adonisjs.com and follow the installation guide. Trust me it will take less than 5 minutes to get Adonis running on your machine.

## Newcomers?

If this is the first time you hear about AdonisJs, then let me put down some impressive features you wished inside a Node framework.

- Written in pure Javascript, no fuss around running transpilers and fighting with them.
- Solid MVC architecture with inbuilt IoC container to bind and resolve dependencies.
- First class support for [unit testing](http://adonisjs.com/docs/4.0/testing), [API](http://adonisjs.com/docs/4.0/api-tests) and [browser tests](http://adonisjs.com/docs/4.0/browser-tests).
- Active Record based [ORM](http://adonisjs.com/docs/4.0/lucid).
- Bunch of first-class add-ons for: [sending emails](http://adonisjs.com/docs/4.0/mail), [I18n](http://adonisjs.com/docs/4.0/internationalization) and [writing terminal commands](http://adonisjs.com/docs/4.0/ace)
- Extensive documentation.

## What’s next?

It is not all over. There are a bunch of things pending to be added to the eco-system and make you even more productive as a developer.

I will be working on small features like:

- Development request logger.
- Model traits for adding slugs.
- A demo application built using AdonisJs and NuxtJs.

The good chunk of my time will be spent on adding support for following features.

- [Websockets support that works](https://github.com/adonisjs/discussion/issues/51)
- [Tooling around deployments](https://github.com/adonisjs/discussion/issues/52)
