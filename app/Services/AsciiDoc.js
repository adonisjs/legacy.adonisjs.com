'use strict'

const asciidoctor = require('asciidoctor.js')()
const matter = use('gray-matter')

/**
 * Asciidoctor defaults for rendering
 * docs
 *
 * @type {Object}
 */
const DEFAULTS = {
  doctype: 'article',
  attributes: [
    'icons=font',
    'skip-front-matter=true',
    'sectlinks',
    'sectanchors',
    'linkattrs',
    'toc=macro',
    'toclevels=1',
    'experimental=true'
  ]
}

class AsciiDoc {
  /**
   * Returns the meta data for a doc file by parsing
   * the yaml front matter
   *
   * @method _getMetaFor
   *
   * @param  {String}    forFile
   *
   * @return {Object}
   *
   * @private
   */
  _getMetaFor (content) {
    return matter(content).data
  }

  /**
   * Converts adoc content to HTML and also
   * abstract the converts the front matter
   * to an object
   *
   * @method convert
   *
   * @param  {String} contents
   *
   * @return {Object}
   *         {String} html
   *         {Object} meta
   */
  convert (contents) {
    const output = asciidoctor.load(contents, DEFAULTS)
    const html = output.convert().replace(/<pre class="highlight">/g, () => '<pre class="highlight line-numbers">')
    const meta = this._getMetaFor(contents)
    meta.title = meta.title || output.getAttribute('doctitle')
    meta.category = Array.isArray(meta.categories) ? meta.categories[0] : meta.category

    return {
      html,
      meta
    }
  }
}

module.exports = AsciiDoc
