const fs = use('fs')
const CsvReadableStream = use('csv-reader')
const Xray = use('x-ray')
const got = use('got')
const klaw = use('klaw')
const { join, basename } = use('path')
const chalk = use('chalk')
const Helpers = use('Helpers')

const CSVPATH = Helpers.tmpPath('uploads/members.csv')
const IMAGES_DIR = Helpers.publicPath('patrons')

const campaignId = '331690'
const cache = {
  members: [],
  existingImages: [],
}

const x = Xray()

/**
 * Returns Markdown for all patreons
 */
function toMarkdown (users) {
  console.log(chalk.cyan('CONVERT: to markdown'))

  return users.map((user) => {
    return `#### [${user.name}](${user.url})\n - ${user.perMonth}/month\n - ${user.lifeTime} Lifetime support`
  }).join('\n\n')
}

/**
 * Returns HTML with avatars of all patreons
 */
function toJSON (users) {
  return users.map((user) => {
    user.thumbUrl = `/patrons/${user.id}.jpg`
    return user
  })
}

/**
 * Downloading user avatar by scanning page HTML and then
 * downloading the images
 */
function downloadUserAvatar ({ url, id }) {
  return new Promise((resolve, reject) => {
    if (cache.existingImages.indexOf(`${id}.jpg`) > -1) {
      console.log(chalk.yellow(`IMAGE: using cache for ${id} user`))
      resolve()
      return
    }

    console.log(chalk.yellow(`IMAGE: scrapping for ${id} user`))

    x(url, 'body > script')((error, src) => {
      if (error) {
        reject(error)
        return
      }

      const obj = JSON.parse(`${src.split('Object.assign(window.patreon.bootstrap,')[1].split('});')[0]}}`)
      const thumbUrl = obj.pageUser ? obj.pageUser.data.attributes.thumb_url : obj.creator.data.attributes.avatar_photo_url

      console.log(chalk.yellow(`IMAGE: downloading for ${id} user`))

      got
        .stream(thumbUrl)
        .on('error', reject)
        .on('end', resolve)
        .pipe(fs.createWriteStream(join(IMAGES_DIR, `${id}.jpg`)))
    })
  })
}

/**
 * Builds in memory cache or previously downloaded images
 * to avoid re-downloading images
 */
function buildImagesCache () {
  return new Promise((resolve, reject) => {
    klaw(IMAGES_DIR)
    .on('data', (item) => {
      if (item.path.endsWith('.jpg')) {
        console.log(chalk.green(`IMAGE: ${basename(item.path)} in cache`))
        cache.existingImages.push(basename(item.path))
      }
    })
    .on('end', resolve)
    .on('error', reject)
  })
}

/**
 * Download avatars for all users
 */
function downloadAvatars (users) {
  return Promise.all(users.map((user) => downloadUserAvatar(user)))
}

function parseCSV () {
  return new Promise((resolve, reject) => {
    const inputStream = fs.createReadStream(CSVPATH, 'utf8')
    let skippedFirstRow = false

    inputStream
      .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
      .on('data', (row) => {
        if (skippedFirstRow) {
          const name = row[0]
          const id = row[row.length - 2]
          const perMonth = row[6]
          const lifeTime = row[5]
          const url = `https://www.patreon.com/user/creators?u=${id}`
          cache.members.push({ name, id, url, perMonth, lifeTime })

          console.log(chalk.magenta(`CSV: got user ${name}`))
        }
        skippedFirstRow = true
      })
      .on('error', reject)
      .on('end', resolve)
  })
}

module.exports = {
  async bootstrap () {
    await buildImagesCache()
    await parseCSV()
    await downloadAvatars(cache.members)
  },
  getJSON () {
    return toJSON(cache.members)
  },
  getMarkdown () {
    return toMarkdown(cache.members)
  }
}
