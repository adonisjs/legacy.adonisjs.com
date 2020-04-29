---
permalink: guides/http/file-uploads
category: Handling HTTP Requests
group: Basics
---

# File Uploads

AdonisJS provides you a robust and performant API for dealing with file uploads. Not only you can process and store uploaded files locally, you can also **stream them directly to the cloud services like S3, Cloudinary or Google cloud storage.**

By the end of this guide you will know:

1. How to access user uploaded files.
2. How to validate and store files locally on the filesystem.
3. How to stream files directly to the cloud services.

## Setup

The BodyParser middleware reads the **request body including the uploaded files** and make them available on the `request` object. So, before moving any forward, let's make sure that the middleware is registered under the list of global middleware.

Open `start/kernel.ts` file and ensure that the file has the following line of code inside it.

```ts
Server.middleware.register([
  'Adonis/Core/BodyParserMiddleware',
])
```

### Config

The configuration for file uploads is stored inside `config/bodyparser.ts` file under the `multipart` object. The config file is extensively documented, so feel free to go through all the available options and tweak them as per your needs.
 
## Basic File Upload
All of the user uploaded files can be accessed using one of the following methods.

- `request.file('fieldName')`: to access file for a given field.
- `request.files('fieldName')`: to access multiple files for a given field.
- `request.allFiles()`: to access all files.

For demonstration purposes, lets setup initial set of routes and create a form to upload files to the server.

```ts{}{start/routes.ts}
Route.on('users/create').render('users/create')
```

```edge{}{users/create.edge}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title> Add a new user </title>
</head>
<body>
  <form
    action="{{ route('UsersController.store') }}"
    enctype="multipart/form-data"
    method="POST"
  >
    <div>
      <p>
        <label for="email"> Email </label>
      </p>
      <input type="text" name="email">
    </div>

    <div>
      <p>
        <label for="avatar"> Upload user avatar </label>
      </p>
      <input type="file" name="avatar">
    </div>

    <hr>

    <div>
      <button type="submit"> Add User </button>
    </div>
  </form>
</body>
</html>
```

If you now visit [http://localhost:3333/users/create](http://localhost:3333/users/create), you must see the above created HTML form.

### Access Uploaded Files
The next step is to access and store the user uploaded files on the server. Create a new controller and also register the route to handle form submission.

```ts{}{start/routes.ts}
Route.post('users', 'UsersController.store')
```

```sh
node ace make:controller Users
```

```ts{}{UsersControllers.ts}
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

export default class UsersController {
  public async store ({ request }: HttpContextContract) {

    const avatar = request.file('avatar')
    if (!avatar) {
      return 'Please upload file'
    }

    await avatar.move(Application.tmpPath('uploads'))

    return 'File uploaded successfully'
  }
}
```

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1582432797/adonisjs.com/adonis-file-upload_s2bwdj.mp4", controls]

### Renaming Uploaded Files
Currently the user uploaded files are saved with the original file name. However, you can rename them during the move operation.

```ts
await avatar.move(Application.tmpPath('uploads'), {
  // highlight-start
  name: `${new Date().getTime()}.${avatar.extname}`,
  // highlight-end
})
```

## Validating Uploaded Files
AdonisJS automatically validate files when you try to access them. All you need to do is define the validation options.

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

export default class UsersController {
  public async store ({ request }: HttpContextContract) {
    const avatar = request.file('avatar', {
      // highlight-start
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
      // highlight-end
    })

    if (!avatar) {
      return 'Please upload file'
    }

    if (avatar.hasErrors) {
      return avatar.errors
    }

    await avatar.move(Application.tmpPath('uploads'))
    return 'File uploaded successfully'
  }
}
```

### Using Request Validator
Another way to validate files is to make use of the request validator. Assuming you are already aware with the validator syntax from the [form submissions guide](form-submissions#validating-form-data), following is the code snippet for validating files using the validator.

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

export default class UsersController {
  public async store ({ request }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string(),
      // highlight-start
      avatar: schema.file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      }),
      // highlight-end
    })

    const data = await request.validate({
      schema: userSchema,
    })

    await data.avatar.move(Application.tmpPath('uploads'))
    return 'File uploaded successfully'
  }
}
```

Next step is to display the validation errors to the user. Open the template file `users/create.edge` and replace its contents with the following code snippet.

```edge{}{users/create.edge}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title> Add a new user </title>
</head>
<body>
  <form
    action="{{ route('UsersController.store') }}"
    enctype="multipart/form-data"
    method="POST"
  >
    <div>
      <p>
        <label for="email"> Email </label>
      </p>
      <input type="text" name="email">
      // highlight-start
      @if(flashMessages.has('errors.email'))
        {{ flashMessages.get('errors.email') }}
      @endif
      // highlight-end
    </div>

    <div>
      <p>
        <label for="avatar"> Upload user avatar </label>
      </p>
      <input type="file" name="avatar">
      // highlight-start
      @if(flashMessages.has('errors.avatar'))
        {{ flashMessages.get('errors.avatar') }}
      @endif
      // highlight-end
    </div>

    <hr>

    <div>
      <button type="submit"> Add User </button>
    </div>
  </form>
</body>
</html>
```

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1582438390/adonisjs.com/adonis-validator-file-uploads_l7fhfl.mp4", controls]

## Custom Error Messages
Following is an example of defining custom error messages when validating files using the request validator.

```ts
// highlight-start
const messages = {
  'avatar.file.extname': 'You can only upload images',
  'avatar.file.size': 'Image size must be under 2mb',
}
// highlight-end

const data = await request.validate({
  schema: validator.compile(userSchema),
  // highlight-start
  messages,
  // highlight-end
})
```
