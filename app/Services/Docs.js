'use strict'

const path = use('path')
const Helpers = use('Helpers')
const _ = use('lodash')
const klaw = use('klaw')
const through2 = use('through2')
const fs = use('fs-extra')
const AsciiDoc = use('App/Services/AsciiDoc')
const mute = use('mute')
const EventEmitter = use('events')
const Config = use('Config')

class Docs extends EventEmitter {
  constructor (version, contentDir) {
    super()
    if (!version) {
      throw new Error('Make sure to define version before compiling docs')
    }

    this._doc = new AsciiDoc()
    this._metaData = []
    this._bulkCompile = false

    this.setVersion(version)
    this.setContentDir(contentDir || 'content')
    this.setOutputDir('docs')
    this.setMenuDir('menu')
  }

  /**
   * Returns an array of all the paths for the docs
   * file.
   *
   * @method _getPathsForDocs
   *
   * @return {Array}
   *
   * @private
   */
  _getPathsForDocs () {
    return new Promise((resolve, reject) => {
      const files = []
      klaw(this.contentDir)
      .pipe(through2.obj(function (item, enc, next) {
        if (!item.stats.isDirectory() && item.path.endsWith('.adoc')) {
          this.push(item)
        }
        next()
      }))
      .on('data', (item) => (files.push(item.path)))
      .on('end', () => resolve(files))
      .on('error', reject)
    })
  }

  /**
   * Saves the html to the disk
   *
   * @method _saveHtml
   *
   * @param  {String}  content
   * @param  {String}  permalink
   *
   * @return {Promise}
   *
   * @preserve
   */
  async _saveHtml (content, permalink) {
    const htmlPath = path.join(this.htmlDir, `${permalink}.html`)
    await Helpers.promisify(fs.outputFile)(htmlPath, content)
    return htmlPath
  }

  /**
   * Save the menu file with changes
   *
   * @method saveMenuFile
   *
   * @return {void}
   */
  async saveMenuFile () {
    /**
     * Do not save the file when bulk compile flag is
     * on. We should wait for compile to finish
     * finish first
     */
    if (this._bulkCompile) {
      return
    }
    this.emit('saving:menu', `${this.menuFile.replace(Helpers.appRoot(), '').replace(path.sep, '')}`)
    await fs.outputFile(this.menuFile, JSON.stringify(_.orderBy(this._metaData, 'path'), null, 2))
  }

  /**
   * Process a single doc file from reading, converting
   * and saving it
   *
   * @method addDoc
   *
   * @param  {String}    docPath
   * @param  {String}   [eventPrefix = 'doc']
   *
   * @return {void}
   */
  async addDoc (docPath, eventPrefix = 'doc') {
    const preMeta = {
      path: docPath.replace(Helpers.appRoot(), '').replace(path.sep, '')
    }

    this._metaData.push(preMeta)
    await this.compileDoc(docPath, preMeta, eventPrefix)
    await this.saveMenuFile()
  }

  /**
   * Removes a doc from the menu list
   *
   * @method removeDoc
   *
   * @param  {String}  docPath
   * @param  {String}  [eventPrefix = 'doc']
   *
   * @return {void}
   */
  async removeDoc (docPath, eventPrefix = 'doc') {
    const meta = _.remove(this._metaData, (doc) => docPath.endsWith(doc.path))
    this.emit(`${eventPrefix}:removed`, meta)
    await this.saveMenuFile()
  }

  /**
   * Updates an existing doc
   *
   * @method updateDoc
   *
   * @param  {String}  docPath
   * @param  {String}  [eventPrefix = 'doc']
   *
   * @return {void}
   */
  async updateDoc (docPath, eventPrefix = 'doc') {
    const meta = _.find(this._metaData, (doc) => docPath.endsWith(doc.path))
    await this.compileDoc(docPath, meta, eventPrefix)
    await this.saveMenuFile()
  }

  /**
   * Compiles a single doc using it's path. Also
   * you need to provide the meta object to be
   * mutated on the go.
   *
   * @method compileDoc
   *
   * @param  {String}   docPath
   * @param  {Object}   preMeta
   * @param  {String}   [eventPrefix = 'doc']
   *
   * @return {void}
   */
  async compileDoc (docPath, preMeta, eventPrefix = 'doc') {
    this.emit(`${eventPrefix}:reading`, preMeta)

    /**
     * Reading the file contents
     */
    const content = await fs.readFile(docPath, 'utf-8')

    /**
     * Converting it
     */
    const unmute = mute()
    const { html, meta } = this._doc.convert(content)
    unmute()

    /**
     * Updating premeta
     */
    _.assign(preMeta, meta)
    this.emit(`${eventPrefix}:saving`, preMeta)

    /**
     * Saving html
     */
    const htmlPath = await this._saveHtml(html, preMeta.permalink)
    preMeta.savePath = htmlPath.replace(Helpers.appRoot(), '').replace(path.sep, '')
    this.emit(`${eventPrefix}:saved`, preMeta)
  }

  /**
   * Set the version for which to compile
   * docs
   *
   * @method setVersion
   *
   * @param  {Number}   version
   *
   * @chainable
   */
  setVersion (version) {
    this.version = version
    return this
  }

  /**
   * Set content dir from where to read docs.
   *
   * @method setContentDir
   *
   * @param  {String}      contentDir
   *
   * @chainable
   */
  setContentDir (contentDir) {
    this.contentDir =  path.isAbsolute(contentDir)
      ? path.join(contentDir, this.version)
      : path.join(Helpers.appRoot(), contentDir, this.version)

    return this
  }

  /**
   * Set the directory where to output the html
   *
   * @method setOutputDir
   *
   * @param  {String}     outpurDir
   *
   * @chainable
   */
  setOutputDir (outpurDir) {
    this.htmlDir = Helpers.resourcesPath(`${outpurDir}/${this.version}`)
    return this
  }

  /**
   * Set the directory where to save the menu file
   *
   * @method setMenuDir
   *
   * @param  {String}   menuDir
   *
   * @chainable
   */
  setMenuDir (menuDir) {
    this.menuFile = Helpers.resourcesPath(`${menuDir}/${this.version}.json`)
    return this
  }

  /**
   * Returns the contents for menu file
   *
   * @method getMenu
   *
   * @return {Object}
   */
  getMenu () {
    return require(this.menuFile)
  }

  /**
   * Returns the list of versions
   *
   * @method getVersionsList
   *
   * @return {Object}
   */
  static getVersionsList () {
    return Config.get('app.docs.versions')
  }

  /**
   * Returns the latest docs version
   *
   * @method getLatestVersion
   *
   * @return {String}
   */
  static getLatestVersion () {
    return Config.get('app.docs.latestVersion')
  }

  /**
   * Returns the instance of doc for the latest
   * version
   *
   * @method forLatestVersion
   *
   * @return {Doc}
   */
  static forLatestVersion () {
    return new this(this.getLatestVersion())
  }

  /**
   * Compile docs for a given version and save the
   * output html file with the menu file
   *
   * @method compile
   *
   * @return {void}
   */
  async compile () {
    const docsPaths = await this._getPathsForDocs()
    this.emit('docs:list', docsPaths)
    this._bulkCompile = true

    /**
     * Doing sequentially to keep fs out of load
     * and we can have nice animations too
     */
    for (let docPath of docsPaths) {
      await this.addDoc(docPath)
    }

    this._bulkCompile = false
    await this.saveMenuFile()
  }
}


module.exports = Docs
