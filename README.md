# AdonisJs Website

This repo contains the source code of [adonisjs.com](http://adonisjs.com). Feel free to clone this repo and run docs on your local machine.

<img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1497112678/adonis-purple_pzkmzt.svg" width="150px" align="right">

## Setup

Start by cloning this repo using the following command:

```bash
> git clone https://github.com/adonisjs/adonisjs.com.git
```

The docs ( markup files ) are referenced as submodules, so make sure to clone the submodules too:

```bash
> git submodule init
> git submodule update
```

Next, install the dependencies from npm:

```bash
> npm install
```

After that copy the `.env.example` file as `.env` and generate the secret key:

```bash
> adonis key:generate
```

## Start server

The server is started using the `adonis serve` command:

```bash
> adonis serve --dev
```

## Compile docs

The docs are compiled at runtime, which means there is no build process to run the website.

But, a menu file is generated to create the **sidebar** in the docs view. For that, you have to run the following command:

```bash
> adonis compile:docs -v 4.0
```

The `-v` flag takes the version for which the menu file should be generated.

You can also watch for changes, so that the menu file is re-generated every time you change something:

```bash
> adonis compile:docs -v 4.0 --watch
```

## Compile Styles & Scripts

All of the styles are saved inside of the `resources/sass` folder. Make sure to not edit the css files inside of the `public` directory - work on the sass files only.
The scripts are compiled using webpack and saved inside the `resources/scripts` folder.

```bash
> npm run build

# with watcher
> npm run build -- -w
```

## License

The fonts referenced from Typekit are only to be used when you are developing the website on local. Deploying the website on a different domain will make the fonts fail and is not recommended.
