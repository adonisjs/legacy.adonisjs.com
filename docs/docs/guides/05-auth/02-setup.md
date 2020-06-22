---
permalink: guides/auth/setup
group: Authentication
---

# Setup
In this guide, you will install `@adonisjs/auth` package and configure it with the desired provider and the guard.

Let's begin by installing the package from the npm registry.

[note]
The auth provider relies on the `@adonisjs/lucid` package. So make sure that it is [configured properly](/guides/database/setup) before installing the auth package.
[/note]

[codegroup]
```sh{}{npm}
npm i @adonisjs/auth@alpha
```

```sh{}{yarn}
yarn add @adonisjs/auth@alpha
```
[/codegroup]

Next, run the following ace command to setup the package.

```sh
node ace invoke @adonisjs/auth
```

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1592764868/adonisjs.com/auth-api-setup_amvpvi.mp4", controls]

- The setup command prompts you to select the `provider` and the `guard` and generates the config file based on your selection
- When using Lucid, you are also prompted to create the model.
- Finally, you can optionally create the migrations to setup the database tables.

## Run migrations
The `ace invoke` command creates a migration file with the following contents to create the database table.

[note]
Feel free to make any modifications to the migration file. Just make sure that `password` and the `remember_me_token` fields are present.
[/note]

```ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
```

Execute the following command to run the pending migrations.
```sh
node ace migration:run
```

## Contracts overview
During the setup process, we create a `contracts/auth.ts` file. This file contains the **static definition** of providers and guards you want to use inside your application.

```ts{}{contracts/auth.ts}
import User from 'App/Models/User'

declare module '@ioc:Adonis/Addons/Auth' {
  interface ProvidersList {
    user: {
      implementation: LucidProviderContract<typeof User>,
      config: LucidProviderConfig<typeof User>,
    },
  }

  interface GuardsList {
    web: {
      implementation: SessionGuardContract<'user', 'web'>,
      config: SessionGuardConfig<'user'>,
    },
  }
}
```

The contract file puts static validation on your configuration file and the runtime code. 

For example: If you decide to use a different model (other than the User model), then first change it inside the contract file and then the typescript compiler will also force you to update the config file as well.

In other words, think of this file as a single source of truth for inferring static types and intellisense throughout your application.

## Config overview
The configuration for the auth module is stored inside `config/auth.ts` file. Lets go through some of the important configuration options for a better understand of the authentication flow.

### `guard`
The `guard` property defines the default guard you want to use for authentication. Having a default guard removes the need of first selecting the guard and then performing actions on it. For example:

Instead of writing
```ts
auth.use('web').login()
```

You can write the following code and the auth module will automatically use the default guard to execute the `login` action.
```ts
auth.login()
```

### `list`
The `list` property holds a collection of one or more guards you want to use. Majority of applications will only need a single guard. However, there can be situations, when you want support multiple style of login. For example:

- Using the `web` guard to login and authenticate users on your web application.
- And using the `jwt` guard for mobile app authentication.

### `provider.model`
The `model` property is used by the `lucid` provider. You can make use of any Lucid model here, just make sure that the model has `password` and `rememberMeToken` properties on it.

During the `login`, or the `authenticate` calls, we will use this model to look up a user.

### `provider.uids`
The `uids` property allows the user of your website to login using multiple identifiers. For example: If you want your users to login with both the `email` and the `username`, then you can add to the `uids` arrays.

### `providers.usersTable`
The `database` provider needs the name of the `table` to lookup users. Just make sure that the `usersTable` has `password` and `remember_me_token` columns.
