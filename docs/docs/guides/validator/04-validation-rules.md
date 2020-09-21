---
permalink: guides/validator/rules
group: Validator
---

# Validation Rules
Validation rules allows adding additional constraints on the schema types. For example: A rule to validate the formatting of a string to be a valid email, and another rule to ensure a field value is unique inside the database.

## Importing and using rules
The first step is to import the `rules` list.

```ts
import {
  rules, // 👈
  schema,
} from '@ioc:Adonis/Core/Validator'
```

And then define them on the schema types.

```ts
schema.create({
  email: schema.string({}, [
    // highlight-start
    rules.email(),
    rules.unique({ table: 'users', column: 'email' })
    // highlight-end
  ])
})
```

## `rules.alpha`
Enforces the value to only have letters. Optionally, you can also allow `spaces`, `dash` and `underscore` characters.

[note]
Can only be used only with the **string schema type**.
[/note]

```ts
{
  username: schema.string({}, [
    rules.alpha(),
  ])
}

// or
rules.alpha({
  allow: ['space', 'underscore', 'dash']
})
```

## `rules.confirmed`
Enforce the field under validation is also confirmed using the `_confirmation` convention. You will mostly use this rule for password confirmation.

```ts
{
  password: schema.string({}, [
    rules.confirmed()
  ])
}

/**
 Valid data: {
    password: 'secret',
    password_confirmation: 'secret'
 }
 */
```

The `confirmed` rule also allows you to use a custom confirmation field name.

```ts
{
  password: schema.string({}, [
    rules.confirmed('passwordConfirmation')
  ])
}

/**
 Valid data: {
    password: 'secret',
    passwordConfirmation: 'secret'
 }
 */
```

## `rules.distinct`
The `distinct` rule ensures that all values of a property inside an array are unique.

Assuming you have an array of objects, each defining a product id property and you want to ensure that no duplicates product ids are being used.

```js{}{Sample Data}
{
  "products": [
    {
      "id": 1,
      "quantity": 4,
    },
    {
      "id": 3,
      "quantity": 10,
    },
    {
      "id": 8,
      "quantity": 1,
    }
  ]
}
```

```ts{}{Validation rule}
{
  products: schema
    .array([
      rules.distinct('id') // 👈 ensures id is unique
    ])
    .members(schema.object().members({
      id: schema.number(),
      quantity: schema.number(),
    }))
}
```

You can also use the distinct rule with an array of literal values by using the wildcard `*` keyword. For example:

```js{}{Sample Data}
{
  "tags": [1, 10, 15, 8]
}
```

```ts{}{Validation rule}
{
  tags: schema
    .array([
      rules.distinct('*')
    ])
    .members(schema.number())
}
```


## `rules.email`
Enforces the value to be properly formatted as an email.

[note]
Can only be used only with the **string schema type**.
[/note]

```ts
{
  email: schema.string({}, [
    rules.email()
  ])
}
```

You can also define the following options to control the validation behavior.

| Option | Default Value | Description |
|--------|----------------|-------------|
| allowIpDomain | `false` | Set it as `true` to allow IP addresses in the host part. |
| ignoreMaxLength | `false` | Set it as `true` to disable email address max length validation. |
| domainSpecificValidation | `false` | Set it as `true` to dis-allow certain syntactically valid email addresses that are rejected by **GMail** |
| sanitize | `false` | Not a validation option, but instead can be used to transform the local part of the email (before the @ symbol) to all lowercase. |

```ts
{
  email: schema.string({}, [
    rules.email({
      sanitize: true,
      ignoreMaxLength: true,
    })
  ])
}
```

## `rules.exists`
Enforces the value to exist in a database table.

[note]
The validation rule is added by `@adonisjs/lucid` package. So make sure it is [installed and configured](/guides/database/setup), before using this rule.
[/note]

```ts
{
  category_id: schema.number([
    rules.exists({ table: 'categories', column: 'id' })
  ])
}
```

### Case insensitivity
Many databases perform case sensitive queries. So whether you can transform the value to `lowerCase` in JavaScript or make use of the `caseInsensitive` option to convert value to lowercase during the query.

```ts
{
  username: schema.string({}, [
    rules.exists({
      table: 'users',
      column: 'username',
      caseInsensitive: true,
    })
  ])
}

// query: SELECT username FROM users WHERE LOWER(username) = LOWER(?)
```

### Additional constraints

Additionally, you can also define `where` and `whereNot` constraints. For example: Limit the database query to a specific tenant id.

[note]

If you are caching your validation schema using the `cacheKey` and your **where constraints** relies on a runtime value, then you must make use of [refs](/guides/validator/schema-caching#refs).

[/note]

```ts
{
  category_id: schema.number([
    rules.exists({
      table: 'categories',
      column: 'id',
      where: { tenant_id: 1 },
    })
  ])
}
```

Example with refs.

```ts
class UserValidator {

  // highlight-start
  public refs = schema.refs({
    tenantId: this.ctx.auth.user.tenantId
  })
  // highlight-end

  public schema = schema.create({
    username: schema.string({}, [
      rules.exists({
        table: 'categories',
        column: 'id',
        // highlight-start
        where: { tenant_id: this.refs.tenantId },
        // highlight-end
      })
    ])
  })

}
```

## `rules.unique`
The `rules.unique` method is the opposite of `rules.exists` method. Instead of checking the existence of the value in a given table, it ensures that missing doesn't exists.

```ts
{
  username: schema.string({}, [
    rules.unique({
      table: 'users',
      column: 'username',
    })
  ])
}
```

## `rules.ip`
Enforce the field under validation is a valid ip address. Optionally, you can also specify the `ip` version.

```ts
{
  ip: schema.string({}, [
    rules.ip()
  ])
}

// or
rules.ip({
  version: 6,
})
```

## `rules.maxLength`
Limit the max length of a `string` or an `array`.

```ts
{
  username: schema.string({}, [
    rules.maxLength(40)
  ])
}
```

You can also apply the `maxLength` rule on an array.

```ts
{
  tags: schema
    .array([
      rules.maxLength(10)
    ])
    .members(schema.string())
}
```

## `rules.minLength`
Enforce minimum length on a string or an array.

```ts
{
  tags: schema.array([
    rules.minLength(1)
  ])
}
```

## `rules.unsigned`
Ensure, the value is an [unsigned integer](https://www.cs.utah.edu/~germain/PPS/Topics/unsigned_integer.html)

```ts
{
  age: schema.number([
    rules.unsigned()
  ])
}
```

## `rules.range`
Ensure, the value is contained in the specified range.
```ts
{
  score: schema.number([
    rules.range(0, 10)
  ])
}
```

## `rules.regex`
Define a custom regex to validate the value against.

```ts
{
  username: schema.string({}, [
    rules.regex(/^[a-zA-Z0-9]+$/)
  ])
}
```

## `rules.uuid`
Enforce the value of field under validation is a valid `uuid`. You can also optionally enforce a uuid version.

```ts
{
  id: schema.string({}, [
    rules.uuid()
  ])
}

// Or enforce version
{
  id: schema.string({}, [
    rules.uuid({ version: 4 })
  ])
}
```

## `rules.mobile`
Enforces the value to be properly formatted as a phone number. You can also define locales for country specific validation.

```ts
{
  mobile: schema.string({}, [
    rules.mobile()
  ])
}
```

Validate against selected locales

```ts
{
  mobile: schema.string({}, [
    rules.mobile({ locales: ['pt-BR', 'en-IN', 'en-US'] })
  ])
}
```

Also, you can enable **strict mode**, which will force the end user to specify the country code along with the `+` prefix.

```ts
{
  mobile: schema.string({}, [
    rules.mobile({ strict: true })
  ])
}
```

## `rules.requiredIfExists`
Mark the current field as required, when **another field exists** and contains some value.

```ts
{
  password: schema.string.optional({}, [
    rules.requiredIfExists('username')
  ])
}
```

## `rules.requiredIfExistsAll`
Mark the current field as required, when **all of the other fields exists** and contains some value.

```ts
{
  password: schema.string.optional({}, [
    rules.requiredIfExistsAll(['username', 'email'])
  ])
}
```

## `rules.requiredIfExistsAny`
Mark the current field as required, when **any of the other fields exists** and contains some value.

```ts
{
  password: schema.string.optional({}, [
    rules.requiredIfExistsAny(['username', 'email'])
  ])
}
```

## `rules.requiredIfNotExists`
The opposite of [rules.requiredIfExists](#rulesrequiredifexists)

## `rules.requiredIfNotExistsAll`
The opposite of [rules.requiredIfExistsAll](#rulesrequiredifexistsall)

## `rules.requiredIfNotExistsAny`
The opposite of [rules.requiredIfExistsAny](#rulesrequiredifexistsany)

## `rules.requiredWhen`
Mark the current field as required, when the value of the other field matches a given criteria.

```ts
{
  address: schema.string.optional({}, [
    rules.requiredWhen('delivery_method', '=', 'shipping')
  ])
}
```

The `requiredWhen` rule support the following operators.

- `in`
- `notIn`
- `=`
- `!=`
- `>`
- `<`
- `>=`
- `<=`

## `rules.after`
Ensure, the value of field is after a given date/offset. The rule can be only be used with the date data type.

```ts
{
  checkin_date: schema.date({}, [
    rules.after(2, 'days')
  ])
}
```

The `after` method can receive one of the following values:

- The `duration` and the `offset`. Feel free to use Typescript intellisense for finding the available offset keywords.
- The `today` or `tomorrow` keywords.
  ```ts
  {
    checkin_date: schema.date({}, [
      rules.after('tomorrow')
    ])
  }
  ```
- Finally, you can also pass an instance of luxon DateTime object. Make sure, you pass it is a ref.
  ```ts
  class HolidayValidator {
    public refs = schema.refs({
      allowedDate: luxon.DateTime.local().add({ days: '2' })
    })

    public schema = schema.create({
      checkin_date: schema.date({}, [
        rules.after(this.refs.allowedDate)
      ])
    })
  }
  ```

## `rules.before`
Similar to `rules.after` but instead enforces the value be before the defined date/offset.

```ts
{
  joining_date: schema.date({}, [
    rules.before('today')
  ])
}
```

## `rules.afterField`
Similar to the `after` rule. But instead of defining a date/offset for comparison, you define the field to check against. For example:

```ts
{
  checkin_date: schema.date(),
  checkout_date: schema.date({}, [
    rules.afterField('checkin_date')
  ]),
}
```

Also, you can make use of the `afterOrEqualToField` for enforcing date to be same or after the given field.

```ts
{
  drafted_on: schema.date(),
  published_on: schema.date({}, [
    rules.afterOrEqualToField('drafted_on')
  ]),
}
```

## `rules.beforeField`
Similar to the `before` rule. But instead of defining a date/offset for comparison, you define the field to check against. For example:

```ts
{
  checkout_date: schema.date(),
  checkin_date: schema.date({}, [
    rules.beforeField('checkout_date')
  ]),
}
```

Also, you can make use of the `beforeOrEqualToField` for enforcing date to be same or before the given field.

```ts
{
  published_on: schema.date(),
  drafted_on: schema.date({}, [
    rules.beforeOrEqualToField('published_on')
  ]),
}
```

## `rules.blacklist`
Enforce the value of field is not inside the blacklist. The `blacklist` rule is opposite of the [enum schema type](/guides/validator/schema-types#schemaenum)

```ts
{
  username: schema.string({}, [
    rules.blacklist([
      'admin',
      'super',
      'root'
    ])
  ])
}
```
