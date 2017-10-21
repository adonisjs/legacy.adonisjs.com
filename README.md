# AdonisJs Website

This repo contains the source code of [adonisjs.com](http://adonisjs.com). Feel free to clone this repo and run docs on your local.

<img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1497112678/adonis-purple_pzkmzt.svg" width="150px" align="right">

## Setup

Start by cloning this repo using the following command.

```bash
git clone https://github.com/adonisjs/adonisjs.com.git
```

The docs ( markup files ) are referenced as submodules, so make sure to clone the submodules too.

```bash
git submodule init 
git submodule update
```

Next, install the dependencies from npm.

```bash
npm install
```

After that copy the `.env.example` file as `.env` and make required changes.

## Start server

The server is started using the `adonis serve` command.

```bash
adonis serve --dev
```

## Compile docs

The docs are compiled at runtime, which means there is no build process to run the website. 

But, a menu file is generated to create the **sidebar** in the docs view. For that, you have to run following command.

```bash
adonis compile:docs -v 4.0
```

The `-v` flag takes the version for which the menu file should be generated.

Also you can watch for changes, so that the menu file is re-generated everytime you change something.

```bash
adonis compile:docs -v 4.0 --watch
```

## Compile styles

All of the styles are saved inside `resources/sass` folder, make sure do not edit the css files inside `public` directory and work sass files only.

```bash
npm run compile:styles

# with watcher
npm run styles
```

## Compile scripts

The scripts are compiled using webpack, and saved inside `resources/scripts` folder.

```js
npm run compile:scripts

# with watcher
npm run scripts
```

## License

The fonts referenced from Typekit are only to be used when you are developing website on local, deploying the website on different domain will make the fonts fail and is also not recommended.
