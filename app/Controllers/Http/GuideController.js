'use strict'

const _ = use('lodash')
const Docs = use('App/Services/Docs')
const fs = use('fs-extra')
const path = use('path')
const Helpers = use('Helpers')
const Logger = use('Logger')

const latestVersion = Docs.getLatestVersion()
const versions = Docs.getVersionsList()

class GuideController {
  async render ({ params, view, response }) {
    /**
     * When Version and permalink both are not defined, then
     * redirect user to the latest version of docs.
     */
    if (!params.permalink && !params.version) {
      return response.route('guides', { version: latestVersion, permalink: 'installation' })
    }

    /**
     * No pemalink, also defined version doesn't exists, we should consider
     * version as permalink and fallback version to the latest version
     */
    if (!params.permalink && params.version) {
      if (_.includes(_.keys(versions), params.version)) {
        return response.route('guides', { version: params.version, permalink: 'installation' })
      }
      return response.route('guides', { version: latestVersion, permalink: params.version })
    }

    /**
     * Version defined && exists but permalink is missing. We should
     * redirect to the installation of that version
     */
    if (!_.includes(_.keys(versions), params.version)) {
      return response.route('guides', { version: latestVersion, permalink: params.permalink })
    }

    /**
     * Finally we have everything
     */
    const { version, permalink } = params

    const docs = new Docs(version)
    const menu = docs.getMenu()
    const menuGroup = _.groupBy(menu, 'category')
    const menuForPermalink = menu.find((item) => item.permalink === permalink)

    /**
     * Doc for permalink doesn't exists
     */
    if (!menuForPermalink) {
      return response.route('/404')
    }

    try {
      const htmlContents = await fs.readFile(path.join(Helpers.appRoot(), menuForPermalink.savePath), 'utf-8')
      return view.render('docs', {
        doc: menuForPermalink,
        menu: menuGroup,
        versions: versions,
        currentVersion: version,
        htmlContents: htmlContents
      })
    } catch (error) {
      Logger.warning('Unexpected 404 on %s url', request.url())
      Logger.warning(error)
      return response.route('/404')
    }
  }
}

module.exports = GuideController
