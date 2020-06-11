// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import '~/assets/fonts/calibre.css'
import '~/assets/fonts/jetbrains.css'
import '~/components/Icons';
import SvgIcon from 'vue-svgicon';
import DefaultLayout from '~/layouts/Default.vue'
import { Dimer, DimerTree, DimerSearch, DimerTabs, utils } from 'dimer-vue'
import CodeBlock from '~/components/CodeBlock.vue'
import Tabs from '~/components/Tabs'

console.log(`
 ______     _____     ______     __   __     __     ______       __     ______
/\\  __ \\   /\\  __-.  /\\  __ \\   /\\ "-.\\ \\   /\\ \\   /\\  ___\\     /\\ \\   /\\  ___\\
\\ \\  __ \\  \\ \\ \\/\\ \\ \\ \\ \\/\\ \\  \\ \\ \\-.  \\  \\ \\ \\  \\ \\___  \\   _\\_\\ \\  \\ \\___  \\
 \\ \\_\\ \\_\\  \\ \\____-  \\ \\_____\\  \\ \\_ \\"\\_\\  \\ \\_\\  \\/\\_____\\ /\\_____\\  \\/\\_____\\
  \\/_/\\/_/   \\/____/   \\/_____/   \\/_/ \\/_/   \\/_/   \\/_____/ \\/_____/   \\/_____/

Hey there!

You are interested in the source code of this project, or you find something that should be fixed?

Lucky you... the website is open source!
Feel free to make any suggestion in an issue or PR directly your change(s). 🤗

🔗 https://github.com/adonisjs/adonisjs.com

`)

export default function (Vue, { router, head, isClient }) {
  Vue.use(SvgIcon, {
		defaultWidth: '30px',
		tagName: 'Icon',
		isOriginalDefault: true,
		isStroke: true,
  });

  Dimer.addRenderer(function (node, rerender, createElement) {
    /**
     * Wrapping tabs inside a custom component
     */
    if (node.props.className && node.props.className.indexOf('tabs') > -1) {
      return createElement(Tabs, { props: { node } })
    }

    // Handles correctly any external link
    if (node.tag === 'a' && /^http(s)?/.test(node.props.href)) {
      node.props.target = '_blank'
      node.props.rel = 'noreferrer'

      const attrs = utils.propsToAttrs(node.props)
      const children = node.children.map(rerender)

      return createElement('a', { attrs }, children)
    }

    if (['h2', 'h3', 'h4'].includes(node.tag)) {
      const children = node.children.concat([{
        type: 'element',
        tag: 'span',
        props: {
          className: ['bookmark'],
          id: node.props.id,
        },
        children: [],
      }])
      return createElement(node.tag, {}, children.map(rerender))
    }

    if (node.tag === 'div' && node.props.className && node.props.className.includes('dimer-highlight')) {
      if (node.children.length === 2) {
        return createElement(CodeBlock, {
          props: {
            title: node.children[0].children[0].value,
          },
          scopedSlots: {
            default: () => {
              return createElement('pre', {
                domProps: {
                  innerHTML: `<code>${node.children[1].children[0].children[0].value}</code>`
                }
              })
            }
          },
        })
      }

      return createElement(CodeBlock, {
        scopedSlots: {
          default: () => {
            return createElement('pre', {
              domProps: {
                innerHTML: `<code>${node.children[0].children[0].children[0].value}</code>`
              }
            })
          }
        },
      })
    }
  })

  Dimer.use(DimerTree)
  Dimer.use(DimerSearch)
  Dimer.use(DimerTabs)
  Vue.use(Dimer)

  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)
  head.meta.push({
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
  })
}
