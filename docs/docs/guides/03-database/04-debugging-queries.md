---
permalink: guides/database/debugging-queries
group: Database
---

# Debugging Queries
The best way to debug queries is to listen for the `db:query` event and log every to the console. To begin, let's open the `AppProvider.ts` file and paste the following code inside the `start` method.

[tip]
The start method is called automatically, when the application has been booted and ready to accept HTTP requests.
[/tip]

```ts{}{providers/AppProvider.ts}
import { IocContract } from '@adonisjs/fold'

export default class AppProvider {
  constructor (protected container: IocContract) {
  }

  public async ready () {
    // highlight-start
    const Database = (await import('@ioc:Adonis/Lucid/Database')).default
    const Event = (await import('@ioc:Adonis/Core/Event')).default
    Event.on('db:query', Database.prettyPrint)
    // highlight-end
  }
}
```

Next, you will have to enable the `debug` flag for your database connection inside the `config/database.ts` file.

```ts{}{config/database.ts}
{
  pg: {
    client: 'pg',
    connection: {
      debug: true,
    },
  }
}
```

- Lucid will emit the `db:query` event for every SQL query executed by any part of the application.
- You can manually handle the event data or make use of the `Database.prettyPrint` method to log the query to the console with some colors and formatting.
- Once you turn off the `debug` flag inside your config file. The `db:query` event won't be emitted.

## Debugging in Production
The above setup is great for development, since you can view every single pretty printed to the console for better readability. However, in production, it is recommended to use the [Logger](/guides/logger) for logging queries in a serialized format and have minimum logging overhead.

Instead of using `Database.prettyPrint`, you can make use of the `Logger.debug` method.

```ts
public async ready () {
  // highlight-start
  const Logger = (await import('@ioc:Adonis/Core/Logger')).default
  const Event = (await import('@ioc:Adonis/Core/Event')).default
  Event.on('db:query', (query: any) => Logger.debug(query))
  // highlight-end
}
```

## Selectively Logging Queries
Logging every single query in production is not a great idea for following reasons.

- You will degrade the performance of your application by increasing logging overhead.
- Your logs will become too noisy.
- If you are using a paid logging service, then you may end up paying more.

As a rule of thumb, you should always disable queries debugging in production by setting the `debug = false` inside the `config/database.ts` file, and then **selectively debug individual queries** that are critical for your application.

The query logging for an individual query can be enabled using the `debug` method.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

await Database
  .query()
  .select('*')
  .from('users')
  .debug(true) 👈
```

Lucid will emit `db:query` event just for the above query.

## Final Recipe
Following is the final recipe to have best debugging experience during development and being selective in production.

- Disable debugging in production
  ```ts{}{config/database.js}
  import Application from '@ioc:Adonis/Core/Application'

  {
    pg: {
      client: 'pg',
      connection: {
        debug: !Application.inProduction,
      },
    }
  }
  ```
- Choose the appropriate query logger based upon the application environment
  ```ts{}{providers/AppProvider.ts}
  import { IocContract } from '@adonisjs/fold'

  export default class AppProvider {
    constructor (protected container: IocContract) {
    }

    public async ready () {
      const Application = (await import('@ioc:Adonis/Core/Application')).default
      const Event = (await import('@ioc:Adonis/Core/Event')).default

      const Logger = (await import('@ioc:Adonis/Core/Logger')).default
      const Database = (await import('@ioc:Adonis/Lucid/Database')).default

      Event.on('db:query', (query: any) => {
        if (Application.inProduction) {
          Logger.debug(query)
        } else {
          Database.prettyPrint(query)
        }
      })
    }
  }  
  ```
- Use the `debug()` method on query builder to enable debugging for selected queries.
