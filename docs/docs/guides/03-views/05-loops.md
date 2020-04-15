---
permalink: guides/views/loops
group: Views & Templates
---

# Loops
Edge offers a uniformed `@each` tag to iterate over both Arrays and Objects. Consider the following examples:

## Arrays
The following example uses `@set` tag to define an inline Array.

```edge{}{Arrays}
@set('users', [
  { username: 'virk' },
  { username: 'romain' },
])

@each(user in users)
  <li> {{ user.username }} </li>
@endeach
```

You can also access the iteration `index` as shown below

```edge
@each((user, index) in users)
  <li> ({{ index + 1 }}) {{ user.username }} </li>
@endeach
```

## Objects
Similarly, you can also loop over an object of key-value pair.

```edge{}{Objects}
@set('food', {
  'ketchup': '5 tbsp',
  'mustard': '1 tbsp',
  'pickle': '0 tbsp',
})

@each((amount, ingredient) in food)
  <li> Use {{ amount }} of {{ ingredient }} </li>
@endeach
```

## Fallback Message
The `@each` tag also let you define a fallback `@else` statement to show a message when the list is undefined or doesn't have items inside it.

```edge
@each(user in users)
  <li> {{ user.username }} </li>
@else
  <p> No users found </p>
@endeach
```
