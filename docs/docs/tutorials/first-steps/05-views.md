---
permalink: tutorials/first-steps/views
category: First Steps
group: Tutorials
author: Chimezie Enyinnaya
---

# Views

AdonisJS makes use of Edge as its templating engine. Edge makes use of mustache like syntax `{{ }}` for string interpolation. You can write almost all JavaScript expressions inside Edge templates. All views are stored inside the `resources/views` directory and each view file must have the `.edge` extension.

Edge supports:

- Layouts
- Partials
- Components
- Tags
- Globals

## Public assets

By default, all public assets such as CSS, JavaScript and images resides inside the `public` in the application root and can be access directly by visiting the file URL. For example: `[http://domain.com/images/logo.png](http://domain.com/images/logo.png)`. Also, serving static files are disabled by default. So we need to first enable it if we want to serve static files in our application. All static file configurations are stored inside `config/static.ts`. So we can enable serving static files by setting `enabled` to `true`:

```ts
// config/static.ts

enabled: true,
```

While in most cases we would want to stick to serving static files from the `public` directory, we can override the default path inside `.adonisrc.json` file by adding a new `directories` object:

```json
// .adonisrc.json

"directories": {
  "public": "./assets"
}
```

Here we set the public path to be `assets`. Next, we need to update the public path inside the `metaFiles` array from `"public/**``"` to `"assets/**"`:

```json
// .adonisrc.json

"metaFiles": [
  "assets/**"
]
```

For the purpose of this tutorial, we’ll stick to serving static files from the `public` directory. Let’s create the `public` directory:

```bash
mkdir public
```

Then create a `css` directory that will contain a `style.css` file:

```bash
mkdir public/css
touch public/css/style.css
```

Then paste the following code in the newly created CSS file:

```css
// public/css/style.css

html {
  background-color: #ebebeb;
}
```

Now, this file can be accessed through [http://127.0.0.1:3333/css/style.css](http://127.0.0.1:3333/css/style.css). Notice, we didn’t include `public` in the path? This is because all public assets/files are relative to the `public` directory.

## Creating a layout

Typically, we would want to have a kind master HTML layout, which other pages can extend instead of having to repeat the same HTML boilerplate across all pages. Luckily for us, Edge has support for layouts. We are going to create a master layout for our application:

```bash
node ace make:view layouts/app
```

This will create a new `app.edge` file inside a `layouts` directory with the `views` directory. Open the newly created file and paste the following code in it:

```html
<!-- resources/views/layouts/app.edge -->

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tasks</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
    <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
  </head>
  <body>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-8 is-offset-2">
            @!section('content')
          </div>
        </div>
      </div>
    </section>
  </body>
</html>
```

Here, we have a simple HTML layout, which all our application pages will use. In addition to using Bulma CSS for styling, we also pull in the CSS we created earlier. To display the content of the page extending the layout, we make use of Edge’s `section` tag and give it a name of `content` (we can call it whatever we want). `@!section('content')` will be replaced by the page’s actual content.

**Creating a child view**
Now, let’s extend the layout we just created. For simplicity our task list application will have just one view called `index.edge`. Every view specific stuff will be done within this view file. We are going to place this view within a `tasks` directory:

```bash
node ace make:view tasks/index
```

Open the newly created file and paste the following code in it:

```html
<!-- resources/views/tasks/index.edge  -->

@layout('layouts.app')

@section('content')
  <!-- page content goes here -->
@endsection
```

To extend a layout, we make use of the `layout` tag, passing to it the relative path (we can use either `/` or `.` as path delimiter) to the layout view. Next, of the actual content, again we make use of the `section` tag. Notice we are using the same name (`content`) as in the layout view.
