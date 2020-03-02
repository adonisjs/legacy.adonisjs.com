<template>
  <Layout>
    <a-header />

    <section class="main">
      <div class="container">
        <a-sidebar
         :groups="this.$context.groups"
         :group="this.$context.doc.group"
         :categories="this.$context.categories"
         />

        <div :key="$route.path">
          <div class="docs-wrapper">
            <div class="in-progress-notification" v-if="$context.under_progress">
              <p>
                The guides for <strong>{{ $context.doc.group }}</strong> are in progress and will be updated regularly.
              </p>
              <p class="notification-timestamp">
                <span> Last updated: </span> {{ $context.last_updated_on }}
              </p>
            </div>
            <a-doc :doc="$context.doc" />
          </div>

          <div class="toc-wrapper" v-if="$context.toc">
            <a-toc :node="$context.toc" />
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
  import AHeader from '~/components/Sections/Header.vue'
  import ASidebar from '~/components/Guides/Sidebar.vue'
  import ADoc from '~/components/Guides/Doc.vue'
  import AToc from '~/components/Guides/Toc.vue'
  import { utils } from 'dimer-vue'

  export default {
    components: { AHeader, ASidebar, ADoc, AToc },

    metaInfo () {
      return {
        title: this.$context.doc.title,
        meta: [
          { name: 'description', content: 'AdonisJS is a fully-featured MVC framework for Node.js. It takes care of most of your web development hassles, offering you a clean and stable API to build web apps or microservices.' },
          { name: 'keywords', content: 'adonis, framework, node.js, mvc, javascript' },
          { property: 'og:title', content: `${this.$context.doc.title} - AdonisJS Framework` },
          { property: 'og:description', content: 'AdonisJS is a fully-featured MVC framework for Node.js. It takes care of most of your web development hassles, offering you a clean and stable API to build web apps or microservices.' },
          { property: 'og:image', content: 'https://preview.adonisjs.com/adonis-readme.jpg' },
        ]
      }
    },
  }
</script>

<style scoped>
  .toc-wrapper {
    display: none;
  }

  @media (min-width: 1024px) {
    .docs-wrapper {
       margin-left: 250px;
    }
  }

  .in-progress-notification {
    position: relative;
    border-radius: 6px;
    background: var(--grey-300);
    padding: 12px 10px 12px 45px;
    max-width: 640px;
    margin-left: 100px;
    border-bottom: 4px solid var(--red);
    margin-top: 40px;
  }

  .in-progress-notification .notification-timestamp {
    font-weight: 500;
    color: var(--grey-600);
    margin-top: 10px;
    font-size: 1.6rem;
  }

  .in-progress-notification:before {
    border-radius: 6px 0 0 6px;
    content: "";
    background: url("data:image/svg+xml, %3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath clip-rule='evenodd' d='M9 17A8 8 0 109 1a8 8 0 000 16z' stroke='%23DF4A4A' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M9 12.5a.8.8 0 100-1.6.8.8 0 000 1.6z' fill='%23DF4A4A'/%3E%3Cpath d='M9 5.8V9' stroke='%23DF4A4A' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat 15px 20px transparent;
    width: 40px;
    left: 0;
    position: absolute;
    top: -4px;
    bottom: 0;
  }

  @media (min-width: 1260px) {
    .toc-wrapper {
       display: block;
    }
  }
</style>
