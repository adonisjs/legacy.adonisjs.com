const WebSocket = require('ws')
const { cyan } = require('kleur')

module.exports = {
  connect (onUpdate, onError) {
    const ws = new WebSocket('ws://localhost:5000')
    ws.on('open', () => {
      console.log(cyan('Connected to ws server'))
    })

    ws.on('message', (message) => {
      try {
        const { data } = JSON.parse(message)
        onUpdate(data)
      } catch (error) {
        onError(error)
      }
    })
  }
}
