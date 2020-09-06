---
permalink: guides/validator/custom-rules
group: Validator
---

# Custom Rules
The validator is extensible and allows adding custom rules. In this guide, we will go through the validator API and add a couple of custom rules to understand the different moving parts.

## Validating phone numbers
Lets add a custom rule to validate phone numbers using [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js). The validator already ships with a mobile number validation rule, but the `libphonenumber-js` is more robust.

Lets begin by creating a new **preload file** using the following ace command. Make sure to select `During HTTP server`, since we do not want to load the rules while running an ace command.

```sh
node ace make:prldfile validationRules

# ✔  create    start/validationRules.ts
```

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1592037324/adonisjs.com/prldfile-validator-rules.png)


Open the newly created file and paste the following code snippet inside it.

```ts{}{start/validationRules.ts}
import { validator } from '@ioc:Adonis/Core/Validator'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

validator.rule('phone', (value, _, { pointer, arrayExpressionPointer, errorReporter }) => {
  /**
   * Skip validation when value is not a string. The string
   * schema rule will handle it
   */
  if (typeof (value) !== 'string') {
    return
  }

  /**
   * Parse phone number from a string
   */
  const phoneNumber = parsePhoneNumberFromString(value, 'IN')

  /**
   * Report error when phone number is not valid
   */
  if (!phoneNumber || !phoneNumber.isValid()) {
    errorReporter.report(pointer, 'phone', 'Invalid phone', arrayExpressionPointer)
  }
})
```

- We skip the validation when field value is not a string.
- We parse the field value using the `parsePhoneNumberFromString` method.
- If the value is null or is invalid, then we will report the validation error using the `errorReporter.report` method.

### Updating interface for static analysis to work
Next, you also need to update the `Rules` interface for typescript to recognize the rule at compile time. 

Create a new file `contracts/validator.ts` file and paste the following code snippet inside it.

```ts{}{contracts/validator.ts}
declare module '@ioc:Adonis/Core/Validator' {
  import { Rule } from '@ioc:Adonis/Core/Validator'

  export interface Rules {
    phone (): Rule // 👈 
  }
}
```

### Usage
Alright, now you can use the `phone` validation rule inside your validators. For example:

```ts
schema.create({
  phone: schema.string({}, [
    rules.phone(),
  ]),
})
```

## Accepting options
Right now the country code is hardcoded inside the validation method. Let's take a step ahead and make it configurable by accepting it as an option.

This time, we will approach the change from our interface. Re-open `contracts/validator.ts` file and update the `phone` method.

```ts{}{contracts/validator.ts}
import { CountryCode } from 'libphonenumber-js'

export interface Rules {
  phone (options: { countryCode: CountryCode }): Rule
}
```

- We accept a required options object with only one property `countryCode`.
- By using an object, we allow ourselves to accept more configuration options in the future.

Next, update the schema usage and pass the country code explicitly.

```ts
schema.create({
  phone: schema.string({}, [
    rules.phone({ countryCode: 'IN' }), // 👈
  ]),
})
```

### Updating implementation to handle options
Finally, we need to update our rule implementation to use the configured country code over the hardcoded one.

```ts{}{start/validationRules.ts}
validator.rule('phone', (
  value,
  [{ countryCode }], // 👈 here we get the options
  { pointer, arrayExpressionPointer, errorReporter },
) => {
  // ...
  const phoneNumber = parsePhoneNumberFromString(
    value,
    countryCode, // 👈 here we use the country code
  )
})
```

- The options accepted by a validation method are passed an array of multiple arguments to the rule implementation.
- In our case, we accept only one argument. i.e: An object with the `countryCode` property. So our implementation receives it as an array with just one item inside it.
- Finally, we remove the hard coded `IN` country code and use the one received as an option.

## Mutating values
The validator allows custom rules to also mutate the field value, since we believe that validation and normalization/sanitization always goes hand in hand.

The phone number rule is a great example of where you would like to perform normalization before storing it inside the database. 

One option is to separate the normalization and validation processes, which sounds great in theory, but can have huge impact on the performance of your app.

- Let's imagine the phone number is a deeply nested property inside an array and then sub-objects.
- First, you will loop over all the items to validate the phone number.
- And then again run a loop to normalize its value.

To address this concern, we allow you to normalize and mutate the value during validation itself.

### Normalizing the phone number
Lets update the rule implementation to normalize the phone number and then mutate its value.

```ts{27-28}{start/validationRules.ts}
validator.rule('phone', (
  value,
  [{ countryCode }],
  { pointer, arrayExpressionPointer, errorReporter, mutate },
) => {
  /**
   * Skip validation when value is not a string. The string
   * schema rule will handle it
   */
  if (typeof (value) !== 'string') {
    return
  }

  /**
   * Parse phone number from a string
   */
  const phoneNumber = parsePhoneNumberFromString(value, countryCode)

  /**
   * Report error when phone number is not valid
   */
  if (!phoneNumber || !phoneNumber.isValid()) {
    errorReporter.report(pointer, 'phone', 'Invalid phone', arrayExpressionPointer)
    return
  }

  const normalized = phoneNumber.formatNational()
  mutate(normalized)
})
```

- We use the `formatNation` method to format the phone number.
- Next, we make use of the `mutate` method to set the new value.
- Now, all validated phone numbers will always be formatted.

## Reporting errors
In the earlier versions of the validator, we used to return `boolean` values from the validation functions to indicate the success or failure. However, the `boolean` are very restrictive in nature. For example:

- You cannot report multiple errors.
- You cannot pass custom metadata related to the validation failure.
- You cannot report errors for sub validation failures. For example: The `file` validation rule reports separate errors for `.size` and `.extnames` failures.

To address the above concern, we now pass the error reporter to the validation rules giving them the complete control.

Following is an example of the `report` method arguments.
```ts
errorReporter.report(
  pointer,
  ruleName,
  defaultMessage,
  arrayPointer,
  metaData,
)
```

### pointer
The `pointer `is the complete path to the field under validation. If a field is inside a nested object, then the pointer will be complete path joined using `dot`.

```js
{
  user: {
    profile: {
      username: 'somename',
    }
  }
}
```

Pointer for `username` will be `user.profile.username`.

### ruleName
The `ruleName` is the rule for which the validation has failed. This value doesn't have to be strictly the rule name. For example: The `file` validation rule uses `file.size` and `file.extnames` as the ruleName.

This allows custom messages to have more variations.

```json
{
  "file.size": "Must be less than 2MB",
  "file.extnames": "Must be a png or jpg"
}
```

### defaultMessage
The message to use, when no custom message is defined.

### arrayPointer
The validator allows defining custom messages for array children using the wildcard `*` keyword. For example:

```json
{
  "users.*.username.required": "Each user must have a username"
}
```

The `arrayPointer` is a string using the `*` keyword, making it easier for the error reporter to locate custom messages for field defined inside an array.

### metaData
Meta data is an optional object that you can pass to the error reporter, that inturn can be used by the custom messages. For example: 

```ts
errorReporter.report(
  pointer,
  'phone',
  'Phone validation failed',
  arrayPointer,
  { countryCode: 'IN' }
)
```

Now, the `countryCode` is accessible inside the custom message as follows:

```json
{
  "phone": "Invalid phone number as per {{ options.countryCode }} country code"
}
```

## Referencing other field's values
At times, you would want to write validation rules, that relies on other fields to run the validation. 

In the following example, the `requiredIfExists` validation rule first checks for the `username` before enforcing the required validation on the `password` field.

```ts
schema.create({
  password: schema.string.optional({}, [
    rules.requiredIfExists('username')
  ])  
})
```

Now, if you are creating a rule with similar behavior, you can access the value of other fields as shown in the following example:

```ts
import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('my-rule', (value, _, { root, tip }) => {
  validator.helpers.getFieldValue('username', root, tip)
})
```

### What is `root` and `tip`?
The `root` is the original data object passed to the `validator.validate` method. And, the `tip` is the closest parent object of the current field.

Given the following data object (`root`).

```ts
{
  user: {
    profile: {
      username: 'virk',
    }
  }
}
```

The validation function is executed for the `username` property, the `tip` will the following object.

```ts
{
  username: 'virk'
}
```

We maintain a reference to the `tip`, so that we are not performing nested lookups for multiple properties of the same object and for multiple validation rules applied on a single property.

So, now as you know about the `root` and the `tip` properties, you need to pass these values to the `helpers.getFieldValue` method and it will lookup the value for you.
