const mix = require('laravel-mix')

if (!mix.inProduction()) {
  mix.webpackConfig({
    devtool: 'inline-source-map',
  })
}

mix.sourceMaps(true, 'source-map')

// NOTE: Don't remove this, Because it's the default public folder path on AdonisJs
mix
  .setPublicPath('public/static')
  .js('resources/assets/js/app.js', 'public/static/js')
  .postCss('resources/assets/css/app.css', 'public/static/css', [require('tailwindcss')])

// Add your assets here
