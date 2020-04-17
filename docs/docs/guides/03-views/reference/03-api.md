---
permalink: guides/views/api
group: Views & Templates
category: Reference
---

# Views API
This document covers the methods and properties available on the View module.

## `render`
The `render` method renders a given view and optionally accepts a state object. This is the method, you see yourself using most of the times.

```ts
import View from '@ioc:Adonis/Core/View'

View.render('welcome', { greeting: 'Hello world' })
```

## `mount`
The `mount` method allows you to mount directories with a unique name and then later you can render views from the mounted directory. For example:

```ts
import View from '@ioc:Adonis/Core/View'
import Application from '@ioc:Adonis/Core/Application'

View.mount('admin', Application.resourcesPath('admin/views'))
```

The above code mounts `resources/admin/views` directory under the `admin` disk name. You can render views from this directory as follows:

```edge
@component('admin::button')
```

Everything before the double colon `::` is the mounted disk name and afterwards is the relative view path.

## `unmount`
The opposite of `mount` method. This methods removes the mounted directory.

## `registerTemplate`
Method to register an in-memory templates. Make sure to also read the dedicated guide on [in memory views](/guides/views/in-memory-views)

## `registerTag`
Method to register your custom tags to the templating layer. Again, it is recommended to read the [dedicated guides](/guides/views/creating-svg-tag) for in-depth understanding.

```ts
View.registerTag({
  block: false,
  name: 'svg',
  seekable: true,
  compile () {
    // implementation goes here.
  },
})
```

## `getRenderer`
The `getRenderer` method returns an instance of the [Renderer class](https://github.com/edge-js/edge/blob/develop/src/Renderer/index.ts), which inturn can be used to render views.

The `renderer` has only two methods:

- `render`: Similar to `View.render`, but also passes the shared state of the renderer with the view.
- `share`: A method to accept shared state. You can call this method as many times as you want and values will be merged to a single object.
  ```ts
  View.getRenderer().share({}).render('')
  ```
