---
permalink: blog/running-tests-in-adonisjs-v5
title: Setting up tests runner for AdonisJS v5
group: blog
meta:
  number: 13
  published_on: 2020-06-24
  author: Harminder Virk
---

The tests runner of AdonisJS v4 has not been migrated to v5 yet and hence, I receive a lot of questions regarding testing in v5. In this article, **I will show you, how to setup [japa](https://github.com/thetutlage/japa) to test your AdonisJS applications.**

The goal of the article is to accomplish the following tasks:

- Setup test runner to boot the application first and then run tests.
- Ability to run a single test file.
- Ability to run a single test in the entire tests suite.
- Setup [supertest](https://github.com/visionmedia/supertest) for making HTTP requests.
- Setup [JSDOM](https://github.com/jsdom/jsdom) for DOM testing.

## Wait, why not use Jest? 

[note]

The Jest explanation will get too long. If you want, you can skip to [Introducing Japa](#introducing-japa) section.

[/note]

Jest is a very popular testing framework in the Javascript community. In fact, many individuals have expressed their interest in using Jest with AdonisJS.

Respecting the community opinions, I myself dig into using Jest and realized, most of the Jest features are not required for testing a backend application. Of course, you can still use Jest and ignore those features, but as Jest is not my first choice, I decided not to use it (at least for now).

### Parallel test suites

Jest runs every test suite `(the describe block)` in its own thread. It means, every test suite has its own global isolated state. This is great, until your tests are not dealing with shared resources.

AdonisJS is a backend framework and most of your tests will be interacting with a database server. Database is a shared resource and multiple tests suites running in parallel will always have data conflicts.

One option is to use a unique database for each test suite, but that also means, each test suite will have to first **create a unique database** and then **run migrations**. This alone will significantly slow down your tests and all the speed gains of parallel tests are of no use. Plus, there is more mental overhead of managing shared resources in a such way, that parallel tests can use them without conflicts.

Other option is to mock the database calls (many articles even suggest doing this). But trust me, never, ever mock your database calls. You will create more problems for yourself.

### Snapshot testing

Another cool feature of Jest is the [snapshot testing](https://jestjs.io/docs/en/snapshot-testing). Snapshots are great (or maybe not), but they are mainly used for asserting HTML structures.

[note]

I know that snapshots are not technically limited to HTML structures only. But, the official docs + dozens of online articles use them for testing React components output.

So in short, the spirit of snapshot testing is to avoid defining the HTML structure in your tests manually and instead use a snapshot. 

[/note]

A good number of AdonisJS applications are JSON APIs and they don't output HTML at all. Even, the applications that render HTML should not use snapshots, as there are better ways to test the behavior of a webpage.

Snapshots, asserts against the structure of the HTML and not the behavior of the element. You should test that clicking a button performs the expected action and not whether your button is wrapped inside 10 divs or 3 divs. 

In other words, snapshot testing is tightly coupled with the DOM structure and changing the DOM structure doesn't mean the functionality of the app has changed.

Here is an [article from Kent C. Dodds](https://kentcdodds.com/blog/effective-snapshot-testing), sharing some good use cases for snapshot testing and I believe, majority of AdonisJS applications do not fall in the specified use cases.

### Jest not so good parts
Features like **parallel tests** and **snapshot assertions** are not bad features in themselves, it's simply, they are not very useful for testing backend code.

On the personal level, there are some things, I don't like about Jest.

- Typescript support is provided using Babel and I am not a big fan of adding too many build processes and config inside a single project.
- Also not a big fan of polluting the global namespace with methods like `describe`, `test`, `it` and so on.

### Jest good parts
So much rant 😐. Well, the article is not meant to criticize Jest. I wanted to share my set of reasons for not using Jest. In fact, Jest has many good parts.

- The ability to run a single test file or an individual test.
- The diff output of assertion failures is easy to understand.
- Lots of in-built helpers for testing DOM.
- And, huge community behind it.

## Introducing Japa

Japa is a small and embeddable test runner, written just for Node.js. It means, it does not carry any extra weight to work in the browser environments.

Following are some of my favorites of Japa (I have written it, so I am bit biased as well)

- There is no CLI to run tests. You can run your Javascript files directly and it will execute the tests.
- Uses [chai assert module](https://www.chaijs.com/guide/styles/#assert) for assertions
- Boot time is [quicker](https://github.com/thetutlage/japa#faster-boot-time-) than Mocha and Ava. I have not benchmarked it against Jest yet.
- Has pretty robust API for managing and creating tests. For example:
    - Run a single test using `.only` method.
    - Skip tests by using `.skip` method.
    - Skip tests just in the CI using `.skipInCI` method.
    - Group tests
    - Ability to write regression tests
    - Allows assertion planning
- Written in Typescript, so intellisense works out of the box.

## Setup for AdonisJS

Enough of theory, let's begin with some action. Run the following command to install required dependencies from the npm registry.

[codegroup]

```sh{}{Npm}
npm i -D japa execa get-port
```

```sh{}{Yarn}
yarn add -D japa execa get-port
```

[/codegroup]

Next, create `japaFile.ts` file inside the project root and paste following contents inside it.

```ts{}{japaFile.ts}
import 'reflect-metadata'
import { join } from 'path'
import getPort from 'get-port'
import { configure } from 'japa'
import sourceMapSupport from 'source-map-support'

process.env.NODE_ENV = 'testing'
process.env.ADONIS_ACE_CWD = join(__dirname, '..')
sourceMapSupport.install({ handleUncaughtExceptions: false })

async function startHttpServer () {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

/**
 * Configure test runner
 */
configure({
  files: [
    'build/test/**/*.spec.js',
  ],
  before: [
    startHttpServer,
  ],
})
```

Finally, create an example test file to ensure that everything is working as expected. The file must go inside `test/` directory in the project root.

```sh
# Make directory
mkdir test

# Create empty file
touch test/example.spec.ts
```

```ts{}{test/example.spec.ts}
import test from 'japa'

test.group('Example', () => {
  test('assert sum', (assert) => {
    assert.equal(2 + 2, 4)
  })
})
```

Make sure to start the development server `node ace serve --watch`, so that the Typescript is compiled to Javascript and open a new terminal session to execute the tests by running `node build/japaFile.js`

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1592989126/adonisjs.com/blog/japa-tests-basic_cvvguq.mp4", controls]

### Understanding `japaFile`

Voila! We have got the basic setup ready. Before moving forward, lets understand what just happened.

- As mentioned earlier. Japa doesn't have any CLI, you just need to create a file and use the `configure` method to setup the test runner.
- The `configure` method accepts a `files` glob to find the test files. We have mentioned `build/test/**/*.spec.js`, it means, it will run tests against the compiled Javascript code.
- The `before` property accepts an array of actions to execute before japa even search for the test files. We define an action to boot the AdonisJS HTTP server.
- Also, instead of relying on the `PORT` defined inside the `.env` file. We pick a random port for running the HTTP server during tests.

## Testing HTTP calls
Lets take a step forward and write a test that makes an HTTP call to our AdonisJS server and uses JSDOM to assert the response HTML.

First, we need to install [supertest](https://npm.im/supertest) and [jsdom](https://npm.im/jsdom).

[codegroup]

```sh{}{Npm}
npm i -D supertest @types/supertest jsdom @types/jsdom
```

```sh{}{Yarn}
yarn add -D supertest @types/supertest jsdom @types/jsdom
```

[/codegroup]

Open the `test/example.spec.ts` file and replace its contents with the following code snippet.

```ts{}{test/example.spec.ts}
import test from 'japa'
import { JSDOM } from 'jsdom'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', () => {
  test('ensure home page works', async (assert) => {
    /**
     * Make request
     */
    const { text } = await supertest(BASE_URL)
      .get('/')
      .expect(200)

    /**
     * Construct JSDOM instance using the response HTML
     */
    const { document } = new JSDOM(text).window

    const title = document.querySelector('.title')
    assert.exists(title)
    assert.equal(title!.textContent!.trim(), 'It Works!')
  })
})
```

[note]
Make sure the another terminal window is still compiling the Typescript code using `node ace serve --watch` command.
[/note]

Now, re-run the tests by executing `node build/japaFile.js` file.

## Interacting with the Database
The next step is to write a test that interacts the database. But first, let's update the `japaFile.ts` file to run and rollback migrations everytime we run the tests. This way, we will ensure that we are always starting from a clean slate.

```ts{}{japaFile.ts}
import 'reflect-metadata'
// highlight-start
import execa from 'execa'
// highlight-end
import { join } from 'path'
import getPort from 'get-port'
import { configure } from 'japa'
import sourceMapSupport from 'source-map-support'

process.env.NODE_ENV = 'testing'
process.env.ADONIS_ACE_CWD = join(__dirname, '..')
sourceMapSupport.install({ handleUncaughtExceptions: false })

// highlight-start
async function runMigrations () {
  await execa.node('ace', ['migration:run'], {
    stdio: 'inherit',
  })
}

async function rollbackMigrations () {
  await execa.node('ace', ['migration:rollback'], {
    stdio: 'inherit',
  })
}
// highlight-end

async function startHttpServer () {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

/**
 * Configure test runner
 */
configure({
  files: [
    'build/test/**/*.spec.js',
  ],
  before: [
    // highlight-start
    runMigrations,
    // highlight-end
    startHttpServer,
  ],
  // highlight-start
  after: [
    rollbackMigrations,
  ]
  // highlight-end
})
```

Next, re-open the `test/example.spec.ts` file and create a new test that interacts with the database.

```ts{}{test/example.spec.ts}
import test from 'japa'
import { JSDOM } from 'jsdom'
import supertest from 'supertest'
// highlight-start
import User from 'App/Models/User'
// highlight-end

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', () => {
  test('ensure home page works', async (assert) => {
    const { text } = await supertest(BASE_URL).get('/').expect(200)
    const { document } = new JSDOM(text).window
    const title = document.querySelector('.title')

    assert.exists(title)
    assert.equal(title!.textContent!.trim(), 'It Works!')
  })

  // highlight-start
  test('ensure user password gets hashed during save', async (assert) => {
    const user = new User()
    user.email = 'virk@adonisjs.com'
    user.password = 'secret'
    await user.save()

    assert.notEqual(user.password, 'secret')
  })
  // highlight-end
})
```

Let's re-run the tests by running `node build/japaFile.js` file.

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1592992827/adonisjs.com/blog/japa-tests-migrations_rxuhcj.mp4", controls]

## Running a single test
Quite often, you will find yourself working on code and the tests together. Wouldn't it be nice, if you can speed up the tests feedback loop just by running a single test?

Well, you can do that with Japa quite easily. **Make use of the `test.only` method to ignore all other tests across all the files**. For demonstration, lets re-open the `test/example.spec.ts` file and run just one test

```ts
// ...

test.group('Welcome', () => {
  // ...

  // highlight-start
  test.only('ensure user password gets hashed during save', async (assert) => {
  // highlight-end
    const user = new User()
    user.email = 'virk@adonisjs.com'
    user.password = 'secret'
    await user.save()
 
    assert.notEqual(user.password, 'secret')
  })
})
```

## Running a single test file
You can also run a single test file by modifying the `files` glob. Re-open the `japaFile.ts` file and adding the following method inside it.

```ts{}{japaFile.ts}
// Import helpers from path module
import { join, isAbsolute, sep } from 'path'

// Add this method to the file
function getTestFiles () {
  let userDefined = process.argv.slice(2)[0]
  if (!userDefined) {
    return 'build/test/**/*.spec.js'
  }

  if (isAbsolute(userDefined)) {
    userDefined = userDefined.endsWith('.ts')
      ? userDefined.replace(`${join(__dirname, '..')}${sep}`, '')
      : userDefined.replace(`${join(__dirname)}${sep}`, '')
  }

  return `build/${userDefined.replace(/\.ts$|\.js$/, '')}.js`
}
```

Next, replace the `files` glob with the output of the `getTestFiles` method.

```ts{}{japaFile.ts}
configure({
  // highlight-start
  files: getTestFiles(),
  // highlight-end
  before: [
    runMigrations,
    startHttpServer,
  ],
  after: [
    rollbackMigrations,
  ]
})
```

That's all! Now, you can specify the file path at the time of running the tests. For demonstration, lets create another test file and only execute tests inside the new file.

```sh
touch test/hello.spec.ts
```

Open the newly created file and paste the following contents inside it.

```ts{}{test/hello.spec.ts}
import test from 'japa'

test.group('Japa', () => {
  test('assert hello world', (assert) => {
    assert.equal('hello world', 'hello world')
  })
})
```

Finally, run the following command to execute just the `hello.spec.ts` file.

```sh
node build/japaFile.js test/hello.spec.ts
```

[video url="https://res.cloudinary.com/adonis-js/video/upload/v1592994611/adonisjs.com/blog/japa-selected-files_vmrtgh.mp4", controls]

## Wrapping up
As you can see, with just few lines of code inside the `japaFile.ts`, we have been able to setup a pretty robust tests runner. Let me leave you with some more tips around testing.

### Lifecycle hooks
The `test.group` method of Japa allows you to hook into the lifecycle of tests by defining the following methods.

```ts
test.group('Example', (group) => {
  group.before(async () => {
    console.log('before all tests')
  })

  group.beforeEach(async () => {
    console.log('before every test')
  })

  group.after(async () => {
    console.log('after all tests')
  })

  group.afterEach(async () => {
    console.log('after every test')
  })
})
```

### Using global database transactions
A good test suite always ensures that every test starts with a clean slate. In order to have a clean database before each test, you can make use of the **Lucid global transactions**. For example:

```ts
import test from 'japa'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Example', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
```

Now, all of the database queries will be wrapped inside a **global transaction** and nothing will be persisted to the database ever.

### Read Japa docs
Finally, I suggest you to go through the [README](https://github.com/thetutlage/japa#test-your-apps) file of Japa once to explore all the features which are not covered in this article.

See ya!  
Virk
