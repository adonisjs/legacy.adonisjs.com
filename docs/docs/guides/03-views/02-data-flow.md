---
permalink: guides/views/data-flow
group: Views & Templates
---

# Data Flow
You can pass data to templates at different stages and each stage defines the scope at which the data will be accessible inside the templates. By the end this guide, you will know:

- Different API's to pass data to a template
- The scope of data at which it is accessible to the templates

## Template State
The most common way to pass data to a template is during the `view.render` call. This data object is known as the `state` of the template.

[codegroup]

```ts{}{Rendering View}
Route.get('users/:id', async ({ view }) => {
  // highlight-start
  const state = {
    user: {
      id: 1,
      username: 'virk',
    }
  }
  
  return view.render('users/show', state)
  // highlight-end
})
```

```ts{}{Template}
<p> Hello {{ user.username }} </p>
```

[/codegroup]

The state of the template is shared among the `partials` and the `layout`, but not with the `components`, since components have their own state.

## Global State
Templates also have a global state, which is shared among all the templates and even the components. This is a great place to store the helper methods or some configuration.

### Defining globals
The globals must be defined only once. So keeping them inside a provider is a great option. Open `providers/AppProvider.ts` file and paste the following code snippet inside it.

```ts
import { IocContract } from '@adonisjs/fold'

export default class AppProvider {
  constructor (protected $container: IocContract) {
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

Now, you can access the `timestamp` method inside your templates.

```edge
<p> The current timestamp is {{ timestamp() }} </p>
```

## Shared State
Finally, the templates can also have shared state. The shared state is similar to the globals, but it is specific to a single instance of a view. The shared state is helpful, when you want to have globals, but isolated between HTTP requests.

For example: The `request` and `auth` variables added by AdonisJS are also part of the shared state.

[codegroup]

```ts{}{Sharing data}
Route.get('/', async ({ view, request }) => {
  view.share({ locale: request.language(['en', 'fr', 'it']) })

  return view.render('/')
})
```

```ts{}{Rendering View}
<p> The current request locale is {{ locale }} </p>
```

[/codegroup]

The above example uses a Route for simpler explaination. However, you can `share` data from middleware as well and it will be isolated among multiple HTTP requests.
