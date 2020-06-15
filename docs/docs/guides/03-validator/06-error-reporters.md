---
permalink: guides/validator/error-reporters
group: Validator
---

# Error Reporters
Validation error messages are consumed by many different parts of your application. You may use them at the time of **rendering the Edge template** or you may want to **pass it to frontend client** from your REST API server.

In other words, you will want different representation of the same error messages, based upon the consumer of your app. For example:

- The Edge templates just want an array of messages in reference to a form field name.
- A [JSONAPI](https://jsonapi.org/) spec complaint server should return the error messages as per the [spec](https://jsonapi.org/format/#errors).
- Or, maybe you want to render them as XML.

If validation error messages always had a fixed shape, then you will have to manually loop over them for restructuring. **Luckily, not with error reporter**.

## Defining reporter
The `validator.validate` or `request.validate` methods optionally accepts a reporter to format the error messages. You can pass one of the pre-bundled reporters or a custom one.

```ts
import { schema, validator } from '@ioc:Adonis/Core/Validator'

validator.validate({
  schema: schema.create({}),
  reporter: validator.reporters.api, // 👈 using reporter
})
```

### API Error Reporter
You must use the `api` reporter, when creating an API server and not following any particular spec. Following is an example of the error message formatted using the `api` reporter.

```json
{
  "errors": [
    {
      "rule": "required",
      "field": "phone",
      "message": "required validation failed"
    }
  ]
}
```

### JSONAPI error reporter
The `jsonapi` error reporter will format error messages as per the [JSON API spec](https://jsonapi.org/format/#errors). Following is an example of the same

```json
{
  "errors": [
    {
      "code": "required",
      "source": {
        "pointer": "phone"
      },
      "title": "required validation failed"
    }
  ]
}
```

### Web error reporter
The `web` reporter must be used by server rendered applications. The error reporter redirects back to the form along with error messages stored as session [flash messages](/guides/http/sessions#flash-messages).

We recommend reading the [form submission guide](/guides/http/form-submissions#validating-form-data) to understand the flow

## Content Negotiation
The `request.validate` method uses the [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation#The_Accept_header) to choose the most appropriate error formatter for a given HTTP request.

- If the `Accept = 'application/vnd.api+json'` header is set, the `jsonapi` error reporter will be used.
- For `Accept = 'application/json'` header, the `api` error reporter will be used.
- For everything else, the `web` error reporter will be used.

## Creating your own error reporter
Creating your own error reporter is very simple, you just need to adhere to the `ErrorReporterContract` interface.

Create a new file `app/Validators/Reporters/MyReporter.ts` and paste the following contents inside it.

```ts{}{app/Validators/Reporters/MyReporter.ts}
import {
  ValidationException,
  MessagesBagContract,
  ErrorReporterContract,
} from '@ioc:Adonis/Core/Validator'

type ErrorNode = {
  message: string,
  field: string,
}

export class MyReporter implements ErrorReporterContract<{ errors: ErrorNode[] }> {
  public hasErrors = false

  /**
   * Tracking reported errors
   */
  private errors: ErrorNode[] = []

  constructor (
    private messages: MessagesBagContract,
    private bail: boolean,
  ) {
  }

  /**
   * Invoked by the validation rules to
   * report the error
   */
  public report (
    pointer: string,
    rule: string,
    message: string,
    arrayExpressionPointer?: string,
    args?: any
  ) {
    /**
     * Turn on the flag
     */
    this.hasErrors = true

    /**
     * Use messages bag to get the error message
     */
    const errorMessage = this.messages.get(
      pointer,
      rule,
      message,
      arrayExpressionPointer,
      args,
    )

    /**
     * Track error message
     */
    this.errors.push({ message: errorMessage, field: pointer })

    /**
     * Bail mode means, stop validation on the first
     * error itself
     */
    if (this.bail) {
      throw this.toError()
    }
  }

  /**
   * Converts validation failures to an exception
   */
  public toError () {
    throw new ValidationException(false, this.toJSON())
  }

  /**
   * Get error messages as JSON
   */
  public toJSON () {
    return {
      errors: this.errors,
    }
  }
}
```

Now, you can import this file and assign it to the reporter property.

```ts
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

validator.validate({
  schema: schema.create({}),
  reporter: MyReporter, // 👈 using reporter
})
```
