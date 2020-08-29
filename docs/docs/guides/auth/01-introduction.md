---
permalink: guides/auth/introduction
group: Authentication
---

# Introduction

AdonisJS comes with a fully fledged authentication system to authenticate the users of your application using **traditional sessions**, **Basic Authentication** or **API tokens**. In this guide, we will cover the fundamentals of authentication in AdonisJS.

## How Authentication works in AdonisJS?
Unlike many other frameworks, we **do not create the routes or the HTML pages** to `register` or `login` the users. We believe, every application has its own UI aesthetics and forcing you to use pre-built bootstrap templates is not a great idea.

Instead, AdonisJS provides you a great set of high level APIs to authenticate users without stressing over every small detail.

### User Providers
AdonisJS makes use of providers to lookup users from the database. We ship following drivers:

- `lucid`: Uses Lucid models to lookup a user.
- `database`: Interacts with the database tables directly to lookup a user.

You just need to define a handful of configuration options and then providers are ready to do all the heavy lifting.

### Token Providers
The token providers are used to lookup tokens from the database. Currently, there is only one token provider, ie `database`. The `database` provider using the SQL database for persisting/reading tokens.

### Guards
Guards decides how to login a user and then authenticate them on subsequent requests. A guard can be an implementation of a stateful authentication like sessions or a stateless implementation using API tokens.

We ship with the following guards:

- `web`: Uses [sessions](/guides/http/sessions) stored inside a cookie. Also has support for **remember me tokens** ([Learn more](/guides/auth/web-guard)).
- `api`: Uses an opaque tokens stored inside your database ([Learn more](/guides/auth/api-guard)).
- `basic`: Uses basic auth for authentication HTTP requests ([Learn more](/guides/auth/basic-auth-guard))
