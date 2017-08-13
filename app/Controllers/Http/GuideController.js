'use strict'

const _ = require('lodash')
const Helpers = use('Helpers')
const Env = use('Env')
const versions = ['4.0', '3.2']

class GuideController {
  render ({ params, view, response }) {
    /**
     * When Version and permalink both are not defined, then
     * redirect user to the latest version of docs.
     */
    console.log(params)
    if (!params.permalink && !params.version) {
      return response.route('guides', { version: Env.get('LATEST_VERSION') })
    }

    if (!params.permalink && params.version) {
      if (_.includes(versions, params.version)) {
        /**
         * When version exists but no permalink, then redirect to installation path
         */
        return response.route('guides', { version: params.version, permalink: 'installation' })
      } else {
        /**
         * Otherwise the first URL param is the permalink and not the version.
         * So we need to redirect the user to the latest version of that
         * permalink
         */
        return response.route('guides', { version: Env.get('LATEST_VERSION'), permalink: params.version })
      }
    }

    try {
      const menu = require(Helpers.resourcesPath(`docs/menu/${params.version}.json`))
      const menuForPermalink = menu.find((item) => item.permalink === params.permalink)
      const menuGroup = _.groupBy(menu, 'category')
      return view.render('docs', { doc: menuForPermalink, menu: menuGroup })
    } catch (error) {
      return response.redirect('/404')
    }
  }
}

module.exports = GuideController
