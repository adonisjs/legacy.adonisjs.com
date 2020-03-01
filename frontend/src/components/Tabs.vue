<template>
  <div class="codegroup">
    <dimer-tabs :node="node">
      <template slot-scope="tabs">
        <div class="codegroup_tabs_head">
          <span class="highlighter" ref="tabsHighlighter"></span>
          <a
            class="codegroup_tab"
            v-for="(link, index) in tabs.links" @click.prevent="updateActiveTab(index)"
            :key="index"
            ref="tabs"
          >
            {{ link }}
          </a>
        </div>

        <div class="codegroup_tabs_body">
          <div
            v-for="(pane, index) in tabs.panes"
            v-show="index === activeIndex"
            :key="index"
          >
            <dimer-tree :node="pane" />
          </div>
        </div>
      </template>
    </dimer-tabs>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeIndex: 0
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

    props: ['node']
  }
</script>

<style scoped>
  .codegroup {
    margin-bottom: 3.2rem;
    background: var(--pre-bg);
    border-radius: 4px;
  }

  .codegroup_tabs_head {
    padding: 0 20px;
    display: flex;
    position: relative;
    border-bottom: 2px solid rgba(102, 105, 118, 0.34);
  }

  .codegroup_tabs_head .highlighter {
    position: absolute;
    bottom: -2px;
    height: 2px;
    background: var(--brand);
    transition: left 200ms ease;
  }

  .codegroup_tabs_head .codegroup_tab {
    cursor: pointer;
    padding: 14px 15px 12px 15px;
    margin-right: 20px;
    font-family: var(--font-secondary);
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 1.2rem;
    color: var(--grey-200);
    font-weight: 600;
  }
</style>
