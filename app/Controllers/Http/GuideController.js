'use strict'

const _ = use('lodash')
const Docs = use('App/Services/Docs')
const fs = use('fs-extra')
const path = use('path')
const Helpers = use('Helpers')
const RouteNotFoundException = use('App/Exceptions/RouteNotFoundException')

const latestVersion = Docs.getLatestVersion()
const versions = Docs.getVersionsList()

class GuideController {
  /**
   * Returns an object to be used for redirecting
   * the request. The redirect only happens
   * when URL is incomplete
   *
   * @method _getRedirectProps
   *
   * @param  {Object}          params
   * @param  {String}          defaultPermalink
   *
   * @return {Object|Null}
   *
   * @private
   */
  _getRedirectProps (params, defaultPermalink) {
    /**
     * When Version and permalink both are not defined, then
     * redirect user to the latest version of docs.
     */
    if (!params.permalink && !params.version) {
      return { version: latestVersion, permalink: defaultPermalink }
    }

    /**
     * No pemalink, also defined version doesn't exists, we should consider
     * version as permalink and fallback version to the latest version
     */
    if (!params.permalink && params.version) {
      if (_.includes(_.keys(versions), params.version)) {
        return { version: params.version, permalink: defaultPermalink }
      }
      return { version: latestVersion, permalink: params.version }
    }

    /**
     * Version defined && exists but permalink is missing. We should
     * redirect to the installation of that version
     */
    if (!_.includes(_.keys(versions), params.version)) {
      return { version: latestVersion, permalink: params.permalink }
    }

    return null
  }

  /**
   * Returns the HTTP file contents
   *
   * @method _getDocContent
   * @async
   *
   * @param  {String}              docFilePath
   *
   * @return {String}
   *
   * @private
   */
  async _getDocContent (docFilePath) {
    try {
      return await fs.readFile(path.join(Helpers.appRoot(), docFilePath), 'utf-8')
    } catch (error) {
      throw new RouteNotFoundException(error.message)
    }
  }

  /**
   * Render docs
   *
   * @method render
   *
   * @param  {Object} options.params
   * @param  {Object} options.view
   * @param  {Object} options.response
   *
   * @return {Html}
   */
  async render ({ params, view, response }) {
    const redirectProps = this._getRedirectProps(params, 'installation')
    if (redirectProps) {
      return response.route('guides', redirectProps)
    }

    const docs = new Docs(params.version)
    const menu = docs.getMenu().filter((item) => item.category !== 'recipes')
    const doc = menu.find((item) => item.permalink === params.permalink)

    if (!doc) {
      return response.route('/404')
    }

    const htmlContents = await this._getDocContent(doc.savePath)
    return view.render('docs', {
      doc,
      menu: _.groupBy(menu, 'category'),
      versions,
      currentVersion: params.version,
      htmlContents
    })
  }

  /**
   * Renders recipes view
   *
   * @method renderRecipes
   *
   * @param  {Object}      options.params
   * @param  {Object}      options.view
   * @param  {Object}      options.response
   *
   * @return {Html}
   */
  async renderRecipes ({ params, view, response }) {
    const redirectProps = this._getRedirectProps(params, 'nginx-proxy')

    if (redirectProps) {
      return response.route('recipes', redirectProps)
    }

    const docs = new Docs(params.version)
    const menu = docs.getMenu().filter((item) => item.category === 'recipes')
    const doc = menu.find((item) => item.permalink === params.permalink)

    if (!doc) {
      return response.route('/404')
    }

    const htmlContents = await this._getDocContent(doc.savePath)
    return view.render('docs', {
      doc,
      menu: _.groupBy(menu, 'category'),
      versions: _.filter(versions, (d, version) => version === '4.0'),
      currentVersion: params.version,
      htmlContents
    })
  }
}

module.exports = GuideController
