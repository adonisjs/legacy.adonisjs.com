---
permalink: guides/views/debugging
group: Views & Templates
---

# Debugging
Since templates are not written in standard programming language, they often lack the context visibility. However, with Edge, we give you enough tooling to inspect and debug templates. By the end of this guide, you will know:

- How to inspect `objects` and the `state` of the template.
- How to use Chrome DevTools for debugging the template output.

## Accurate stack traces
The first step to better debugging experience is to provide accurate stack traces. Edge does a pretty good job in pointing to the correct filename and the line number of the error.

Following are the screenshots demonstrating compile time and runtime errors.

### Compile time errors
![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1587039853/adonisjs.com/edge-compile-error.png)

### Runtime errors
![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1587040053/adonisjs.com/edge-runtime-error.png)

The stack traces works fine with components, partials and layouts too.

## Inspecting Objects
Edge also provides a helper `inspect` to inspect values within your templates. The helper is similar to `JSON.stringify`, but also pretty prints the output for better readability.

You can inspect an object as shown below.

```edge
{{ inspect({ username: 'virk', age: 28, isAdmin: true }) }}
```

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1587022522/adonisjs.com/edge-inspect.png)

You can also inspect the state of a template as shown in the following example.

```edge
{{ inspect(state) }}
```

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1587048614/adonisjs.com/componet-inspect.png)

## Using Debugger
Finally, you can also dig into the compiled output by using the `@debugger` tag. For debugging to work, you will have to use Google Chrome and its DevTools.

For demonstration, lets create a new template and paste following contents inside it.

[codegroup]

```edge{8}{View}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{ title }}</title>
</head>
<body>
  @debugger
  @if(user.username)
    <h2> Hello {{ user.username }} </h2>
  @endif
</body>
</html>
```

```ts{}{Route}
Route.on('/').render('welcome', {
  title: 'Home page',
  user: {
    username: 'virk',
  }
})
```
[/codegroup]

Now, start the HTTP server by running `node ace serve --watch` command, but also pass `--node-args="--inspect"` flag to it.

```sh
node ace serve --watch --node-args="--inspect"

# Debugger listening on ws://127.0.0.1:9229/7f98f05a-6d74-4d2a-9aa6-b69fda272a90
# For help, see: https://nodejs.org/en/docs/inspector
# [1587053678353] INFO  (hello-world/72154 on MacBook-Pro-9.local): started server on 0.0.0.0:3333
```

Finally, visit [http://localhost:3333](http://localhost:3333) inside Google Chrome and debug as shown in the following video.

[video url="https://res.cloudinary.com/adonis-js/video/upload/q_80/v1587055017/adonisjs.com/edge-debugging-chrome-540_hwebpl.mp4", controls]
