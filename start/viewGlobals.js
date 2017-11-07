'use strict'

const _ = require('lodash')

module.exports = function registerViewGlobals () {
  const View = use('Adonis/Src/View')
  View.global('humanize', (input) => {
    return _.upperFirst(input.replace(/-(\w)/g, (group, word) => {
      return ` ${word.toUpperCase()}`
    }))
  })

  View.global('getProps', (item, doc) => {
    return {
      permalink: item.permalink,
      class: doc.permalink === item.permalink ? 'is-active' : '',
      title: item.title
    }
  })

  View.global('getMetaDescription', (doc) => {
    if (!doc || !doc.description) {
      return ''
    }
    return doc.description
  })

  View.global('navbarAnchor', function (meta) {
    /////////////////////
    // For single item //
    /////////////////////
    if (!meta.childs) {
      const attributes = _.map(meta, (value, key) => key !== 'title' ? `${key}="${value}"` : '')

      /**
       * Add required classes to the anchor tag. Note, he detect the current url
       * and add active class to anchor
       */
      attributes.push(`class="navbar-item ${this.resolve('url').startsWith(meta.href) ? 'is-active' : ''}"`)

      /**
       * Set target to _blank for external urls
       */
      if (meta.href && meta.href.startsWith('http')) {
        attributes.push('target="_blank"')
      }

      return this.safe(`<a ${attributes.join(' ')}> ${meta.title} </a>`)
    }

    //////////////////
    // For dropdown //
    //////////////////
    let isChildItem = false

    const childs = _.map(meta.childs, (child) => {
      const attributes = _.map(child, (value, key) => key !== 'title' ? `${key}="${value}"` : '')

      /**
       * Set parent active when any child url is open
       */
      if (!isChildItem && child.href && this.resolve('url').startsWith(child.href)) {
        isChildItem = true
      }

      attributes.push('class="navbar-item"')

      /**
       * Set target to _blank for external urls
       */
      if (child.href && child.href.startsWith('http')) {
        attributes.push('target="_blank"')
      }
      return `<a ${attributes.join(' ')}> ${child.title} </a>`
    }).join('\n')

    return this.safe(`
    <div class="navbar-item has-dropdown ${isChildItem ? 'is-child-active': ''}">
      <a class="navbar-link"> ${meta.title} </a>
      <div class="navbar-dropdown">
        ${childs}
      </div>
    </div>
    `)
  })
}
