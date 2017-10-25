'use strict'

const { Command } = use('@adonisjs/ace')
const Docs = use('App/Services/Docs')
const chalk = use('chalk')
const watcher = use('watch')
const progressBar = use('cli-progress')
const _ = use('lodash')

class CompileDoc extends Command {
  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    compile:docs
    { --forVersion?=@value : The version to compile }
    { --watch: Watch docs for future changes }
    `
  }

  /**
   * The command description
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Compile docs and generate a menu file'
  }

  /**
   * Enables the watcher to start watching for file changes.
   *
   * @method enableWatcher
   *
   * @param  {Object}      docs
   *
   * @return {void}
   */
  enableWatcher (docs) {
    watcher.watchTree(docs.contentDir, {
      ignoreDotFiles: true,
      interval: 1,
      filter: (file, stats) => {
        return stats.isDirectory() || file.endsWith('.adoc')
      }
    }, async (file, curr, prev) => {
      if (typeof (file) === 'object' && prev === null && curr === null) {
        return
      }

      if (prev === null) {
        await docs.addDoc(file, 'single:doc')
        return
      }

      if (curr.nlink === 0) {
        await docs.removeDoc(file, 'single:doc')
      }

      await docs.updateDoc(file, 'single:doc')
    })
  }

  /**
   * The method executed when command is called
   *
   * @method handle
   *
   * @param  {Object} args
   * @param  {Boolean} options.watch
   *
   * @return {void}
   */
  async handle (args, { forVersion, watch }) {
    const docs = new Docs(forVersion || Docs.getLatestVersion())
    const bar = new progressBar.Bar({
      format: 'progress [{bar}] {percentage}% | {doc}'
    }, progressBar.Presets.shades_classic)
    let counter = 0

    docs.on('docs:list', (list) => {
      bar.start(list.length, 0)
    })

    docs.on('doc:saved', (meta)  => {
      counter++
      bar.update(counter, {
        doc: meta.path
      })
    })

    docs.on('saving:menu', (menuPath) => {
      bar.stop()
      this.completed('menu      ', menuPath)
    })

    docs.on('single:doc:saved', (meta) => {
      this.completed('compiled  ', meta.path)
    })

    await docs.compile()

    if (watch) {
      this.enableWatcher(docs)
    }
  }
}

module.exports = CompileDoc
