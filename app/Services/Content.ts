import View from '@ioc:Adonis/Core/View'
import { ContentManager } from '@dimerapp/content'
import Application from '@ioc:Adonis/Core/Application'

export default new ContentManager(Application.appRoot, View)
