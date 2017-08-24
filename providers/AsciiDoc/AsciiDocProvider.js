'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class AsciiDocProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Guides/AsciiDoc', (app) => {
      const AsciiDoc = require('./index')
      return new AsciiDoc(app.use('Adonis/Src/View'))
    })
  }

  boot () {
    const View = this.app.use('Adonis/Src/View')
    const AsciiDoc = this.app.use('Adonis/Guides/AsciiDoc')
    View.engine.tag(new AsciiDoc())
  }
}

module.exports = AsciiDocProvider
