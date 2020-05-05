---
permalink: blog/changing-route-url-behavior
title: Changing Route.url behavior
group: blog
meta:
  number: 8
  published_on: 2018-01-12
  author: Harminder Virk
---

The `Route.url` method returns a fully qualified URL to a registered route. For example:

```js
// register route
Route.get('user/:username', 'UserController.show')

// following returns - user/virk
Route.url('user/:username', { username: 'virk' })

// or resolve using controller.method name
Route.url('UserController.show', { username: 'virk' })
```

## For a specific domain

`Route.url` method used to take a 3rd parameter called `domain`. Which resolves the URL but registered under a specific domain.

```js
Route
  .get('post/:slug', 'PostController.show')
  .domain('blog.adonisjs.com')

// following returns - http://blog.adonisjs.com/post/adonis-101
Route.url(
  'PostController.show',
  { slug: 'adonis-101' },
  'blog.adonisjs.com'
)
```

## In near future

Going forward the 3rd parameter needs to be an object over a string. The change is done in the favor of accepting more configuration options in the near future.

```js
Route.url(
  'PostController.show',
  { slug: 'adonis-101' },
  { domain: 'blog.adonisjs.com' }
)
```
