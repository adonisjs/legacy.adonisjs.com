---
permalink: blog/the-reddit-fire
title: The Reddit Fire
group: blog
meta:
  published_on: 2018-02-15
  author: Harminder Virk
---

Recently a [thread on Reddit](https://www.reddit.com/r/node/comments/7x3afi/anyone_using_adonisjs_in_production/) asking whether **AdonisJs is ready for production and not?** caught my attention towards the weird reasons shared by users on the thread.

One of the most popular ones was:

> Most of the packages are hand-written from scratch and that’s why the framework is not production ready.

Before I really get into the specifics, I want to share the philosophy of the framework.

AdonisJs is not a toolset, it’s an experience. For example:

- **Android** gives you a software and then all these companies, bundle that software into fucked up hardware.
- Whereas **Apple** decided to ship the experience of using a mobile device, they don’t care, whether they created everything by hand or they outsourced it.

Now let’s dive into the criticisms.

## The test runner

A common complaint is related to [japa](https://github.com/thetutlage/japa), the test runner used by AdonisJs to write and run tests. Before writing the first line of the code, here were my requirements.

- Ability to write test using a concise syntax and avoiding too much nesting.
- Controlling the test flow, so that framework can hook into specific areas and offer better testing experience.
- Clean `cli` interface to filter and run tests.
- Extendible testing API, so that the framework users can plug add-ons when they need them. The `trait` is an example of same.

So I looked for all popular options.

- **Mocha** - Too much is spitted in globals like `before`, `describe`, `it` and so on. Also mocha comes with too much and half of it is useless for Adonis, for example, It’s a browser-friendly test runner and Adonis is a server framework.
- **Ava** - Ava doesn’t have any API, which can allow me to register tests and then call some function to execute those tests. If I decided to stick with `Ava`, then I will have to hack upon their CLI commands and call them using [child_process.exec](https://nodejs.org/dist/latest-v9.x/docs/api/child_process.html#child_process_child_process_exec_command_options_callback) method.
- **Jest** - The same story as Ava, I cannot change the testing syntax or add new features.

These tools are great, but they were not written to be embedded into a framework, they are supposed to be used on their own.

Now Japa is an **API first** testing framework, it doesn’t care where and how your tests are written. Which means AdonisJs can do all sort of custom stuff and then register tests with Japa and execute them.

Here’s a working example.

```js
const Emitter = require('events')
const { Test, Runner, Group, reporters } = require('japa/api')

// Some global options
const options = {
  timeout: 2000,
  emitter: new Emitter()
}

// Your test
const test = new Test('hello world', function (assert) {
  assert.equal(2 + 2, 4)
}, options)

// Add test to some group
const group = new Group('', options)
group.addTest(test)

// Initiate runner
const runner = new Runner([group], reporters.list, options)

// Run tests
runner
  .run()
  .then(() => {
    console.log('tests over')
  })
  .catch(() => {
    console.log('tests failed')
  })
```

As you can see, **there are no command line commands** to execute, **there are no globals**. If you want me to leave this pure API and hack upon the existing test runners, which are not supposed to be embedded, then I am sorry, AdonisJs is not for you.

This philosophy is true for everything I wrote by hand. In places where existing tools are best suited, I have used them and [commander.js](https://github.com/tj/commander.js/) is an example of same, which is used by Ace.

## The use method

Another criticism is the `use` method. Now Javascript never had any standards on module loading or dependency management. That’s why Node.js came-up with `require` and I with `use`.

I agree the custom implementation of module loading is painful since there is no support for autocomplete by editors.

Again as there were no standards, the editor chooses to implement the autocomplete for popular patterns. And once ES6 `import/export` will be a stable thing in Node.js. The IoC container of the framework will use it over the custom `use` method.

The IoC container will use the [loader hooks](https://nodejs.org/dist/latest-v9.x/docs/api/esm.html#esm_loader_hooks) to resolve dependencies and hence you will be able to use `import` statements over `use` method. **Till then it’s a trade off**.

## You cannot maintain it

How do you know? If you think maintaining a code base is all about more people, then you got it wrong.

A popular testing framework **Mocha** is looking for maintainers, because the guy who created it has moved on and expecting everyone else to share the same passion for the code base is false.

IMAGE

Yes, I can also move on with something else, but until then maintaining all these reports is something that keeps me awake and happy.

## Mmmm, Adonis is slower than express

First, **micro benchmarking is for suckers**, but still here’s how Adonis slim boilerplate performs in comparison to ExpressJs.

Again, there are many another framework, which will perform better than AdonisJs and speed is not the main concern for me, until it’s not a bottleneck. So I am not going to talk about it at all.

[youtube url="https://www.youtube.com/watch?v=P10Bpz82Rpc"]
