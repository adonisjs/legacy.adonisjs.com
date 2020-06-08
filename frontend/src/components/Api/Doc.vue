<template>
  <div class="doc wysiwyg">
    <ApiMarkdownStyling v-if="content">
      <dimer-tree :node="content" />
    </ApiMarkdownStyling>
  </div>
</template>

<script>
  import ApiMarkdownStyling from '~/components/ApiMarkdownStyling.vue'
  export default {
    props: ['doc'],
    data () {
      return {
        content: null,
      }
    },
    components: { ApiMarkdownStyling },
    mounted () {
      this.groupByH3()
    },
    methods: {
      getCardOutput () {
        return {
          type: 'element',
          tag: 'div',
          props: {
            className: ['api-card'],
          },
          children: [],
        }
      },
      groupByH3 () {
        let openedGroup = null

        this.doc.content.children = this.doc.content.children.reduce((result, child) => {
          if (child.tag === 'h3') {
            openedGroup = this.getCardOutput()
            openedGroup.children.push(child)
            result.push(openedGroup)
            return result
          }

          if (child.tag === 'h2') {
            openedGroup = null
            result.push(child)
            return result
          }

          if (openedGroup) {
            openedGroup.children.push(child)
            return result
          }

          result.push(child)
          return result
        }, [])

        this.content = this.doc.content
      }
    }
  }
</script>

<style scoped>
  .doc {
    max-width: 100%;
    padding: 60px 0;
    color: var(--grey-800);
    line-height: 1.4;
  }

  .doc .markdown-content:first-child {
    margin-top: 0;
  }

  @media (min-width: 1024px) {
    .doc {
      padding: 60px 0 60px 100px;
      max-width: 760px;
    }
  }
</style>
