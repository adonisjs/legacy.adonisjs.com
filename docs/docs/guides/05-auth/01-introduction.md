---
permalink: guides/auth/introduction
group: Authentication
---

# Introduction

AdonisJS comes with a fully fledged authentication system to authenticate the users of your application using **traditional sessions**, **JWT tokens** or **API tokens**. In this guide, we will cover the fundamentals of authentication in AdonisJS.

## How Authentication works in AdonisJS?
Unlike many other frameworks, we **do not create the routes or the HTML pages** to `register` or `login` the users. We believe, every application has its own UI aesthetics and forcing you to use pre-built bootstrap templates is not a great idea.

Instead, AdonisJS provides you a great set of high level APIs to authenticate users without stressing over every small detail.

### User Providers
AdonisJS makes use of providers to lookup users from the database. We ship following drivers:

- `lucid`: Uses Lucid models to lookup a user.
- `database`: Interacts with the database tables directly to lookup a user.

You just need to define a handful of configuration options and then providers are ready to do all the heavy lifting.

### Guards
Guards decides how to login a user and then authenticate them on subsequent users. A guard can be an implementation of a stateful authentication like sessions or a stateless implementation using JWT tokens.

We ship with the following guards

[note]
Currently, only the `web` guard is ready. Other guards will be ready soon. 
[/note]

- `web`: Uses sessions to login/authenticate a user. Also has support for **remember me tokens**.
- `basic_auth`: Uses basic auth for authenticating users.
- `jwt`: Issues JWT token after verifying the user credentials and protects subsequent request by checking for a valid JWT token.
- `api_tokens`: Inspired from Github personal tokens. The API tokens allows you to let the users of your app create personal tokens from a dashboard and then use them for authentication.
