<template>
  <footer class="footer">
    <div class="footer-main">
      <div class="container">
        <div class="grid">
          <div class="col for-logo">
            <svg width="77" height="64" viewBox="0 0 77 64" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="nonzero"><path d="M33.063 0L16.547 28.606.03 57.212h31.265l5.718-9.91h-19.82l7.938-13.74 7.93-13.742 7.935 13.741 1.976 3.422 5.72-9.91zM65.205 44.355L53.97 24.892l-5.074 8.79-11.684 20.23-5.718 9.909h44.947z"/></g></svg>
          </div>
          <div class="col" v-for="item in $static.menu.edges" :key="item.node.id">
            <h3 class="title">{{ item.node.title }}</h3>
            <ul>
              <li v-for="child in item.node.children" :key="child.id">
                <a :href="child.permalink" v-if="child.isExternal" target="_blank">
                  {{ child.title }}
                </a>
                <g-link :to="child.permalink" v-else>{{ child.title }}</g-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-container">
          <p>
            &copy; {{ new Date().getFullYear() }}. AdonisJS is a registered trademark of <a href="https://twitter.com/AmanVirk1" target="_blank">Harminder Virk</a>
          </p>
          <!-- <p>Website Designed by <a href="http://frederikwilhelm.de/" target="_blank">Frederik Wilhelm</a></p> -->
        </div>
      </div>
    </div>
  </footer>
</template>

<static-query>
  query {
    menu: allFooterMenu(order: ASC) {
      edges {
        node {
          id
          title
          permalink
          isExternal
          children {
            title
            permalink
            isExternal
          }
        }
      }
    }
  }
</static-query>

<style scoped>
  .footer {
    border-top: 1px solid var(--outlines);
  }

  .footer-main {
    display: none;
  }

  .footer-bottom-container {
    display: flex;
    padding: 40px 0;
    flex-direction: column;
  }

  .footer-bottom p {
    color: var(--grey-moderate);
    font-size: 1.4rem;
    margin-bottom: 10px;
  }

  @media (min-width: 1024px) {
    .footer-main {
      display: block;
      padding: 60px 0;
      background: #FFFFFF;
      box-shadow: 0 4px 4px 0 rgba(0,0,0,0.04), 0 15px 40px 0 rgba(0,0,0,0.05);
    }

    .footer-main ul {
      list-style: none;
    }

    .title {
      font-size: 1.5rem;
      letter-spacing: 0.5px;
      color: var(--black);
      margin-bottom: 10px;
    }

    .footer-main ul a {
      color: var(--grey-moderate);
      display: block;
      font-size: 1.5rem;
    }

    .footer-main ul a:hover {
      color: inherit;
    }

    .grid {
      display: flex;
    }

    .col {
      width: 20%;
    }

    .col.for-logo {
      width: 40%;
    }

    .for-logo svg {
      height: 48px;
      color: var(--inactive);
    }

    .footer-bottom p {
      margin: 0;
    }

    .footer-bottom-container {
      padding: 0;
      height: 80px;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
    }
  }
</style>
