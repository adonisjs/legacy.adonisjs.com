---
permalink: guides/database/redis
group: Database
category: Redis
sidebarTitle: Usage
---

# Redis Usage
AdonisJS has its own first party package for working with a Redis database. It internally wraps [ioredis](https://github.com/luin/ioredis) but improves the **pub/sub layer** and provides first class support for **connections management** and **health checks**.

By the end of this guide, you will know:

- How to setup the redis package
- How to make use of Redis pub/sub system
- How to enable health checks

## Setup
Install the `@adonisjs/redis` package from npm registry using the following command.

[codegroup]

```sh{}{npm}
npm i @adonisjs/redis@alpha
```

```sh{}{yarn}
yarn add @adonisjs/redis@alpha
```

[/codegroup]

### Invoke Generator
AdonisJS packages can configure themselves by running the post install instructions. Run the following command to setup `@adonisjs/redis` package.

```sh
node ace invoke @adonisjs/redis

#    create    config/redis.ts
#    create    contracts/redis.ts
#    update    .env
#    update    tsconfig.json { types += @adonisjs/redis }
#    update    .adonisrc.json { providers += @adonisjs/redis }
# ✔  create    ace-manifest.json
```

## Configuration
The configuration for redis is stored inside `config/redis.ts` file. You can define one or more named connections inside this file and their lifecycle will be managed automatically.

[note]
When adding new connections, make sure to first define them inside `contracts/redis.ts` file. Otherwise, the Typescript static compiler will complain about the unknown connections.
[/note]

```ts
{
  connection: Env.get('REDIS_CONNECTION', 'local') as 'local',
  connections: {
    local: {
      host: Env.get('REDIS_HOST', '127.0.0.1') as string,
      port: Env.get('REDIS_PORT', '6379') as string,
      password: Env.get('REDIS_PASSWORD', '') as string,
      db: 0,
      keyPrefix: '',
    },
  }
}
```

## Usage
Once the setup has been done, you can import the module and execute the redis commands.

```ts
import Redis from '@ioc:Adonis/Addons/Redis'

await Redis.set('foo', 'bar')
const value = await Redis.get('foo')
```

- All of the method from [ioredis](https://github.com/luin/ioredis) are supported.
- You can use the `Redis.connection` method to execute commands on a specific connection.
  ```ts
  Redis.connection('name').get('foo')
  ```

- The connections are only created once (on the first use) and then re-used for the lifecycle of the process.

## Pub/Sub
Redis forces you to maintain two separate connections when using `pub/sub`, where the subscriber uses a dedicated connection just listening for new messages.

In AdonisJS,  we have improved the API of pub/sub and manage the subscriber connection internally for you, so that you don't have to create and manage it manually.

For demonstration, lets create a pub/sub channel for tracking user signups. Begin by creating a new preload file by executing the following ace command.

```sh
node ace make:prldfile redis

# ✔  create    start/redis.ts
```

Open the newly created file and paste the following code snippet inside it.

```ts{}{start/redis.ts}
import Redis from '@ioc:Adonis/Addons/Redis'

Redis.subscribe('user:signup', (user: string) => {
  console.log(JSON.stringify(user))
})
```

Next, create a dummy route to publish to the `user:signup` channel on every new HTTP request.

```ts{}{start/routes.ts}
import Route from '@ioc:Adonis/Core/Route'
import Redis from '@ioc:Adonis/Addons/Redis'

Route.get('/signup', async () => {
  await Redis.publish('user:signups', JSON.stringify({ id: 1 }))

  return 'handled'
})
```

- The `Redis.subscribe` method listens for messages on a given channel. 
- The `Redis.publish` method is used to publish events to a given channel.
- The messages are passed as string, since Redis doesn't support other data types during Pub/sub.


### Pattern pub/sub
Redis also supports pub/sub using patterns. Instead of `subscribe`, you have to use the `psubscribe` method.

```ts
Redis.psubscribe('user:*', (event: string, user: string) => {
  console.log(event, JSON.stringify(user))
})
```

## Health Checks
The Redis module uses the AdonisJS [health check](/guides/health-check) module to report the connections health. All you need to do is enable inside the config file.

```ts{}{config/redis.ts}
{
  local: {
    host: Env.get('REDIS_HOST', '127.0.0.1') as string,
    port: Env.get('REDIS_PORT', '6379') as string,
    password: Env.get('REDIS_PASSWORD', '') as string,
    db: 0,
    keyPrefix: '',
    healthCheck: true, // 👈 health check
  },
}
```

Now, you can use the health check module to view the status of your redis connections.

```ts
import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})
```

![](https://res.cloudinary.com/adonis-js/image/upload/v1592724884/adonisjs.com/redis-health-check.png)

## Closing connections
You can close the redis connections using one of the following methods.

### `quit`
The `quit` method closes the redis connection gracefully. This method will wait for all queued commands to finish.

```ts
await Redis.quit()
await Redis.connection('name').quit()
```

### `disconnect`
The `disconnect` method doesn't wait for existing commands to finish and will disrupt the connection immediately.

```ts
await Redis.disconnect()
await Redis.connection('name').disconnect()
```

### `quitAll`
Similar to `quit`, but quits all the connections

```ts
await Redis.quitAll()
```

### `disconnectAll`
Similar to `disconnect`, but disconnects all the connections.

```ts
await Redis.disconnectAll()
```
