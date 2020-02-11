// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const axios = require('axios')
const WebSocket = require('ws')
const { cyan, green, red, yellow } = require('kleur')

const config = require('./config.js')

const BASE_URL = 'http://localhost:5000'

/**
 * Returns a collection of categories and their docs
 */
async function getCategoriesWithContent (zone, version) {
  const { data } = await axios(`${BASE_URL}/${zone}/versions/${version}.json?load_content=true`)
  return data
}

/**
 * Returns a collection of categories and their docs
 */
async function getCategories (zone, version) {
  const { data } = await axios(`${BASE_URL}/${zone}/versions/${version}.json`)
  return data
}

/**
 * Get doc
 */
async function getDoc (zone, version, permalink) {
  const { data } = await axios(`${BASE_URL}/${zone}/versions/${version}/${permalink}.json`)
  return data
}

/**
 * Returns page data for a given doc and it's categories
 */
async function getDocPageData (doc, category) {
  return {
    path: `/${doc.permalink}`,
    component: './src/templates/Tutorials.vue',
    context: {
      doc: doc,
      tree: category,
    },
  }
}

module.exports = function (api) {
  api.loadSource(async ({ addCollection }) => {
    const hero = addCollection({ typeName: 'Hero' })
    const header = addCollection({ typeName: 'HeaderMenu' })
    const footer = addCollection({ typeName: 'FooterMenu' })
    const primaryFeatures = addCollection({ typeName: 'PrimaryFeatures' })
    const showCaseTabs = addCollection({ typeName: 'ShowCaseTabs' })
    const mainVideo = addCollection({ typeName: 'MainVideo' })
    const secondaryFeatures = addCollection({ typeName: 'SecondaryFeatures' })
    const secondaryFeaturesSection = addCollection({ typeName: 'SecondaryFeaturesSection' })

    hero.addNode(config.hero)
    mainVideo.addNode(config.mainVideo)
    secondaryFeaturesSection.addNode(config.secondaryFeaturesSection)

    config.header.forEach((item) => header.addNode(item))
    config.footer.forEach((item) => footer.addNode(item))
    config.showCaseTabs.forEach((item) => showCaseTabs.addNode(item))
    config.primaryFeatures.forEach((item) => primaryFeatures.addNode(item))
    config.secondaryFeatures.forEach((item) => secondaryFeatures.addNode(item))
  })

  api.createManagedPages(async ({ createPage, removePageByPath }) => {
    const guides = await getCategoriesWithContent('guides', 'master')
    const ws = new WebSocket('ws://localhost:5000')

    ws.on('error', () => {
      console.log(red('unable to make WebSocket connection. Instant builds will not work'))
    })
    ws.on('open', () => {
      console.log(cyan('Connected to WebSocket server. Listening for events for instant builds'))
    })

    ws.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message)
        console.log(cyan(parsedMessage.event))

        if (parsedMessage.event !== 'change:doc') {
          console.log(yellow(`Skip event ${parsedMessage.event}`))
          return
        }

        const version = parsedMessage.data.version
        const zone = parsedMessage.data.zone
        const permalink = parsedMessage.data.permalink

        const doc = await getDoc(zone, version, permalink)
        const categories = await getCategories(zone, version)
        const docCategory = categories.find((category) => {
          return category.docs.find((doc) => doc.permalink === permalink)
        })

        const newPage = await getDocPageData(doc, docCategory)
        console.log(yellow(`remove page ${newPage.path}`))
        removePageByPath(`/${permalink}`)

        console.log(green(`create page ${newPage.path}`))
        createPage(newPage)
      } catch (error) {
        console.log(red('received error when trying to re-create the page'))
        console.log(error)
      }
    })

    for (category of guides) {
      for (doc of category.docs) {
        const page = await getDocPageData(doc, category)
        console.log(green(`create page ${page.path}`))
        createPage(page)
      }
    }
  })
}
