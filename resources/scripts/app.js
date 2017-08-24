require('./prism')
require('./edge-syntax')

const Zepto = require('zepto')
Zepto(function () {
  if (Zepto('#docs-version')) {
    Zepto('#docs-version').on('change', function () {
      const val = Zepto(this).val()
      window.location = '/guides/' + val + '/' + AD.permalink
    })
  }
})

