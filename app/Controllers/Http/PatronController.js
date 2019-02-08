const patreon = use('App/Services/patreon')

class PatronController {
  async handle ({ params }) {
    return params.format === 'markdown' ? patreon.getMarkdown() : patreon.getJSON()
  }
}

module.exports = PatronController
