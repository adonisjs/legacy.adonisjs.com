---
permalink: guides/http/form-submissions
category: Handling HTTP Requests
---

# Form Submissions
AdonisJS is pre-configured to **parse** and **validate** the HTTP request body and you do not have to install any 3rd party packages for same. In fact, AdonisJS has one of the most robust bodyparser with first class support for following content types.

- `multipart/form-data`
- `application/x-www-form-urlencoded`
- `application/json`
- `application/json-patch+json`
- `application/vnd.api+json`
- `text/plain`

## Creating the Form

**AdonisJS does not interfere with your HTML and you define the forms using the standard HTML syntax**. In other words, AdonisJS doesn't have any kind of form builders doing magic behind the scenes and hence you have the complete freedom to structure the HTML the way you want.

For example, following is the HTML form to create a new blog post by accepting the **post title** and **body** from the post creator.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title> Create a new blog post </title>
</head>
<body>
  <form action="/posts" method="POST">
    <div>
      <p>
        <label for="title"> Post title </label>
      </p>
      <input type="text" name="title" />
    </div>

    <div>
      <p>
        <label for="body"> Post body </label>
      </p>
      <textarea name="body" cols="30" rows="10"></textarea>
    </div>

    <div>
      <button type="submit"> Create Post </button>
    </div>
  </form>
</body>
</html>
```

As you can notice, the entire document is vanilla HTML with no special syntax inside it. However, we can replace the hardcoded form action `/posts`  with a helper method `route`.

Assuming that the following route declarations. 

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('posts/create', 'PostsController.create')
Route.post('posts', 'PostsController.store')
```

You can get the route URL for creating a new post using its `controller.action` name.

```html
<form action="{{ route('PostsController.store') }}" method="POST">
```

#### What is the benefit of using the Route helper?

If you were to change the route URL inside the routes file, you will have to remember to change the form action as well. On the other hand, the `route` helper automates this process for you, resulting in more maintainable code base.

## Reading Form Data

The `BodyParser` middleware is responsible for reading the request body and making it available on the `request` object. So, before moving any forward, let's make sure that the middleware is registered under the list of global middleware.

Open `start/kernel.ts` file and ensure that the file has the following line of code inside it.

```ts
Server.middleware.register([
  'Adonis/Core/BodyParserMiddleware',
])
```

Once the middleware is in place, you can use one of the following request methods to read the request body.

- `request.all()` returns a merged object of the request body and the query string.
- `request.input(field)` returns the value of a given field.
- `request.only([field1, field2])` returns an object of cherry picked fields.
- `request.except([field1, field2])` is the opposite of `request.only`.

For demonstration, `console.log` the post title and the body using the `request.only` method.

```ts{9-10}
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {
  public async create ({ view }: HttpContextContract) {
    return view.render('posts/create')
  }

  public async store ({ request }: HttpContextContract) {
    const data = request.only(['title', 'body'])
    console.log(data)
    
    return 'Handled'
  }
}
```

If you visit [http://localhost:3333/posts/create](http://localhost:3333/posts/create) and submit the form, you must see the data object being logged to the console.

![](/form-submission.gif)

## Validating Form Data

AdonisJS makes it super simple and intuitive to validate the form data using [Indicative](https://indicative.adonisjs.com) (a home grown validation library). Instead of just performing the runtime validations, Indicative also returns the type information of the validated objects.

Continuing with the blog post example, following is an example of validating the post title and the body.

```ts{2,10-16}
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class PostsController {
  public async create ({ view }: HttpContextContract) {
    return view.render('posts/create')
  }

  public async store ({ request }: HttpContextContract) {
    const data = await request.validateAll(schema.new({
      title: schema.string(),
      body: schema.string(),
    }))

    console.log(data)
    return 'Post created'
  }
}
```

- The `request.validateAll()` method takes the validation schema *(aka shape)* of the data that you expect from the HTTP request.
- The schema must be created using the `schema.new` method.
- If validation fails, the validator will redirect the user back to the form along with the error messages and the form data.
- If the validation succeeds, the next line of code *(`console.log(data)` in this case)* will be executed.


### Displaying Validation Errors

The `validateAll` method uses [flash messages](/concepts/flash-messages) to set the validation errors before redirecting the user back to the form. The flash messages are made available to the views using the `flashMessages` global object.

Following is an example of displaying the error messages next to the input fields.

```html{14-16,24-26}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title> Create a new blog post </title>
</head>
<body>
  <form action="{{ route('PostsController.store') }}" method="POST">
    <div>
      <p>
        <label for="title"> Post title </label>
      </p>
      <input type="text" name="title" />
      @if(flashMessages.has('errors.title'))
        {{ flashMessages.get('errors.title') }}
      @endif
    </div>

    <div>
      <p>
        <label for="body"> Post body </label>
      </p>
      <textarea name="body" cols="30" rows="10"></textarea>
      @if(flashMessages.has('errors.body'))
        {{ flashMessages.get('errors.body') }}
      @endif
    </div>

    <div>
      <button type="submit"> Create Post </button>
    </div>
  </form>
</body>
</html>
```

If you submit the form with empty fields, you will see the validation errors next to the form inputs.

![](/form-submission-validation.gif)

### Retaining Form Input Values

Currently, after the validation failure and the redirect, the form inputs losses their old values and the user will have to fill the form again. However, you can prevent this behavior by reading the input values again from the `flashMessages` global object.

```html{13,23}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title> Create a new blog post </title>
</head>
<body>
  <form action="{{ route('PostsController.store') }}" method="POST">
    <div>
      <p>
        <label for="title"> Post title </label>
      </p>
      <input type="text" name="title" value="{{ flashMessages.get('title') || '' }}" />
      @if(flashMessages.has('errors.title'))
        {{ flashMessages.get('errors.title') }}
      @endif
    </div>

    <div>
      <p>
        <label for="body"> Post body </label>
      </p>
      <textarea name="body" cols="30" rows="10">{{ flashMessages.get('body') || '' }}</textarea>
      @if(flashMessages.has('errors.body'))
        {{ flashMessages.get('errors.body') }}
      @endif
    </div>

    <div>
      <button type="submit"> Create Post </button>
    </div>
  </form>
</body>
</html>
```

### Showing Success Message

So far you have only seen the `request.validateAll` method using the flash messages. However, you can also set custom data inside the flash messages store using `session.flash` method.

[codegroup]

```ts{9-10}
public async store ({ request, session, response }: HttpContextContract) {
  const data = await request.validateAll(schema.new({
    title: schema.string(),
    body: schema.string(),
  }))

  console.log(data)

  session.flash('success', 'Post created successfully')
  response.redirect('back')
}
```

```html{8-10}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title> Create a new blog post </title>
</head>
<body>
  @if(flashMessages.has('success'))
    <p>{{ flashMessages.get('success') }}</p>
  @endif

  <form action="{{ route('PostsController.store') }}" method="POST">
    <div>
      <p>
        <label for="title"> Post title </label>
      </p>
      <input type="text" name="title" value="{{ flashMessages.get('title') || '' }}" />
      @if(flashMessages.has('errors.title'))
        {{ flashMessages.get('errors.title') }}
      @endif
    </div>

    <div>
      <p>
        <label for="body"> Post body </label>
      </p>
      <textarea name="body" cols="30" rows="10">{{ flashMessages.get('body') || '' }}</textarea>
      @if(flashMessages.has('errors.body'))
        {{ flashMessages.get('errors.body') }}
      @endif
    </div>

    <div>
      <button type="submit"> Create Post </button>
    </div>
  </form>
</body>
</html>
```

[/codegroup]

This time if you submit the form with the post title and the body, you will see the success message being displayed after the redirect.

![](/form-submission-success.gif)

## Validations for the API Server

When creating an API server, you likely will be using Ajax or fetch for form submissions and hence displaying validation errors using **sessions or flash message is not an option** for following reasons.

- A JSON API server must always respond with JSON and not with redirects. In fact, you cannot redirect the user from an AJAX response.
- Cookies are a concept of Browsers and native apps running on Android or iOS have no inbuilt support for managing cookies.

In other words, the job of the validator must be to return the validation errors as JSON with appropriate status code (422).

AdonisJS uses [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) to decide the behavior of the `request.validateAll` method. When [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept) header is set to `application/json`, then AdonisJS will return the error messages as JSON.

![](/validator-json-errors.png)


## Next Steps

We have just scratched the surface with form validation and flash messages. We recommend you to read the dedicated guides on the following topics.

- Crash course on [Flash messages](session#flash-messages)
- [Validator deep dive](validator)
- [Sanitizing form data](sanitizor)
