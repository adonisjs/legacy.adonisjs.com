---
permalink: guides/views/interpolation-and-conditionals
group: Views & Templates
---

# Interpolation & Conditionals
Just like any other template engine, Edge also has support for interpolation and conditionals. By the end of this guide, you will know:

- How to write JavaScript expressions
- How to use conditionals inside your templates
- The difference between mustache and safe mustache braces

## Interpolation
Interpolation allows you to write JavaScript expressions within your HTML markup. In Edge, the expressions are inclosed within the mustache braces `{{ }}`. For example:

```edge
<p>
  Welcome {{ user }}
</p>

<p>
  The total is {{ 2 + 2 }}
</p>
```

You are not only limited to simple variable reference or arithmetic operations. Infact, you can use any valid [JavaScript expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) inside the mustache braces.

[codegroup]
```edge{}{Array.Map}
  <ul> {{{
    users.map((user) => `<li> ${user.name} </li>`)
  }}} </ul>
```

```edge{}{Function calls}
  <p> Hello {{ username.toUpperCase() }} </p>
```

```edge{}{Inline Arrays}
  @each(user in ['virk', 'romain'])
    {{ user }}
  @endeach
```
[/codegroup]

### The Safe Mustache
The output of expressions inside the mustache braces is HTML escaped to prevent XSS attacks.

If we were not to escape the output, then the following expression inside the curly braces would have been successful to trigger an alert.

```edge
<p> {{ '<script>alert("Your are hacked")</script>' }} </p>
```

The escaping is a great way to protect against the user input. However, there are many scanerios, in which you want to render the HTML and you can do that by using the triple curly brace.

The triple curly brace is an explicit way to trusted the input.

```edge
<p> {{{ 'I trust this <strong>input</strong>' }}} </p>
```

## Conditionals
Edge also has support for writing conditionals.

```edge
@if(username)
  <p> Hello {{ username }}! </p>
@else
  <p> Hello Guest </p>
@endif
```

The `else if` tag

```edge
@if(user.role === 'admin')
  <a href="/posts/1/edit"> Edit Post </a>
  <a href="/posts/1/delete"> Delete Post </a>
@elseif (user.role === 'moderator')
  <a href="/posts/1/edit"> Edit Post </a>
@endif
```

You can also use the `unless` tag for writing conditionals. The `unless` is the opposite of `if` and at times it feels more natural than writing a negative if.

```edge
@unless(auth.user)
  <a href="/login"> Login </a>
@endunless
```

## Ignoring Interpolation
The syntax for interpolation `{{ }}` is majorily same across different frameworks and at times it can cause unwanted conflicts. For example: 

You want to use Vue.js along with your server render templates. The syntax for interpolation in Vue and Edge is same, and hence Edge will always evaluate it, instead of passing it to the vue.

```edge
<template>
  <p> Hello {{ name }}! I am vue fragment </p>
</template>
```

Now, the problem is, Edge will attempt to resolve the `name` variable on the server and Vue.js will not receive the mustache braces.

To fix this, you can prepend the `@` symbol in front of the mustache brace.

```edge
<template>
  <p> Hello @{{ name }}! I am vue fragment </p>
</template>
```
