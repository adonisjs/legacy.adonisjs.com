---
permalink: guides/validator/usage
group: Validator
---

# Usage
In this guide, we will walk through the multiple examples covering different use cases 

Lets 

## Validating HTTP requests
Most of the times, you will be using the validator to validate the forms/data submitted over an HTTP request. So let's begin with the most simplest approach of validating the user input inside an HTTP controller.

```ts{}{app/Controllers/Http/AuthController.ts}
// highlight-start
import { schema } from '@ioc:Adonis/Core/Validator'
// highlight-end
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async register ({ request }: HttpContextContract) {
    const userSchema = schema.create({
    })

    return request.all()
  }
}
```
