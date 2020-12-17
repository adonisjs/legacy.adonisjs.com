# Static Files
AdonisJS comes with an inbuilt static file server to serve files from a dedicated directory. By the end of this guide, you will know how to configure and use the static file server.

## Setup
The static file server is inbuilt into the core of the framework and hence there is no need to install any additional packages. However, do make sure that your project has `config/static.ts` config file with `enabled = true`.

If the configuration file is missing, you can create one by copying the contents from this [url](https://github.com/adonisjs/core/blob/develop/templates/config/static.txt).

Next, open the `.adonisrc.json` file and make sure that `public/**` glob pattern is in the `metaFiles` array.

:::tip
The `metaFiles` tells AdonisJS compiler to copy the mentioned files to the `build` folder.
:::

```json{9}{.adonisrc.json}
"metaFiles": [
  ".env",
  ".adonisrc.json",
  {
    "pattern": "resources/views/**/*.edge",
    "reloadServer": false
  },
  {
    "pattern": "public/**",
    "reloadServer": false
  }
]
```

## Usage
AdonisJS will serve all files from the `public` directory to the internet. For demonstration, let's create a new `.css` file inside this directory.

```css{}{public/style.css}
body {
  background: #fff;
  color: #222;
}
```

Now, start the development server by running `node ace serve --watch` command and visit [http://localhost:3333/style.css](http://localhost:3333/style.css) to view the contents of the CSS file.

![](https://res.cloudinary.com/adonis-js/image/upload/q_auto,w_700,f_auto,fl_lossy/v1584157353/adonisjs.com/static-assets.png)

### How it works?
- If you notice carefully, the URL doesn't contain the directory name `/public`. So, if you decide to change the directory name from public to something else, then your URLs will not be impacted.
- AdonisJS checks for static files before checking for routes. If a route pattern and a static file name collides, the static file will be given preference and served.


## Using A Custom Directory
You can customize the directory for storing static files by updating the value of `directories.public` key  inside the `.adonisrc.json` file.

```json{}{.adonisrc.json}
"directories": {
  "public": "./assets"
}
```

Also, make sure to update the `metaFiles` array and restart the server.

```diff{}{.adonisrc.json}
"metaFiles": [
  ".env",
  ".adonisrc.json",
  "resources/views/**/*.edge",
- "public/**"
+ "assets/**"
]
```
