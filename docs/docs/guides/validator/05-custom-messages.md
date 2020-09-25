---
permalink: guides/validator/custom-messages
group: Validator
---

# Custom Messages
Once you get the validations working, the next natural step is to present helpful error messages to the end user. In this guide, we will go through the API to define custom messages.

## Defining custom messages
Both, the `request.validate` and the `validator.validate` methods accepts an optional `messages` object containing a set of custom messages.

```ts
request.validate({
  schema: schema.create({}),
  messages: {
    'username.required': 'Username is required to sign up',
    'username.unique': 'The username is already in use',
  }
})
```

As you can see, the messages are defined as a combination of **field** + **the validation rule** and this enables you to define unique and specific messages for each field.

However, you can also define generic messages just for the validation rules. For example:

```ts
{
  messages: {
    required: 'Make sure to enter the field value',
    'username.required': 'A unique username is required to sign up',
  }
}
```

- Validator will first look for the `field.rule` messages.
- Next, it will look for just `rule` messages.
- Finally, it will fallback to a generic message.

## Messages API
To make sure that you are applications are not getting bom-bared with ton of custom messages. Validator has support for dynamic messages with the help of wild card callback and micro templating.

### Micro templating
The message string cans define placeholders for runtime values as shown in the following code snippet.

```ts
{
  messages: {
    required: '{{ field }} is required to sign up',
    enum: 'The value of {{ field }} must be in {{ options.choices }}'
  }
}
```

Following is the list of placeholders, you can define inside your messages.

- `{{ field }}`: Name of the field under validation. Nested object paths are represented with a **dot separator**. For example: `user.profile.username`.
- `{{ rule }}`: Name of the validation rule.
- `{{ options }}`: The options passed by the validation methods. For example: The enum rule will pass an array of `choices` and some rules may not pass any options.

### Wild card callback
You can also define a wildcard callback, that is executed to retrieve the message string for every single validation message.

```ts
{
  messages: {
    '*': (field, rule, arrayExpressionPointer, options) => {
      return `${rule} validation error on ${field}`
    },
  }
}
```

The wildcard callback can be used in combination with regular messages. In the following example, the wildcard callback will be invoked only for the messages not defined in the object.

```ts
{
  messages: {
    '*': (field, rule, arrayExpressionPointer, options) => {
      return `${rule} validation error on ${field}`
    },
    'username.required': 'Username is required to sign up',
  }
}
```

## Options passed to the message string
Following is the list of options passed by the different validation methods to the message string.

### `date`
The `date` validation rule will pass the `options.format`.

```ts
{
  'date.format': '{{ date }} must be formatted as {{ format }}',
}
```

### `distinct`
The `distinct` validation rule will pass the `field` on which the distinct rule is applied, along with `index` at which the duplicate value was found.

```ts
{
  'products.distinct': 'The product at {{ options.index + 1 }} position has already been added earlier'
}
```

### `enum` / `enumSet`
The `enum` and `enumSet` validation rules will pass an array of `options.choices`.

```ts
{
  'enum': 'The value must be one of {{ options.choices }}',
  'enumSet': 'The values must be one of {{ options.choices }}',
}
```

### `file`
The file validation allows defining custom messages for the sub rules. For example:

```ts
{
  'file.size': 'The file size must be under {{ options.size }}',
  'file.extnames': 'The file must have one of {{ options.extnames }} extension names',
}
```

### `minLength` / `maxLength`
The `minLength` and `maxLength` validation rules will pass the `options.length` to the message.

```ts
{
  'minLength': 'The array must have {{ options.minLength }} items',
}
```


### `requiredIfExists` / `requiredIfNotExists`
The `requiredIfExists` and `requiredIfNotExists` validation rules will pass the `options.otherField` as a string.

```ts
{
  'requiredIfExists': '{{ options.otherField }} requires {{ field }}',
}
```

### Conditional required rules
The following `requiredIf*` rules will pass the `options.otherFields` as an array of strings.

- requiredIfExistsAll
- requiredIfExistsAny
- requiredIfNotExistsAll
- requiredIfNotExistsAny

```ts
{
  'requiredIfExistsAll': '{{ options.otherFields }} requires {{ field }}',
}
```

### `requiredWhen`
The `requiredWhen` validation rule will pass the following options.

- `options.otherField`
- `options.operator`
- `options.values`
