---
permalink: guides/database/seeds
group: Database
---

# Database seeding
Database seeding is a way to setup your application with some initial data that is required to run and use the application. For example:

- Creating a seeder to insert countries, states and cities before deploying and running your application.
- Or a seeder to insert users inside the database for local development.

In AdonisJS, the seeders are stored inside the `database/Seeders` directory. You can create seeders manually or run the following ace command to create one for you.

```sh
node ace make:seeder User
```

The seeder file is a standard Javascript class as shown in the following example:

```ts{}{database/Seeders/UserSeeder.ts}
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {

  public async run () {
    await User.createMany([
      {
        email: 'virk@adonisjs.com',
        password: 'secret',
      },
      {
        email: 'romain@adonisjs.com',
        password: 'supersecret'
      }
    ])
  }

}
```

- As you can see, the `UserSeeder` is a standard Javascript class extending the `BaseSeeder`.
- Within the `run` method, you can execute the database operations.

## Running seeders
You can execute all or selected database seeders as shown below:

```sh
# runs all
node ace db:seed
```

```sh
# runs database/Seeders/UserSeeder
node ace db:seed --file=UserSeeder
```

There is also an interactive mode to manually select one or more seeders to execute.

```sh
node ace db:seed -i
```

## Development only seeders
Lucid allows you to mark your certain seeder files to be available only during the development phase. This ensures that by mistake you are not seeding your production database with dummy data.

```ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run () {
  }

}
```

The `developmentOnly` flag ensures that this file is never executed when `process.env.NODE_ENV = 'production'`.

## Idempotent operations
Unlike migrations, there is no tracking system in place for the database seeders. In other words, executing a seeder multiple times will perform the inserts multiple times as well.

Based upon the nature of a seeder, you may or may not want this behavior. For example:

- It is okay to run a `PostSeeder` for multiple times and increase the number of posts you have in the database.
- On the other hand, you would want the `CountrySeeder` to perform inserts only once. These kind of seeders are idempotent in nature.

Fortunately, Lucid models has inbuilt support for idempotent operations using methods like `updateOrCreate` or `fetchOrCreateMany`. Continuing with the `CountrySeeder`, following is an example of creating countries only once.

```ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Country from 'App/Models/Country'

export default class CountrySeeder extends BaseSeeder {

  public async run () {
    const uniqueKey = 'isoCode'

    await Country.updateOrCreateMany(uniqueKey, [
      {
        isoCode: 'IN',
        name: 'India',
      },
      {
        isoCode: 'FR',
        name: 'France',
      },
      {
        isoCode: 'TH',
        name: '	Thailand',
      },
    ])
  }

}
```

In the above example, the `updateOrCreateMany` method will look for existing rows inside the database using the `isoCode` code and only inserts the missing ones and hence running the `CountrySeeder` for multiple times will not insert duplicate rows.

[tip]
Learn more about the other idempotent methods [here](/guides/models/crud-operations#find-or-create).
[/tip]
