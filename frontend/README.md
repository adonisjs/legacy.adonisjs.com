# AdonisJS.com Frontend
> Adonisjs.com website frontend

This folder holds the source code for the adonisjs.com website. The website is built using [Gridsome](https://gridsome.org/), since it let us create a static website with Vue.js sprinkled on top for interactivity.

## Why Gridsome?
If you are familiar with Gridsome or even Gatsby, then you would know that many people choose either of them for their GraphQL API. However, we didn't choose it for GraphQL at all. 

The main reason for using Gridsome is that it can take the Vue.js source code and convert them into static HTML pages. While doing so, it let us create dynamic pages programmatically. For example:

1. We have 10 markdown files converted to JSON (in a seperate application)
2. We want to use those JSON files with a vue template and render them on the browser.
3. During development we want the vue templates to re-compile a doc is changed.
4. For production, we want vue templates to be converted to standard HTML pages. So that we don't need the markdown API service anymore.

And guess what, Gridsome does all this in the most simplest possible way.

## How the project is structured?

In order to understand the Frontend codebase, you first have to understand the workflow of writing docs in markdown and compiling them.

### Markdown Compilation Flow

We make use of [dimer](https://github.com/dimerapp/cli) to convert Markdown to an API server. So if you run this application with command `./develop.sh` and then visit [http://localhost:5000](http://localhost:5000), you will see a playground to explore the API.

Converting markdown to JSON instead of HTML has lots of benefits.

1. The HTML structure is not proprietary and you have complete freedom to structure the HTML you want. Today we are using Gridsome, tomorrow we can easily switch to something else and the markdown build process doesn't have to change for that.
2. We get native search support. In standard static websites, people first convert **Markdown to HTML** and then **scrape the HTML** to create JSON documents for adding search.

### Gridsome Consuming the Dimer API
At this point we are clear that, dimer handles all the markdown files, converts them to JSON and any client can consume it via HTTP server.

Now, the Job of Gridsome is to make use of the HTTP API and create pages from it and luckily Gridsome has [first class support](https://gridsome.org/docs/pages-api/#createpageoptions-1) for that.

Inside `frontend/gridsome.server.js` file, we make use of `axios` to make an API call to the dimer server and then use the Gridsome API to create the static pages from it.

### Rebuilds during Development
Since, we are relying on a different process to gives us the content for creating the pages. There is no way for the Gridsome to know when the content has been changed. Luckily, Dimer allows creating Websocket connections in the development mode and we can subscribe to Websocket events inside `frontend/gridsome.server.js` file and trigger a re-build. This is how it works.

1. Make a websocket connection with the Dimer server inside `frontend/gridsome.server.js`.
2. Everytime an event is received, make use of the Gridsome [removePageByPath](https://gridsome.org/docs/pages-api/#removepagebypathpath) and [createPage](https://gridsome.org/docs/pages-api/#createpageoptions-1) API to re-build that specific page.

And voila! We have instant feedback during development.

## Gridsome Structure

## Dimer Structure
