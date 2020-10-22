<template>
  <div class="doc wysiwyg">
    <MarkdownStyling>
      <DimerTree :node="docTitle" />

      <div class="toc-wrapper">
        <DimerTree :node="toc" />
      </div>

      <DimerTree :node="docContent" />
    </MarkdownStyling>
  </div>
</template>

<script>
  import MarkdownStyling from '~/components/MarkdownStyling.vue'

  export default {
    props: ['doc', 'toc'],

    components: { MarkdownStyling },

    computed: {
      docContent () {
        const children = this.doc.content.children.slice()
        children.splice(0, 2)

        return { 
          type: 'root',
          children
        }
      },

      docTitle () {
        return {
          type: 'root',
          children: [this.doc.content.children[1]]
        }
      }
    }
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
