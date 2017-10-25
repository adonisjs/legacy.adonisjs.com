'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const Logger = use('Logger')

class RouteNotFoundException extends LogicalException {
  handle (error, { response, request }) {
    Logger.warning('Unexpected 404 on %s url', request.url())
    Logger.warning(error)
    return response.route('/404')
  }
}

module.exports = RouteNotFoundException
