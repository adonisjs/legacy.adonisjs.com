// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const { cyan, green, red, yellow, dim } = require('kleur')
const api = require('./api')

const config = require('./config.js')
const BASE_URL = 'http://localhost:5000'

module.exports = function (gsApi) {
  gsApi.loadSource(async ({ addCollection }) => {
    const hero = addCollection({ typeName: 'Hero' })
    const header = addCollection({ typeName: 'HeaderMenu' })
    const footer = addCollection({ typeName: 'FooterMenu' })
    const primaryFeatures = addCollection({ typeName: 'PrimaryFeatures' })
    const showCaseTabs = addCollection({ typeName: 'ShowCaseTabs' })
    const mainVideo = addCollection({ typeName: 'MainVideo' })
    const secondaryFeatures = addCollection({ typeName: 'SecondaryFeatures' })
    const secondaryFeaturesSection = addCollection({ typeName: 'SecondaryFeaturesSection' })

    /**
     * Using the static config file to feed the graphQL database.
     */
    hero.addNode(config.hero)
    mainVideo.addNode(config.mainVideo)
    secondaryFeaturesSection.addNode(config.secondaryFeaturesSection)

    config.header.forEach((item) => header.addNode(item))
    config.footer.forEach((item) => footer.addNode(item))
    config.showCaseTabs.forEach((item) => showCaseTabs.addNode(item))
    config.primaryFeatures.forEach((item) => primaryFeatures.addNode(item))
    config.secondaryFeatures.forEach((item) => secondaryFeatures.addNode(item))
  })

  gsApi.createManagedPages(async ({ createPage, removePageByPath }) => {
    const zones = await api.getZones()

    /**
     * After this loop, we will have an initial set of pages for all
     * zones
     */
    for (let zone of zones) {
      const zoneCategories = await api.getZoneCategories(zone.slug, zone.version.no, true)
      console.log(dim(`using layout: ${zone.component}`))

      zoneCategories.forEach((category) => {
        category.docs.forEach((doc) => {
          const pageData = api.getDocPageData(zone, doc, zoneCategories)
          console.log(
            green(`create page ${pageData.path}`),
          )
          createPage(pageData)
        })
      })
    }
  })
}
