<template>
  <Layout>
    <Header />

    <Article>
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

      <div class="page-content">
        <MarkdownStyling>
          <DimerTree :node="$context.doc.content" :custom-renderers="customRenderers" />
        </MarkdownStyling>
      </div>

      <section class="comments">
        <div class="comments-container">
          <div class="comments-content">
            <h2> Comments </h2>
            <div class="comments-list" ref="postComments"></div>
          </div>
        </div>
      </section>
    </Article>

    <Footer />
  </Layout>
</template>

<style scoped>
  .page-content .markdown-content {
    margin-top: 10rem;
  }

  .page-content .markdown-content h2:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  .comments-content {
    border-top: 1px solid var(--grey-100);
    padding-top: 40px;
    margin-top: 40px;
  }

  .comments-content h2 {
    font-weight: 600;
    font-size: 3rem;
    margin-bottom: 30px;
    color: var(--grey-900);
  }
</style>

<script>
  import Header from '~/components/Sections/Header.vue'
  import Footer from '~/components/Sections/Footer.vue'
  import Article from '~/components/Article.vue'
  import DateTime from '~/components/Time/DateTime.vue'
  import MarkdownStyling from '~/components/MarkdownStyling.vue'

  export default {
    metaInfo () {
      return {
        title: this.$context.doc.title,
      }
    },

    components: { Header, Article, Footer, DateTime, MarkdownStyling, },

    mounted () {
      const utterancesScript = document.createElement('script')
      utterancesScript.src = 'https://utteranc.es/client.js'
      utterancesScript.async = true
      utterancesScript.setAttribute('repo', 'AdonisCommunity/adonisjs.com-blog-comments')
      utterancesScript.setAttribute('issue-term', 'pathname')
      utterancesScript.setAttribute('theme', 'github-light')
      utterancesScript.setAttribute('crossorigin', 'anonymous')
      this.$refs.postComments.appendChild(utterancesScript)
    },

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
