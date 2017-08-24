'use strict'

const _ = use('lodash')
const Helpers = use('Helpers')
const GE = use('@adonisjs/generic-exceptions')
const Env = use('Env')
const Config = use('Config')
const versions = Config.get('app.docs.versions')

class GuideController {
  render ({ params, view, response }) {
    /**
     * When Version and permalink both are not defined, then
     * redirect user to the latest version of docs.
     */
    if (!params.permalink && !params.version) {
      return response.route('guides', { version: Env.get('LATEST_VERSION') })
    }

    if (!params.permalink && params.version) {
      if (_.includes(_.keys(versions), params.version)) {
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

    const { version, permalink } = params

    try {
      if (Env.get('NODE_ENV') === 'development') {
        require('clear-require')(Helpers.resourcesPath(`docs/menu/${version}.json`))
      }
      const menu = require(Helpers.resourcesPath(`docs/menu/${version}.json`))
      const menuForPermalink = menu.find((item) => item.permalink === permalink)
      const menuGroup = _.groupBy(menu, 'category')

      return view.render('docs', {
        doc: menuForPermalink,
        menu: menuGroup,
        versions: versions,
        currentVersion: version
      })
    } catch (error) {
      throw new GE.HttpException('Page not found', 404)
    }
  }
}

module.exports = GuideController
