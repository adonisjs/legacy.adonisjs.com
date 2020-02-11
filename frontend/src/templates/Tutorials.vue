<template>
  <Layout>
    <a-header />
    <section class="main">
      <div class="container">
        <a-sidebar :category="this.$context.tree" />
        <div class="docs-wrapper" :key="$route.fullPath">
          <a-doc :doc="$context.doc" />
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
  import AHeader from '~/components/Sections/Header.vue'
  import ASidebar from '~/components/Guides/Sidebar.vue'
  import ADoc from '~/components/Guides/Doc'

  export default {
    components: { AHeader, ASidebar, ADoc },
  }
</script>

<style scoped>
  @media (min-width: 1024px) {
    .docs-wrapper {
       margin-left: 250px;
    }
  }
</style>
