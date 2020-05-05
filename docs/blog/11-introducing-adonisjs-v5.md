---
permalink: blog/introducing-adonisjs-v5
title: Introducing AdonisJS V5 Preview
group: blog
meta:
  number: 11
  published_on: 2020-03-01
  author: Harminder Virk
---

Finally after a very long wait, I am excited to share the preview release of AdonisJS version 5. In this post, I will explain what this release contains, what is about to come and also share some of my favorite features from v5.

[note]
Here's the link to the new website https://preview.adonisjs.com/. This remains the permanent URL until we are in the preview phase.
[/note]

## What Does the Preview Release Means?

I am not a versioning expert, so its possible that the pure meaning of `preview release` is quite different from what I intended it to mean. So let's get on the same page first.

This is a preview release because, some of the AdonisJS packages are not yet ready for v5. In other words, if your application relies on unfinished packages like Auth, then you may not be able to move to v5 yet and hence this cannot be considered as a final release.

On the other hand, the features added to v5 are stable and it is less likely that their API will change.

## Typescript is now a first class citizen in AdonisJS

AdonisJS, now has baked-in support for Typescript. In fact, this is one of the biggest reasons for such a long wait. The core of the framework and all the surrounding packages are re-written in Typescript.

When we say that AdonisJS supports Typescript, we mean it. It is not just about adding few types here and there to certain API's, we make sure that every corner of your app has proper support for type checking. Below are some of the examples of same.

### Full Typed Request Body

The following screenshot shows that right after validating the request body, you also get its type information. Also, you don't have to maintain any separate interfaces for this. It just works!

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_auto,c_scale/v1588693759/adonisjs.com/blog/c07965f4-1527-430b-aa97-139e24816798_pjkaop.webp)

### Typed Events

The events listeners are usually defined inside a single dedicated file, but you emit events across the entire application. So it is possible that you may end up passing wrong data to an event at the time emitting.

However, with AdonisJS you can define types for your events and we will ensure to enforce them.

[video url="https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_auto,c_scale/v1588693893/adonisjs.com/blog/11905a79-d365-4686-abee-821da458324e_vjuu0x.mp4", controls]

### Extending AdonisJS Core

Extending classes or objects at runtime with typed languages is not fun. Infact, this is one of the places, where majority of Typescript driven frameworks falls short.

However, we have put extra care to ensure that you can extend every piece of the framework at both runtime and static fronts. For fun, let's extend the Response class of AdonisJS

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_auto,c_scale/v1588693980/adonisjs.com/blog/b7850421-8114-4e5c-8698-ac0436ef781a_bmfwdl.webp)

## Crazy Performance Improvements

I am not a big fan of **micro optimizations** and **pointless hello world benchmarks**. In context of Web request, it does not matter, if your application responds in 20ms, 30ms or 40ms. At the end of the day, if it is under a certain threshold, then it's all fine.

The reason 40ms to 20ms doesn't matter, because the amount of time spent on achieving that performance has very less value to add to your application.

With that said, as a framework, we always measure our performance bottlenecks and try to tweak them wherever necessary. During this process, we have been able to achieve some great results with our [HTTP server](https://github.com/adonisjs/http-server) and the [validator](https://github.com/adonisjs/validator).

### HTTP Server

The HTTP server has been extracted from the core to its own repo. Running this server standalone is on par with Fastify. You can clone the repo yourself and run the benchmark to see the results.

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_auto,c_scale/v1588694018/adonisjs.com/blog/57101ee5-0cb8-46d2-af55-b8a357326ec4_rkgoib.webp)

### Validator

The validator has received some crazy performance gains. Infact, it is the fastest data validator in its own league (ignoring JSON schema validator like ajv).

- It is faster than Joi (A popular validation library for Node.js)
- And also faster than its predecessor Indicative

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_auto,c_scale/v1588694056/adonisjs.com/blog/4311d061-89a8-4ba6-b666-81e99f8c8882_ie8u0v.webp)

## Good Bye Adonis CLI

Just like Ember, Vue or Gatsby, AdonisJS also had a CLI, that you can install globally on your computer. However, since AdonisJS is a backend framework, it needs a CLI that can be extended.

It is very common for backend projects to have custom CLI commands. For example: A command to process the queue jobs, or a command to add an admin user from the command line. Also, these commands are project specific and not global.

To serve the above mentioned use case, we embedded a command line framework `ace` to all AdonisJS applications. But now, we have 2 command line utilities, `ace` and `adonis cli` and you have to remember which command comes from which utility.

With this release, we have moved all the commands to `ace` and saying goodbye to Adonis CLI. From now on:

- No need to install anything globally on your computer. All commands lives inside your projects locally.
- A new project is created using `npx` or `yarn create`.

## ESM Imports all the way

If I ever wanted to improve something to AdonisJS, that was getting rid of the `use` method to import dependencies, but without giving up the niceties of the IoC container.

The IoC container is the backbone of AdonisJS. It takes all the clutter of assembling dependencies from the end-user and gives to the module authors.

Finally, we have been able make ESM imports work with the AdonisJS IoC container. It means, you can import bindings from the container as follows:

```ts
import Route from '@ioc:Adonis/Core/Route'
```

Couple of things to note here:

- You will have to prefix the binding with `@ioc` keyword. This is not a technical limitation, but a design choice. We want you to easily distinguish between standard imports and IoC container specific imports.
- The IoC container aliases cannot be used. This is fine, since you can autocomplete them anyways with Typescript.

## Highlights

This release contains bunch of new features, minor tweaks to the existing APIs and also some breaking changes. It is hard to cover everything in a single blog post. Let me share some of my favorite additions and changes.

### Signed Routes

This release adds a new feature (inspired by Laravel) of signed routes. Signed routes are great for features like **email validation**, **temporary download URLs** and so on. In nutshell, this is how it works:

- Using the `Route.makeSignedUrl()` method, you can generate links to any pre-registered route and AdonisJS will append a signature to the generated link query string.
- The signature is generated using a secret key, so it is not possible to decode it without the key.
- When someone visits the signed URL, you can use `request.hasValidSignature()` method to verify that the signature is valid and also the URL is not tampered.

We have a detailed tutorial on [signed URLS](https://preview.adonisjs.com/guides/http/url-generate#generating-signed-urls), so make sure to read that as well.

### Health Checks

As more and more applications are moving towards the world of containers and orchestration. It is very important for these tools to know the health of your application, so that they spin up new resources, when existing ones are not stable.

AdonisJS now comes with a unified health check module, that other packages can use in order to register their service. For example: Lucid [registers a checker](https://github.com/adonisjs/lucid/blob/develop/providers/DatabaseProvider.ts#L73) to report its connectivity with the database server and same is done by the [Redis module](https://github.com/adonisjs/redis/blob/develop/providers/RedisProvider.ts#L36).

Within your application, you can pull a report from the Health check service and share it your monitoring tool or the orchestrator. For example: Exposing it as a JSON endpoint.

```ts
import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('/', async ({ response }) => {
  const { report, healthy } = await HealthCheck.getReport()
  return healthy
    ? response.status(200).send(report)
    : response.status(400).send(report)
})
```

### Overall Improvements to Lucid

A big thanks to Typescript here. Lucid was great as an ORM, but there was lot of unnecessary magic inside the codebase. We simply went crazy with the use of ES6 proxies and after a while, it was so hard to navigate within the codebase.

After switching to Typescript, the magic has to disappear, since static languages doesn't like them. Typescript forced us to think clearly and helped design a better, stable and reliable API. Since, the codebase has improved a lot, it allowed us to add more features to Lucid. It includes:

- **Support for read/write replicas**: Now, you can define a single write and multiple read servers and Lucid will route SQL queries to the right server.
- **Using advisory locks during migrations**: Instead of using a lock table to disallow concurrent migrations, we now make use of [advisory locks](https://vladmihalcea.com/how-do-postgresql-advisory-locks-work/).
- **Support for configuring runtime connections**: This one is a great addition for multi-tenant apps using separate database for each tenant. Now, you can register database connections at runtime (maybe do it inside a middleware) and then use them throughout the application

## The Progress

Many of you might be waiting to know the exact status of the project. What has been done and what is remaining?

### Functionality ready to be used

- Router
- Request, Response and Templates
- Cookies and Sessions
- Lucid and its Active Record ORM
- The Bodyparser with support for file uploads
- Validator (some of the validation rules are missing)
- Health checks
- Logger
- Mailer (some of the drivers are missing)
- Events
- Encryption and Hashing
- Redis
- Ace Commands

### Packages that are not migrated yet

- Authentication
- Social Authentication
- Websockets
- Tests Runner
- and Intl

### New Functionality to be added

Following are the features, that never existed in AdonisJS, but will make their way through in v5.

- Support for RBAC
- Queues
- Caching (including Database queries)

### Roadmap

Finally, you can follow the [roadmap on trello](https://trello.com/b/3klaHbfP).  Feel free to vote for the features you want to be prioritized and also pick the ones you want to work on.

- We will first focus on completing the items in the Documentation lane.
- Then moving to the Q1 (Quarter 1) features.
- And finally to the Q2 features.

The v5 will be considered released after Q1, since the features in Q2 are mainly new additions to the framework

## Breaking Changes

Breaking changes are expected with the amount of changes we have made to the framework. But don't worry, we will not leave you alone.

So far, we have not finalized the list of breaking changes and neither there is any upgrade guide. The preview release has been made for the community to be a part for the upcoming changes.

Right after we complete all the features for this quarter, we will put out a proper upgrade guide for upgrading your existing applications to v5. Also, we will create a dedicated channel on our [Discord Server](https://discord.gg/vDcEjq6) and I will try to answer all questions to make sure you are able to migrate your existing apps to v5.

## Thanks to all of you

AdonisJS was my first major open source project. I learned a lot during my journey and also made a lot of mistakes. It took it around 4 years to learn things around managing a community and maintaining a framework.

Also, I do hear maintainers horror stories in the open source world, but I have personally never experienced them. The AdonisJS community has been so kind to me in every situation. This release has been waiting for a long time, but I have never seen someone getting angry over me or trying to demoralizing me.

So as much as me, all this hard work is possible because of you. It takes only a day for a maintainer to shutdown the project without any motivation. But, I have been lucky enough to have such great people using the framework and always appreciating the work.

Cheers!

Harminder Virk
