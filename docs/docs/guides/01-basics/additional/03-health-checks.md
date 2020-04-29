---
permalink: guides/health-check
category: Additional Resources
group: Basics
---

# Health Checks

In the era of Containers and Orchestration, it is very important for your application to report about its own health. For example, Kubernetes can use the health checks information for its [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

## How Health Checks Works?
AdonisJS exposes a unified module for health checks. The other parts of the application, including the packages you install, can register checkers to this module. For example: [Lucid registers](https://github.com/adonisjs/lucid/blob/develop/providers/DatabaseProvider.ts#L73) a checker for reporting its connectivity with the database.

[note]
You can make use of `HealthCheck.getReport` to get the health check report and then share it with the external services.
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
