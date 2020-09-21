---
permalink: guides/views/introduction
group: Views & Templates
---

# Introduction
AdonisJS uses [Edge](/packages/edge) as its template engine. It is a fully featured template engine written for the modern day. It has out of the box support for:

- Conditionals and loops
- Components, layouts and partials
- Runtime debugging using Chrome DevTools
- Stack traces that points to the original filename and the line number
- Extensible API to add your own custom Edge tags

## Setup
Edge comes pre-installed with the **Web Application** project structure created using the `create-adonis-ts-app` binary. However, installing it separately is also pretty straight forward.

Open the `.adonisrc.json` file to check if it is installed and registered under the providers array or not.

```json{4}{.adonisrc.json}
"providers": [
  "@adonisjs/core",
  "@adonisjs/session",
  "@adonisjs/view"
]
```

If not, then follow the below instructions to install it from the npm package registry.

[codegroup]

```sh{}{npm}
npm i @adonisjs/view
```

```sh{}{yarn}
yarn add @adonisjs/view
```

[/codegroup]

Once installed, run the following ace command to setup the package.

```sh
node ace invoke @adonisjs/view

#    update    .adonisrc.json
# ✔  create    ace-manifest.json
```

## Usage
Lets begin by creating a route that renders a given template file.

```ts{}{start/routes.ts}
Route.get('/', async ({ view }) => {
  return view.render('home')
})
```

Next step is to create the `home.edge` template. Template lives inside the `resources/views` directory of your project root. You can manually create a file inside this folder, or use the following ace command to create one.

```sh
node ace make:view home

# ✔  create    resources/views/home.edge
```

Let's open the newly created file and paste the following code snippet inside it.

```edge{}{resources/views/home.edge}
<p> Hello world. You are viewing the {{ request.url() }} page </p>
```

Make sure to start the development server by running `node ace serve --watch` and visit [http://localhost:3333](http://localhost:3333) to view the contents of the template file.

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1583063256/adonisjs.com/view-usage.png)

### How it works?
- Every route handler receives an instance of `view` that is used to render template files.
- The `view.render` method accepts a relative path from the `resources/views` directory.
- During the `view.render` call, you can pass the template state/data as 2nd argument.
  ```ts
  view.render('home', { greeting: 'Hello world' })
  ```

## Syntax Guide
Before learning about the features of Edge, it is very important to understand the Edge syntax at the fundamental level, since everything else is layers on top of these fundamentals.

There are basically two distinct ways of writing Javascript or logic inside your templates.

### The Curly Braces
The curly braces (or mustache braces) are commonly used across many different template engines. Edge also uses the same syntax for interpolation.

```edge
{{ username }}
{{ username.toUpperCase() }}

{{ users[0].username }}
{{ users.length ? users[0].username : 'Guest' }}

{{-- Multiline --}}
{{
  users.map((user) => {
    return user.username
  }).join(',')
}}
```

### The Edge tags
A fully featured template engine needs many more features than just outputting Javascript expressions. For example: Including partials, writing conditionals and so on. These features are added using the **tags API** of Edge.

The following is the `include` tag for including partials.
```edge
@include('header')
```

The following is an `each` tag for iterating for an array of items. However, the each tag accepts additional markup inside the opening and closing expressions.

```edge
@each(user in users)
  - {{ user.username }}
@endeach
```
<!-- not found creating-custom-tags page -->
Similarly, there are many more tags to enrich the templating experience. The great thing is, Edge also [exposes the API](creating-custom-tags) for creating your own tags.

### Comments
Finally, you can also write comments inside your templates.

```edge
{{-- A block level comment --}}

{{--
  A multiline comment
--}}

Hello {{-- inline comment --}} everyone!
```

Most of the times, you will be generating HTML from your edge templates, so using the standard HTML comments is also fine. However, the Edge comments becomes helpful, when you are using them inside a language that doesn't have comments, like **JSON** or **Markdown**.

```edge
{
  {{-- The main account username --}}
  "username": "{{ username }}"
}
```

Output

```json
{
  "username": "virk"
}
```
