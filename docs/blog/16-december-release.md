---
permalink: blog/december-2020-release
title: December Release (2020)
group: blog
meta:
  number: 16
  published_on: 2020-12-7
  author: Harminder Virk
---

This release has been mainly focused on fixing bugs and making subtle improvements to the existing packages and API.

## Highlights

- Add support for [redis provider](#auth-tokens-redis-provider) for storing API tokens
- Add support for [mailer classes](#mailer-classes)
- A new syntax for [Edge components](#new-syntax-for-edge-components).
- A bunch of [small additions](#other-improvements), along with some [bug fixes](#bug-fixes)

## Upgrading dependencies

Make sure you update all the `@adonisjs/*` packages to their latest alpha releases. For example:

```sh
npm i @adonisjs/core@alpha @adonisjs/lucid@alpha <other-packages>
```

There are no breaking changes in this release, so expect everything to work smoothly.

## Auth tokens Redis provider

We have added another provider for storing [api tokens](/guides/auth/api-guard#where-tokens-are-saved) to Redis. This is how we expect you to choose between the `database` and the `redis` provider.

- Use the `database` provider, when the **api tokens** are the secondary way of authenticating users. For example, You let the users of your app generate personal access tokens that they can use as an alternative to authenticate.

Usually, the personal access tokens are long-lived and are not generated in bulk in a short time and hence SQL database storage is perfect for them.

- Use the `redis` provider, when the **api tokens** are the primary way of authenticating users. For example, You are generating them to authenticate the users of your mobile app or a SPA.

In this scenario, tokens are generated in bulk and will be expired after some duration. Redis is a perfect storage option here since it auto cleans the expired key-value pairs

The configuration for the tokens is defined within the `config/auth` file.

[codegroup]

```ts{}{Database provider}
{
  tokenProvider: {
    driver: 'database',
    table: 'api_tokens',
  }
}
```

```ts{}{Redis provider}
{
  tokenProvider: {
    driver: 'redis',
    connection: 'local',
  }
}
```

[/codegroup]

When using the Redis driver, you have to define the connection inside the `config/redis` file and reference the connection name from the `tokenProvider.connection` property.

## Mailer classes

You can now configure/send emails by defining them inside a dedicated mailer class. This will clean up your controllers as you can remove all the inline `Mail.send` calls. Also, the self-contained mailer classes are easier to unit test.

Begin by upgrading the `@adonisjs/mail` package.

```sh
npm i @adonisjs/mail@alpha
```

[note]
The following steps are only required when upgrading an existing application. For new applications, the command will be added automatically on the `node ace invoke` call.
[/note]

Next, open the `.adonisrc.json` file and register the mail package to the array of commands.

```json
{
  "commands": [
    // ...
    "@adonisjs/mail/build/commands"
  ]
}
```

Finally, run the following ace command to generate a manifest file of all the commands available in your app.

```sh
node ace generate:manifest
```

After this, you can create mailer classes by running the `node ace make:mailer` command. Also make sure to read the [docs](/guides/mail#mailer-classes) as well.

## New syntax for Edge components

With the latest release of the `@adonisjs/view` package, we will recursively scan the `resources/views/components` directory for `.edge` templates and make them available as tags. For example:

Instead of writing the following

```edge
@component('components/modal', { title: 'Want to continue?' })
@endcomponent
```

You can now write

```edge
@modal({ title: 'Want to continue?' })
@end
```

In this approach, the file name becomes the tag name. The filenames using `_` or `-` will be converted to `camelCase`.

- `components/form-input.edge` becomes `@formInput()`
- `components/user_avatar.edge` becomes `@userAvatar()`

The components inside nested directories are accessible using the dot `.` separator.

- `components/form/input.edge` becomes `@form.input()`

## Other improvements

- Add [url validation rule](/guides/validator/rules#rulesurl) to the validator.
- Add [`updateOrCreateMany`](/guides/model-relations/has-many#updateorcreatemany) method to the has many relationship.
- Add support for [serializing](/guides/models/serializing-models#serializing-extras) the model `$extras` object.
- Crash process on `uncaughtException` exception. As per [Node.js](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly) **"It is not safe to resume normal operation after 'uncaughtException'"** and hence AdonisJS now listens for this event and calls the `process.exit` method.

## Bug fixes

- fix: convert milliseconds to seconds when passing to Redis. [501cc8d078](https://github.com/adonisjs/session/commit/501cc8d0781c584c435fa463f11128044d7cad8b)
- fix: ignore body when status code is 304. [e2dac2060](https://github.com/adonisjs/http-server/commit/e2dac2060704e68fbfb277321142b05e33919f05)
- fix: set correct exit code for the commands. [0047d5b72](https://github.com/adonisjs/lucid/commit/0047d5b728a1e6e73cc6b575fb4289ab4cfee26f). Fixes [#119](https://github.com/adonisjs/ace/issues/119).
