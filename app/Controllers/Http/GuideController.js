'use strict'

const _ = require('lodash')
const Helpers = use('Helpers')

class GuideController {
  render ({ params, view, response }) {
    if (!params.permalink) {
      return response.redirect('/guides/installation')
    }

    if (process.env.NODE_ENV === 'development') {
      require('clear-require')(Helpers.tmpPath('menu'))
    }
    const menu = require(Helpers.tmpPath('menu'))
    const menuForPermalink = menu.find((item) => item.permalink === params.permalink)
    const menuGroup = _.groupBy(menu, 'category')
    return view.render('docs', { doc: menuForPermalink, menu: menuGroup })
  }
}

module.exports = GuideController
