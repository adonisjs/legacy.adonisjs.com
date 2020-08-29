---
permalink: blog/socketio-with-adonisjs-v5
title: Using Socket.io with AdonisJS v5
group: blog
meta:
  number: 12
  published_on: 2020-06-08
  author: Harminder Virk
---

[Socket.io](https://socket.io/) is a very popular library for real-time and bidirectional communication. Quite often I am asked on how to use socket.io with AdonisJS v5 and in this article, I will answer that question.

## Simplest approach
Let's begin with the most simplest approach of integrating socket.io with AdonisJS. The first step is to install the package from the npm package registry.

[codegroup]
```sh{}{npm}
npm i socket.io @types/socket.io
```

```sh{}{yarn}
yarn add socket.io @types/socket.io
```
[/codegroup]

Next, manually create a `start/socket.ts` file and paste the following contents inside it.

```ts{}{start/socket.ts}
import socketIo from 'socket.io'
import Server from '@ioc:Adonis/Core/Server'

/**
 * Pass AdonisJS http server instance to socketIo.
 */
const io = socketIo(Server.instance!)

/**
 * Standard business from here
 */
io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' })

  socket.on('my other event', (data) => {
    console.log(data)
  })
})
```

Finally, import the above created file inside the `providers/AppProvider.ts` file under the `ready` method.

[tip]

The `ready` method is by called when the HTTP server is ready to accept Incoming requests.

[/tip]

```ts{}{providers/AppProvider.ts}
import { IocContract } from '@adonisjs/fold'

export default class AppProvider {
  constructor (protected container: IocContract) {
  }

  public async ready () {
    const App = await import('@ioc:Adonis/Core/Application')

    /**
     * Only import socket file, when environment is `web`. In other
     * words do not import during ace commands.
     */
    if (App.default.environment === 'web') {
      await import('../start/socket')
    }
  }
}
```

That's all you need to do in order to setup socket.io. Let's take a step further and also test that we are able to establish a connection from the browser.

Open/create `resources/views/welcome.edge` file and paste the following HTML snippet inside it.

```html{}{resources/views/welcome.edge}
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.dev.js"></script>

  <script>
    const socket = io('http://localhost:3333');
    socket.on('news', (data) => {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });
  </script>

</body>
</html>
```

Register the following route to render the `welcome` view.

```ts{}{start/routes.ts}
Route.on('/').render('welcome')
```

Now, start the development server by running `node ace serve --watch` and open [http://localhost:3333](http://localhost:3333) in the browser to see the console messages being logged.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1591543846/adonisjs.com/blog/socket-io_i4qe6n.mp4", controls]

## Extracting socket.io to a Service Object
Socket.io allows you to emit/broadcast socket events from anywhere inside your codebase, given you can access the `io` object. 

In our example, we instantiated the `io` inside the `start/socket.ts` file, but never exported it.

```ts
const io = socketIo(Server.instance!)
```

One option is to export it from this file and then import the `start/socket.ts` file anywhere we want to access the `io` object. However, I would like to avoid it for following reasons.

- First time we import this file to create the socket io server. And, in subsequent imports, we are importing it to access the `io` variable. This alone doesn't feel hygienic.
- The files inside the `start` folder of AdonisJS are meant to perform one time only operations. However, in this case, we are also planning to import this file elsewhere inside our codebase.
- Finally, by wrapping socket.io inside a service object, we can make our code more intentful.

### Creating service object
Service object is just a fancy word of a class stored inside the `app/Services` folder. So lets begin by creating one and paste the following code snippet inside it

```ts{}{app/Services/Ws.ts}
import socketIo from 'socket.io'
import Server from '@ioc:Adonis/Core/Server'

class Ws {
  public isReady = false
  public io: socketIo.Server

  public start (callback: (socket: socketIo.Socket) => void) {
    this.io = socketIo(Server.instance!)
    this.io.on('connection', callback)
    this.isReady = true
  }
}

/**
 * This makes our service a singleton
 */
export default new Ws()
```

Next, open the existing `start/socket.ts` file and replace its contents with the following code snippet.

```ts
import Ws from 'App/Services/Ws'

Ws.start((socket) => {
  socket.emit('news', { hello: 'world' })

  socket.on('my other event', (data) => {
    console.log(data)
  })
})
```

That's all! Your code should work as it is. However, now we have a much nicer API.

- The `start/socket.ts` file just have one job, ie: To initiate the socket.io server.
- The `Ws` service doesn't perform any actions implicitly. You must call the `start` method explicitly to start the server.
- Also, you can now import the `Ws` service anywhere inside your codebase and access `.io` property to emit events.
  ```ts
  import Ws from 'App/Services/Ws'
  
  Ws.io.emit('hello', 'everyone')
  ```

## Adding `getClients` helper
Since, we have wrapped the socket.io inside a service object, we can add our own helpers to simplify certain tasks. For demonstration, let's add a method to fetch a list of connected client ids.

Open `app/Services/Ws.ts` file and add the following `getClients` method to it.

```ts
class Ws {
  public getClients (namespace?: string, room?: string): Promise<string[]> {
    let namespaceInstance = this.io.of(namespace || '/')
    if (room) {
      namespaceInstance = namespaceInstance.in(room)
    }

    return new Promise((resolve, reject) => {
      namespaceInstance.clients((error: Error, clients: string[]) => {
        if (error) {
          reject(error)
        } else {
          resolve(clients)
        }
      })
    })
  }

  //  ... rest of the service
}
```

And use it as follows:

```ts
import Ws from 'App/Services/Ws'

await Ws.getClients()
await Ws.getClients('some-namespace')
await Ws.getClients('some-namespace', 'some-room')
```

That's all for now :)  
Virk!
