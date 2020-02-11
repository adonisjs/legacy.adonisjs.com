// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'
import { Dimer, DimerTree, DimerSearch } from 'dimer-vue'
import CodeBlock from '~/components/CodeBlock.vue'
import '~/assets/stylesheet.css'

export default function (Vue, { router, head, isClient }) {
  Dimer.addRenderer(function (node, rerender, createElement) {
    /**
     * Do not display toc-container
     */
    if (node.tag === 'div' && node.props.className && node.props.className.includes('toc-container')) {
      return false
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
  Vue.use(Dimer)

  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)
  head.meta.push({
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
  })
}
