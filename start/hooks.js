'use strict'

const { hooks } = require('@adonisjs/ignitor')
hooks.after.providersRegistered(require('./viewGlobals'))

hooks.after.providersBooted(async () => {
  await use('App/Services/patreon').bootstrap()
})
