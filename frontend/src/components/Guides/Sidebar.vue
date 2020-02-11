<template>
  <div class="sidebar-wrapper">
    <aside class="sidebar" :class="{ visible: isVisible }">
      <div class="sidebar-container">
        <div class="sidebar-menu">
          <div class="sidebar-section">
            <div class="categories-dropdown" :class="{ expanded: isExpanded }">
              <a
                href="#"
                class="dropdown-selected-item"
                :title="category.category"
                @click="isExpanded = !isExpanded"
              >
                <span>{{ category.category }}</span>
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.94.727l-.94.94 4 4 4-4-.94-.94L4 3.78.94.727z" fill="currentColor"/></svg>
              </a>
              <div class="dropdown-options">
                <g-link
                  :to="item.docs[0].permalink"
                  v-for="item in list"
                  :key="item.category"
                >
                  <span> {{ item.category }} </span>
                </g-link>
              </div>
            </div>
            <ul>
              <li v-for="doc in category.docs" :key="doc.permalink">
                <g-link :to="doc.permalink">
                  <span class="label"> {{ doc.title }} </span>
                </g-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
  export default {
    props: ['category', 'categories'],
    data () {
      return {
        isExpanded: false,
        isVisible: false,
      }
    },
    watch: {
      '$route.fullPath' () {
        this.isExpanded = false
        this.isVisible = false
      },
    },
    computed: {
      list () {
        return this.categories.filter((one) => {
          return one.category !== this.category.category && one.docs && one.docs.length
        })
      }
    },
  }
</script>

<style scoped>
  .sidebar {
    position: fixed;
    top: calc(var(--header-height) + 6px);
    background-image: linear-gradient(90deg,#F9FAFC 60%,#f5f5f9);
    bottom: 0;
    margin-left: -999px;
    padding-left: 999px;
    transition: transform 180ms ease, opacity 200ms ease;
    z-index: 1;
    transform: translateX(-400px);
    opacity: 0;
    pointer-events: none;
  }
  .sidebar.visible {
    transform: none;
    transition: transform 180ms ease;
    opacity: 1;
    pointer-events: inherit;
  }

  .sidebar-container {
    width: 100vw;
    padding-right: 40px;
    height: 100%;
    overflow: scroll;
  }

  .sidebar-section {
    margin-top: 60px;
  }

  .sidebar-menu .title {
    color: var(--inactive);
    text-transform: uppercase;
    font-weight: 700;
    font-size: 1.4rem;
    margin-bottom: 20px;
  }

  .sidebar-menu ul {
    list-style: none;
  }

  .sidebar-menu li a {
    color: inherit;
    text-decoration: none;
    margin-bottom: 8px;
    font-size: 1.8rem;
    display: block;
    transition: color 200ms ease;
  }

  .sidebar-menu li a:hover {
    color: var(--black);
  }

  .sidebar-menu li a.active {
    color: var(--brand);
  }

  .categories-dropdown {
    margin: 30px 30px 40px 0;
    position: relative;
  }

  .dropdown-selected-item {
    background: #FFFFFF;
    border: 1px solid #D7DEEB;
    border-radius: 3px;
    display: block;
    color: inherit;
    font-size: 1.8rem;
    font-weight: 500;
    padding: 12px 30px 8px 20px;
    position: relative;
  }

  .dropdown-selected-item span {
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    overflow: hidden;
  }

  .dropdown-selected-item svg {
    position: absolute;
    right: 18px;
    top: 50%;
    transition: 100ms transform ease;
    transform: translateY(-50%);
  }

  .dropdown-options {
    box-shadow: 0 20px 40px 0 rgba(0,0,0,0.02), 0 14px 6px 0 rgba(0,0,0,0.03);
    border: 1px solid #D7DEEB;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-10px);
    border-radius: 0 0 3px 3px;
    position: absolute;
    background: #fff;
    transition: 80ms transform ease, 40ms opacity ease;
    z-index: 1;
    left: 0;
    right: 0;
    margin-top: -2px;
    padding: 10px 0;
  }

  .dropdown-options a {
    display: block;
    padding: 10px 20px;
    color: inherit;
    font-size: 1.7rem;
    font-weight: 500;
  }

  .dropdown-options a:hover {
    background: var(--grey-lighter);
    color: var(--black);
  }

  .dropdown-options a span {
    display: block;
    margin-bottom: -4px;
  }

  .categories-dropdown.expanded .dropdown-options {
    opacity: 1;
    transform: none;
    pointer-events: inherit;
    transition: 80ms transform ease;
  }

  .categories-dropdown.expanded .dropdown-selected-item svg {
    transform: translateY(-50%) rotate(180deg);
  }

  @media (min-width: 1024px) {
    .sidebar {
      transform: none;
      opacity: 1;
      pointer-events: inherit;
    }

    .sidebar-mobile-handle {
      display: none;
    }

    .sidebar-container {
      width: 250px;
      padding: 0;
    }
  }
</style>
