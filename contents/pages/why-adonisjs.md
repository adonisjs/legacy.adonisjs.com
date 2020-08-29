---
permalink: why-adonisjs
title: Why AdonisJS?
group: pages
meta:
  excerpt: Choosing a framework is a tricky business. So, let’s hold hands together and see what makes AdonisJS different from other Node.js frameworks.
---

## History

 AdonisJS was started as an open source project in the later half of 2015. The framework was intentionally created to serve as an alternative to other frameworks in the Node.js ecosystem.

I (the author) had past experience of working with Laravel (which was fun). After pivoting to Node.js, I had a hard time finding a framework which was joy to work with.

- Frameworks like Express, Koa are mainly routing libraries with support for middleware
- Frameworks like SailsJS are [badly architected](https://kevin.burke.dev/kevin/dont-use-sails-or-waterline/).
- Meteor unnecessarily takes everything to the next level all together. For example, their own package manager.

To summarize: A common theme among all the frameworks is to stay super small and unopinionated. Of course, libraries like Koa and Express are useful in certain use cases, but there is huge section of people who can benefit from a full stack framework like Rails or Laravel, but for Node.js.

Also, I have never been a fan of **duck taping** and hence AdonisJS is not a wrapper on top of ExpressJs, over selling the idea of re-using the Express middleware. AdonisJS is written from ground up with strong principles and clear goals in mind.

## Value Integrated Systems

 At AdonisJS we highly believe in integrated systems. Instead of pointing you to 10 different libraries and saying “you can choose whatever you want”, we have invested in creating first class primitives for every corner of your app.

The statement “you can choose whatever you want” is a nice way of saying “please do all the hard work yourself, we have curated a list of libraries for you”.

Well, a curated list is not bad, but a framework has a bigger job to accomplish. Also, when frameworks doesn’t value integrated systems, they leave you alone in the land of [glue code](https://en.wikipedia.org/wiki/Glue_code).

Let’s go through a small example and see how glue code makes its way into your code.

- You choose a main framework that does only the routing for you.
- Then you pick the popular body parser to access form input and uploaded files.
- Next step maybe is to use a validation engine to validate the form. But wait, the validation engine has no idea about the properties that exists on the file object created by the bodyparser. Hmmmm, let’s write some **glue code** between both of them.
- Wait, you also want to validate the email address to ensure it’s unique inside the database. Again, the validation engine has no idea about your Database ORM. So, another glue?

Well, the reality is, a working real world application always have overlapping parts and without an integrated system, you will always find yourself writing more glue code than the actual code.

Also, do not mistake integrated systems with hardcoded features. AdonisJS itself treats its ORM and the validation engine as two separate modules. The fact, we believe in integrated systems, we created extensible API’s, which allows the module authors to write the glue code and not the module consumers.

## Optimize for Developer Experience

At AdonisJS, we put a lot of emphasis on improving the developer experience. Adopting TypeScript, CLI commands and extensive documentation are all that contributes to this goal.

Also, it is not only about the tooling, we give similar care to the aesthetics of the code as well. Every part of the framework feels like a member of the same family. In fact, this is one of the reasons for writing AdonisJS from ground up vs wrapping existing frameworks in our own packaging.

## Features Highlights

 Being a complete web framework, AdonisJS has ton of features that you can explore through documentation. Following are some of the handpicked one's.

- A well thought and robust SQL ORM. It comes with a Query builder, Migrations and Active Record Models.
- One of the most advanced HTTP router with features like: Route groups, subdomains, pattern matching and resourceful routes.
- Form validator that provides type information, along with the runtime validations. There is no need to maintain separate interfaces for HTTP request body.
- Inbuilt health check module that you can use with orchestrators like Kubernetes.
- A strong emphasis of Web security. We guard for websites against many of the common web attacks.
