<template>
  <div class="header-wrapper" :class="{ expanded: isExpanded }">
    <header class="header">
      <div class="header-main">
        <div class="container">
          <div class="header-main-container">
            <div class="logo">
              <g-link to="/">
                <svg viewBox="0 0 424 118" xmlns="http://www.w3.org/2000/svg"><path d="M60.952.096l28.842 49.956-10.557 18.286-3.644-6.315-14.641-25.356L46.31 62.023 31.671 87.38h36.57l-10.55 18.285H-.001v-.006l30.477-52.778L60.952.096zm29.211 62.148l9.362-16.214 20.73 35.913 20.742 35.913H58.053l10.557-18.28 21.553-37.332zm77.472-16.85c14.537 0 22.144 7.613 22.144 20.194v31.025h-15.317v-3.804c-3.219 3.712-8.199 5.072-12.88 5.072-8.387 0-16.78-4.584-16.78-16.293 0-12.288 9.07-17.067 18.243-17.067 3.615 0 8.1.58 11.417 1.652v-1.56c0-4.681-3.706-6.827-9.07-6.827-4.005 0-9.369 1.56-12.49 4.389L146.85 51.74c5.657-4.103 13.952-6.346 20.785-6.346zm6.827 36.78v-5.95c-1.86-.683-4.395-1.268-6.827-1.268-3.615 0-6.735 1.756-6.735 5.76 0 3.999 2.828 5.754 5.949 5.754 3.126 0 6.241-1.658 7.613-4.297zm53.904-31.61V28.127l15.317-3.42v71.906h-15.317v-3.51c-3.023 3.218-7.51 4.778-12.197 4.778-11.806 0-21.46-10.435-21.46-26.045 0-15.512 9.459-26.441 21.363-26.441 4.492 0 9.173 1.853 12.294 5.169zm0 28.782V64.229c-2.438-3.035-5.559-4.98-8.582-4.98-5.37 0-8.88 4.877-8.88 12.587 0 7.705 3.614 12.288 8.971 12.288 3.03 0 5.955-1.652 8.491-4.778zm46.125-33.95c13.074 0 25.271 8.393 25.271 26.24 0 16.688-12.197 26.538-25.27 26.538-12.978 0-25.07-9.85-25.07-26.538 0-17.95 12.092-26.24 25.07-26.24zm0 39.021c5.559 0 9.07-4.583 9.07-12.58 0-8.1-3.511-12.69-9.07-12.69-5.461 0-9.07 4.59-9.07 12.69 0 7.997 3.511 12.58 9.07 12.58zm59.274-39.024c9.758 0 16.195 6.242 16.195 17.95v33.269h-15.415V66.66c0-5.163-2.152-7.412-5.754-7.412-3.608 0-6.443 1.853-8.686 4.784v32.58h-15.317V46.954h15.317v4.193c3.414-3.602 8.199-5.754 13.66-5.754zm70.286 20.393c8.777.78 19.023 4.584 19.023 15.116 0 11.91-10.929 17.268-23.217 17.268-8.295 0-17.267-2.627-23.222-7.21l6.534-11.71c3.907 3.901 11.904 6.144 17.267 6.144 4.103 0 7.034-1.267 7.034-3.9 0-3.219-4.004-3.414-10.928-4.395-8.784-1.36-17.47-4.779-17.47-15.019 0-11.617 10.052-16.689 21.364-16.689 7.418 0 15.519 2.152 21.565 5.955l-7.216 10.826c-3.127-2.536-9.174-4.096-14.154-4.096-3.705 0-6.534 1.176-6.534 3.803 0 2.64 3.615 3.224 9.954 3.907zm-47.699 30.83V46.958h15.415v49.658h-15.415zm15.33-71.907v3.42h.091v12.196h-15.421V28.128h.012l15.318-3.419z" fill="currentColor" fill-rule="evenodd"/></svg>
              </g-link>
            </div>

            <div class="navbar-wrapper">
              <a-navbar />
            </div>

            <div class="hamburger-wrapper">
              <a-hamburger @toggle="toggleHeader" :is-expanded="isExpanded" />
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
  import AButton from '~/components/Button.vue'
  import ANavbar from '~/components/Sections/NavBar.vue'
  import AHamburger from '~/components/Hamburger.vue'

  export default {
    components: { AButton, AHamburger, ANavbar },
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
    height: calc(var(--header-height));
  }
  .header-wrapper.expanded {
    height: 100vh;
  }

  .header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 2;
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
    display: flex;
    justify-content: flex-start;
    position: relative;
    flex-direction: column;
    padding: 0 30px;
    overflow: hidden;
  }
  .header-wrapper.expanded .header-main-container {
    height: calc(100vh);
  }

  .logo {
    user-select: none;
    height: var(--header-height);
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .logo a {
    display: block;
    color: var(--black);
  }

  .logo svg {
    height: 30px;
    display: block;
  }

  .navbar-wrapper {
    border-top: 1px solid var(--outlines);
    padding: 20px 0;
    display: none;
    overflow: scroll;
  }
  .header-wrapper.expanded .navbar-wrapper {
    display: block;
  }

  @media (min-width: 1024px) {
    .header-main-container {
      flex-direction: row;
      align-items: center;
      overflow: visible;
      justify-content: space-between;
    }

    .header-wrapper.expanded .header-main-container {
      height: var(--header-height);
      overflow: visible;
    }

    .hamburger-wrapper {
      display: none;
    }

    .navbar-wrapper {
      border: none;
      padding: 0;
      display: block;
      overflow: visible;
    }
  }
</style>
