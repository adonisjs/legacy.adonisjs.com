'use strict'

const _ = require('lodash')
const { hooks } = require('@adonisjs/ignitor')
const fs = require('fs')
const asciidoctor = require('asciidoctor.js')()

const DEFAULTS = {
  doctype: 'article',
  attributes: ['icons=font', 'skip-front-matter=true', 'sectlinks', 'sectanchors', 'linkattrs', 'toc=macro', 'toclevels=1', 'experimental=true']
}

hooks.after.providersRegistered(() => {
  const View = use('Adonis/Src/View')
  View.global('humanize', (input) => {
    return _.upperFirst(input.replace(/-(\w)/, (group, word) => {
      return ` ${word.toUpperCase()}`
    }))
  })

  View.global('getProps', (item, doc) => {
    return {
      permalink: item.permalink,
      class: doc.permalink === item.permalink ? 'active' : '',
      title: item.title
    }
  })

  View.global('getMetaDescription', (doc) => {
    if (!doc || !doc.description) {
      return ''
    }
    return doc.description
  })

  class AsciiDocTag extends View.engine.BaseTag {
    get tagName () {
      return 'adoc'
    }

    get isBlock () {
      return false
    }

    get allowedExpressions () {
      return ['Literal', 'Identifier', 'MemberExpression']
    }

    compile (compiler, lexer, buffer, { body, childs, lineno }) {
      const compiledStatement = this._compileStatement(lexer, body, lineno).toStatement()
      buffer.writeToOutput(`\${this.context.renderAdoc(${compiledStatement})\}`, false)
    }

    run (context) {
      context.macro('renderAdoc', (input) => {
        const fileContents = fs.readFileSync(input, 'utf-8')
        const output = asciidoctor.load(fileContents, DEFAULTS)
        return output.convert().replace(/<pre class="highlight">/g, () => '<pre class="highlight line-numbers">')
      })
    }
  }

  View.global('json', (input) => JSON.stringify(input))
  View.engine.tag(new AsciiDocTag())
})
