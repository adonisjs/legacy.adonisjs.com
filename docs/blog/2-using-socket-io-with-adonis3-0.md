---
permalink: blog/using-socket-io-with-adonis3-0
title: Using Socket.Io with Adonis 3.0
group: blog
meta:
  number: 2
  published_on: 2016-06-26
  author: Harminder Virk
---

Since inbuilt support for web sockets is missing in AdonisJs, using [socket.io](http://socket.io/) with AdonisJs is extremely simple.

## Setting Up Socket.Io

Using Existing Http connection is very common when starting a websocket server using socket.io. Let’s start by creating a `socket.js` file inside `app/Http` directory.

```js{}{app/Http/socket.js}
module.exports = function (server) {

  const io = use('socket.io')(server)

  io.on('connection', function (socket) {
    console.log('connection created >>>')
  })

}
```

This file exposes a function which accepts the HTTP server instance and using that instance you can create a web socket connection. Now you can approach socket.io the way you want.

Next you need to import this file inside `bootstrap/http.js` file. Just before `Server.listen()` import this file.

```js{}{bootstrap/http.js}
use('App/Http/socket')(Server.getInstance())

Server.listen(Env.get('HOST'), Env.get('PORT'))
```
