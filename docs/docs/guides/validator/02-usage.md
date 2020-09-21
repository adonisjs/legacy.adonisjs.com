---
permalink: guides/validator/usage
group: Validator
---

# Usage
In this guide, we will take a glimpse of the AdonisJS validator by covering only the basics and later, you can deep dive into individual topics to have a stronger understanding.

By the end of this guide, you will know:

- How to validate form requests during an HTTP request
- How to use validator outside the flow of an HTTP request
- Covering the basics of validation schema

[note]
This guide only cover inline validation. If you'd like to create a validator class, you should refer to the [form submissions](/guides/http/form-submissions#using-validator-classes) guide.
[/note]

## Validating HTTP requests
Most of the times, you will be using the validator to validate the forms submitted over an HTTP request. So, lets begin with an HTTP specific example first and later we will see how to use the validator directly.

```ts{}{app/Controllers/Http/AuthController.ts}
// highlight-start
import { schema } from '@ioc:Adonis/Core/Validator'
// highlight-end
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {
  public async register ({ request }: HttpContextContract) {

    const postsSchema = schema.create({
      title: schema.string(),
      content: schema.string(),
      tags: schema.array().members(
        schema.number(),
      )
    })

    const validatedData = await request.validate({
      schema: postsSchema,
    })

    console.log(validatedData.title)
    console.log(validatedData.content)
    console.log(validatedData.tags)
  }
}
```

1. First, you need to import the `schema` object from `@ioc:Adonis/Core/Validator` module.
2. Next, you have to define the validation schema using the `schema.create` method and define all the properties you want to validate.
3. Finally, using the `request.validate` method, you can validate the request form data against the pre-define schema.

If validation passes, then the return value of the `request.validate` will contain all the validated properties, otherwise an exception will be raised.

### Handling Errors
Upon failure, the `request.validate` method will raise an exception, containing the error messages. One option is self handle the exception and convert it into a response. For example:

```ts
try {
  await request.validate({
    schema: postsSchema,
  })
} catch (error) {
  console.log(error.messages)
  response.status(422).send(error.messages)
}
```

Another **(recommended)** approach is to let AdonisJS handle the exception for you and convert it into a response. So let's understand how that will work.

- The core of the framework allows exceptions to self handle themselves during an HTTP request. You can learn more about it in [exception handling guide](/guides/http/exception-handling#self-handled-exceptions).
- Once, the validator will [handle](https://github.com/adonisjs/validator/blob/develop/src/ValidationException/index.ts#L21) its own exception, it will convert the error messages to an HTTP response as explained below:
  - If `Accept: application/json` request header exists. It will return back a JSON response.
  - If `Accept: application/vnd.api+json` request header exists. It will return back a JSON response formatted as per the [JSON API spec](https://jsonapi.org/format/#errors).
  - Otherwise, the request will be redirected back to the previous page and error messages are forwarded back as [flash messages](/guides/http/form-submissions#displaying-validation-errors).

## Standalone usage
You can also use the validator outside of the HTTP requests. Following is an example of the same.

[note]

With standalone usage, you will have to wrap your validation calls inside a `try/catch` statement, since the self handled exceptions only work during within HTTP request lifecycle.

[/note]

```ts
import {
  schema,
  validator, // 👈 import validator
} from '@ioc:Adonis/Core/Validator'

// Define schema
const postsSchema = schema.create({ ... })

// Define the data to validate
// highlight-start
const data = {
  title: 'Adonis 101',
  content: 'Lets get started',
  tags: [1, 4, 8],
}
// highlight-end

// Run validations
// highlight-start
try {
  await validator.validate({
    schema: postsSchema,
    data: data,
  })
} catch (error) {
  console.log(error.messages)
}
// highlight-end
```

## Schema 101
The schema definition is divided into three main parts.

1. The shape of the expected data defined using `(schema.create())`.
2. The expected data type of individual properties, ie `(schema.string())`.
3. Additional set of validation rules to validate the data formatting, or checking if its unique in the database.

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1591851435/adonisjs.com/schema-101_ldhxks.png)

Also, if you look carefully, we have separated the **format validations from core data types**. For example: There is no data type called `schema.email`. In fact `email` is a standalone rule to check the formatting a string.

This separation helps a lot in extending the validator with custom rules, without creating unnecessary schema types that has no meaning. For example: There is no thing called **email type**, it is a just a **string**, formatted as an email.

### Marking fields as optional
Every schema field is marked as `required` by default. However, you can mark them optional by chaining the `.optional` method. For example:

[note]
You can chain the `.optional` method with all available schema data types.
[/note]


```ts
schema.create({
  content: schema.string.optional()
})
```

So, here we are saying, the `content` property must be defined as a **string**, but its okay if it is not defined at all.

### Validating nested objects/arrays
You can define schema for a nested object using the [schema.object](/guides/validator/schema-types#schemaobject) data type. For example:

```ts
schema.create({
  // highlight-start
  profile: schema.object().members({
    name: string.string(),
  })
  // highlight-end
})
```

Similarly, you can validate an array using the [schema.array](/guides/validator/schema-types#schemaarray) data type.

```ts
schema.create({
  accounts: schema.array().members(
    schema.object().members({
      type: schema.string(),
      id: schema.number(),
    })
  )
})

// Valid data
[
  {
    "type": "twitter",
    "id": "@adonisframework"
  },
  {
    "type": "github",
    "id": "adonisjs"
  }
]
```

### Validating array length
You can make use of the additional validation rules to enforce a minimum or a maximum array length. For example:

```ts
schema.create({
  accounts: schema.array([
    rules.minLength(1),
    rules.maxLength(4)
  ]).members(...)
})
```

## What's next?
We hope, the usage guide gave a head start with the validator. However, we do recommend reading the following guides to explore all available data types and validation rules.

- Available [schema data types](/guides/validator/schema-types)
- List of available [validation rules](/guides/validator/rules)
- [Custom messages](/guides/validator/custom-messages)
