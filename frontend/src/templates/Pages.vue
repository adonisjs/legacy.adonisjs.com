<template>
  <Layout>
    <a-header />

    <a-article>
      <template v-slot:hero>
        <h1> {{ $context.doc.title }} </h1>

        <h3 class="lede" v-if="$context.doc.meta.excerpt" v-html="$context.doc.meta.excerpt">
        </h3>

        <div class="meta">
          <p v-if="$context.doc.meta.author">
            Written by <strong>{{ $context.doc.meta.author }}</strong>
          </p>
          <p v-if="$context.doc.meta.published_on">
            Published on <strong><DateTime :time="$context.doc.meta.published_on" format="do LLLL yyyy" /></strong>
          </p>
        </div>
      </template>

      <MarkdownStyling>
        <dimer-tree :node="$context.doc.content" :custom-renderers="customRenderers" />
      </MarkdownStyling>
    </a-article>

    <a-footer />
  </Layout>
</template>

<script>
  import AHeader from '~/components/Sections/Header.vue'
  import AFooter from '~/components/Sections/Footer.vue'
  import AArticle from '~/components/Article.vue'
  import DateTime from '~/components/Time/DateTime.vue'
  import MarkdownStyling from '~/components/MarkdownStyling.vue'

  export default {
    metaInfo () {
      return {
        title: this.$context.doc.title,
      }
    },

    components: { AHeader, AArticle, AFooter, DateTime, MarkdownStyling, },

    methods: {
      /**
       * Defines a custom renderer for DimerTree that removes the title
       * from the renderer since we want to display it
       * inside the hero of the page.
       */
      customRenderers (globalRenderers) {
        return globalRenderers.concat((node, rerender, createElement) => {
          if (node.tag === 'h1') {
            return false
          }
        })
      }
    }
  }
</script>
