---
permalink: guides/http/content-negotiation
category: Handling HTTP Requests
group: Basics
---

# Content Negotiation
[Content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) is the mechanism that is used for serving **different representations of a resource** from the same URL. The content negotiation is done using the `Accept` HTTP header and in this guide you will learn how content negotiation works in AdonisJS.

## When to use content negotiation?
Content negotiation is helpful, when you (the webservice provider) decides to support different representations of a single resources. For example: Creating an API sever, that can respond both with XML and JSON.

The client sets the appropriate `Accept` header and server uses its value to respond with the correct response type. In AdonisJS, you can use the `request.accepts` method to find the best possible response type for a given HTTP request.

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {
  public async index ({ request, view }: HttpContextContract) {
    const posts = [{
      title: 'Adonis 101',
    }]

    // highlight-start
    switch (request.accepts(['html', 'json'])) {
      case 'html':
        return view.render('posts/index', { posts })
      case 'json':
        return posts
      default:
        return view.render('posts/index', { posts })
    }
    // highlight-end
  }
}
```

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1582537642/adonisjs.com/adonis-negotiation_nemsvr.mp4", controls]

## Content Negotiation in Exception Handler
The [base exception handler](https://github.com/adonisjs/adonis-framework/blob/develop/src/HttpExceptionHandler/index.ts#L177) of AdonisJS also uses content negotiation for returning errors in the correct format. 

- **If HTML**: Render status pages or return error as an HTML string.
- **If JSON**: Render error as an error object
- **If JSONAPI**: Render error in the format as per the [JSONAPI spec](https://jsonapi.org/format/#errors).


## Content Negotiation in Validation Exception
The [AdonisJS validator](https://github.com/adonisjs/validator/blob/develop/src/Bindings/Request.ts#L32) also use content negotiation for returning validation error messages in the correct format. 

- **If HTML**: Use session flash messages for passing errors to the form and redirect the request.
- **If JSON**: Return errors as an array of objects.
- **If JSONAPI**: Returns errors as per the [JSONAPI spec](https://jsonapi.org/format/#errors).
