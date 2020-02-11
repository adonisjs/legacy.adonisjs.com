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

module.exports = function compileCode (hooks) {
  hooks.before('doc', ({ doc }) => {
    visit(doc.content, 'pre', (node) => {
      node.children[0].children[0].value = highlight(
        node.children[0].children[0].value,
        node.props.className[0],
        node.props.dataLine,
      )
    })
  })
}
