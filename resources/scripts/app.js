const Zepto = require('zepto')

window.Prism.languages.edge = {
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
    pattern: /(\{\{[\s\S]*?\}\})/g,
    inside: {
      keyword: /\$loop|\$slot/g,
      boolean: /\b(true|false|null)\b/g,
      punctuation: /{{2,3}|}{2,3}/,
      number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
      'string': {
        pattern: /("|')(?:\\?.)*?\1/,
        inside: {
          'punctuation': /^['"]|['"]$/,
          other: {
            pattern: /\S(?:[\s\S]*\S)?/,
            inside: window.Prism.languages.markup
          }
        },
        operator: /==|=|\!=|<|>|>=|<=|\+|\-|~|\*|\/|\/\/|%|\*\*|\|/g,
        property: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g
      }
    }
  },
  other: {
    pattern: /\S(?:[\s\S]*\S)?/,
    inside: window.Prism.languages.markup
  }
}

Zepto(function () {
  if (Zepto('#docs-version')) {
    Zepto('#docs-version').on('change', function () {
      const val = Zepto(this).val()
      window.location = `/guides/${val}/${AD.permalink}`
    })
  }
})

