---
permalink: guides/views/introduction
group: Views & Templates
---

# Introduction
AdonisJS comes with a home grown template engine known as [Edge](https://www.npmjs.com/package/edge.js). Edge is written for the modern day and has lots of exiciting features like **components**, **runtime debugging** and extensible API.

## Interpolation
Just like any other template engine, Edge also supports interpolation using the famous mustache braces `{{ }}`.

```edge
<p>
  Welcome {{ user }}
</p>

<p>
  The total is {{ 2 + 2 }}
</p>
```

You are not only limited to simple variable reference or arithmetic operations. Tou can use any valid [Javascript expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions). For example:

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

## Conditionals
You can also write standard conditional statements within your templates.

```edge
@if(username)
  <p> Hello {{ username }}! </p>
@else
  <p> Hello Guest </p>
@endif
```
