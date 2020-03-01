---
permalink: guides/views/loops
group: Views & Templates
---

# Loops
Edge provides a single `@each` tag to loop over both the arrays and objects. For example:

```edge{}{Arrays}
@set('users', [{ username: 'virk' }, { username: 'romain' }])

// highlight-start
@each(user in users)
  <li> {{ user.username }} </li>
@endeach
// highlight-end
```

Similarly, you can also loop over an object of key-value pair.

```edge{}{Objects}
@set('food', {
  'ketchup': '5 tbsp',
  'mustard': '1 tbsp',
  'pickle': '0 tbsp',
})

// highlight-start
@each((amount, ingredient) in food)
  <li> Use {{ amount }} of {{ ingredient }} </li>
@endeach
// highlight-end
```

## The `$loop` Variable
The `@each` loop creates an inner `$loop` variable to access the current iteration properties. Consider the following example:

```edge
@each(user in users)
  <li class="{{ $loop.isEven ? 'bg-grey' : '' }}"> {{ user.username }} </li>
@endeach
```

The `$loop.isEven` returns true, when you the current iteration cycle number is even. Following are properties on the `$loop` object.

[tip]
You can also use the `inspect` method to inspect the value of a variable. For example `{{ inspect($loop) }}`
[/tip]

- `index`: The current iteration index. Starts from `0`
- `isFirst`: Is this the first item of the array
- `isLast`: Is this the first item of the array
- `isOdd`: Is the current interation cycle an odd number
- `isEven`: The opposite of `isOdd`
- `total`: The total number of rows
