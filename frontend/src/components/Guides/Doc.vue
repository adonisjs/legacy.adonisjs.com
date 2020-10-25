<template>
  <div class="doc wysiwyg">
    <MarkdownStyling>
      <h1> {{ doc.title }} </h1>
      <div class="toc-wrapper" v-if="toc">
        <DimerTree :node="toc" />
      </div>
      <DimerTree :node="doc.content" />
    </MarkdownStyling>
  </div>
</template>

<script>
  import MarkdownStyling from '~/components/MarkdownStyling.vue'

  export default {
    props: ['doc', 'toc'],
    components: { MarkdownStyling },
  }
</script>

<style scoped>
  .toc-wrapper a {
    font-size: inherit;
    background-image: none;
    transition: color 300ms ease-in-out;
  }

  .toc-wrapper a:hover {
    color: var(--brand);
  }

  @media (min-width: 1350px) {
    .toc-wrapper {
      display: none;
    }
  }

  .doc {
    max-width: 100%;
    padding: 60px 0;
    color: var(--grey-800);
    line-height: 1.4;
  }

  .doc .markdown-content:first-child {
    margin-top: 0;
  }

  @media (min-width: 1024px) {
    .doc {
      padding: 60px 0 60px 100px;
      max-width: 760px;
    }
  }
</style>
