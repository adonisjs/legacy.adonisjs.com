<template>
  <div class="header-wrapper" :class="{ expanded: isExpanded }">
    <header class="header">
      <div class="header-main">
        <div class="container">
          <div class="header-main-container">
            <div class="logo">
              <GLink to="/">
                <svg width="112" height="33" viewBox="0 0 121 33" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-203b3037=""><path d="M40.99 31.525c0-.083-.024-.154-.048-.237-.024-.082-.035-.153-.07-.224-.013-.024-.013-.047-.025-.071L26.668 6.44c-.011-.024-.035-.036-.047-.048-.047-.07-.094-.118-.153-.177a1.104 1.104 0 00-.178-.153c-.023-.012-.035-.036-.059-.048-.047-.023-.094-.023-.142-.047a.823.823 0 00-.224-.07c-.07-.013-.142-.013-.225-.013-.07 0-.141 0-.224.012-.083.012-.154.047-.236.083-.048.023-.095.023-.142.047-.024.012-.036.036-.047.047a.622.622 0 00-.178.142c-.059.06-.106.106-.153.177-.012.024-.036.036-.047.06l-2.423 4.182L16.377.58c-.012-.024-.036-.035-.047-.047-.048-.071-.095-.118-.154-.178a1.1 1.1 0 00-.177-.153c-.024-.012-.036-.036-.06-.047-.047-.024-.094-.024-.141-.048a.824.824 0 00-.225-.07C15.503 0 15.431 0 15.361 0c-.071 0-.142 0-.225.012-.083.012-.153.047-.236.083-.047.023-.095.023-.142.047-.024.012-.035.035-.047.047-.071.047-.118.095-.178.154-.059.059-.106.106-.153.177-.012.024-.036.035-.047.059L.153 25.132c-.011.024-.011.048-.023.071a.711.711 0 00-.07.225c-.025.082-.048.153-.048.236 0 .024-.012.047-.012.071 0 .047.024.095.024.142.011.082.023.165.047.236.024.071.059.13.094.2.036.072.071.13.13.19.06.06.119.106.178.165.035.036.07.071.106.095.024.012.06.024.083.035.035.012.059.024.094.036.13.047.272.083.402.083h11.615l-2.363 4.1c-.012.023-.012.047-.024.07a.71.71 0 00-.07.225c-.024.083-.048.154-.048.236 0 .024-.012.048-.012.071 0 .047.024.095.024.142.012.083.023.166.047.236.024.071.06.13.095.201.035.071.07.13.13.19.059.058.118.106.177.165.035.035.07.07.106.094.024.012.06.024.083.036.035.011.059.023.094.035.13.047.272.083.402.083h28.358c.142 0 .272-.036.402-.083.035-.012.07-.024.095-.035.023-.012.059-.024.082-.036.047-.023.071-.07.107-.094a.593.593 0 00.177-.166c.047-.059.083-.118.13-.189.035-.059.07-.13.094-.2a1.69 1.69 0 00.048-.237.595.595 0 00.023-.142c.071-.059.06-.07.06-.094zM5.27 23.36L15.36 5.884l4.786 8.295-5.305 9.181H5.27zm10.28 5.86l1.335-2.327 2.044-3.545 3.261-5.624 2.044-3.545 1.395-2.422 10.09 17.464H15.55zM51.715 27.66c1.957 0 3.184-.81 3.94-2.037h.053v1.645h3.94V15.21h-3.94v1.644h-.052c-.757-1.226-1.984-2.036-3.94-2.036-3.132 0-5.716 2.193-5.716 6.42 0 4.228 2.584 6.42 5.715 6.42zm1.096-3.602c-1.566 0-2.766-1.096-2.766-2.819 0-1.722 1.2-2.818 2.766-2.818 1.592 0 2.793 1.096 2.793 2.818 0 1.723-1.2 2.819-2.793 2.819zM66.571 27.66c1.957 0 3.184-.81 3.94-2.037h.053v1.645h3.94V9h-3.94v7.855h-.052c-.757-1.226-1.984-2.036-3.94-2.036-3.132 0-5.716 2.193-5.716 6.42 0 4.228 2.584 6.42 5.715 6.42zm1.096-3.602c-1.566 0-2.766-1.096-2.766-2.819 0-1.722 1.2-2.818 2.766-2.818 1.592 0 2.793 1.096 2.793 2.818 0 1.723-1.2 2.819-2.793 2.819zM82.599 14.82c-3.889 0-6.76 2.557-6.76 6.42 0 3.862 2.871 6.42 6.76 6.42 3.914 0 6.785-2.558 6.785-6.42 0-3.863-2.871-6.42-6.785-6.42zm0 3.6c1.591 0 2.818 1.097 2.818 2.82 0 1.722-1.227 2.818-2.819 2.818-1.565 0-2.818-1.096-2.818-2.819 0-1.722 1.253-2.818 2.819-2.818zM98.54 14.82c-1.696 0-3.105.809-3.94 2.218h-.052V15.21h-3.863v12.057h3.941v-6.055c0-2.14.992-2.923 2.323-2.923 1.461 0 2.218.81 2.218 2.61v6.368h3.914v-7.464c0-3.445-1.879-4.984-4.54-4.984zM109.052 9.026h-4.227v3.967h4.227V9.026zm-4.071 18.242h3.941V15.21h-3.941v12.057zM115.406 27.66c3.21 0 5.324-1.201 5.324-4.072 0-2.036-1.096-3.001-2.923-3.68l-2.088-.783c-.6-.234-.913-.391-.913-.756 0-.314.183-.522.966-.522.965 0 2.296.365 3.575.887l1.096-3.184c-1.54-.496-3.001-.73-4.358-.73-3.471 0-5.167 1.435-5.167 3.914 0 1.8.965 2.975 2.949 3.732l2.113.835c.366.157.836.235.836.705 0 .391-.392.548-1.097.548-1.487 0-2.975-.627-4.279-1.383l-1.488 3.235c1.827.914 3.862 1.253 5.454 1.253z" fill="currentColor" data-v-203b3037=""></path></svg>
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
    box-shadow: 0 20px 40px 0 rgba(0,0,0,0.02), 0 4px 6px 0 rgba(0,0,0,0.03);
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
