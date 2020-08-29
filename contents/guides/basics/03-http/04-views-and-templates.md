---
permalink: guides/http/views-and-templates
category: Handling HTTP Requests
group: Basics
---

# Views and Templates

AdonisJS comes with an official templating library to create server rendered apps. The template engine **(Edge)** offers a convenient way to generate dynamic HTML using runtime data and also write logic within your views.

By the end of this guide, you will know:

1. How to setup the template engine?
2. How the templating syntax works.
3. Using partials and components to create reusable HTML fragments.
4. Using Presenters to encapsulate templates logic for better testing experience.

## Setup
The default application created using `npx` or `yarn create` is pre-configured to use views and templates. Open `.adonisrc.json` file and check if `@adonisjs/view` is registered under the providers array or not.

```json
{
  "providers": [
    "@adonisjs/core",
    "@adonisjs/view"
  ]
}
```

If not, then follow the upcoming steps to install the package and invoke post install instructions to set it up.

### Install the Package
Install the `@adonisjs/view` package from npm registry using the following command.

[codegroup]

```sh{}{npm}
npm i @adonisjs/view
```

```sh{}{yarn}
yarn add @adonisjs/view
```

[/codegroup]

### Invoke Generator
AdonisJS packages can configure themselves by running the post install instructions. Run the following command to setup `@adonisjs/view` package.

```sh
node ace invoke @adonisjs/view
```

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1582276116/adonisjs.com/invoke-ace.png)

## Working with Views
The views are stored inside `resources/views` directory with files ending in `.edge` extension. The edge syntax can be written along with any other markup language like HTML, Markdown, XML and so on. However, we will be using HTML throughout this guide.

Let's start by creating a view to render a list of posts on the blog homepage.

```sh
node ace make:view posts/index
# ✔  create    resources/views/posts/index.edge
```

The `make:view` command creates an empty view file. You can start writing HTML inside it and render it to the browser using `view.render` method.

[codegroup]

```ts{}{Route}
Route.get('/posts', async ({ view }) => {
  return view.render('posts/index')
})
```

```html{}{posts/index.edge}
<h2> Hello world </h2>
```

[/codegroup]

[note]
Make sure to start the HTTP server using `node ace serve --watch` command.
[/note]

If you visit [http://localhost:3333/posts](http://localhost:3333/posts), you will be greeted with `Hello world`.

## Passing data to the views
You can pass data from your route handlers to the views during `view.render` method call, as shown below.

[codegroup]

```ts{}{Route}
import Route from '@ioc:Adonis/Core/Route'

Route.get('/posts', async ({ view }) => {
  const posts = [
    {
      id: 1,
      title: 'Getting Started with AdonisJS',
      body: '',
    },
    {
      id: 2,
      title: 'Covering Basics of Lucid ORM',
      body: '',
    },
    {
      id: 3,
      title: 'Understanding Build Process',
      body: '',
    }
  ]

  return view.render('posts/index', { posts })
})
```

```edge{}{Template}
@each(post in posts)
  <div>
    <h2><a href="">{{ post.title }}</a></h2>
  </div>
@endeach
```

[/codegroup]

If you visit the registered route `/posts`, you must see the following output on the browser screen.

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1582279633/adonisjs.com/view-render-static-posts_dsd1hk.png)

#### What just happened?
1. The route handler renders the `posts/index.edge` template and passes along an array of `posts` to it.
2. There is no need to type the `.edge` extension when using `view.render` method.
3. The template loops over the array of posts using the `@each` tag. The `@each` tag is part of the Edge templating syntax.

As you can see, Edge syntax doesn't interfere with your HTML. You can use all of your creativity to create beautiful looking webpages with dynamic data inside them. Infact, Edge gives you all the necessary tooling to structure and re-use your HTML using **Layouts**, **Partials** and **Components**.

## Using Layouts
As the name suggests, the layouts let you define the overall structure of a web page with placeholders to replace markup that is different for every single page.

Continuing with the blog posts listing page, let's create a master layout for our blog.

```sh
node ace make:view layouts/master

# Output
# ✔  create    resources/views/layouts/master.edge
```

Open the newly created file `(resources/views/layouts/master.edge)` and paste the following contents inside it.

```edge
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title> AdonisJS Blog </title>
</head>
<body>
  <section>

    <!-- HEADER -->
    <header>
      <div>
        <a href="/posts">
          AdonisJS Blog
        </a>
      </div>

      <navbar>
        <a href=""> Home </a>
        <a href=""> Archives </a>
      </navbar>
    </header>

  </section>

  <section>
    <!-- ANY TEMPLATE CAN INJECT CONTENT HERE 👇 -->
    @section('main')
    @endsection
  </section>

</body>
</html>
```

Along with the standard HTML markup, there is also a `@section` block. The sections are placeholders with unique names in which other templates can inject content.

Let's open the `resources/views/posts/index.edge` file and make it use the `master` layout.

```edge
@layout('layouts/master')

@section('main')
  <main>
    @each(post in posts)
      <article>
        <h2>
          <a href="/"> {{ post.title }} </a>
        </h2>
      </article>
    @endeach
  </main>
@endsection
```

If you re-visit the `/posts` URL, you must see the following output on the browser screen.

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1582373292/adonisjs.com/view-layouts_jllnte.png)

#### How does layout and sections work?
- The `@layout` tag takes the path to the layout file. The path is relative from the `views` directory.
- The `@section` tag inside the layout defines a named placeholder. All section names has to be unique.
- Template using a layout uses the same `@section` name to define the content for that given section.

## Using Partials
Partials are one of the best ways to have fragments of re-usable markup. The great thing about partials is, they have access to all the data from the parent template and hence no extra work needs to be done when creating partials.

### When to use partials?
Partials have no technical advantage over keeping all the markup inside a single file. However, they do help in organizing the code in a better way, as you can keep dedicated pieces of markup in their own files over having a single giant HTML file.

### Extract header to it's own partial
Continuing with the blog example. Let's move the `<header>` tag to it's own partial and include it inside the `master` layout.

```sh
node ace make:view partials/header

# Output
# ✔  create    resources/views/partials/header.edge
```

Open the `resources/views/partials/header.edge` and paste the following contents inside it.

```edge
<header>
  <div>
    <a href="/posts">
      AdonisJS Blog
    </a>
  </div>

  <navbar>
    <a href=""> Home </a>
    <a href=""> Archives </a>
  </navbar>
</header>
```

Finally, edit the `resources/views/layouts/master.edge` and make it include the header partial.

```edge
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title> AdonisJS Blog </title>
</head>
<body>
  <section>

    <!-- HEADER  👇 -->
    @include('partials/header')

  </section>

  <section>
    <!-- ANY VIEW CAN INJECT CONTENT HERE 👇 -->
    @section('main')
    @endsection
  </section>

</body>
</html>
```

#### How does partials work?
- The `@include` tag accepts only a single argument, the path of the template to include.
- All the state of the parent template is shared with the partial.

## Using Components
Components are just like partials, but with their own state. Since partials share the state of the parent template, they are limited to the use cases they can serve. On the other hand, components can accept data and have isolated state of their own.

### Using Components to Create a Form
Let's create a signup form using components. Assuming that you are now familiar with the ace commands and `view.render` method, we will do the initial setup without explaining every step.

1. Create `button` and `input` components.
  ```sh
  node ace make:view components/button
  node ace make:view components/input
  ```

2. Create a parent template to show the signup form.
  ```sh
  node ace make:view signup
  ```

3. Render the view from the signup route `(start/routes.ts)`.
  ```ts
  Route.get('/signup', async ({ view }) => {
    return view.render('signup')
  })
  ```

4. Add markup to `components/button.edge` file.
  ```edge
  <button type="{{ type }}"> {{ text }} </button>
  ```

5. Add markup to `components/input.edge` file.
  ```edge
  <div>
    <label for="{{ name }}">{{ text }}</label>
    <input type="{{ type }}" name="{{ name }}" />
  </div>
  ```

6. Finally use the `@component` tag to include the components inside the signup form.
  ```edge
  <form action="">
    @!component('components/input', {
      name: 'username',
      text: 'Enter username',
      type: 'input'
    })

    @!component('components/input', {
      name: 'password',
      text: 'Enter password',
      type: 'password'
    })

    @!component('components/button', {
      text: 'Signup',
      type: 'submit'
    })
  </form>
  ```

If you visit [http://localhost:3333/signup](http://localhost:3333/signup), you must a form similar to the following screenshot.

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1582374471/adonisjs.com/edge-components-form_ckmhhd.png)

#### How does components work?
- The `@component` tag accepts path to a given template, similar to the `@include` tag. But it also accepts an object of values called the component state.
- Components do not have access to the parent template state, except the globals created using `view.global` or `view.share`. We will talk about globals shortly.

## Conditionals and Loops
Templates won't be fun, if you cannot conditionally render HTML or loop over an array or object. Let's start with conditionals.

### Conditionals

Just like JavaScript, you can write `if`, `elseif` and `else` statements in Edge using the dedicated conditional tags.

```edge
@if(username)
  <h1> Hello {{ username }}! </h1>
@else
  <h1> Hello Guest! </h1>
@endif
```

Using `elseif`


```edge
@if(user.role === 'admin')
  <h1> You can delete users </h1>
@elseif (user.role === 'staff')
  <h1> You can view users </h1>
@else
  <h1> You can view only your own profile </h1>
@endif
```

[tip]

  Important thing to note. The `@elseif` and `@else` are always inside the `@endif` tag.

[/tip]

As you can experience, the syntax of conditionals is very close to JavaScript. Infact, one of the goals of Edge is to stay closer to the JavaScript syntax for smaller learning curve.

Edge also has `@unless` tag, which is opossite of `@if` tag. Sometimes writing `unless` feels more natural than writing a `negative if`.

```edge
<!-- Show the login button unless user property exists -->
@unless(user)
  <a href="/login"> Login </a>
@endunless
```

### Loops
The `@each` tag of Edge allows you to loop over `Arrays` and `Objects` both.

```edge
<!-- Setting users array inline. This can come from controller too -->
@set('users', [
  {
    username: 'virk'
  },
  {
    username: 'romain',
  },
  {
    username: 'tobi'
  }
])

@each(user in users)
  <li>{{ user.username }}</li>
@endeach
```

Loop over object

```edge
@set('food', {
  'ketchup': '5 tbsp',
  'mustard': '1 tbsp',
  'pickle': '0 tbsp'
})

@each((amount, ingredient) in food)
  <li>Use {{ amount }} of {{ ingredient }}</li>
@endeach
```

## What's next?
We have just scratched the surface with templates and there is more to learn. We recommend reading the following guides for better understanding.

- [In-depth guide on view components](/guides/views/components)
- [Views API](/guides/views/api)
- [View tags](/guides/views/tags)
- [View globals](/guides/views/globals)
