---
permalink: blog/adonisjs-3-0-release
title: AdonisJs 3.0 Release
group: blog
meta:
  published_on: 2016-06-21
  author: Harminder Virk
---

The shiny new release of AdonisJs is out today (26th, June 2016). It’s more than just another new version. We have taken a bigger step towards making AdonisJs one of the best and stable framework in the community.

3.0 dev release stayed in beta for over 2 months, which helped in finding last time issues and fix the core of the framework for better tomorrow. Not only the code even new documentation is improved and tailored to make every skill level programmer feel comfortable.

Let’s talk about some notable features which are going to make your development experience smoother.

## Request Collection

Request collections solve the most common problem of dealing with the creation of multiple records inside a single HTML form. Make sure to check out this video to learn more about it.

## Data Driven Architecture

AdonisJs data models (Lucid) is the implementation of Active Record pattern. Not only you can make use of data models to read/write database to an SQL database, but instead, make use of the entire eco-system to make your development life easier.

AdonisJs has out of the box support for:

- Database migrations
- Model factories
- Database seeds
- A lean query builder to write fluent SQL queries
- Powerful database associations

Let's take a sneak peek of how you would go about creating a new migration, seed dummy data to the database and make use of it.

### Users Migration

```js
'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {

  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UserSchema
```

### Model Factory

```js
Factory.blueprint('App/Model/User', (fake) => {
  return {
    username: fake.username(),
    email: fake.email(),
    password: fake.password()
  }
})
```

And finally, you can make use of the Factory blueprint to seed rows to the users table.

```js
const Factory = use('Factory')

class DatabaseSeeder {

  * run () {
    // create 5 users
    yield Factory.model('App/Model/User').create(5)
  }

}

module.exports = DatabaseSeeder
```

How simple is it? With the help of these functionalities, it becomes so easier to work as a team, as you won’t have to share the **SQL dump** around with each other.

## In Built REPL

AdonisJs in-built REPL can be used to play around with different modules and see the expected output. Also, it is very handy to interact with Lucid models.

## Robust Authentication Layer

Almost every application has requirements of dealing with user login and secured urls. AdonisJs in-built [authentication system](https://adonisjs.com/docs/authentication) not only makes it super easy to manage traditional session-based login but also it supports RESTFUL authentication schemes like **JWT**, **Basic Auth** and **Github styles personal API tokens**.

```js
Route
  .get('/documents', 'DocumentsController')
  .middleware('auth')
```

or you can choose a specific scheme

```js
Route
  .get('/documents', 'DocumentsController')
  .middleware('auth:jwt')
```

## In Progress

3.0 release makes the core stronger and ready to scale the framework by adding new components from **Outside In**. It is just the beginning and in coming days you will see lots of new features being released as individual modules/providers.

Below is the list of planned providers in no particular order.

- Social Authentication via **Facebook**, **Github**, **Google+**, **LinkedIn** and **Twitter**.
- Redis provider to interact with redis.io with much smoother and elegant API.
- Out of the box support for socket.io with an attempt to solve real-time problems.
- Inbuilt support for Unit and Integration testing.
- Cache provider to make Apps performant.

## Future

It is very important to stay transparent with the vision of the framework. AdonisJs is an intentionally created framework to reach millions of developers and make a stable eco-system in Node.js land.

I work part time on it on my weekends and during nights. Even being part time this is the 3rd major release within a year, which shows the dedication and the love I have for AdonisJs.

I am in conversation with a couple of companies to sponsor the development of the framework. But that does not mean they will decide the future of AdonisJs. I am very clear and straight forward with my expectations and negotiations to make sure the framework has a bright future.

If I get offered with a sponsorship, it will become million times easier to grow the framework and get full time contributors. Even in the worst scenarios (where I still work part-time), you will find me active in the community as always.

## Your Contribution

If you make use of AdonisJs, please consider supporting the project by donating a very small portion of your income. If recurring donations lead to a good amount that can afford my living expenses then I will be more than happy to switch to it in full time.
