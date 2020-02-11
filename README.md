# AdonisJs.com
> Source code for the official website

This repo contains two sub-projects [frontend](frontend) and [docs](docs) and as the name suggests, they hold the source code for the respective areas.

- The `frontend` is the Gridsome website
- The `docs` are the Markdown files compiled using [dimer](https://github.com/dimerapp/cli).

## Why Gridsome?
If you are familiar with Gridsome or even Gatsby, then you would know that many people choose either of them for their GraphQL API. However, we didn't choose it for GraphQL at all. 

The main reason for using Gridsome is that it can take the Vue.js source code and convert them into static HTML pages. While doing so, it let us create dynamic pages programmatically. For example:

1. We have 10 markdown files converted to JSON (in a seperate application)
2. We want to use those JSON files with a vue template and render them on the browser.
3. During development we want the vue templates to re-compile a doc is changed.
4. For production, we want vue templates to be converted to standard HTML pages. So that we don't need the markdown API service anymore.

And guess what, Gridsome does all this in the most simplest possible way.

## Build process

In order to understand the build process, you will have to start from the markdown compilation flow.

### Markdown Compilation Flow

We make use of [dimer](https://github.com/dimerapp/cli) to convert Markdown to an API server. So, if you run this application with command `./develop.sh` and then visit [http://localhost:5000](http://localhost:5000), you will see a playground to explore the API.

Converting markdown **to JSON instead of HTML** has lots of benefits.

1. The HTML structure is not proprietary and you have complete freedom to structure the HTML the way you want. Today we are using Gridsome, tomorrow we can easily switch to something else and the markdown build process doesn't have to change for that.
2. We get native search support. In standard static websites, people first convert **Markdown to HTML** and then **scrape the HTML** to create JSON documents for adding search.

### Gridsome Consuming the Dimer API
At this point we are clear that, dimer handles all the markdown files, converts them to JSON and any client can consume it via the HTTP server.

Now, the Job of Gridsome is to make use of the HTTP API and create pages from it. Luckily Gridsome has [first class support](https://gridsome.org/docs/pages-api/#createpageoptions-1) for that.

Inside `frontend/gridsome.server.js` file, we make use of `axios` to make an API call to the dimer server and then use the Gridsome API to create the static pages from it.

### Rebuilds during Development
Since, we are relying on a different process to gives us the content for creating the pages. There is no way for the Gridsome to know when the content has been changed. Luckily, Dimer allows creating Websocket connections in the development mode and we can subscribe to Websocket events inside `frontend/gridsome.server.js` file and trigger a re-build. This is how it works.

1. Make a websocket connection with the Dimer server inside `frontend/gridsome.server.js`.
2. Everytime an event is received, make use of the Gridsome [removePageByPath](https://gridsome.org/docs/pages-api/#removepagebypathpath) and [createPage](https://gridsome.org/docs/pages-api/#createpageoptions-1) API to re-build that specific page.

And voila! We have instant feedback during development.

## Gridsome Structure
The Gridsome codebase is a standard Vuejs or Gridsome website stored inside the `frontend` directory.

- We keep all the resuable components inside the `src/components` directory.
- All static pages (not built programmatically) inside the `src/pages` directory.
- Templates for dynamic pages inside the `src/templates` directory.
- A standard Layout for the complete website is in `src/layouts` directory.

## Dimer Structure
The `docs` directory holds the Markdown files along with the `dimer.json` file. The `dimer.json` is the config file for dimer to define structure for the docs.

Dimer has concept of `zones` and `versions`.

- A `zone` means a boundary between different types of documentation. For example: A zone for `guides` and a zone for `api docs` and so on.
- Within each zone, you can have one or more versions for the documentation. Do not confuse `versions` with version control, it means a new set of markdown files for a specific version of the framework.
- The versions for each zone can evolve independently.
