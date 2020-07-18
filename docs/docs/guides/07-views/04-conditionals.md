---
permalink: guides/views/conditionals
group: Views & Templates
---

# Conditionals
You can write conditionals inside your templates using the following Edge tags:

- `@if`
- `@elseif`
- `@else`
- `@unless`

## If/else

```edge
@if(username)
  <p> Hello {{ username }}! </p>
@else
  <p> Hello Guest </p>
@endif
```

## Elseif

```edge
@if(user.role === 'admin')
  <a href="/posts/1/edit"> Edit Post </a>
  <a href="/posts/1/delete"> Delete Post </a>
@elseif (user.role === 'moderator')
  <a href="/posts/1/edit"> Edit Post </a>
@endif
```

## Unless
You can also use the `unless` tag for writing conditionals. The `unless` is the opposite of `if` and at times it feels more natural than writing a negative if.

```edge
@unless(auth.isLoggedIn)
  <a href="/login"> Login </a>
@endunless
```

## Ternary Operator
You can also write the standard Javascript ternary operator for shorthand `if/else` statements

```ts
<p>Hello {{ username ? username : 'Guest' }}</p>
```
