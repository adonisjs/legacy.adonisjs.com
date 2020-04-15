---
permalink: guides/views/in-memory-views
group: Views & Templates
---

# In-memory Views
Edge provides a neat way to register templates directly in-memory without creating files on the disk. This is helpful, when a package author wants to distribute pre-built templates without creating templates in the main application source code.

You can register a template using `View.registerTemplate` method. For example:

```ts
import View from '@ioc:Adonis/Core/View'

View.registerTemplate('button', {
  template: `<button type="{{ type || 'submit' }}">{{ title }}</button>`,
})
```

And then use it as a component or as a partial inside your templates.

```ts
@!component('button', {
  type: 'submit',
  title: 'Create Post',
})
```

## Distributing Templates Inside a Package
As a package author you can register custom templates inside a provider `boot` method.

```ts
import { IocContract } from '@adonisjs/fold'

export default class AppProvider {
  constructor (protected $container: IocContract) {
  }

  public async boot () {
    this.$container.with(['Adonis/Core/View'], (View) => {
      // highlight-start
      View.registerTemplate('button', {
        template: `<button type="{{ type || 'submit' }}">{{ title }}</button>`,
      })
      // highlight-end
    })
  }
}
```

## Inside Application Code
It is recommended to create template files within your views folder. However, if for some reason, you decide to use in-memory templates, you can register them inside the `AppProvider` within the `providers` folder or create a preloaded file inside the `start` folder.

### Inside Provider
Open, `providers/AppProvider.ts` file and paste following code snippet inside it.

```ts{}{providers/AppProvider.ts}
import { IocContract } from '@adonisjs/fold'

export default class AppProvider {
  constructor (protected $container: IocContract) {
  }

  public async boot () {
    const View = (await import('@ioc:Adonis/Core/View')).default

    // highlight-start
    View.registerTemplate('button', {
      template: `<button type="{{ type || 'submit' }}">{{ title }}</button>`,
    })
    // highlight-end
  }
}
```

### Inside Preloaded File
Create a new file called `view.ts` inside the `start` folder and paste following code snippet inside it.

```ts{}{start/view.ts}
import View from '@ioc:Adonis/Core/View'

View.registerTemplate('button', {
  template: `<button type="{{ type || 'submit' }}">{{ title }}</button>`,
})
```

Next, you will have to add this file to the `preloads` array inside the `.adonisrc.json` file.

```json{5}{.adonisrc.json}
{
  "preloads": [
    "./start/routes",
    "./start/kernel",
    "./start/view"
  ],
}
```
