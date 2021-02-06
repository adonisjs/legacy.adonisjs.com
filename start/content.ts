/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { Renderer } from '@dimerapp/edge'
import Application from '@ioc:Adonis/Core/Application'
import Content from 'App/Services/Content'

import Guides from '../content/guides/menu.json'

Content.cache(Application.inProduction ? 'full' : 'markup')
  .zone('guides')
  .baseUrl('guides')
  .baseContentPath('./content/guides')
  .template('guides')
  .loadLanguage({
    path: './edge.tmLanguage.json',
    scopeName: 'text.html.edge',
    id: 'edge',
  })
  .useTheme('material-theme-palenight')
  .renderer('tocRenderer', new Renderer())
  .renderer(
    'dimerRenderer',
    new Renderer().use((node) => {
      if (node.tagName === 'img') {
        return ['elements/img', { node }]
      }

      if (node.tagName === 'pre') {
        return ['components/code', { node }]
      }

      if (node.type !== 'element') {
        return
      }

      if (!Array.isArray(node.properties!.className)) {
        return
      }

      if (node.properties!.className.includes('error-block')) {
        return ['components/errorBlock', { node }]
      }

      if (node.properties!.className.includes('success-block')) {
        return ['components/successBlock', { node }]
      }

      if (node.properties!.className.includes('hint')) {
        return ['elements/hint', { node }]
      }

      if (node.properties!.className.includes('alert')) {
        return ['components/alert', { node }]
      }

      if (node.properties!.className.includes('codegroup')) {
        return ['components/codegroup', { node }]
      }
    })
  )
  .before('compile', (file) => {
    file.macro('error', (node) => {
      node.data = node.data || {}
      node.data.hName = 'div'
      node.data.hProperties = {
        className: ['error-block'],
        dataTitle: node.attributes.title,
      }
    })

    file.macro('success', (node) => {
      node.data = node.data || {}
      node.data.hName = 'div'
      node.data.hProperties = {
        className: ['success-block'],
        dataTitle: node.attributes.title,
      }
    })
  })
  .docs(Guides)
  .register()
