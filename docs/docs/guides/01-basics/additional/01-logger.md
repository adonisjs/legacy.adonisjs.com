---
permalink: guides/logger
category: Additional Resources
group: Basics
---

# Logger
AdonisJS uses [pino logger](https://getpino.io/#/) for logging, since it is one of the fastest logging libraries in Node.js ecosystem and also follows the [12factor app guidelines](https://12factor.net/logs).

## How AdonisJS Logger works?
Since, Node.js is a single threaded event-loop, it is very important to keep the main thread free from any extra work required to process or reformat logs. 

For this very reason, we opted for pino logger, which does not perform any in-process log formatting and instead encourages you to make use a seperate process for that. In nutshell, this is how the logging works.

1. You can log at different levels using the Logger API, for example: `Logger.info('some message')`.
2. The logs will be send out to `stdout`.
3. You can redirect the `stdout` stream to a file or use a seperate process to read and format them.

## Logging in Development
Since logs are always written to `stdout`, there is nothing special required in the development environment. Also, AdonisJS will automatically [pretty print](https://github.com/pinojs/pino-pretty) the logs when `NODE_ENV=development`.

## Logging in Production
In production, you would want to stream your logs to an external service like Datadog or Papertrail. Following are some of the ways to send logs to an external service.

[note]
Yes, there is an additional operational overhead of piping the stdout stream to a service. But, the trade off is worth the performance boost you receive. Make sure to check [pino benchmarks](https://getpino.io/#/docs/benchmarks) as well.
[/note]

### Using Pino Transports
The simplest way to process the `stdout` stream is to make use of [pino transports](https://getpino.io/#/docs/transports). All you need to do is pipe the output to the transport of your choice. For demonstration, let's try to send logs to Datadog.

1. Install the `pino-datadog` package from npm package registry.
  ```sh
  npm i pino-datadog
  ```

2. Start the application in production and pipe the `stdout` output to `pino-datadog`.
  ```sh
  node build/server.js | ./node_modules/.bin/pino-datadog --key DD_API_KEY
  ```

### Streaming to a File
Another approach is to forward the output of `stdout` to a physical file on the disk and then configure your logging service to read and rotate the log files.

```sh
node build/server.js >> app.log
```

Now, configure your logging service to read logs from the `app.log` file
