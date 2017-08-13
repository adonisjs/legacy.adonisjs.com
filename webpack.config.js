const path = require('path')

module.exports = {
  entry: './resources/scripts/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public/js')
  },
  module: {
    rules: [
      {
        test: require.resolve('zepto'),
        use: 'imports-loader?this=>window'
      }
    ]
  }
}
