'use strict'

const fs = require('fs')
const asciidoctor = require('asciidoctor.js')()

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

module.exports = function (View) {
  return class AsciiDocTag extends View.engine.BaseTag {
    /**
     * The tag name to be used inside view
     *
     * @method tagName
     *
     * @return {String}
     */
    get tagName () {
      return 'adoc'
    }

    /**
     * Only inline tag
     *
     * @method isBlock
     *
     * @return {Boolean}
     */
    get isBlock () {
      return false
    }

    /**
     * Expression that can be passed when using the tags
     *
     * @method allowedExpressions
     *
     * @return {Array}
     */
    get allowedExpressions () {
      return ['Literal', 'Identifier', 'MemberExpression']
    }

    /**
     * Compile phases, where we just add a line to
     * render the doc at runtime, since doc path
     * can be dynamic too
     *
     * @method compile
     *
     * @param  {Object} compiler
     * @param  {Object} lexer
     * @param  {Object} buffer
     * @param  {String} options.body
     * @param  {Array} options.childs
     * @param  {Number} options.lineno
     *
     * @return {void}
     */
    compile (compiler, lexer, buffer, { body, childs, lineno }) {
      const compiledStatement = this._compileStatement(lexer, body, lineno).toStatement()
      buffer.writeToOutput(`\${this.context.renderAdoc(${compiledStatement})\}`, false)
    }

    /**
     * Add a macro to the template runtime context, which will
     * render the doc file.
     *
     * @method run
     *
     * @param  {String} context
     *
     * @return {void}
     */
    run (context) {
      context.macro('renderAdoc', (input) => {
        try {
          const fileContents = fs.readFileSync(input, 'utf-8')
          const output = asciidoctor.load(fileContents, DEFAULTS)
          return output.convert().replace(/<pre class="highlight">/g, () => '<pre class="highlight line-numbers">')
        } catch (error) {
          throw new Error(`Cannot render ${input} file via adoc tag, since unable to locale it`)
        }
      })
    }
  }
}
