module.exports = function lede (hooks) {
  hooks.before('compile', ({ Markdown }) => {
    Markdown.addMacro('signature', function (props) {
      return {
        type: 'SignatureNode',
        data: {
          hName: 'div',
          hProperties: {
            className: ['signature']
          }
        },
        children: [
          {
            type: 'SignatureArgsNode',
            data: {
              hName: 'span',
              hProperties: {
                className: ['signature-arg']
              }
                },
            children: [{
              type: 'text',
              value: props.args,
            }]
          },
          {
            type: 'SignatureReturnNode',
            data: {
              hName: 'span',
              hProperties: {
                className: ['signature-returns']
              }
                },
            children: [{
              type: 'text',
              value: props.returns,
            }]
          },
        ]
      }
    }, true)
  })
}
