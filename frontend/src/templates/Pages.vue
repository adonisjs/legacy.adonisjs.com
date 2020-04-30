<template>
  <Layout>
    <a-header />

    <a-article>
      <template v-slot:hero>
        <h1> {{ $context.doc.title }} </h1>

        <div class="meta">
          <p v-if="$context.doc.meta.author">
            Written by <strong>{{ $context.doc.meta.author }}</strong>
          </p>
          <p v-if="$context.doc.meta.published_on">
            Published on <strong><DateTime :time="$context.doc.meta.published_on" format="do LLLL yyyy" /></strong>
          </p>
        </div>
      </template>

      <div>
        <dimer-tree :node="$context.doc.content" :custom-renderers="customRenderers" />
      </div>
    </a-article>

    <a-footer />
  </Layout>
</template>

<script>
  import AHeader from '~/components/Sections/Header.vue'
  import AFooter from '~/components/Sections/Footer.vue'
  import AArticle from '~/components/Article.vue'
  import DateTime from '~/components/Time/DateTime.vue'

  export default {
    metaInfo () {
      return {
        title: this.$context.doc.title,
      }
    },

    components: { AHeader, AArticle, AFooter, DateTime, },

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
