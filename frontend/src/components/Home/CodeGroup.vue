<template>
  <div class="hero-codegroup">
    <div class="hero-codegroup-tabs">
      <div class="hero-codegroup-tab-container">
        <span class="highlighter" ref="tabsHighlighter"></span>
        <a
          class="hero-codegroup-tab"
          href="#"
          v-for="(section, index) in sections"
          :key="index"
          ref="tabs"
          @click.prevent="updateActiveTab(index)"
        >
          {{ section.title }}
        </a>
      </div>
    </div>
    <div class="hero-codegroup-contents">
      <div
        class="hero-codegroup-content-container"
        v-for="(section, index) in sections" :key="index"
        v-show="index === activeIndex"
      >
        <code-block><div v-html="section.code"></div></code-block>
      </div>
    </div>
  </div>
</template>

<script>
  import CodeBlock from '~/components/CodeBlock.vue'

  export default {
    components: { CodeBlock },
    props: ['sections'],

    data () {
      return {
        activeIndex: 0,
      }
    },

    mounted () {
      this.updateHighlighterPosition()
    },

    methods: {
      updateHighlighterPosition () {
        const activeTab = this.$refs.tabs[this.activeIndex]
        if (!activeTab) {
          return
        }

        const highlighter = this.$refs.tabsHighlighter
        highlighter.style.left = `${activeTab.offsetLeft}px`
        highlighter.style.width = `${activeTab.clientWidth}px`
      },

      updateActiveTab (index) {
        this.activeIndex = index
        this.updateHighlighterPosition()
      }
    },
  }
</script>

<style scoped>
  .hero-codegroup-tabs {
    overflow: auto;
    position: relative;
  }

  .hero-codegroup-tab-container {
    padding: 0 20px;
    display: flex;
    position: relative;
    border-bottom: 2px solid rgba(102, 105, 118, 0.34);
  }

  .hero-codegroup .highlighter {
    position: absolute;
    bottom: -2px;
    height: 2px;
    background: var(--brand);
    transition: left 200ms ease;
  }

  .hero-codegroup-tab {
    padding: 13px 15px;
    margin-right: 20px;
    font-family: var(--font-secondary);
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 1.3rem;
    color: var(--grey-200);
    font-weight: 500;
  }
</style>
