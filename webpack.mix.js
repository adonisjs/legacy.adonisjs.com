const mix = require('laravel-mix')

if (!mix.inProduction()) {
  mix.webpackConfig({
    devtool: 'inline-source-map',
  })
}

mix.sourceMaps(true, 'source-map')

// NOTE: Don't remove this, Because it's the default public folder path on AdonisJs
mix.setPublicPath('public').js('resources/assets/js/app.js', 'public/js')

mix.postCss('resources/assets/css/app.css', 'public/css', [require('tailwindcss')])

// Add your assets here
