<template>
  <div class="sidebar-wrapper">
    <div class="mobile-menu">
      <select name="docs-menu" class="docs-menu">
        <optgroup v-for="(category, index) in categories" :key="index" :label="category.category">
          <option v-for="doc in category.docs" :key="doc.permalink">{{ doc.title }}</option>
        </optgroup>
      </select>
    </div>

    <aside class="sidebar">
      <div class="sidebar-container">
        <div class="sidebar-menu">
          <div class="sidebar-section">
            <ul>
              <div v-for="(category, index) in categories" :key="index">
                <h3 class="title">{{ category.category }}</h3>
                <li v-for="doc in category.docs" :key="doc.permalink">
                  <g-link :to="doc.permalink">
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
    props: ['categories'],
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
  .sidebar.visible {
    transform: none;
    transition: transform 180ms ease;
    opacity: 1;
    pointer-events: inherit;
  }

  .sidebar-container {
    height: 100%;
    overflow: scroll;
    width: 250px;
    padding: 0;
  }

  .sidebar-menu .title {
    color: var(--grey-200);
    text-transform: uppercase;
    font-family: var(--font-mono);
    font-weight: 600;
    letter-spacing: 1px;
    font-size: 1.3rem;
    margin-bottom: 20px;
  }

  .sidebar-menu ul {
    list-style: none;
  }

  .sidebar-menu li a {
    color: inherit;
    text-decoration: none;
    margin-bottom: 4px;
    display: block;
    transition: color 200ms ease;
  }

  .sidebar-section {
    margin-top: 60px;
  }

  .sidebar-menu li a:hover {
    color: var(--grey-900);
  }

  .sidebar-menu li a.active {
    color: var(--brand);
  }

  .sidebar-wrapper .docs-menu {
    width: 100%;
    padding: 10px;
    margin-top: 40px;
  }

  @media (min-width: 1024px) {
    .sidebar {
      display: block;
    }

    .sidebar-wrapper .docs-menu {
      display: none;
    }
  }
</style>
