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

  @media (min-width: 1024px) {
    .toc-wrapper {
       display: block;
    }
  }
</style>
