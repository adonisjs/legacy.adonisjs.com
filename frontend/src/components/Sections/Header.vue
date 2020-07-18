<template>
  <div class="header-wrapper" :class="{ expanded: isExpanded }">
    <header class="header">
      <div class="header-main">
        <div class="container">
          <div class="header-main-container">
            <div class="logo">
              <GLink to="/">
                <img src="/img/adonis-banner.svg" alt="AdonisJS" />
              </GLink>
            </div>

            <div class="navbar-wrapper">
              <Navbar />
            </div>

            <div class="search-wrapper">
              <Search />
            </div>

            <div class="hamburger-wrapper">
              <Hamburger @toggle="toggleHeader" :is-expanded="isExpanded" />
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
  import Button from '~/components/Button.vue'
  import Navbar from '~/components/Sections/NavBar.vue'
  import Hamburger from '~/components/Hamburger.vue'
  import Search from '~/components/Sections/Search.vue'

  export default {
    components: { Button, Hamburger, Navbar, Search },
    data () {
      return {
        isExpanded: false,
      }
    },
    methods: {
      toggleHeader () {
        this.isExpanded = !this.isExpanded
      },
    }
  }
</script>

<style scoped>
  .header-wrapper {
    height: calc(var(--header-height) + 6px); /** +6px for the border top */
  }
  .header-wrapper.expanded {
    height: 100vh;
  }

  .header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 3;
    background: #FFFFFF;
    transition: transform 200ms ease;
    border-top: 6px solid var(--brand);
  }

  .header-main {
    background: #FFFFFF;
    border-bottom: 1px solid var(--grey-400);
  }

  .header .container {
    padding: 0;
  }

  .header-main-container {
    height: var(--header-height);
    padding: 0 30px;
  }
  .header-wrapper.expanded .header-main-container {
    height: calc(100vh);
  }

  .logo {
    width: 180px;
    height: var(--header-height);
    display: flex;
    align-items: center;
    flex-shrink: 0;
    user-select: none;
  }

  .logo a {
    display: block;
    color: var(--grey-900);
  }

  .navbar-wrapper {
    border-top: 1px solid var(--grey-100);
    padding: 20px 0;
    display: none;
  }
  .header-wrapper.expanded .navbar-wrapper {
    display: block;
    overflow: scroll;
  }

  /** Hide search on mobile */
  .search-wrapper {
    display: none;
  }

  @media (min-width: 1024px) {
    .header-main-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-wrapper.expanded {
      height: calc(var(--header-height) + 6px);
    }

    .header-wrapper.expanded .header-main-container {
      height: var(--header-height);
    }

    /**
      * Hide hamburger on desktop
     */
    .hamburger-wrapper {
      display: none;
    }

    .navbar-wrapper {
      border: none;
      padding: 0;
      display: block;
      overflow: visible;
      height: 100%;
    }

    .search-wrapper {
      display: block;
    }
  }

  @media (min-width: 1260px) {
    .logo {
      width: 250px;
    }
  }
</style>
