---
permalink: guides/validator/introduction
group: Validator
---

# Introduction
AdonisJS comes with an in-built data validation library to validate form requests using a pre-defined schema. Since, the support for validations is baked-in to the framework, there is no need to install any additional libraries.

The AdonisJS validator has support for:

- Async validations
- Validating nested objects and arrays
- Custom messages & Error reporters
- No need to maintain separate interfaces for intellisense to work
- Removes non-validated properties from the data object
- Extensible API to add custom rules

## Built with HTTP in mind
The data submitted over the HTTP is always represented as string and hence manual data casting is required to convert it to language specific data types.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1589776782/adonisjs.com/http-data-is-always-string.mov", controls]

If a validator is strict about the data types, then it will offload the work of casting strings to the correct data type on you. 

However, **AdonisJS handles the data casting** for you based upon the applied validation rules. For example:

```ts{}{start/routes.ts}
import { schema } from '@ioc:Adonis/Core/Validator'

Route.post('/', async ({ request }) => {
  const validated = await request.validate({
    schema: schema.create({
      marks: schema.number() // 👈
    })
  })

  console.log('typeof marks', `"${typeof validated.marks}"`)
  return validated
})
```

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1589777292/adonisjs.com/validator-casted-data-type.mov", controls]

## Custom error messages
The validator has first class support for defining custom error messages. The `validate` method accepts an object of `messages` along side the validation `schema`.

```ts
request.validate({
  schema: schema.create({
    marks: schema.number()
  }),
  messages: {
    'marks.required': 'Marks are required to submit the form',
    'marks.number': 'Invalid value provided for the marks'
  },
})
```

- Mostly custom messages are defined as a combination of the **field name** + **validation rule**. For example: `marks.required`. However, you can define global messages for just the validation rules.
- You can reference runtime values within the validation messages using curly braces.
- To write messages for nested properties, you can rely on the dot notation. For example: `user.profile.username`.

## Type information
The static types are extracted automatically from the runtime validation rules, hence there is no need to maintain separate interfaces just for the type information or intellisense to work.

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1589789301/adonisjs.com/validator-types.webp)

## Extensible
Just like every other part of the framework. The validator is built with extensibility in mind and exposes the API to add custom validation rules. For example: [Here's the source code](https://github.com/adonisjs/lucid/blob/develop/src/Bindings/Validator.ts#L168) of Lucid extending the validator to add the database related validation rules.
