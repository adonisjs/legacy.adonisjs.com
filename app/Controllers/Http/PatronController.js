const patreon = use('App/Services/patreon')

class PatronController {
  async handle ({ params }) {
    return params === 'markdown' ? patreon.getMarkdown() : patreon.getJSON()
  }
}

module.exports = PatronController
