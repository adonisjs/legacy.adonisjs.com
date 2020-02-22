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

### Processing Modes

The user uploaded files can be handled in one of the following two ways:

1. **Process automatically (default mode)**: This is the traditional approach, where AdonisJS will automatically move all the uploaded files to the `tmp` directory. Inside your controllers you can validate and move files from the `tmp` directory to a permanent location or stream them to the cloud services like s3.

2. **Process manually from incoming stream**: In this mode, AdonisJS will not touch the incoming HTTP request stream and passes it directly to the controller. Also, AdonisJS provides you bunch of helper functions for handling streams in the most efficient way possible. 

Both approaches have their own pros and cons and we will discuss them later in this document.
 
## Basic File Upload

Let's setup an HTML form for adding a new user along with their profile picture.

```html{8}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title> Add a new user </title>
</head>
<body>
  <form action="{{ route('UsersController.store') }}" enctype="multipart/form-data" method="POST">
    <div>
      <p>
        <label for="email"> Email </label>
      </p>
      <input type="text" name="email">
    </div>

    <div>
      <p>
        <label for="profile_pic"> Profile Pic </label>
      </p>
      <input type="file" name="profile_pic">
    </div>

    <hr>

    <div>
      <button type="submit"> Add User </button>
    </div>
  </form>
</body>
</html>
```
