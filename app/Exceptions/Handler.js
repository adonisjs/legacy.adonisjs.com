'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, ctx) {
    if (process.env.NODE_ENV === 'development') {
      return BaseExceptionHandler.handle(error, ctx)
    }

    const { response, view } = ctx
    const status = error.status || 500
    response.status(status).send(view.render('error', { status }))
  }
}

module.exports = ExceptionHandler
