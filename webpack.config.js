const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './resources/scripts/app.js',
  output: {
    filename: 'app.min.js',
    path: path.resolve(__dirname, 'public/js')
  },
  module: {
    rules: [
      {
        test: require.resolve('zepto'),
        use: 'imports-loader?this=>window'
      }
    ]
  },
  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        mangle: true,
        output: {
          ascii_only: true
        }
      }
    })
  ]
}
