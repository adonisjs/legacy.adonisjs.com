---
permalink: guides/views/introduction
group: Views & Templates
under_progress: true
last_updated_on: 1st March, 2020
---

# Introduction

AdonisJS comes with a home grown template engine called [Edge](https://www.npmjs.com/package/edge.js). Edge is written for the modern day and has lots of exiciting features like:

- Support for components, layouts and partials.
- Runtime debugging using chrome devtools.
- View presenters to encapsulate the views logic to a dedicated Javascript class.
- Extensible API to add your own custom tags to extend the template engine.

## Setup
Edge comes pre-installed with **Web Application** project structure created using the `create-adonis-ts-app` binary. However, installing it seperately is also pretty straight forward.

Open the `.adonisrc.json` file to check if it is installed and registered under the provider array or not.

```json{4}{.adonisrc.json}
"providers": [
  "@adonisjs/core",
  "@adonisjs/session",
  "@adonisjs/view"
]
```

If not, then follow the below instructions to install it from the npm package registry.

[codegroup]

```sh{}{npm}
npm i @adonisjs/view
```

```sh{}{yarn}
yarn add @adonisjs/view
```

[/codegroup]

Once installed, run the following ace command to setup the package.

```sh
node ace invoke @adonisjs/view

#    update    .adonisrc.json
# ✔  create    ace-manifest.json
```

## Usage
Lets begin by creating a route that renders a given template file.

```ts{}{start/routes.ts}
Route.get('/', async ({ view }) => {
  return view.render('home')
})
```

Next step is to create the `home.edge` template. Template lives inside the `resources/views` directory of your project root. You can manually create a file inside this folder, or use the following ace command to create one for now.

```sh
node ace make:view home

# ✔  create    resources/views/home.edge
```

Let's open the newly created file and paste the following code snippet inside it.

```edge
<p> Hello world. You are viewing the {{ request.url() }} page </p>
```

Make sure to start the development server `node ace serve --watch` and visit [http://localhost:3333](http://localhost:3333) to view the contents of the template file.

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1583063256/adonisjs.com/view-usage.png)

### The Route render method
The Router module also exposes a shorthand to render a views without defining a closure or the controller method. The following example results in the same output as the earlier route definition.

```ts
Route.on('/').render('home')
```

### Using Outside the HTTP Requests
Rendering views during an HTTP request is a very common task and hence AdonisJS passes an instance of the view to the route handlers. 

However, it doesn't mean that you cannot render views outside the context of an HTTP request. Consider the following example.

```ts
import View from '@ioc:Adonis/Core/View'
const html = View.render('home')
```

- You can import the `@ioc:Adonis/Core/View` module anywhere inside your app and then run `View.render` method to render a template.
- But do make sure that you cannot access the `request` or the `auth` variables when rendering outside the context of the HTTP request.

## Customizing Views Location
You can customize the location of views by defining a custom location inside the `.adonisrc.json` file.

[tip]
You can run `node ace dump:rcfile` command to view an expanded version of the config.
[/tip]

```json
{
  "directories": {
    "views": "./my-dir/views"
  }
}
```
