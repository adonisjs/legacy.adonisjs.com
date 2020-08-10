---
permalink: guides/views/components
group: Views & Templates
---

# Components
The term __*Components*__ is widely used in the frontend eco-system, like: the React Components, the Vue Components and so on. The Edge components are not same as the components from the frontend space, its just that Edge borrows some of the concepts from these frameworks.

## What are Edge components?
Edge components are not [Web components](https://www.webcomponents.org/introduction). There is no concept of Shadow DOM or even Virtual DOM, since the nature of server side templating is completely different from client side templating.

The components in Edge are:

- Re-usable markup/template files with their own state.
- At the time of rendering, you can pass custom data to the components.
- Using slots, you can also inject custom markup to the component structure.

## Creating a Component
Let's begin by creating a component for a modal box. We will be using [alpinejs](https://github.com/alpinejs/alpine) for interactivity and [bulma css](https://bulma.io/documentation/components/modal/) for styling the modal.

The first step is to create a component for the modal. Running the following ace command to create one.

```sh
node ace make:view components/modal

# ✔  create    resources/views/components/modal.edge
```

Open the newly created file and paste the following code snippet inside it.

```edge{}{resources/views/components/modal.edge}
<div x-data="{ open: false }">
  <span @click="open = true">
    {{{ $slots.trigger() }}}
  </span>

  <div class="modal" :class="{ 'is-active': open }">
    <div class="modal-background"></div>

    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button class="delete" aria-label="close" @click="open=false"></button>
      </header>

      <section class="modal-card-body">
        {{{ $slots.body() }}}
      </section>

      <footer class="modal-card-foot">
        {{{ $slots.actions() }}}
      </footer>
    </div>
  </div>
</div>
```

- The component accepts 4 pieces of information. It includes:
  - The `title` for the modal box
  - A slot `$slots.body` for displaying the modal content
  - A slot `$slots.actions` for display the modal actions inside the footer
  - A slot `$slots.trigger` for showing the button to open the modal box
- All HTML classes are part of bulma framework to style the modal box.
- The `x-data`, `@click` handlers are part of AlpineJs. You can replace it with any frontend library of your choice.

## Using the component
Finally, lets create a template file and a route to render the above created component.

```sh
node ace make:view index

# ✔  create    resources/views/index.edge
```

Register route

```ts{}{start/routes.ts}
Route.on('/').render('index')
```

Finally, open the `index.edge` file and paste the following code snippet inside it, to render the component.

```edge{}{resources/views/index.edge}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js" defer></script>
  </head>
  <body>
    @component('components/modal', { title: 'Terms & Conditions' })
      @slot('trigger')
        <button> Click here to view terms & conditions </button>
      @endslot
    
      @slot('body')
        <div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, metus ultrices eleif end gravida, nulla nunc varius lectus, nec rutrum justo nibh eu lectus. Ut vulputate semper dui. Fusce erat odio, sollicitudin vel erat vel, interdum mattis neque. </p>
        </div>
      @endslot
    
      @slot('actions')
        <button class="button is-success">Accept</button>
        <button class="button">Cancel</button>
      @endslot
    @endcomponent
  </body>
</html>
```

[note]
Make sure to start the development server by running `node ace serve --watch` command.
[/note]

Now, if you visit [http://localhost:3333](http://localhost:3333), you must see a working modal as shown in the following video.

[video url="https://res.cloudinary.com/adonis-js/video/upload/q_80/v1585653521/adonisjs.com/edge-modal-component_wzygvj.mp4", controls]

### How it works?

- You can render components by using the `@component` tag. It accepts the relative path to the template file, along with optional data object. The data object becomes the state of the component.
- The `@slot` tag allows you to define fragments of HTML inside the component body and then the actual component can access them from the `$slots` object.

## Slots
Slots are also part of the component state, but defined in a more succinct manner. If you were to replicate slots manually, this is how you will write them.

```edge
@component('components/modal', {
  title: 'Terms & Conditions',
  $slots: {
    body: function (prop) {
      return `<div>
        <p>
          Hello ${username}
        </p>
      </div>`
    },
  }
})
```

Well, writing HTML inside nested objects isn't fun. This is why, Edge comes with a dedicated tag to define slots in a much cleaner and approachable manner.

```edge
@set('username', 'virk')

@component('components/modal', { title: 'Terms & Conditions' })
  @slot('body')
    <div>
      <p> Hello {{ username }} </p>
    </div>
  @endslot
@endcomponent
```

The `username` is not accessible by the component, but the slots can access it.

### The main slot
Every component has a main slot, which doesn't need to be defined explicitly. In the following example, the markup within the opening and the closing statements is part of the main slot.

```edge
@component('components/modal')
  <p> This will become part of the main slot </p>
@endcomponent
```

In other words, every line of code that is not nested inside a named slot is added to the `main` slot.

### Passing data to the slots
The component can pass custom data to the slots at the time of rendering them. For example:

```edge
{{{ $slots.body({ foo: 'bar' }) }}}
```

The slot can access the object `{foo: 'bar'}` as the 2nd argument.

```edge{1}
@slot('body', slotProps)
  <div>
    <p> Hello {{ slotProps.foo }} </p>
  </div>
@endslot
```
