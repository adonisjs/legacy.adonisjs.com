---
permalink: guides/validator/schema-types
group: Validator
---

# Schema Types
Schema types enforces type validation on a given property. Also, every schema type has a static return data type as well. In other words, there is no need to maintain separate interfaces for Typescript types.

In this guide, we will go through all of the available schema types and the options accepted by them.

## `schema.string`
Enforces the value to a valid string. Also, you can pass options to trim the whitespace or escape certain characters with HTML entities.

```ts
{
  title: schema.string({
    escape: true,
    trim: true
  })
}

// Valid data: { title: 'Hello world' }
```

The  `<`, `>`, `&`, `'`, `"` and `/` characters will be escaped with HTML entities.

### Passing additional rules
You can pass an array of additional rules as 2nd argument.

```ts
schema.string({}, [
  rules.email(),
])
```

## `schema.number`
Enforces the value to be a valid number. The string representation of a number will be casted to a number data type. For example: `"22"` becomes `22`.

```ts
{
  marks: schema.number()
}

// Valid data: { marks: 20 } or { marks: "20" }
```

### Passing additional rules
Since the `number` rule does not accept any configuration options, you can pass additional rules as 1st argument itself.

```ts
schema.number([
  rules.unsigned(),
  rules.range(10, 100),
])
```

## `schema.boolean`
Enforces the value to be a valid boolean. The following literal values are also casted to a boolean.

- `"1"`, `1`, `"on"`, `"true"` is casted to `true`.
- `"0"`, `0`, `"off"`, `"false"` is casted to `false`.

[note]

We cast `on` and `off` values to a boolean, since the HTML form `input[type="checkbox"]` sets the value to `"on"` if checkbox is checked.

[/note]

```ts
{
  accepted: schema.boolean()
}

// Valid data: { accepted: "on" }, { accepted: "true" }
```

## `schema.date`
Enforces the value to be a valid date object or a string representing a date. The values are casted to an instance of [luxon.DateTime](https://moment.github.io/luxon/docs/manual/tour.html#creating-a-datetime) 

```ts
{
  published_at: schema.date()
}

// Valid data: { published_at: "2020-04-30 12:00:00" }
```

You can also enforce a format for the string values by defining a valid format accepted by luxon.

```ts
{
  published_at: schema.date({
    format: 'yyyy-MM-dd HH:mm:ss',
  })
}
```

Or use the following shorthand codes for standardized date/time formats.

```ts
{
  published_at: schema.date({
    format: 'rfc2822',
  })
}

// OR
{
  published_at: schema.date({
    format: 'sql',
  })
}

// OR
{
  published_at: schema.date({
    format: 'iso',
  })
}
```

## `schema.enum`
Enforces value to be one of the pre-defined enum options.

```ts
{
  account_type: schema.enum(['twitter', 'github', 'instagram'] as const)
}

// Valid data: { account_type: 'twitter' }
```

You can also make use of Typescript enums.

```ts
enum SocialAccounts {
  TWITTER = 'twitter',
  GITHUB = 'github',
  INSTAGRAM = 'instagram',
}

schema.enum(Object.values(SocialAccounts))
```

[note]

If you are caching your validation schema using the `cacheKey` and your **enum options** relies on a runtime value, then you must make use of [refs](schema-caching#refs).

[/note]


## `schema.enumSet`
The `schema.enumSet` is similar to the `enum`, instead it accepts an array of values that falls under one of the pre-defined values.

In the following example, we expect the user to select one or more of the pre-defined skills.

```ts
{
  skills: schema.enumSet([
    'Programming',
    'Design',
    'Marketing',
    'Copy writing',
  ] as const)
}

// Valid data: { skills: ['Programming', 'Design'] }
```

[note]

If you are caching your validation schema using the `cacheKey` and your **enumSet options** relies on a runtime value, then you must make use of [refs](schema-caching#refs).

[/note]

## `schema.file`
Enforces the value to be a valid uploaded file. You can also enforce additional validation rules on the file size and the extension names.

```ts
{
  avatar: schema.file({
    size: '2mb',
    extnames: ['png', 'jpg', 'jpeg'],
  })
}
```

## `schema.array`
Enforces the value to be a valid Javascript array.

```ts
{
  tags: schema.array()
}
```

You can also validate the members of the array, using the `.members` method. For example: We can enforce all members of the array are numbers.

```ts
{
  tags: schema.array().members(
    schema.number()
  )
}

// Valid data: { tags: [1, 2, 3] } or { tags: ["1", "2", "3"] }
```

To validate the array itself, you can pass additional validation rules to the `array` method.

```ts
{
  tags: schema.array([ rules.minLength(1) ]).members(
    schema.number()
  )
}
```

## `schema.object`
Enforces the value to be a valid Javascript object. Similar to an array, you can also validate the members/properties of an object.

```ts
{
  profile: schema.object().members({
    full_name: schema.string(),
    profile_pic: schema.file(),
    twitter_handle: schema.string.optional(),
  })
}

// Valid data: { full_name: 'Virk', profile_pic: [MultipartStream] }
```
