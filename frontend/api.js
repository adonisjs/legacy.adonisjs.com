const { red, yellow } = require('kleur')
const axios = require('axios')
const { utils } = require('dimer-vue')
const BASE_URL = 'http://localhost:4444'

/**
 * A mapping of zones and the template component they must use
 */
const ZONE_TEMPLATE_MAPPING = {
  guides: './src/templates/Guides.vue',
  releases: './src/templates/Guides.vue'
}

/**
 * We decided to stick to a single version for the docs. Every
 * major release can get it's own website (a copy of it) and
 * every minor release can have inline notes.
 */
const WEBSITE_VERSION = 'master'

/**
 * Returns an array of zones and their respective version. Each
 * zone has a single version only.
 */
async function getZones () {
  const { data } = await axios.get(`${BASE_URL}/zones.json`)
  return data.map(({ name, slug, versions }) => {
    const component = ZONE_TEMPLATE_MAPPING[slug]
    const version = versions.find((version) => version.no === WEBSITE_VERSION)

    if (!component) {
      throw new Error(
        `${slug} doesn't have a component assigned to it. Open "frontend/api.js" to assign a component`,
      )
    }

    if (!version) {
      throw new Error(`${slug} must have a ${WEBSITE_VERSION} in order to be compiled.`)
    }

    return {
      name: name,
      slug: slug,
      component,
      version,
    }
  })
}

/**
 * Returns a tree of categories and optionally their docs with complete
 * content.
 */
async function getZoneGroupsAndCategories (zoneSlug, versionNo, includeContent) {
  if (!zoneSlug || !versionNo) {
    throw new Error(
      `Cannot fetch categories. zoneSlug and versionNo are required.`
    )
  }

  const params = {}
  if (includeContent) {
    params.load_content = true
  }

  const { data } = await axios(`${BASE_URL}/${zoneSlug}/versions/${versionNo}.json`, { params })
  const groups = []

  /**
   * Looping over categories to group them by their group
   */
  data.filter((category) => {
    category.docs.forEach((doc) => {
      if (!doc.group) {
        console.log(red(`${doc.permalink} is ignored, since it has no group`))
        return
      }

      if (doc.group === 'Application Security') {
        return
      }

      if (doc.draft) {
        console.log(yellow(`${doc.permalink} is ignored, since it is in draft mode`))
        return
      }

      let group = groups.find(({ name }) => name === doc.group)
      if (!group) {
        group = {
          name: doc.group,
          categories: []
        }
        groups.push(group)
      }

      if (!group.under_progress && doc.under_progress) {
        group.under_progress = true
        group.last_updated_on = doc.last_updated_on
      }

      let category = group.categories.find(({ name }) => name === doc.category)
      if (!category) {
        category = {
          name: doc.category,
          docs: []
        }
        group.categories.push(category)
      }

      category.docs.push(doc)
    })
  })

  return groups
}

/**
 * Returns the content for a doc
 */
async function getDoc (zoneSlug, versionNo, permalink) {
  if (!zoneSlug || !versionNo || !permalink) {
    throw new Error(
      `Cannot fetch doc. "zoneSlug", "versionNo" and "permalink" are required.`
    )
  }

  const { data } = await axios(`${BASE_URL}/${zoneSlug}/versions/${versionNo}/${permalink}.json`)
  return data
}

/**
 * Returns the page data for the doc
 */
function getDocPageData (zone, doc, groups) {
  if (!zone) {
    throw new Error('Make sure to define the zone when getting page data')
  }

  if (!zone.component) {
    throw new Error('The zone must have a component property in order to generate page data')
  }

  /**
   * Extracting toc from the doc content
   */
  const toc = utils.extractNode(doc.content, (node) => {
    return node.tag === 'div'
      && node.props.className
      && node.props.className.includes('toc-container')
  })

  const docGroup = groups.find(({ name }) => name === doc.group) || {}
  return {
    path: `/${doc.permalink}`,
    component: zone.component,
    context: {
      doc: {
        title: doc.title,
        content: doc.content,
        group: doc.group,
        permalink: doc.permalink,
        meta: doc.meta || null,
      },
      toc: toc,
      groups: groups,
      under_progress: docGroup.under_progress,
      last_updated_on: docGroup.last_updated_on,
      categories: docGroup.categories,
    },
  }
}

module.exports = {
  getZones: getZones,
  getZoneGroupsAndCategories: getZoneGroupsAndCategories,
  getDoc: getDoc,
  getDocPageData: getDocPageData,
}
