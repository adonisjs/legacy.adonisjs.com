const highlight = require('./highlight')

/**
 * Recursively visit a given ast nodes
 */
function visit (node, tag, callback) {
  if (node.tag === tag) {
    callback(node)
  }

  if (node.children) {
    return node.children.map((child) => visit(child, tag, callback))
  }
}

module.exports = function lede (hooks) {
  hooks.before('compile', ({ Markdown }) => {
    Markdown.addMacro('lede', function (content, props, { transformer, eat }) {
      return {
        type: 'LedeNode',
        data: {
          hName: 'div',
          hProperties: {
            className: ['lede']
          }
        },
        children: transformer.tokenizeBlock(content, eat.now())
      }
    })
  })
}
