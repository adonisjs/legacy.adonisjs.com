<template>
  <footer class="footer">
    <div class="footer-main">
      <div class="container">
        <div class="grid">
          <div class="col for-logo">
            <Icon name="adonis" height="33" width="41" :fill="true" />
          </div>
          <div class="col" v-for="item in $static.menu.edges" :key="item.node.id">
            <h3 class="title">{{ item.node.title }}</h3>
            <ul>
              <li v-for="child in item.node.children" :key="child.id">
                <a :href="child.permalink" v-if="child.isExternal" target="_blank" rel="noreferrer">
                  {{ child.title }}
                </a>
                <GLink :to="`${child.permalink}/`" v-else>{{ child.title }}</GLink>
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
            &copy; {{ new Date().getFullYear() }}. AdonisJS is a registered trademark of <a href="https://twitter.com/AmanVirk1" target="_blank" rel="noreferrer">Harminder Virk</a>
          </p>
          <p>Website Designed by <a href="http://frederikwilhelm.de/" target="_blank" rel="noreferrer">Frederik Wilhelm</a></p>
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
    border-top: 1px solid var(--grey-100);
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
    color: var(--grey-500);
    font-size: 1.6rem;
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
      font-size: 1.8rem;
      letter-spacing: 0.5px;
      color: var(--grey-900);
      margin-bottom: 10px;
    }

    .footer-main ul a {
      color: var(--grey-500);
      display: block;
      font-size: 1.7rem;
      margin-bottom: 5px;
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
      color: var(--grey-100);
    }

    .footer-bottom p {
      margin-bottom: -10px;
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
