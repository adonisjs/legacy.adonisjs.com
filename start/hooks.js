'use strict'

const { hooks } = require('@adonisjs/ignitor')
hooks.after.providersRegistered(require('./viewGlobals'))
