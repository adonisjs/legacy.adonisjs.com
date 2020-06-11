<template>
  <div class="search" :class="{ active: model.query.length }">
    <div class="search-overlay" @click="hideResults()"></div>
    <DimerSearch :model="model" baseUrl="http://localhost:5000/">
      <template slot-scope="searchScope">
        <div class="search-input">
          <Icon class="stroke-0" name="search" height="20" width="20" :fill="true" />
          <input
            ref="algolia"
            id="algolia-search-input"
            type="search"
            placeholder="Search Documentation"
            @click="boot"
          />
        </div>

        <div class="search-results">
          <div class="search-result-tabs">
            <span class="highlighter" ref="tabsHighlighter"></span>
            <a
              href="#"
              v-for="(row, tabIndex) in model.data"
              :key="tabIndex"
              ref="tabs"
              :class="{ active: tabIndex === activeIndex }"
            >
              {{ row.title }}
            </a>
          </div>

          <div class="search-result-items">
            <div
              :key="rowIndex"
              v-for="(row, rowIndex) in model.data[activeIndex].results"
            >
              <GLink
                v-if="row.body.length"
                class="search-result-item"
                :to="row.url"
              >
                <h2 class="title"><component :is="searchScope.renderMark(row.title.marks)" /></h2>
                <div v-for="(sec, index) in row.body" :key="index">
                  <component :is="searchScope.renderMark(sec.marks)" />
                </div>
              </GLink>
            </div>
          </div>
        </div>
      </template>
    </DimerSearch>
  </div>
</template>

<script>
export default {
    data () {
      return {
        booted: false,
        activeIndex: 0,
        model: {
          query: '',
          data: [
            {
              zone: 'guides',
              version: 'master',
              title: 'Guides',
              results: [],
            },
          ]
        }
      }
    },
    watch: {
      '$route.fullPath' () {
        this.hideResults()
      },
    },
    mounted () {
      // this.updateHighlighterPosition()
    },
    methods: {
      boot () {
        if (!this.booted) {
          this.booted = true

          Promise.all([
            import(/* webpackChunkName: "docsearch" */ 'docsearch.js/dist/cdn/docsearch.min.js'),
            import(/* webpackChunkName: "docsearch" */ 'docsearch.js/dist/cdn/docsearch.min.css')
          ]).then(([docsearch]) => {
            docsearch = docsearch.default
            docsearch({
              apiKey: 'a161da32d12c414b40fd88002ec685b2',
              indexName: 'adonisjs_next',
              inputSelector: '#algolia-search-input',
              debug: false,
              handleSelected: (input, event, suggestion) => {
                const { pathname, hash } = new URL(suggestion.url)
                const routepath = pathname.replace(window.location.host, '/')
                this.$router.push(`${routepath}${hash}`)
              }
            })
            this.$refs.algolia.focus()
          }).catch((e) => this.booted = false)
        }
      },

      updateHighlighterPosition () {
        const activeTab = this.$refs.tabs[this.activeIndex]
        if (!activeTab) {
          return
        }

        const highlighter = this.$refs.tabsHighlighter
        highlighter.style.left = `${activeTab.offsetLeft}px`
        highlighter.style.width = `${activeTab.clientWidth}px`
      },

      hideResults () {
        this.model.query = ''
      }
    }
  }
</script>

<style scoped>
  .search-overlay {
    position: fixed;
    z-index: 3;
    left: 0;
    right: 0;
    top: calc(var(--header-height) + 6px);
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    pointer-events: none;
  }
  .search.active .search-overlay {
    opacity: 1;
    pointer-events: inherit;
  }

  .search-input {
    position: relative;
    display: flex;
    align-items: center;
    color: var(--grey-200);
    width: 200px;
    padding: 0 20px;
    height: var(--header-height);
  }

  .search-input svg {
    width: 20px;
    height: 20px;
    left: 0;
    top: 1px;
  }

  .search-input input {
    color: var(--grey-900);
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    margin-left: 8px;
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
  }
  ::-webkit-input-placeholder {
    color: var(--grey-200);
  }

  :-ms-input-placeholder {
    color: var(--grey-200);
  }

  ::placeholder {
    color: var(--grey-200);
  }

  .search-input:focus-within {
    background: var(--grey-300);
    color: var(--grey-900);
  }

  .search-results {
    position: fixed;
    background: #FFFFFF;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.03),
      0px 20px 40px rgba(0, 0, 0, 0.02),
      0px -1px 0px #F5F5F5;
    right: 0;
    width: 450px;
    z-index: 4;
    bottom: 0;
    top: calc(var(--header-height) + 7px);
    opacity: 0;
    overflow: scroll;
    transform: translateX(200px);
    transition: 140ms transform ease, opacity 160ms ease;
    pointer-events: none;
  }
  .search.active .search-results {
    opacity: 1;
    transform: none;
    transition: 100ms transform ease;
    pointer-events: inherit;
  }

  .search-result-tabs {
    display: flex;
    background: var(--grey-300);
    justify-content: space-between;
    position: relative;
  }

  .search-result-tabs a {
    padding: 16px 14px;
    font-weight: 500;
    flex: 1;
    text-align: center;
    color: var(--grey-700);
  }

  .search-result-tabs a.active {
    color: var(--grey-900);
  }

  .search-result-item {
    color: var(--grey-700);
    padding: 20px 30px;
    display: block;
    font-size: 1.8rem;
  }
  .search-result-item:hover {
    background: var(--grey-300);
  }

  .search-result-tabs .highlighter {
    position: absolute;
    bottom: -2px;
    height: 2px;
    background: var(--brand);
    transition: left 200ms ease;
  }

  .search-result-item .title {
    color: var(--grey-900);
    font-size: 2rem;
    margin-bottom: 8px;
  }

  .search-result-item p {
    margin-bottom: 10px;
  }

  .search-result-item p strong {
    font-weight: 400;
    color: var(--brand);
  }

  @media (min-width: 1260px) {
    .search-input {
      width: 280px;
    }
  }
</style>
