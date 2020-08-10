---
permalink: guides/views/partials
group: Views & Templates
---

# Partials
Partials are the re-usable chunks of markup that you can include inside any template. Technically, there isn't anything different about partials, its just a layer for better code organization.

For demonstration, lets create a partial for the website header. Begin by executing the following ace command.

```sh
node ace make:view partials/header

# ✔  create    resources/views/partials/header.edge
```

Open the newly created file and paste the following code snippet inside it.

```edge{}{resources/views/partials/header.edge}
<header>
  <nav>
    <div>
      <a href=""> AdonisJS </a>
    </div>
    <ul>
      <li><a href="/"> Home </a></li>
      <li><a href="/about"> About </a></li>
      <li><a href="/contact"> Contact </a></li>
    </ul>
  </nav>
</header>
```

Now, create another template and include the header inside it using the `@include` tag.

```edge{6}{resources/views/index.edge}
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
  @include('partials/header')

  <main>
    <p> Content comes here </p>
  </main>
</body>
</html>
```

The contents of the `header` template will be copied to the parent template. 

## Dynamic Includes
The `@include` tag also works with dynamic values evaluated at runtime. For example:

```edge
<body>
  @include(`${user.theme.name}/partials/header`)
</body>
```

## Conditional Includes
Quite often you will find yourself wrapping partials inside conditional statements. For example: Include the partial to show comments, only if post has comments.

```edge
@if(post.comments)
  @include('comments/list')
@endif
```

Using the `includeIf` tag, you can shorten the above code snippet to a single line.

```edge
@includeIf(post.comments, 'comments/list')
```
