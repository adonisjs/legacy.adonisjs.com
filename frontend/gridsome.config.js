// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const postCSSPlugins = [
  require('postcss-import')(),
  require('tailwindcss')(),
  require('postcss-nested')(),
  require('autoprefixer')(),
]

module.exports = {
  siteName: 'AdonisJS',
  css: {
    loaderOptions: {
      postcss: {
        plugins: postCSSPlugins
      }
    }
  },
  plugins: [
    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: 'UA-62429600-3',
      }
    }
  ],
}
