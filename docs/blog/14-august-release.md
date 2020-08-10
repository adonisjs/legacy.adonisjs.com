---
permalink: blog/august-2020-release
title: August Release (2020)
group: blog
meta:
  number: 14
  published_on: 2020-08-10
  author: Harminder Virk
---

In the last few weeks, we have fixed a handful of issues and also shipped with some new features and improvements. This blog post summarizes the highlights of the release.

## ORM helpers to work with relationships
In the true spirit of making it easier to work with Model relationships, we shipped new methods to [count related rows](/guides/model-relations/introduction#counting-related-rows), [check for relationship existence](/guides/model-relations/introduction#querying-relationship-existence) and apply **group limit** during preload.

Imagining, you have a blog with **categories**, **posts** and **comments**. Following are the code examples for some of the known use cases.

### Get categories list with counts of posts inside them
Many popular blogs shows the count of posts for a category or a tag. 

![](https://res.cloudinary.com/adonis-js/image/upload/v1597042110/adonisjs.com/blog/categories_with_counts_efaxw1.png)

You can achieve the similar results using the following query.

```ts
const categories = await Category
  .query()
  .withCount('posts')

categories.forEach((category) => {
  console.log(category.$extras.posts_count)
})
```

### Check for relationship existence
Another frequent use case is to limit the number of parent model records based upon the existence of its relationships.

For example: Show all posts that has received one or more comments.

```ts
const posts = await Post
  .query()
  .has('comments')
```

The `has` method has more variants. We recommend [reading the docs](/guides/model-relations/introduction#counting-related-rows) for same.

### Preloading group limit
The `groupLimit` method uses [SQL window functions](https://www.sqlservertutorial.net/sql-server-window-functions/sql-server-row_number-function/) to limit the number of rows for preloaded relationships.

Continuing with the blog categories and the posts example. Lets fetch all categories, along with the latest 3 posts in each category.

```ts
const categories = await Category
  .query()
  .preload('posts', (posts) => {
    posts
      .groupOrderBy('posts.created_at', 'desc')
      .groupLimit(3) // 👈
  })
```

The `groupLimit` is not similar to just applying the `limit` clause on the query. The regular limit clause will fetch a total of 3 posts across all the categories. Whereas, we want 3 post from each category.

## New validator rules

The validator has received a bunch of new validation rules related to date-time validation.

### `after` and `before` rules

The `after` and the `before` rules allows you to enforce a date to be after/before a specified date time or offset. Example:

```ts
{
  checkin_date: schema.date({}, [
    rules.after(4, 'days')
  ])
}
```

You can also use the `today` and `tomorrow` keywords with the after `rule`.

```ts
{
  checkin_date: schema.date({}, [
    rules.after('today')
  ])
}
```

Similarly, the `before` rule enforces the date to be before the specified date or offset.

### `afterField` and `beforeField` rules

Another variant is to compare the date with the value of an existing field. This is super helpful for forms with `before` and `after` date columns.

```ts
{
  checkin_date: schema.date({}, [
    rules.after('today')
  ]),

  // highlight-start
  checkout_date: schema.date({}, [
    rules.afterField('checkin_date')
  ])
  // highlight-end
}
```

### `blacklist`

The `blacklist` rule dis-allows certain values. It is the opposite of the enum schema type. A practical use case is to blacklist certain usernames.

```ts
{
  username: schema.string({}, [
    rules.blacklist([
      'super',
      'admin',
      'root',
      'bot',
      'hacker'
    ])
  ])
}
```

## Support for Basic Auth
We have also added the another auth driver that uses the HTTP basic auth for authenticating requests. Using it is as simple as dropping the auth middleware on a route.

```ts{}{start/routes.ts}
Route
  .get('posts', async ({ auth }) => {
    return `You are logged in as ${auth.user!.email}`
  })
  .middleware('auth:basic')
```

[video url="https://res.cloudinary.com/adonis-js/video/upload/q_80/v1597034375/adonisjs.com/adonis-basic-auth_n8ierd.mp4", controls]


## Trap events
One of the primary goals of AdonisJS is to make it easier for you to test your applications. That's why along with the option of trapping emails, we now **also allow trapping emitter events**.

```ts
import User from 'App/Models/User'
import Event from '@ioc:Adonis/Core/Event'

Event.trap('new:user', (user) => {
  assert.instanceOf(user, User)
})
```

To trap all the events, you can make use of the `trapAll` method.

```ts
Event.trapAll((event, data) => {
})
```

Once done with the test, you can call the `restore` method to dispose traps.

```ts
Event.restore()
```
