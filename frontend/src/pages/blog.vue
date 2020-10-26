<template>
  <Layout>
    <Header />

    <Article>
      <template v-slot:hero>
        <h1>Blog</h1>
        <h3 class="lede">Sharing framework updates and our learnings as we build AdonisJS</h3>
      </template>

      <div class="post-card" v-for="post in posts" :key="post.path">
        <GLink :to="`/${post.permalink}`">
          <h2>{{ post.title }}</h2>
          <small class="publish_date">
            Published the
            <DateTime :time="post.publishedOn" format="do LLLL yyyy" />
          </small>
        </GLink>
      </div>
    </Article>

    <Footer />
  </Layout>
</template>

<script>
import Header from '~/components/Sections/Header.vue'
import Footer from '~/components/Sections/Footer.vue'
import Article from '~/components/Article.vue'
import DateTime from '~/components/Time/DateTime.vue'

export default {
  metaInfo() {
    return {
      title: 'Blog',
    }
  },

  data() {
    return {
      posts: [
        {
          title: 'October Release (2020)',
          permalink: 'blog/october-2020-release',
          publishedOn: '2020-10-25T00:00:00.000Z',
          order: 15,
        },
        {
          title: 'August Release (2020)',
          permalink: 'blog/august-2020-release',
          publishedOn: '2020-08-10T00:00:00.000Z',
          order: 14,
        },
        {
          title: 'Setting up tests runner for AdonisJS v5',
          permalink: 'blog/running-tests-in-adonisjs-v5',
          publishedOn: '2020-06-24T00:00:00.000Z',
          order: 13,
        },
        {
          title: 'Using Socket.io with AdonisJS v5',
          permalink: 'blog/socketio-with-adonisjs-v5',
          publishedOn: '2020-06-08T00:00:00.000Z',
          order: 12,
        },
        {
          title: 'Introducing AdonisJS V5 Preview',
          permalink: 'blog/introducing-adonisjs-v5',
          publishedOn: '2020-03-01T00:00:00.000Z',
          order: 11,
        },
        {
          title: 'Adonis + IntelliSense = 💜',
          permalink: 'blog/adonis-intellisence',
          publishedOn: '2018-09-15T00:00:00.000Z',
          order: 10,
        },
        {
          title: 'The Reddit Fire',
          permalink: 'blog/the-reddit-fire',
          publishedOn: '2018-02-15T00:00:00.000Z',
          order: 9,
        },
        {
          title: 'Changing Route.url behavior',
          permalink: 'blog/changing-route-url-behavior',
          publishedOn: '2018-01-12T00:00:00.000Z',
          order: 8,
        },
        {
          title: 'Depreciating self reference inside config files',
          permalink: 'blog/depreciating-self-reference-inside-config-files',
          publishedOn: '2018-01-12T00:00:00.000Z',
          order: 7,
        },
        {
          title: 'Here you go - Adonis 4.0 ?',
          permalink: 'blog/here-you-go-adonis-4-0',
          publishedOn: '2017-11-08T00:00:00.000Z',
          order: 6,
        },
        {
          title: 'Adonis 4.0 Dev Release',
          permalink: 'blog/adonis-4-0-dev-release',
          publishedOn: '2017-08-25T00:00:00.000Z',
          order: 5,
        },
        {
          title: 'Contributing to AdonisJs',
          permalink: 'blog/contributing-to-adonisjs',
          publishedOn: '2017-05-10T00:00:00.000Z',
          order: 4,
        },
        {
          title: 'Petit mais grand (AdonisJS 3.2.1)',
          permalink: 'blog/petit-mais-grand-adonisjs-3-2-1',
          publishedOn: '2017-01-27T00:00:00.000Z',
          order: 3,
        },
        {
          title: 'Using Socket.Io with Adonis 3.0',
          permalink: 'blog/using-socket-io-with-adonis3-0',
          publishedOn: '2016-06-26T00:00:00.000Z',
          order: 2,
        },
        {
          title: 'AdonisJs 3.0 Release',
          permalink: 'blog/adonisjs-3-0-release',
          publishedOn: '2016-06-21T00:00:00.000Z',
          order: 1,
        },
      ],
    }
  },

  components: { Header, Article, Footer, DateTime },
}
</script>

<style scoped>
.post-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
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
