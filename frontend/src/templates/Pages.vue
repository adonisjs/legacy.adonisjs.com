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
          <DimerTree :node="$context.doc.content" />
        </MarkdownStyling>
      </div>
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
  }
</script>
