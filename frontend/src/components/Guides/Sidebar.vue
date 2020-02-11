<template>
  <div class="sidebar-wrapper">
    <aside class="sidebar">
      <div class="sidebar-container">
        <div class="sidebar-menu">
          <div class="sidebar-section">
            <h3 class="title"> {{ category.category }} </h3>
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
    props: ['category']
  }
</script>

<style scoped>
  .sidebar {
    position: fixed;
    top: var(--header-height);
    background-image: linear-gradient(90deg,#F9FAFC 60%,#f5f5f9);
    bottom: 0;
    margin-left: -999px;
    padding-left: 999px;
    transition: transform 200ms ease;
  }
  .sidebar-wrapper.shrinked .sidebar {
    transform: translateY(-62px);
  }

  .sidebar-container {
    width: 250px;
    height: 100%;
    overflow: scroll;
  }

  .sidebar-menu {
    height: 100%;
  }

  .sidebar-section {
    margin-top: 50px;
  }

  .sidebar-menu .title {
    color: var(--inactive);
    text-transform: uppercase;
    font-weight: 700;
    font-family: var(--font-mono);
    font-size: 1.4rem;
    margin-bottom: 20px;
  }

  .sidebar-menu ul {
    list-style: none;
  }

  .sidebar-menu li a {
    color: inherit;
    text-decoration: none;
    margin-bottom: 4px;
    font-size: 1.7rem;
    display: block;
    transition: color 200ms ease;
  }

  .sidebar-menu li a:hover {
    color: var(--black);
  }

  .sidebar-menu li a.active--exact {
    color: var(--brand);
  }

  @media (min-width: 1024px) {
    .sidebar {
      transform: none;
    }
  }
</style>
