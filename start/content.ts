/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Content from 'App/Services/Content'
import Guides from '../content/guides/menu.json'

Content.cache('markup')
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
  .before('compile', (file, zone) => {
    file.macro('relaxed', (node) => {
      node.data = node.data || {}
      node.data.hName = 'div'
      node.data.hProperties = {
        className: ['relaxed'],
      }
    })

    zone['edgeRenderer'].use((node) => {
      if (node.type !== 'element' || !node.properties.className) {
        return
      }

      if (node.properties.className.includes('alert')) {
        return ['components/alert', { node }]
      }

      if (node.properties.className.includes('codegroup')) {
        return ['components/codegroup', { node }]
      }
    })
  })
  .docs(Guides)
  .register()
