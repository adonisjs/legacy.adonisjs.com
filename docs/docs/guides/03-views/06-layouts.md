---
permalink: guides/views/layouts
group: Views & Templates
---

# Layouts
The layouts allows you to define the common markup of a web page inside its own file and then other templates can re-use that markup by just replacing the certain sections. In this, you will learn:

- How layouts work in Edge
- Using sections to inject content inside a layout
- Known limitations and using components as an alternative

## Creating a Layout
Layouts are the standard Edge template files, but written with the purpose to be extended by the other templates. For demonstration, lets create a layout to hold the markup for a blog.

```sh
node ace make:view layouts/blog
# ✔  create    resources/views/layouts/blog.edge
```

Now, open the newly created file and paste the following contents inside it.

```edge{}{resources/views/layouts/blog.edge}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
</head>
<body>
  <header>
    <nav>
      <div>
        <a href=""> Adonis Blog </a>
      </div>
      <ul>
        <li><a> Home </a></li>
        <li><a> Posts </a></li>
      </ul>
    </nav>
  </header>

  <main>
    // highlight-start
    @section('content')
    @endsection
    // highlight-end
  </main>
</body>
</html>
```

Next, create a new template file that will use the above layout and defines its own content.

```sh
node ace make:view posts/list

# ✔  create    resources/views/posts/list.edge
```

```edge{}{resources/views/posts/list.edge}
@layout('layouts/blog')

@section('content')
  <p> Here comes the list of posts </p>
@endsection
```

Finally, render the `posts/index.edge` template.

```ts
Route.on('/').render('posts', { title: 'AdonisJS Blog' })
```

Now, if you visit [http://localhost:3333](http://localhost:3333), you must see the content being injected at the right place.

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1585622864/adonisjs.com/layout.png)

### How it works?
- The `layout/blog.edge` template is created with a purpose to be used as a layout and hence it defines `@section` that other template can inject content into.
- Also, it relies on the `title` variable to set the page title.
- The parent template (one using the layout) can  inject the content by using the  `@section` tag with the same name.
- The `@layout` always have to be at the first line in the parent template, otherwise  the layout is ignored.

## Defining sections
Sections allows you to define areas in your layout that can be overwritten by the parent templates. You can create as many sections as you want, just make sure they all have unique names for a given layout.

```edge{}{Layout}
<div class="content">
  <aside>
    @section('sidebar')
    @endsection
  </aside>

  <main>
    @section('content')
    @endsection
  </main>
</div>
```

Most of the times, the sections inside the layouts are empty. So instead of writing `@endsection`, you can self close a tag by prefixing it with a `bang (!)` character.

```edge{3,7}
<div class="content">
  <aside>
    @!section('sidebar')
  </aside>

  <main>
    @!section('content')
  </main>
</div>
```

## Inheriting Sections Content
The default behavior of sections is to overwrite the contents of a section defined inside a layout. For example:

The master template defines a `scripts` section that has a list of default scripts.

```edge{}{master.edge}
@section('scripts')
  <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine/dist/alpine-ie11.min.js"></script>
  <script src="/app.js"></script>
@endsection
```

The parent template re-defines the `scripts` section with the intention to append a new script.

```edge{}{index.edge}
@layout('master')

@section('scripts')
  <script src="/index.js"></script>
@endsection
```

But, as per the default behavior of sections, the first two scripts defined by the master layout have been removed.

To address this problem, Edge sections comes with an inheritance model. Just like the Javascript classes, you can use the `@super` tag to inherit the existing content of a section.

```edge{4}{index.edge}
@layout('master')

@section('scripts')
  @super
  <script src="/index.js"></script>
@endsection
```

## Limitations
The layouts and sections are only evaluated during compile time and this approach comes with its own set of limitations.

- The name of the `layout` and the `section` has to be a static string. You cannot compute these names from a Javascript expression evaluated at runtime.
- You cannot nest sections inside each other. It is not really a limitation, but instead a design choice.
- The parent template can only contain `@section` and `@set` tags. Everything else outside of sections is ignored.
