---
permalink: guides/http/url-generate
category: Handling HTTP Requests
group: Basics
---

# URL Generation
This guide covers the API around generating plain and signed URLs for the registered routes. By the end of this guide, you will know:

- How to generate plain URLs for registered routes.
- Using signed URLs for tasks like email verification.
- How to assign unique names to your routes.

## What is URL Generation?
Even though the routes are defined inside the `start/routes.ts` file, you need to reference them at several other places. For example:

- Redirecting the request to a URL
- An anchor tag in your HTML document
- Or, the form action

A simple approach is to hardcode the URLs in all places. However, if you decide to change the routes later, you will have to find all the harcoded URLs and update them. A better approach is to generate the URLs dynamically.

## Generating URLs
AdonisJS provides helpers for making URLs for the registered routes. You can reference routes either by their `Controller.action` name or by using the route unique name. For example:

Begin by defining a route

```ts
Route.get('users/:id', 'UsersController.show')
```

Then, inside your controller or the view template, you can generate a URL by referencing the `Controller.action` name.

[codegroup]
```ts{}{Inside Javascript Code}
import Route from '@ioc:Adonis/Core/Route'

export default class UsersController {
  public async index ({ response }) {
    response.redirect(
      // highlight-start
      Route.makeUrl('UsersController.show', { params: { id: 1 } })
      // highlight-end
    )
  }
}
```

```edge{}{Inside View Templates}
{{ route('UsersController.show', { params: { id: 1 } }) }}
```
[/codegroup]

### Defining Params
The routes with parameters expects you to define the `params` values in order to make the URL, otherwise an exception will be raised.

### Defining Query String
You can also define the query string values when making the URL. For example:

```ts
Route.makeUrl('UsersController.show', {
  params: { id: 1 },
  qs: {
    status: 'active',
  },
})

// Output: /users/1?status=active
```

Query string with arrays

```ts
Route.makeUrl('UsersController.show', {
  params: { id: 1 },
  qs: {
    fields: ['username', 'email'],
  },
})

// Output: /users/1?fields%5B0%5D=username&fields%5B1%5D=email
```

## Using Route Names
In majority of cases, the `Controller.action` will point to a single route. However, there can be cases, in which a controller action is shared by multiple routes. For example:

Showing a list of all the blog posts on the homepage as well as the `/posts` URL and hence using the same controller action on both the routes.

```ts
Route.get('/', 'PostsController.index')
Route.get('posts', 'PostsController.index')
```

In situations like these, it becomes mandatory to give unique names to your routes, so that you can generate correct URLs.

Using the `as` method, you can assign a unique name to a route. The router will complain, if you attempt to assign the same name to the multiple routes and hence this is the best way to ensure that you are always referencing the correct route when generating URLs.

```ts
Route.get('/', 'PostsController.index')
  .as('homepage') 👈

Route.get('posts', 'PostsController.index')
  .as('listPosts') 👈
```

The `makeUrl` API remains the same, all you need to do is use the route name, instead of the controller action name.

```ts
Route.makeUrl('listPosts')

// or
Route.makeUrl('homepage')
```

## Generating Signed URLs
Signed URLs provides a neat way to generate URLs with hash signature appended to them. The hash ensures that the generated URL is not modified or tampered.

A great use case of signed URLs is email verification. Instead of generating and storing email verification tokens inside the database, you can opt for signed URLs. 

For demonstration, let's create a dummy app to verify the user email address using a signed URL.

1. Create a route that will handle email verification
  ```ts
  Route.get('/verify/:email', async ({ request }) => {
    if (request.hasValidSignature()) {
      return 'Marking email as verified'
    }

    return 'Url is not valid'
  }).as('verifyEmail')
  ```

2. Create another route to generate a signed URL to verify the email. In a real world app, you may send the signed URL to the user email address.
  ```ts
  Route.get('/get_verification_link', async () => {
    const signedUrl = Route.makeSignedUrl('verifyEmail', {
      params: {
        email: 'foo@bar.com',
      }
    })

    return `Click <a href="${signedUrl}">here</a> to verify email address`
  })
  ```

3. Visit `/get_verification_link` URL and click on the verification link. If you attempt to modify the URL, the signature verification will fail. 

4. Demo
  
  [video url="https://res.cloudinary.com/adonis-js/video/upload/q_80/v1582524587/adonisjs.com/signed-route-email-verification_xujtpz.mp4", controls]


#### What just happened?

- As you can notice, we directly pass the user email address to the URL, without worrying about someone changing it.
- The `request.hasValidSignature()` tests the route signature and ensures that any part of the URL is not tampered.
- Just like `params`, you can also add `query string` to the signed URL's and it will just work fine.

### Expiring Signed URLs
By default, the signed URLs lives forever. However, you can add expiry to them at the time of generating one.

```ts
  Route.get('/get_verification_link', async () => {
    const signedUrl = Route.makeSignedUrl('verifyEmail', {
      params: {
        email: 'foo@bar.com',
      },
      // highlight-start
      expiresIn: '30m',
      // highlight-end
    })

    return `Click <a href="${signedUrl}">here</a> to verify email address`
  })
```
