'use strict'

const { Command } = use('@adonisjs/ace')
const Docs = use('App/Services/Docs')
const chalk = use('chalk')
const DraftLog = use('draftlog')
DraftLog(console)

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
    { --forVersion?=@value : The version to compile }`
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
   * The method executed when command is called
   *
   * @method handle
   *
   * @param  {Object} args
   * @param  {Boolean} options.watch
   *
   * @return {void}
   */
  async handle (args, { forVersion }) {
    const docs = new Docs(forVersion || Docs.getLatestVersion())
    const stateJar = []

    docs.on('doc:reading', function (meta) {
      const update = console.draft()
      const state = { id: meta.id, update }
      stateJar.push(state)
      update(chalk `Reading {dim ${meta.path}}`)
    })

    docs.on('doc:saving', function (meta) {
      const state = stateJar.find((doc) => doc.id === meta.id)
      state.update(chalk `Converted {yellow ${meta.path}}`)
    })

    docs.on('doc:saved', function (meta) {
      const state = stateJar.find((doc) => doc.id === meta.id)
      state.update(chalk `Saved {green ${meta.savePath}}`)
    })

    docs.on('saving:menu', (menuPath) => {
      console.log()
      this.completed('menu', menuPath)
    })

    await docs.compile()
  }
}

module.exports = CompileDoc
