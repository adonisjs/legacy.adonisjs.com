---
permalink: guides/views/tags
group: Views & Templates
category: Reference
---

# Tags Reference
Edge uses tags for implementing features to the templating layer. By using a standard API, we have been able to provide you a uniform syntax for writing logic inside your views. In this guide, we will cover usage of all the pre-existing tags.

## Verbiage
Before getting started, let's go through some terms that we use internally to define the behavior of tags.

### Block tag
A block tag can optionally accept content inside the opening and the closing statement. Every block level tag needs to be closed, otherwise the compiler will raise an exception. The `@if` tag is a block tag.

### Inline tag
An inline tag doesn't accepts any content, but only the arguments. Also, there is no need to close an inline tag. The `@include` is an inline tag.

### Self closed
Every block level tag can also be self closed. It is simply a way to write one less line of code. For example:

```edge
@section('content')
@endsection
```

Since, the `section` has no content inside it, we can self close it in a single line by prefixing the `bang (!)` character.

```edge
@!section('content')
```

## `@if`
The `@if` tag is used to write conditional if statements inside your templates. The tag accepts every valid Javascript expression as the first and the only argument.

```edge
@if(username)
  {{-- body --}}
@endif
```

The `@elseif` tag is similar to the `@if` tag and accepts the same number and type of arguments. Whereas, the `@else` tag accepts no arguments.

```edge
@if(user.role === 'admin')
  {{-- if admin --}}
@elseif (user.role === 'moderator')
  {{-- if moderator --}}
@else
  {{-- otherwise --}}
@endif
```

## `@each`
The `@each` tag is used to loop over an array or object of items. The each tag accepts a single argument as shown below:

```edge
@each(user in users)
  <li>{{ user.username }}</li>
@endeach
```

Unlike Javascript, you can also loop over object properties. There is no need to collect object keys using `Object.keys` method.

[codegroup]
```js{}{Data Object}
const userDetails = {
  username: 'virk',
  age: 28,
  isAdmin: true,
}
```

```edge{}{Loop}
@each((value, prop) in userDetails)
  <tr>
    <td> {{ prop }} </td>
    <td> {{ value }} </td>
  </tr>
@endeach
```

```html{}{Output}
Property	Value
username	virk
age	        28
isAdmin	    true
```
[/codegroup]

Also, the each tag accepts inline array/object declarations. For example:

```edge
@each(user in ['virk', 'romain'])
  {{ user }}
@endeach
```

## `@include`
The `@include` tag is used to include other templates inside the current template. It is an `inline` tag, so there is no need to close it using `@end` statement.

[note]
The included partial has access to the entire state of the parent template and hence, there is no need to pass data to a partial.
[/note]

```edge
@include('partials/header')
```

The partial path can also be computed using runtime values.

```edge
@include(`${user.theme}/partials/header`)
```

## `@includeIf`
Similar to `@include`, but accepts an additional value to conditionally include a template. For example: Include the comments partial only when a post has comments.

```edge
@includeIf(post.comments.length, 'partials/comments')
```

## `@component`
The `@component` tag allows you to render re-usable components. It is a block tag and can optionally accept `slots` for the component.

[note]
We have also have a dedicated guide on [components](/guides/views/components). Make sure to check it out.
[/note]

```edge
@component('components/modal', { title: 'Delete post' })
  @slot('body')
    <p> Are you sure you want to delete the post? </p>
  @endslot
@endcomponent
```

At times, you will have components that doesn't accept any body and can be self closed.

```edge
@!component('components/button', {
  text: 'Login',
  role: 'primary',
})
```

## `@slot`
The `@slot` tag is always used inside a component. Using it outside a component will raise an exception. The idea of slots is to let you define dynamic markup for an existing component.

- A slot must always have a unique name within the component.
- The slot names cannot be dynamic. In other words, you cannot use runtime values to compute the slot name.
- Slots have access to the state of parent template and not the component. However, the component can pass it's state to a slot.

## `@layout`
The `@layout` tag allows you to use a layout and then replace certain sections of it to insert page specific content.

- The layout always have to be on the first line inside a template.
- It is an inline tag and hence no need to close it separately.
- The tag accepts only one argument, ie: the path of the layout template.
- The layout name cannot be dynamic. In other words, you cannot use runtime values to compute the layout name.

```edge
@layout('layouts/master')
```

## `@section`
The `@section` tag is used inside both the layout and the template using the layout. However, the behavior differs based upon where it is used.

- Inside the layout, a `@section` tag is used to define areas that are replicable by other templates. Many times sections are empty inside a layout template.
- Inside the parent template (one using the layout), a `@section` tag is used to define the markup for a given section.

[codegroup]
```edge{10}{Layout}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>
<body>
  <section class="main">
    @!section('content')
  </section>
</body>
</html>
```

```edge{}{Parent Template}
@layout('layouts/master')

// highlight-start
@section('content')
  <p> Hello world </p>
@endsection
// highlight-end
```

```html{10}{Output}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>
<body>
  <section class="main">
    <p> Hello world </p>
  </section>
</body>
</html>
```
[/codegroup]

## `@super`
The `@super` tag is specific to layout sections to append to the section content instead of overwriting it. We recommend reading the [dedicated guide on sections inheritance](/guides/views/layouts#inheriting-sections-content).

## `@set`
The `@set` tag allows you to define variables within your templates. Think of it as defining a `variable` inside Javascript but with edge specific syntax.

```edge
{{-- Define variable --}}
@set('title', 'Home page')

{{-- Use it --}}
{{ title }}
```

The variables defined locally inside a template are not added to the template state object. So if you inspect the template state, they will not show up.

```edge
{{-- Define variable --}}
@set('title', 'Home page')

{{ inspect(state) }}
```

To understand it clearly, let's write the equivalent code in Javascript.

```js
function template (state) {
  let title = 'Home page'
  console.log(JSON.stringify(state))
}
```

As expected, the `console.log` statement will not show the value of the `title` variable, since it is not part of the `state` object. Same is the case with Edge `inspect` call.

## `@debugger`
The `@debugger` tag allows you to debug your template output using Chrome DevTools. We recommend you to read the [dedicated doc on debugging](/guides/views/debugging#using-debugger).
