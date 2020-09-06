---
permalink: guides/events
group: Digging Deeper
---

# Events
AdonisJS has an inbuilt event emitter which is slightly different (for good) from the Node.js event emitter. By the end of this guide, you will know:

- How to use the AdonisJS event emitter for emitting events.
- Differences between AdonisJS and Node.js event emitter.
- Making your events type safe.

## Basic Example
Let's begin by creating a new file inside the `start` folder and preload it during the application boot process.

Create `start/events.ts` file

```sh
touch start/events.ts
```

Next, open the `.adonisrc.json` file and add it to the array of `preloads`. The files under the preloads array are automatically loaded by AdonisJS during the boot process.

```json{5}
{
  "preloads": [
    "./start/routes",
    "./start/kernel",
    "./start/events"
  ],
}
```

Open `start/events.ts` inside your text editor and paste the following code snippet inside it.

```ts{}{start/events.ts}
import Event from '@ioc:Adonis/Core/Event'

Event.on('new:user', (user) => {
  console.log(user)
})
```

The `Event.on` method register a new event listener that is invoked everytime the `new:user` event it fired. For demonstration, let's create a route that emits this event after handling the HTTP request.

```ts{}{start/routes.ts}
import Route from '@ioc:Adonis/Core/Route'
import Event from '@ioc:Adonis/Core/Event'

Route.get('/register', async () => {
  // create user
  const user = { id: 1 }
  Event.emit('new:user', user)

  return 'User registered'
})
```

Now, if you visit [http://localhost:3333/register](http://localhost:3333/register), you must see the `console.log` statement executed by the event listener.

[video url="https://res.cloudinary.com/adonis-js/video/upload/q_80/v1582562375/adonisjs.com/adonis-events_gexfh3.mp4", controls]

## Making Events Type Safe
Since, the events listeners and the code emitting the events are not in the same file, it is very easy to make the mistake of sending wrong arguments to a specific event. To prevent this behavior, AdonisJS allows you to define the shape of data an event can/must receive.

Open the pre-existing file `contracts/events.ts` to define the shape of data for the `new:user` event.

```ts{}{contract/events.ts}
declare module '@ioc:Adonis/Core/Event' {
  interface EventsList {
    'new:user': { id: number },
  }
}
```

Now, if you attempt to emit the `id` as a string to the `new:user` event, the TypeScript compiler will complain about it.

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1582564270/adonisjs.com/Screen_Shot_2020-02-24_at_10.40.53_PM_x0a3tn.png)


## Dedicated Listener Classes
Just like controllers and middleware, you can also extract the inline event listeners to their own dedicated classes. Begin by running the following ace command to create a new listener class.

```sh
node ace make:listener User

# ✔  create    app/Listeners/User.ts
```

Open the newly created file and replace its content with the following code snippet.

```ts{}{app/Listeners/User.ts}
import { EventsList } from '@ioc:Adonis/Core/Event'

export default class UserListener {
  public async handleRegistration (user: EventsList['new:user']) {
    console.log(user)
  }
}
```

Update the `start/events.ts` file to remove the inline event listener callback and instead reference the newly created listener class.

```ts{}{start/events.ts}
import Event from '@ioc:Adonis/Core/Event'

Event.on('new:user', 'User.handleRegistration')
```

### How it works?

- The listeners classes allows you to keep your events file clean by extracting the logic for handling events inside their own classes.
- By default, the listeners lives inside `app/Listeners` directory. However, you can customize inside the `.adonisrc.json` file.
- AdonisJS will create a new instance of the listener class, everytime the event is emitted.

## Trapping Events
In true spirit of making testing easier in your AdonisJS applications, the event emitter allows trapping events. For example:

```ts
import User from 'App/Models/User'
import Event from '@ioc:Adonis/Core/Event'

Event.trap('new:user', (user) => {
  assert.instanceOf(user, User)
})
```

Once, a trap has been placed on a event, the actual event listener will not be invoked. 

### Trap All
Similar to the `Event.trap`, you can also place a trap for all the events.

[note]
The `Event.trapAll` is only called for events with no existing trap.
[/note]

```ts{4-6}
Event.trap('new:user', (data) => {
})

Event.trapAll((event, data) => {
  // only called for "send:email"
})

Event.emit('new:user', {})
Event.emit('send:email', {})
```

## Node.js vs AdonisJS Event Emitter
The event emitter of Node.js is synchronous by nature. It means every call to `emitter.emit` blocks the event loop and leads to non-performant codebase. On the other hand, AdonisJS uses [emittery](https://github.com/sindresorhus/emittery), which is a light weight asynchronous event emitter.

### Only allows one argument during emit
Emittery doesn't allow multiple arguments during the `emit` call and suggests to use [destructuring](https://github.com/sindresorhus/emittery#can-you-support-multiple-arguments-for-emit) instead. Having limitation for a single argument is not really a big drawback in comparison to the performance it brings into your applications.

### API surface
We suggest you to check the API docs and do not assume identical API as the Node.js event emitter.
