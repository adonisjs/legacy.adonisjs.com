---
permalink: blog/petit-mais-grand-adonisjs-3-2-1
title: Petit mais grand (AdonisJS 3.2.1)
group: blog
meta:
  number: 3
  published_on: 2017-01-27
  author: Harminder Virk
---

I am about to step the paddle for the major release of Adonisjs version 4.0 (called dawn).

Dawn will be released with lots of exciting features including first class support for async/await, testing, tooling for deployment and bunch of 🚀 features.

This post is about the features you can use today in Adonisjs. Today I have released v3.2.1 which is ideally a small release but has lot more to offer.

## Lucid

Latest release of lucid ships with powerful features to filter data based upon relationships.

### Fetch users with alteast one post

Let’s say we want to fetch all users who have contributed alteast one post.

```js
const User = use('App/Model/User')

yield User.query().has('posts', '>=', 1).fetch()
```

The `has()` method will filter out all records from the parent model, if child models doesn’t satisfy a rule.

Checkout [official documentation](http://adonisjs.com/docs/relationships#_filtering_records) for all available methods.

### Get comments count for each post

A common use case is to display the count of comments a post has received on posts listing page.

```js
yield User.query().withCount('comments').fetch()
```

Each post will have an additional attribute called `comments_count`.

## Error Reporting For Neat Kids

AdonisJs error reporting library [Youch](https://npmjs.org/package/youch) is inspired by [Whoops](https://filp.github.io/whoops/) which displays errors as an HTML page, instead of dumping them to the console.

Newer release of **Youch** has lots of exciting features focusing to improve your productivity when developing web apps.

IMAGE

1. Pretty design;
1. It only shows stack traces of your code and eliminates all native stack traces, as they only create noise;
1. Optionally, you can click **Show all frames** to view frames for native code or npm modules;
1. Displays important HTTP headers and cookies.

## New Adonis CLI

[@romainlanz](https://twitter.com/romainlanz) rewrote adonis-cli from scratch using Ace. The more it looks pretty, the more it offers options to customize the installation process. Under the hood it allows:

1. Choose between `npm` and `yarn` when installing dependencies;
1. Make use of 3rd party templates by defining a `--blueprint` flag;
1. Skip the modules installation process all together by passing `--skip-install` flag.

## New Adonis Ally Drivers

IMAGE

[Adonis Ally](https://adonisjs.com/docs/social-auth) let’s you add social login feature to your website. [@iamraphson](https://twitter.com/iamraphson) has done awesome piece of work by contributing 2 new drivers for:

1. Instagram
1. Foursquare
