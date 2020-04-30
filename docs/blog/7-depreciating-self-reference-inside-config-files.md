---
permalink: blog/depreciating-self-reference-inside-config-files
title: Depreciating self reference inside config files
group: blog
meta:
  published_on: 2018-01-12
  author: Harminder Virk
---

AdonisJs allows you to define reference to an existing value inside the config files. For example.

```js{}{config/app.js}
module.exports = {
   appKey: Env.get('APP_KEY')
}
```

Now you can make use of the above value inside any other config file using the following syntax.

```js{}{config/auth.js}
module.exports = {
   jwt: {
     secret: 'self::app.appKey'
   }
}
```

In order to resolve self references, each `Config.get` call has to recursively parse the return value and make sure all references to self are resolved.

This behavior causes an unnecessary performance overhead, without any major gains.

`@adonisjs/framework@4.0.30` has marked this behavior as depreciated and will be removed in **another minor** release of the framework ( 4.1.0 ).
