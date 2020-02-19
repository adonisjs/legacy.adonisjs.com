---
permalink: guides/http/views-and-templates
category: Handling HTTP Requests
---

# Views and Templates

AdonisJS comes with an official templating library to create server rendered apps. The template engine **(Edge)** offers a convenient way to generate dynamic HTML using runtime data and writing logic with in your views.

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
    "@adonisjs/bodyparser",
    "@adonisjs/view"
  ]
}
```

If not, then follow the upcoming steps to install the package and invoke post install instructions to set it up.

### Install the Package
Install the `@adonisjs/view` package from npm registry using the following command.

[codegroup]

```sh
npm i @adonisjs/view
```

```sh
yarn add @adonisjs/view
```

[/codegroup]

### Invoke Generator
AdonisJS packages can configure themselves by running the post install instructions. Run the following command to setup `@adonisjs/view` package.

```sh
node ace invoke @adonisjs/view
```

Output

![](/node-ace-invoke-view.png)

## Working with Views
The views are stored inside `resources/views` directory with files ending in `.edge` extension. The edge syntax can be written along with any other markup language like HTML, Markdown, XML and so on. However, we will be using HTML throughout this document.

Let's start by creating a view to render a list of posts on the blog homepage.

```sh
node ace make:view posts/index
```

Output 

![](/node-ace-make-view.png)

The `make:view` command creates an empty file at the right location. You can start writing HTML inside it and render it on the browser using `view.render` method.

[codegroup]

```ts
Route.get('/posts', async ({ view }) => {
  return view.render('posts/index')
})
```

```html
<h2> Hello world </h2>
```

[/codegroup]

[note]

  Make sure to start the HTTP server using `node ace serve --watch` command.

[/note]

If you visit [http://localhost:3333/posts](http://localhost:3333/posts), you will be greeted with `Hello world`.

## Passing data to the views
The goal of Edge is to allow composing documents using **runtime data**, **conditionals** and **loops**. The data must always be passed as an object of values when calling `view.render` method. For example:

[codegroup]

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('/posts', 'PostsController.index')
```


```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {
  public async index ({ view }: HttpContextContract) {
    /**
     * Static list of posts
     */
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

    /**
     * Render the view and return HTML
     */
    return view.render('posts/index', { posts })
  }
}
```

```html
@each(post in posts)
  <div>
    <h2><a href="">{{ post.title }}</a></h2>
  </div>
@endeach
```

[/codegroup]

If you visit the registered route `/posts`, you must see the following output on the browser screen.

![](/view-render-static-posts.png)

#### What just happened?
1. The `/posts` route is handled by the `PostsController`.
2. The controller's `index` method renders the `posts/index.edge` view and pass along an array of `posts` to it.
3. Since, all Edge templates always ends with `.edge` extension, you don't have to type the extension when calling `view.render` method.
4. We loop over the posts array using the edge `@each` tag and spit out an h2 with an anchor tag for each post.

As you can see that the Edge syntax doesn't interfere with HTML, you can use all of your creativity to create beautiful looking webpages with dynamic data inside them. Infact, Edge gives you all the necessary tooling to structure and re-use your HTML using **Layouts**, **Partials** and **Components**.

## Using Layouts
As the name suggests, the layouts let you define the overall structure of a web page with placeholders to replace markup that is different for every single page.

Continuing with the blog posts listing page, let's create a master layout that can be used across the website.

```sh
node ace make:view layouts/master

# Output
# ✔  create    resources/views/layouts/master.edge
```

Open the newly created file `(resources/views/layouts/master.edge)` and paste the following contents inside it.

```html
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
    <!-- ANY VIEW CAN INJECT CONTENT HERE 👇 -->
    @section('main')
    @endsection
  </section>

</body>
</html>
```

Along with the standard HTML markup, we are also using the `@section` tag. The sections are the named placeholders in which other views can inject their content.

Let's open the `resources/views/posts/index.edge` and make it use the `master` layout.

```html
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

![](/view-layouts.png)

#### How does layout and sections work?
- The `@layout` tag takes the path to the layout file. The path is relative from the `views` directory.
- The `@section` tag inside the layout defines a named placeholder. All section names has to be unique.
- Template using a layout uses the same `@section` name to define the content for that given section.

## Using Partials
Partials are one of the best ways to have fragments of re-usable markup. The great thing about partials is, they have access to all the data from the parent template and hence no extra work needs to be done when creating partials.

### When to use partials?
Partials have no technical advantage over keeping all the markup inside a single file. However, they do help in organizing the code in a better way, as you can keep dedicated pieces of markup in their own files over having a giant HTML file.

### Extract header to it's own partial
Continuing with the blog example. Let's move the `<header>` tag to it's own partial and include it inside the `master` layout.

```sh
node ace make:view partials/header

# Output
# ✔  create    resources/views/partials/header.edge
```

Open the `resources/views/partials/header.edge` and paste the following contents inside it.

```html
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

```html
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
Components are like partials, but with their own state. Since partials share the state of the parent template, they are limited to the use cases they can serve. For example:

You want to create a **button partial**, but with the ability to change it's class names and text on every usage.

**partials/button.edge**

```html
<button class="button {{ type }}">{{ text }}</button>
```

The parent template has no way to pass dynamic `type` and `text` to this partial. One thing you can do is update the state of the parent template just before including the partial.


```html
@set('type', 'primary')
@set('text', 'Submit Form')
@include('partials/button')

<!-- Update state and then include the partial again -->
@set('type', 'secondary')
@set('text', 'Cancel')
@include('partials/button')
```

Even though the above example works, it looks more like a hack than a feature. Components are meant to solve exactly this problem by accepting parameters from the parent template.

### Using Components to Create a Form
Let's create a signup form using components. Assuming that you are now familiar with the ace commands and `view.render` method, we will do the initial setup without explaining every step.

[div class="steps"]

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
  ```html
  <button type="{{ type }}"> {{ text }} </button>
  ```

5. Add markup to `components/input.edge` file.
  ```html
  <div>
    <label for="{{ name }}">{{ text }}</label>
    <input type="{{ type }}" name="{{ name }}" />
  </div>
  ```

6. Finally use the components to create the signup form.
  ```html
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

[/div]

If you visit [http://localhost:3333/signup](http://localhost:3333/signup), you must a form similar to the following screenshot.

![](/edge-components-form.png)

#### How does components work?
- The `@component` tag accepts path to a given template, similar to the `@include` tag. But it also accepts an object of values called the component state.
- Components do not have access to the parent template state, except the globals created using `view.global` or `view.share`. We will talk about globals shortly.

## Conditionals and Loops
Templates won't be fun, if you cannot conditionally render HTML or loop over an array or object. Let's start with conditionals.

### Conditionals

Just like Javascript, you can write `if`, `elseif` and `else` statements in Edge using the dedicated conditional tags.

```html
@if(username)
  <h1> Hello {{ username }}! </h1>
@else
  <h1> Hello Guest! </h1>
@endif
```

Using `elseif`


```html
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

As you can experience, the syntax of conditionals is very close to Javascript. Infact, one of the goals of Edge is to stay closer to the Javascript syntax for smaller learning curve.

Edge also has `@unless` tag, which is opossite of `@if` tag. Sometimes writing `unless` feels more natural than writing a `negative if`.

```html
<!-- Show the login button unless user property exists -->
@unless(user)
  <a href="/login"> Login </a>
@endunless
```

### Loops
The `@each` tag of Edge allows you to loop over `Arrays` and `Objects` both.

```html
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

```html
@set('food', {
  'ketchup': '5 tbsp',
  'mustard': '1 tbsp',
  'pickle': '0 tbsp'
})

@each((amount, ingredient) in food)
  <li>Use {{ amount }} of {{ ingredient }}</li>
@endeach
```

Following is the output of the above template.

![](/edge-loop-objects.png)

## What's next?
We have just sratched the surface with templates and there is more to learn. We recommend reading the following guides for better understanding.

- [In-depth guide on view components](components-in-depth)
- [Views API](/api/views)
- [Templates API](/api/templates)
- [View tags](/api/view-tags)
- [View globals](/api/view-globals)
