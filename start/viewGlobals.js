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
}
