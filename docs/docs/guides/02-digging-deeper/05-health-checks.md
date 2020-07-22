---
permalink: guides/health-check
group: Digging Deeper
---

# Health Checks

In the era of Containers and Orchestration, it is very important for your application to report about its own health. For example, Kubernetes can use the health checks information for its [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

## How Health Checks Works?
AdonisJS exposes a unified module for health checks. The other parts of the application, including the packages you install, can register checkers to this module. For example: [Lucid registers](https://github.com/adonisjs/lucid/blob/develop/providers/DatabaseProvider.ts#L73) a checker for reporting its connectivity with the database.

[note]
You can make use of `HealthCheck.getReport` method to get the health check report and then share it with the external services.
If any of the registered checkers fails, your application will be considered unhealthy.
[/note]

Coming back to the Kubernetes example, you can expose the health of your application to Kubernetes using an HTTP route. The following code example is copied (with some modifications) from the [K8 official documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-liveness-http-request).

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: my-adonis-app
    image: my-docker-service/app
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 3
      periodSeconds: 3
```

As you can notice, the `livenessProbe` relies on the `/healthz` route to know the health of the application. If your app will respond with anything other than a `200`, then Kubernetes will consider it as unstable.

```ts
import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('/healthz', async ({ response }) => {
  // highlight-start
  const isLive = await HealthCheck.isLive()
  // highlight-end

  return isLive
    ? response.status(200).send({})
    : response.status(400).send({})
})
```

Since, Kubernetes only relies on the HTTP status, there is no need to fetch the complete report using `HealthCheck.getReport`. Just using `isLive` method is sufficient.

Similarly, you can use the same approach with other monitoring tools like Pingdom.

## Existing Health checkers
Following is the list of pre-bundled health checkers. You can also add your own checkers, and we will explore the API for that later in this guide.

### App Key Checker
The checker will look for the `APP_KEY` environment variable and fails if the key is missing or its length is less than 32 characters.

To fix the issue, you can generate a secure key using `node ace generate:key` command and set the output value as `APP_KEY` environment variable.

### NODE_ENV Checker
The checker will look for the `NODE_ENV` environment variable and fails if no environment has been set. You should never run your apps with an undefined `NODE_ENV` value.

### SQL Database Checker
The `@adonisjs/lucid` package registers a checker to check the database connectivity from your application. To enable the health checks for your database, you just need to turn on the `healthCheck` flag inside the `config/database.ts` file.

```ts
{
  pg: {
    client: 'pg',
    connection: {},
    healthCheck: true, // 👈
  }
}
```

### Redis Checker
Similar to the SQL databases, you can also enable the health checks for your redis server when using the `@adonisjs/redis` module.

To enable the health checks for your redis server, you just need to turn on the `healthCheck` flag inside the `config/redis.ts` file.

```ts
{
  local: {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    healthCheck: true // 👈
  }
}
```

## Un-healthy report sample

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1592214549/adonisjs.com/unhealthy-health-check.png)

## Healthy report sample

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1592214549/adonisjs.com/health-check-healthy.png)

## Registering your own checker
You can also register your own health checkers using the Health check module. Since, the checker needs to be registered only once, you must use a **preload file** or the **service provider** to register it.

For demonstration, lets open the `providers/AppProvider.ts` and paste the following code inside the `boot` method.

```ts
import { IocContract } from '@adonisjs/fold'

export default class AppProvider {
  constructor (protected $container: IocContract) {
  }

  // highlight-start
  public async boot () {
    const HealthCheck = (await import('@ioc:Adonis/Core/HealthCheck')).default

    HealthCheck.addChecker('my-checker', async () => {
      return {
        displayName: 'Checker Name',
        health: {
          healthy: true,
          message: 'Everything works fine'
        },
        meta: {},
      }
    })
  }
  // highlight-end
}
```

- The `HealthCheck.addChecker` accepts a total of two arguments.
- The first argument is a unique name of the checker.
- The second argument is the callback that should return the report with following required properties.
  - `displayName` A human readable name of the checker.
  - `health.healthy` A boolean that indicates if the service is healthy.
  - `health.message` Error or success message.
