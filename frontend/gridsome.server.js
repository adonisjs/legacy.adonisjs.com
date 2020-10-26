// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const { green, red, dim } = require('kleur')
const api = require('./api')
const ws = require('./ws')

const config = require('./config.js')

module.exports = function (gsApi) {
  gsApi.loadSource(async ({ addCollection }) => {
    const header = addCollection({ typeName: 'HeaderMenu' })
    const footer = addCollection({ typeName: 'FooterMenu' })
    const primaryFeatures = addCollection({ typeName: 'PrimaryFeatures' })
    const homePageShowCaseTabs = addCollection({ typeName: 'HomePageShowCaseTabs' })
    const edgeShowCaseTabs = addCollection({ typeName: 'EdgeShowCaseTabs' })
    const secondaryFeatures = addCollection({ typeName: 'SecondaryFeatures' })

    /**
     * Using the static config file to feed the GraphQL database.
     */
    config.header.forEach((item) => header.addNode(item))
    config.footer.forEach((item) => footer.addNode(item))
    config.homePageShowCaseTabs.forEach((item) => homePageShowCaseTabs.addNode(item))
    config.edgeShowCaseTabs.forEach((item) => edgeShowCaseTabs.addNode(item))
    config.primaryFeatures.forEach((item) => primaryFeatures.addNode(item))
    config.secondaryFeatures.forEach((item) => secondaryFeatures.addNode(item))
  })

  gsApi.createPages(async ({ createPage, removePageByPath }) => {
    const zones = await api.getZones()
    let blogPosts = []

    /**
     * After this loop, we will have an initial set of pages for all
     * zones
     */
    for (let zone of zones) {
      const zoneGroupsCategories = await api.getZoneGroupsAndCategories(zone.slug, zone.version.no, true)
      console.log(dim(`using layout: ${zone.component}`))

      zoneGroupsCategories.forEach((group) => {
        group.categories.forEach((category) => {
          category.docs.forEach((doc) => {
            if (doc.draft) {
              return
            }
            const pageData = api.getDocPageData(zone, doc, zoneGroupsCategories)

            if (pageData.component === './src/templates/Blog.vue') {
              blogPosts.push({
                title: pageData.context.doc.title,
                permalink: pageData.context.doc.permalink,
                publishedOn: pageData.context.doc.meta.published_on,
                order: pageData.context.doc.meta.number,
              })
            }

            console.log(green(`create page ${pageData.path}`))
            createPage(pageData)
          })
        })
      })
    }

    /**
     * Listen for websockets events on dimer server and rebuild
     * docs
     */
    if (process.env.NODE_ENV === 'development') {
      ws.connect(async (message) => {
        const zoneSlug = message.zone
        const versionNo = message.version
        const permalink = message.permalink

        const zoneGroupsCategories = await api.getZoneGroupsAndCategories(zoneSlug, versionNo, false)
        const doc = await api.getDoc(zoneSlug, versionNo, permalink)
        if (doc.draft) {
          return
        }

        const zone = zones.find((one) => one.slug === zoneSlug)
        const pageData = api.getDocPageData(zone, doc, zoneGroupsCategories)

        console.log(green(`create page ${pageData.path}`))
        createPage(pageData)
      }, (error) => {
        console.log('Ws error')
        console.log(red(error))
      })
    }

    console.log(JSON.stringify(blogPosts.sort((a, b) => b.order - a.order), null, 2))
  })
}
