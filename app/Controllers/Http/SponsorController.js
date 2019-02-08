const patreon = use('App/Services/patreon')

class SponsorController {
  async handle ({ view }) {
    return view.render('sponsors', { patrons: patreon.getJSON() })
  }
}

module.exports = SponsorController
