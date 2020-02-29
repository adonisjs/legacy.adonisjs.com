---
permalink: guides/http/http-hooks
category: Handling HTTP Requests
group: Basics
hidden: true
---

# HTTP Hooks
HTTP hooks provides a lower level API to hook into the HTTP request lifecycle. By the end of this guide, you will know:

- What are HTTP hooks and why you need them.
- How they are different from HTTP middleware.
- When you should reach for hooks over middleware.

## How Middleware Works?
In order to understand the need for hooks, you will have to first understand the flow and limitations of HTTP middleware.

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1582969262/adonisjs.com/http-middleware_wvb8mg.png)

- Middleware are executed on every new HTTP request.
- They are executed in sequence from left to right. 
- If one middleware decided to abort the request, then all other middleware along with the route handler are not executed.
- More importantly, they have no knowledge about when a request finishes.

The last point in the above list makes middleware less suitable for actions that must occur just before the response
is sent to the client.

Sessions is the classic example, in which creating a middleware is not the right approach. Sessions needs to know about both the starting and ending of request in order to load and persist session data on each request.

Infact, this is such a common problem with middleware, that plugins in the express eco-system has to [override the res.end method](https://github.com/expressjs/session/blob/master/index.js#L250) in order to make sessions work.


### What Middleware Are For?
Middleware are mainly for the actions that must happen at the time of receive a new request. For example:

- Authentication middleware to ensure that user is logged in.
- Rate limiting middleware to limit the number of requests from a single client.
- BodyParser middleware to parse the request body.

If your middleware wants to hook into the response lifecycle, then it's a clear sign, that you need hooks and not middleware.

## How HTTP Hooks Works?
HTTP hooks are a level above the middleware and they get executed for every single HTTP request.

You can define **before hooks**, which are executed before any middleware and the route handler. Whereas the **after hooks** are executed after the route handler and before the response is sent.

### Registering Hooks
You can register hooks on the `Server` module inside the `start/kernel.ts` file. For example:

[note]
As of now, you can only define inline closure functions with HTTP hooks. If HTTP hooks ends up getting used widely by the community, then we will add support for IoC container bindings as well.
[/note]

```ts{}{start/kernel.ts}
Server.hooks.before(async (ctx) => {
  console.log(`Inside before hook`)
})

Server.hooks.after(async (ctx) => {
  console.log(`Inside after hook`)
})
```
