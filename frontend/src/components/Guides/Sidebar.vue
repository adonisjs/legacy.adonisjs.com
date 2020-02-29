<template>
  <div class="sidebar-wrapper">
    <div>
      <select name="docs-menu" class="menu-select-box" @change="openUrl($event)">
        <optgroup v-for="(category, index) in categories" :key="index" :label="category.name">
          <option v-for="doc in category.docs" :key="doc.permalink" :value="`/${doc.permalink}`">
            {{ doc.title }}
          </option>
        </optgroup>
      </select>
    </div>

    <aside class="sidebar">
      <div class="sidebar-container">
        <div class="sidebar-section">
          <div class="categories-dropdown" :class="{ expanded: isExpanded }">
            <a
              href="#"
              class="dropdown-selected-item"
              :title="group"
              @click="isExpanded = !isExpanded"
            >
              <span>{{ group }}</span>
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.94.727l-.94.94 4 4 4-4-.94-.94L4 3.78.94.727z" fill="currentColor"/></svg>
            </a>
            <div class="dropdown-options">
              <g-link
                v-for="group in groups"
                :to="`/${group.categories[0].docs[0].permalink}`"
                :key="group.name"
              >
                <span @click="isExpanded = false"> {{ group.name }} </span>
              </g-link>
            </div>
          </div>

          <div class="sidebar-menu">
            <ul>
              <div v-for="(category, index) in categories" :key="index">
                <h3 class="title" v-if="category.name !== 'root'">{{ category.name }}</h3>
                <li v-for="doc in category.docs" :key="doc.permalink">
                  <g-link :to="`/${doc.permalink}`">
                    <span class="label"> {{ doc.title }} </span>
                  </g-link>
                </li>
              </div>
            </ul>
          </div>
        </div>

      </div>
    </aside>
  </div>
</template>

<script>
  export default {
    props: ['categories', 'groups', 'group'],
    data () {
      return {
        isExpanded: false,
      }
    },
     watch: {
      '$route.fullPath' () {
        this.isExpanded = false
      },
    },
    methods: {
      openUrl (event) {
        this.$router.push(event.target.value)
      },
    }
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
    z-index: 1;
    display: none;
  }

  .sidebar-container {
    height: 100%;
    overflow: scroll;
    width: 250px;
    padding: 0;
  }

  .sidebar-section {
    padding: 30px 0 40px 0;
  }

  .sidebar-menu {
    margin: 20px 5px;
  }

  .sidebar-menu .title {
    margin-top: 40px;
    color: var(--grey-200);
    text-transform: uppercase;
    font-family: var(--font-mono);
    font-weight: 600;
    letter-spacing: 1px;
    font-size: 1.3rem;
    margin-bottom: 15px;
  }

  .sidebar-menu ul {
    list-style: none;
  }

  .sidebar-menu li a {
    color: inherit;
    text-decoration: none;
    margin-bottom: 6px;
    display: block;
    transition: color 200ms ease;
  }

  .sidebar-menu li a:hover {
    color: var(--grey-900);
  }

  .sidebar-menu li a.active {
    color: var(--brand);
  }

  .sidebar-wrapper .menu-select-box {
    width: 100%;
    padding: 10px;
    margin-top: 40px;
  }

  @media (min-width: 1024px) {
    .sidebar {
      display: block;
    }

    .sidebar-wrapper .menu-select-box {
      display: none;
    }

    .categories-dropdown {
      margin: 30px 30px 30px 0;
      position: relative;
    }

    .dropdown-selected-item {
      background: #FFFFFF;
      border: 1px solid var(--grey-100);
      border-radius: 3px;
      display: block;
      color: inherit;
      font-size: 1.7rem;
      font-weight: 500;
      padding: 10px 30px 10px 20px;
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
      border: 1px solid var(--grey-100);
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
      color: inherit;
      font-size: 1.7rem;
      font-weight: 500;
    }
    .dropdown-options a:hover {
      background: var(--grey-300);
      color: var(--grey-900);
    }
    .dropdown-options a span {
      padding: 8px 20px;
      display: block;
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
  }
</style>
