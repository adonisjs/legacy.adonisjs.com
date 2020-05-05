<template>
  <div class="doc wysiwyg">
    <div v-if="doc.meta">
      <p>{{ doc.meta.class }}</p>
      <p>{{ doc.meta.source }}</p>
    </div>

    <MarkdownStyling>
      <dimer-tree :node="doc.content" />
    </MarkdownStyling>
  </div>
</template>

<script>
  import MarkdownStyling from '~/components/MarkdownStyling.vue'

  export default {
    props: ['doc'],

    components: { MarkdownStyling }
  }
</script>

<style scoped>
  .doc {
    max-width: 100%;
    padding: 60px 0;
    color: var(--grey-800);
    line-height: 1.4;
  }

  @media (min-width: 1024px) {
    .doc {
      padding: 60px 0 60px 100px;
      max-width: 760px;
    }
  }
</style>
