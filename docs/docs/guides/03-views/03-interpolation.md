---
permalink: guides/views/interpolation
group: Views & Templates
---

# Interpolation
Interpolation allows you to write Javascript expressions within a markup language like HTML. The output of the Javascript expression  is concatenated to the template output value. For example:

```edge
<p>Hello {{ username }}</p>
```

Assuming the `username` variable has value of `virk`. The output will be as follows:

```html
<p>Hello virk</p>
```

## Javascript Expressions

You are not only limited to simple variable references like `{{ username }}`. Infact, you can write almost any valid [JavaScript expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) inside the curly braces. Consider the following examples:

```edge{}{Array.Map}
<ul> {{{
  users.map((user) => `<li> ${user.name} </li>`)
}}} </ul>
```

```edge{}{Function calls}
<p> Hello {{ username.toUpperCase() }} </p>
```

```edge{}{Ternary operator}
<p>{{ users.length ? users[0].username : 'Guest' }}</p>
```

```edge{}{Arithmetic expression}
<p> {{ (2 + 2) * 2  }} </p>
```

## Raw HTML
The output of curly braces is escaped to prevent XSS attacks. If you want Edge to not escape the output, then you will have to make use of 3 curly braces `{{{`, also known as safe mustache.

```ts
<p>Using mustache: {{ rawHtml }}</p>
<p>Using safe mustache : {{{ rawHtml }}}</p>
```

```html
Using mustache: <span style="color: red">This should be red.</span>
Using safe mustache: This should be red.
```

Also, you can make use of the global `safe` function to render HTML without escaping it.

```ts
<p> {{ safe(rawHtml) }}</p>
```

## Ignoring Interpolation
The syntax for interpolation `{{ }}` is majorly same across different frameworks and at times it can cause unwanted conflicts. For example: 

You want to use Vue.js along with Edge. The interpolation syntax for both is same and hence, Edge will evaluate the expressions before passing them to Vue. However, you can instruct Edge to ignore curly braces by prefixing the `@` symbol.

```edge
<template>
  <p> Hello @{{ name }}! I am a vue fragment </p>
</template>
```
