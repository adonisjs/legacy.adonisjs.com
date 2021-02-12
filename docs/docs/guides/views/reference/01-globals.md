---
permalink: guides/views/globals
group: Views & Templates
category: Reference
---

# Globals
Globals are the values that are shared with every single view including components. In this guide, we go through the list of globals added by AdonisJS

## `inspect`
The `inspect` helper is similar to `JSON.stringify`, but pretty prints the output. You can pass it any value that is acceptable by the `JSON.stringify` method.

[tip]
You can inspect the state of the entire view using the `state` variable. ie. `inspect(state)`.
[/tip]

```edge
{{ inspect({ username: 'virk', age: 28, isAdmin: true }) }}
```

Output

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1587022522/adonisjs.com/edge-inspect.png)

## `truncate`
Truncate a string at a given character length.

```edge
{{
  truncate(
    'This is a very long sentence that i would like to be shortened',
    18
  )
}}

<!-- Output: This is a very long... -->
```

The 18th character ends at the `lon`, but the truncate method doesn't chop off the words in between and prints the complete word `long`. If for some reason, you don't want this behavior, you can turn it off by enabling the strict mode.

[codegroup]
```edge{}{Non strict mode}
{{
  truncate(
    'This is a very long sentence that i would like to be shortened',
    18
  )
}}

<!-- Output: This is a very long... -->
```

```edge{5,9}{Strict mode}
{{
  truncate(
    'This is a very long sentence that i would like to be shortened',
    18,
    { strict: true }
  )
}}

<!-- Output: This is a very lon... -->
```
[/codegroup]

Finally, you can also define the suffix for the truncated string. By default, it is set to **three dots (...)** .

```edge
{{
  truncate(
    'This is a very long sentence that i would like to be shortened',
    18,
    { suffix: '. Read more' }
  )
}}
```

## `excerpt`
Similar to truncate, but also removes the HTML tags from the string. This is useful for defining the content of the meta tags.

```edge
<meta name="description" content="{{ excerpt(post.content, 30) }}"/>
```

## `request`
You can also access the current `request` inside a view, but only when the view is rendered within the HTTP request life-cycle using `ctx.view.render` method.

[codegroup]
```ts{}{Controller}
export default class HomeController {
  public async index ({ view }) {
    return view.render('welcome')
  }
}
```

```edge{}{View}
<p> The request url is {{ request.url() }} </p>
```
[/codegroup]

## `route`
The route helper can be used to [generate URLs](/guides/http/url-generate#generating-urls) for the registered routes.

```edge
{{ route('PostsController.store') }}

<!--
  Returns URL for the route handled by "PostsController.store" method
-->
```

The route helper method accepts a total of two arguments

- **Route identifier**: It can be the `name` of the route, `Controller.action` or the `route pattern` itself.
- **Data**: If route accepts parameters, then you can pass them inside a `params` object and for query string, you can define a `qs` object.
  ```edge
  {{
    route('PostsController.show', {
      params: { id: 1 },
      qs: request.get(),
    })
  }}
  ```

## `signedRoute`
Similar to the `route` method, but instead creates a signed route. We recommend reading more about [signed urls here](/guides/http/url-generate#generating-signed-urls).

## `application`
Reference to the AdonisJS [Application](https://github.com/adonisjs/application/blob/develop/src/Application.ts) instance. You can use it to generate paths to certain directories, get the current framework version and so on.

```edge
The current framework version is {{ app.adonisVersion.toString() }}
```

You can also access the application inside your Typescript code by importing it from the `IoC` container.

```ts
import Application from '@ioc:Adonis/Core/Application'
```

## `safe`
The output of interpolation (the code inside `curly braces`) is HTML escaped to avoid XSS attacks. However, at times you do want to render HTML without escaping and for that you can make use of three curly braces instead of two.

```edge
{{ '<p> I will be escaped </p>' }}
{{{ '<p> I will render as it is </p>' }}}
```

Another way to render HTML without escaping, is to make use of the `safe` method.

```edge
{{ safe('<p> I will render as it is </p>') }}
```

Using the `safe` method has no advantage over three curly braces. However, it becomes helpful, when you are creating your own global methods and want to render HTML from them. For example:

```ts
View.global('input', (type: string, value: string) => {
  return View.GLOBALS.safe(`<input type="${type}" value="${value || ''}" />`)
})
```

And now you can use the `input` global inside the standard double curly braces.

```edge
{{ input('text', 'foo') }}
```

## `csrfToken`
Value of the CSRF token generated for the current HTTP request.

[note]
Available only, when the `@adonisjs/shield` package is installed and CSRF protection is enabled.
[/note]

```edge
{{ csrfToken }}
```

Following are the methods to render the CSRF token inside a hidden input field or the meta tag.

```edge
{{-- Renders the input field --}}
{{ csrfField() }}

{{-- Renders the meta tag --}}
{{ csrfMeta }}
```

## Adding your own
You can add your own globals by using the `View.global` method. Since, globals needs to be registered only once, it is best to register them inside a provider or a preloaded file.

### Inside a Provider
Open the `providers/AppProvider.ts` file and replace its content with the following snippet

[note]
The `import` statement is inside the `boot` method. This is required because, when the provider file is loaded
by AdonisJS, at that time the `View` is not registered and hence top level imports will not work.
[/note]

```ts{}{providers/AppProvider.ts}
import { IocContract } from '@adonisjs/fold'

export default class AppProvider {
  constructor (protected container: IocContract) {
  }

  public async boot () {
    const View = (await import('@ioc:Adonis/Core/View')).default
    // highlight-start
    View.global('timestamp', () => {
      return new Date().getTime()
    })
    // highlight-end
  }
}
```

### Inside preloaded file
If `Provider` approach seems complicated, then you can simply create a preloaded file inside the `start` folder. Run the following command to create one.

```sh
node ace make:prldfile viewGlobals
```

Open the newly created file and paste the following code snippet inside it.

```ts{}{start/viewGlobals.ts}
import View from '@ioc:Adonis/Core/View'

View.global('timestamp', () => {
  return new Date().getTime()
})
```
