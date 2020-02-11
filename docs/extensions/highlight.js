const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
const rangeParser = require('parse-numeric-range')
const directives = require('./directives')

Prism.languages.edge = {
  comment: /{{--[\w\W]*?--}}/,
  keyword: /@debugger|@super/,
  rawComment: {
    pattern: /@raw[\w\W]+@endraw/,
    inside: {
      function: /@raw|@endraw/,
      comment: /[\w\W]+/
    }
  },
  tag: {
    pattern: /^\s*@(!?)(\w+)(?:\((.*)\))?/gm,
    inside: {
      function: /^\s*@(?:!?)\w+(?=\()?/,
      number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
      'string': {
        pattern: /("|')(?:\\?.)*?\1/,
        inside: {
          'punctuation': /^['"]|['"]$/
        }
      },
      operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/,
      keyword: /in\s+|\$slot/
    }
  },
  mustacheComment: {
    pattern: /^@{{[\w\W]+/g,
    inside: {
      comment: /^@{{[\w\W]+/
    }
  },
  mustache: {
    pattern: /{{.*}}/g,
    inside: {
      keyword: /\$loop|\$slot/g,
      punctuation: /{{2,3}|}{2,3}/,
      number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
      'string': {
        pattern: /("|')(?:\\?.)*?\1/,
        inside: {
          'punctuation': /^['"]|['"]$/,
          other: {
            pattern: /\S(?:[\s\S]*\S)?/,
            inside: Prism.languages.markup
          }
        },
        operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
      }
    }
  },
  other: {
    pattern: /\S(?:[\s\S]*\S)?/,
    inside: Prism.languages.markup
  }
}

/**
 * Returns the prims language for language directive
 * set in the markdown
 */
function getPrismLanguage (preLanguage) {
  const language = preLanguage.startsWith('language-') ? preLanguage.replace('language-', '') : 'text'
  if (language === 'sh') {
    return 'shell'
  }
  return language
}

/**
 * Highlight code
 */
module.exports = function highlight (code, languageClass, dataLine) {
  const language = getPrismLanguage(languageClass)
  if (!Prism.languages[language]) {
    loadLanguages(language)
  }

  const lines = dataLine ? rangeParser.parse(dataLine) : []
  const highlighted = Prism.highlight(code, Prism.languages[language], language)

  let finalCode = ''
  const codeSplits = directives(highlighted, lines)
  const lastId = codeSplits.length - 1

  codeSplits
    .forEach((split, index) => {
      finalCode += split.highlight
        ? split.code
        : `${split.code}${index == lastId ? `` : `\n`}`
    })

  return finalCode
}
