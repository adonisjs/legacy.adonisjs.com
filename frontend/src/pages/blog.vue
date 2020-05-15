<template>
  <Layout>
    <a-header />

    <a-article>
      <template v-slot:hero>
        <h1>Blog</h1>
        <h3 class="lede">
          Hello world
        </h3>
      </template>

      <div class="post-card" v-for="post in posts" :key="post.path">
        <a :href="post.path">
          <h2>{{ post.context.doc.title }}</h2>
          <small class="publish_date">
            Published the <DateTime :time="post.context.doc.meta.published_on" format="do LLLL yyyy" />
          </small>
        </a>
      </div>
    </a-article>

    <a-footer />
  </Layout>
</template>

<page-query>
query {
  posts: allPage(filter: { path: { regex: "^\/blog\/.{1,}" }}) {
    path
    context
  }
}
</page-query>

<script>
  import AHeader from '~/components/Sections/Header.vue'
  import AFooter from '~/components/Sections/Footer.vue'
  import AArticle from '~/components/Article.vue'
  import DateTime from '~/components/Time/DateTime.vue'

  export default {
    metaInfo () {
      return {
        title: 'Blog',
      }
    },

    components: { AHeader, AArticle, AFooter, DateTime },

    computed: {
      posts () {
        return this.$page.posts.sort((a, b) => {
          return b.context.doc.meta.number - a.context.doc.meta.number
        })
      }
    }
  }
</script>

<style scoped>
  .post-card {
    background: white;
    border-radius: .5rem;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06);
    margin-bottom: 2rem;
  }

  .post-card:first-of-type {
    margin-top: 6rem;
  }

  .post-card a {
    color: var(--grey-900);
    display: block;
    padding: 2rem;
  }

  .publish_date {
    color: var(--grey-700);
    font-size: 1.5rem;
  }
</style>
