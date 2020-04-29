---
permalink: guides/csrf-protection
category: Additional Resources
group: Basics
---

# CSRF Protection
Keeping the security at the forefront, AdonisJS comes with all the tooling required to keep your applications secure from common Web attacks like **CSRF**, **XSS**, **CSP** and lot more.

In this guide, we will just focus on the CSRF protection.

## What is a CSRF attack?
CSRF (Cross Site Request Forgery) is an attack, in which a 3rd party website can trick the users of your website to submit forms without their explicit consent.

For an in-depth understanding of the attack, we recommend you reading [this article](https://owasp.org/www-community/attacks/csrf). But for now, we will focus on the AdonisJS side of things to prevent this attack from happening.

## Setup
The CSRF protection, along with many other guards are part of the `@adonisjs/shield` package. So let's get it configured first.

Run the following command to install the package from the npm registry.

[codegroup]
```sh{}{npm}
npm i @adonisjs/shield@alpha
```

```sh{}{yarn}
yarn add @adonisjs/shield@alpha
```
[/codegroup]

Run the following command to configure the package.

```sh
node ace invoke @adonisjs/shield

# ✔  create    config/shield.ts
#    update    .adonisrc.json
# ✔  create    ace-manifest.json
```

Finally, register the following middleware inside `start/kernel.ts` file. The middleware must be right after `BodyParserMiddleware`.

```ts{3}{start/kernel.ts}
Server.middleware.register([
  'Adonis/Core/BodyParserMiddleware',
  'Adonis/Addons/ShieldMiddleware',
])
```

## Secure by default
As soon as the package is configured, all of the HTML forms will be protected against CSRF attacks. For demonstration, lets create a new form and try submitting it without the CSRF token.

- Define the following routes
  ```ts{}{start/routes.ts}
  Route.on('posts/create').render('posts/create')
  Route.post('posts', 'PostsController.store')
  ```

- Render the HTML form
  ```edge{}{resources/views/posts/create.edge}
  <form action="{{ route('PostsController.store') }}" method="post">
    <div>
      <label for="title">Post title</label>
      <input type="text" name="title">
    </div>
    <hr>
    <button type="submit">Create Post</button>
  </form>
  ```

- Finally, define the `PostsController.store` to handle the form submission
  ```ts{}{app/Controllers/Http/PostsController.ts}
  export default class PostsController {
    public async store () {
      return 'Form submission handled'
    }
  }
  ```

Now, if you visit [http://localhost:3333/posts/create](http://localhost:3333/posts/create) and submit the form, you will receive an exception with `Invalid CSRF Token` message.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1587649378/adonisjs.com/csrf_ruyzwo.mov", controls]

### Fixing the error
In order to the fix the error, you will have add a hidden input field to your form that contains a unique CSRF token. Open `resources/views/posts/create.edge` file and update the form body as shown in the following code snippet.

```edge{2}
<form action="{{ route('PostsController.store') }}" method="post">
  {{ csrfField() }}
  <div>
    <label for="title">Post title</label>
    <input type="text" name="title">
  </div>
  <hr>
  <button type="submit">Create Post</button>
</form>
```

That's all. Now attempt to submit the form again and it will work fine.

### How it works?
- The `csrfField` global helper adds a hidden input field with a secure random token.
- The token is generated securely on the server side and cannot be guessed.
- When the form is submitted, the Shield middleware will make sure that the token is present, otherwise it denies the request with `403` status code.

## Configuration
The config for the CSRF is stored inside the `config/shield.ts` file under the `csrf` object.

### `enabled`
The `enabled` flag is used to enable or disable CSRF protection for your app.

### `exceptRoutes`
You can define an array of routes to ignore when enforcing CSRF protection.

```ts
{
  exceptRoutes: [
    '/contact-us',
    'user/:id/payment-confirmation',
  ]
}
```

### `methods`
The HTTP methods that should be protected against the CSRF attacks. You should add all the methods you use for handling form submissions.

```ts
{
  methods: ['POST', 'PUT', 'PATCH', 'DELETE']
}
```

### `enableXsrfCookie`
If you are application is rendering not forms on the frontend and hence not using the `XSRF-TOKEN` cookie, then it is recommended to turn off the cookie feature all together.

```ts
{
  enableXsrfCookie: false,
}
```

## CSRF token for SPA
The Single page applications render forms on the frontend and hence they do not have access to the `csrfField` global. However, during the Ajax calls, you can read the CSRF token from the `XSRF-TOKEN` cookie and send it back as `X-XSRF-TOKEN` header.

The cookie technique is already widely supported by frameworks like [Angular](https://angular.io/api/common/http/HttpClientXsrfModule) and also by axios.

[note]
The `XSRF-TOKEN` cookie is only accessible to the frontend, if your backend and the frontend are on the same domain.
[/note]

## CSRF token for RESTful API
If you are creating RESTful API server, then you don't need CSRF protection, unless you are relying on cookies for user authentication. If you are relying on cookies for authentication, then simply follow the instructions of [CSRF token for SPA](#csrf-token-for-spa) section.

[tip]
CSRF is an attack exists because of the nature of cookies inside the browser. If there are no cookies, then there is no CSRF attack.
[/tip]
