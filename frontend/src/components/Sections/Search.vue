<template>
  <div class="search" :class="{ active: model.query.length }">
    <div class="search-overlay" @click="hideResults()"></div>
    <dimer-search :model="model" baseUrl="http://localhost:5000/">
      <template slot-scope="searchScope">
        <div class="search-input">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.32 12.17l.012.167 4.168 4.168-.995.995-4.168-4.168-.168-.01a6.024 6.024 0 111.152-1.152zM3.909 8.524a4.617 4.617 0 109.233 0 4.617 4.617 0 00-9.233 0z" fill="currentColor"/><path d="M13.332 12.337l-.15.01a.15.15 0 00.044.096l.106-.106zm-.011-.167l-.12-.09a.15.15 0 00-.03.1l.15-.01zm4.179 4.335l.106.106a.15.15 0 000-.212l-.106.106zm-.995.995l-.106.106a.15.15 0 00.212 0l-.106-.106zm-4.168-4.168l.106-.106a.15.15 0 00-.097-.044l-.01.15zm-.168-.01l.01-.15a.15.15 0 00-.1.03l.09.12zM4.265 4.265l-.106-.106.106.106zm9.216 8.062l-.01-.167-.3.02.011.166.3-.02zm4.125 4.072l-4.168-4.168-.212.212 4.168 4.168.212-.212zm-.995 1.207l.995-.995-.212-.212-.995.995.212.212zm-4.38-4.168l4.168 4.168.212-.212-4.168-4.168-.212.212zm-.07.033l.167.01.018-.3-.168-.01-.018.3zm-8.288-.886a6.174 6.174 0 008.387.856l-.182-.239a5.874 5.874 0 01-7.98-.814l-.225.197zm.286-8.426a6.174 6.174 0 00-.286 8.426l.226-.197a5.874 5.874 0 01.272-8.016l-.212-.213zm8.425-.285a6.174 6.174 0 00-8.425.285l.212.213a5.874 5.874 0 018.016-.272l.197-.226zm.856 8.387a6.174 6.174 0 00-.856-8.387l-.197.226a5.874 5.874 0 01.814 7.98l.24.18zm-4.916.73c-2.467 0-4.466-2-4.466-4.467h-.3a4.767 4.767 0 004.766 4.767v-.3zm4.467-4.467c0 2.467-2 4.467-4.467 4.467v.3a4.767 4.767 0 004.767-4.767h-.3zM8.524 4.057c2.467 0 4.467 2 4.467 4.467h.3a4.767 4.767 0 00-4.767-4.767v.3zM4.058 8.524c0-2.467 2-4.467 4.466-4.467v-.3a4.767 4.767 0 00-4.766 4.767h.3z" fill="currentColor"/></svg>
          <input
            type="search"
            v-model="model.query"
            placeholder="Search Documentation"
            @keyup="searchScope.triggerSearch"
          />
        </div>
        <div class="search-results">
          <div class="search-result-tabs">
            <span class="highlighter"></span>
            <a href="" v-for="row in model.data" :key="row.zone"> {{ row.title }} </a>
          </div>

          <div class="search-result-items">
            <div
              :key="rowIndex"
              v-for="(row, rowIndex) in model.data[activeIndex].results"
            >
              <g-link
                v-if="row.body.length"
                class="search-result-item"
                :to="row.url"
              >
                <h2 class="title"><component :is="searchScope.renderMark(row.title.marks)" /></h2>
                <p v-for="(sec, index) in row.body" :key="index">
                  <component :is="searchScope.renderMark(sec.marks)" />
                </p>
              </g-link>
            </div>
          </div>
        </div>
      </template>
    </dimer-search>
  </div>
</template>

<script>
export default {
    data () {
      return {
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
    methods: {
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
    top: calc(var(--header-height) + 7px);
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
    color: var(--inactive);
    width: 200px;
    padding-left: 20px;
  }

  .search-input svg {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 0;
  }

  .search-input input {
    color: var(--black);
    font-family: inherit;
    font-size: 1.6rem;
    margin-left: 8px;
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
  }

  .search-input:focus-within {
    color: var(--black);
  }

  .search-results {
    position: fixed;
    background: #FFFFFF;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.03),
      0px 20px 40px rgba(0, 0, 0, 0.02),
      0px -1px 0px #F5F5F5;
    right: 0;
    width: 400px;
    z-index: 4;
    bottom: 0;
    top: calc(var(--header-height) + 7px);
    opacity: 0;
    overflow: scroll;
    transform: translateX(200px);
    transition: 140ms transform ease, opacity 160ms ease;
    pointer-events: none;
    font-family: var(--font-base);
  }
  .search.active .search-results {
    opacity: 1;
    transform: none;
    transition: 100ms transform ease;
    pointer-events: inherit;
  }

  .search-result-items {
    padding: 30px 24px;
  }

  .search-result-item {
    padding: 20px 16px;
    color: inherit;
    display: block;
    font-size: 1.7rem;
    border-radius: 3px;
  }

  .search-result-item p strong {
    font-weight: 400;
    background: var(--selection);
  }

  .search-result-item:hover {
    background: var(--grey-lighter);
  }

  .search-result-item .title {
    color: var(--black);
    font-size: 1.9rem;
    margin-bottom: 8px;
  }

  .search-result-tabs {
    display: flex;
    border-bottom: 1px solid var(--outlines);
    position: relative;
  }

  .search-result-tabs .highlighter {
    position: absolute;
    height: 3px;
    background: var(--brand);
    bottom: 0;
  }

  .search-result-tabs a {
    padding: 14px 14px 14px 14px;
    color: inherit;
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 1.2rem;
    text-transform: uppercase;
    flex: 1;
    letter-spacing: 0.4px;
    text-align: center;
  }

  ::-webkit-input-placeholder {
    color: var(--inactive);
  }

  :-ms-input-placeholder {
    color: var(--inactive);
  }

  ::placeholder {
    color: var(--inactive);
  }

  @media (min-width: 1260px) {
    .search-input {
      width: 280px;
    }
  }
</style>
