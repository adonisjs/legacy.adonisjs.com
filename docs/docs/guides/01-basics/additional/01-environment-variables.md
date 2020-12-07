---
permalink: guides/environment-variables
category: Additional Resources
group: Basics
---

# Environment Variables

As the name suggests, environment variables are the values that differ across different environments For example: having different database credentials in development and production environments.

Environment variables is such a widely accepted concept that you will find them everywhere and hence AdonisJS supports them too. In this guide, we will cover the following topics

- Validating environment variables
- Using the `.env` files during development
- And validating environment variables

## How environment variables are defined?
The simplest way to define environment variables is to make use of the `set` keyword on your command line. For example:

```sh
set NODE_ENV=development

# now start the server
node server.js
```

Defining environment variables like above is a tedious task and hence most of the cloud providers like **Heroku**, **Cleavr** or **AWS** let you define the environment variables from their control panel.

Similarly, many frameworks (including AdonisJS) let you define environment variables inside the `.env` file during development. The dotenv file uses the bash syntax for defining variables as a key-value pair. For example:

```sh{}{.env}
NODE_ENV=development
PORT=3333
HOST=0.0.0.0
```

## Accessing environment variables in Node.js
Node.js let you read the environment variables using the `process.env` object. Try logging the `env` object and you will see all the values available to your application at runtime.

```ts
console.log(process.env)
```

## AdonisJS Env module
The Env module of AdonisJS brings some improvements over the `process.env` API offered by Node. You can import and use the module as follows:

```ts
import Env from '@ioc:Adonis/Core/Env'

Env.get('NODE_ENV')

// with default value
Env.get('NODE_ENV', 'development')
```

### Validating environment variables
Environment variables are injected from outside-in to your application and you have little or no control over them within your codebase.  

Missing or in-correct values can lead to unstable or in-secure behavior and hence it is extremely important to validate environment variables during the application boot cycle.

AdonisJS has first class support for validating environment variables. All of the validation rules are defined inside the `env.ts` file inside the project root.

[note]
Feel free to create the `env.ts` file if it is missing. Also make sure that you are using `@adonisjs/core@5.0.4-preview-rc` or greater.
[/note]

```ts
import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  // ... rest of the validations
})
```

- It is optional to validate your environment variables. However, we encourage you to validate them.
- All the environment variables, regardless of whether they are defined inside the `.env` file or not can be validated.
- You can also use your own functions for custom validations.

Out of the box, the following methods are available for validating the environment variables.

#### `Env.schema.string`
Validates the value to exist and be a valid string. Empty strings fails the validations and you must use the optional variant to allow empty strings.

```ts
{
  APP_KEY: Env.schema.string()
}

// optional values
{
  APP_KEY: Env.schema.string.optional()
}
```

You can also force the value to have one of the pre-defined formats.

```ts
// Must be a valid host (url or ip)
Env.schema.string({ format: 'host' })

// Must be a valid url
Env.schema.string({ format: 'url' })

// Must be a valid email address
Env.schema.string({ format: 'email' })
```

When validating for the `url` format. You can also define additional options to force/ignore the `tld` and `protocol`.

```ts
Env.schema.string({ format: 'url', tld: false, protocol: false })
```

#### `Env.schema.boolean`
Enforces the value to be a valid string representation of a boolean. Following values are considered as valid booleans and are casted to `true` or `false`.

- `'1', 'true'` are casted to `true`
- `'0', 'false'` are casted to `false`

```ts
{
  CACHE_VIEWS: Env.schema.boolean()
}

// optional values
{
  CACHE_VIEWS: Env.schema.boolean.optional()
}
```

#### `Env.schema.number`
Enforces the value to be a valid string representation of a number.

```ts
{
  PORT: Env.schema.number()
}

// optional values
{
  PORT: Env.schema.number.optional()
}
```

#### `Env.schema.enum`
Forces the value to be one of the pre-defined values.

```ts
{
  NODE_ENV: Env
    .schema
    .enum(['development', 'production'] as const)
}

// optional values
{
  PORT: Env
    .schema
    .enum
    .optional(['development', 'production'] as const)
}
```

#### Custom functions
You can also define your own custom functions for validating the environment variables. Just remember the following rules:

- You must return the value after validating it.
- The return value of your function will be used as the final casted value. It can be different from the input value.

```ts
{
  PORT: (key, value) => {
    if (!value || isNaN(Number(value))) {
      throw new Error('Value for PORT is required')
    }

    return Number(value)
  }
}
```

### Casting values to correct data types
Environment variables at Node.js level are always represented as string. Even if you have defined a boolean value inside the `.env` file Node.js will read and store it as a string.

Contrary to the Node.js behavior, the values validated using the AdonisJS `Env` module are casted to their expected data type. For example: If you validate `CACHE_VIEWS` using the boolean rule, then its value will be casted to a boolean.

```ts
Env.rules({
  CACHE_VIEWS: Env.schema.boolean()
})

// In some other file
Env.get('CACHE_VIEWS') // true (boolean)
process.env.CACHE_VIEWS // 'true' (string)
```

### Intellisense support
Being a Typescript first framework, AdonisJS makes sure that along with the runtime validations you get proper intellisense for the validated environment variables.

Copy/paste the following code snippet inside the `contracts/env.ts` (file path doesn't matter in this case) and all calls to `Env.get` will infer the types for the validated values.

[note]
All newly created applications already have this file, so feel free to ignore this section
[/note]

```ts
declare module '@ioc:Adonis/Core/Env' {
  type CustomTypes = typeof import('../env').default
  interface EnvTypes extends CustomTypes {}
}
```

![](https://res.cloudinary.com/adonis-js/image/upload/v1603465509/adonisjs.com/env-types.png)
