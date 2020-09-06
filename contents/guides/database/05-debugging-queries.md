---
permalink: guides/database/debugging-queries
group: Database
---

# Debugging Queries
The best way to debug queries is to listen for the `db:query` event and log every query to the console. To begin, lets create `start/events.ts` file using the following ace command.

```sh
node ace make:prldfile events
# ✔  create    start/events.ts
```

Open the newly created file and paste the following code snippet inside it.

[note]

The `start/events.ts` file is registered inside `.adonisrc.json` and autoloaded during the application boot.

[/note]

```ts{}{start/events.ts}
import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'

Event.on('db:query', Database.prettyPrint)
```

Next, you will have to enable the `debug` flag for your database connection inside the `config/database.ts` file.

```ts{5}{config/database.ts}
{
  pg: {
    client: 'pg',
    connection: {},
    debug: true,
  }
}
```

That's all. Now, all the executed database queries will be pretty printed on the console as shown in the following screenshot.

![](https://res.cloudinary.com/adonis-js/image/upload/v1596793952/adonisjs.com/query-events_cdxsku.png)

### How it works?

- Lucid emits the `db:query` event for every SQL query executed by any part of your application.
- You can manually handle the event or make use of the `Database.prettyPrint` method to log the query to the console with some colors and formatting.
- The event is only emitted when `debug` flag is set to `true`.

## Debugging in Production
The above setup is great for development as you can view every single pretty printed to the console for better readability. However, in production, it is recommended to use the [Logger](/guides/logger) for logging queries in a serialized format and have minimum logging overhead.

Instead of using `Database.prettyPrint` you must use the `Logger.debug` method.

```ts{}{start/events.ts}
import Event from '@ioc:Adonis/Core/Event'
import Logger from '@ioc:Adonis/Core/Logger'

Event.on('db:query', (query) => Logger.debug(query))
```

You can also conditionally decide the listener for the `db:query` event based upon the application environment.

```ts{7-11}{start/events.ts}
import Event from '@ioc:Adonis/Core/Event'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'

Event.on('db:query', (query) => {
  if (Application.inProduction) {
    Logger.debug(query)
  } else {
    Database.prettyPrint(query)
  }
})
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
