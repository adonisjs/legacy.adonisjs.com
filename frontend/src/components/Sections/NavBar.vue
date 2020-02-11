<template>
  <nav class="navbar">
    <ul>
      <li
        v-for="(item, index) in $static.menu.edges"
        :key="item.node.id"
        :class="{ dropdown: item.node.children.length, active: index === activeIndex }"
      >
        <!-- Using anchor tags when top level anchor has children -->
        <a
          href="#" @click.prevent="toggleMenu(index)"
          v-if="item.node.children.length"
          :class="{ active: withIn(item.node.children) }"
        >
          <span>{{ item.node.title }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="5"
            viewBox="0 0 10 5"
          >
            <path d="M0 0l5 5 5-5z" fill="currentColor" fill-rule="nonzero"/>
          </svg>
        </a>

        <!-- Use anchor tag when top level link is external -->
        <a :href="item.node.permalink" v-else-if="item.node.isExternal" target="_blank">
          {{ item.node.title }}
        </a>

        <!-- Otherwise use g-link -->
        <g-link :to="item.node.permalink" v-else><span>{{ item.node.title }}</span></g-link>

        <!-- Dropdown -->
        <ul v-if="item.node.children.length">
          <li v-for="(child, index) in item.node.children" :key="index">
            <a :href="child.permalink" v-if="child.isExternal" target="_blank">
              {{ child.title }}
            </a>
            <g-link :to="child.permalink" v-else>{{ child.title }}</g-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
  export default {
    data () {
      return {
        activeIndex: -1
      }
    },
    methods: {
      toggleMenu (index) {
        this.activeIndex = this.activeIndex === index ? - 1 : index
      },
      withIn (children) {
        return children.find((child) => child.permalink === this.$route.path)
      },
    }
  }
</script>

<static-query>
  query {
    menu: allHeaderMenu(order: ASC) {
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
  .navbar ul {
    list-style: none;
  }

  .navbar a {
    text-decoration: none;
    color: var(--dark-grey);
    font-weight: 500;
    transition: color 300ms ease;
    display: flex;
    align-items: center;
    font-size: 1.6rem;
  }
  .navbar a:hover {
    color: var(--black);
  }

  .navbar > ul {
    display: flex;
    flex-direction: column;
  }

  .navbar > ul > li {
    position: relative;
    margin-bottom: 30px;
  }

  .navbar > ul > li.dropdown > a {
    color: var(--inactive);
    font-family: var(--font-mono);
    font-weight: 600;
    font-size: 1.5rem;
    margin-bottom: 5px;
  }

  .navbar > ul > li.dropdown > a svg {
    display: none;
  }

  .navbar > ul > li.dropdown ul {
    background: #FFFFFF;
  }

  .navbar > ul > li.dropdown ul li a {
    display: block;
    white-space: nowrap;
  }

  @media (min-width: 1024px) {
    .navbar > ul {
      flex-direction: row;
      align-items: center;
    }

    .navbar > ul > li {
      margin: 0;
    }

    .navbar > ul > li > a {
      padding: 16px 17px 15px 17px;
    }

    .navbar > ul > li.dropdown > a {
      color: var(--grey-dark);
      font-family: inherit;
      font-size: 1.6rem;
      font-weight: 500;
      margin: 0;
    }

    .navbar > ul > li.dropdown > a svg {
      display: block;
      margin-left: 4px;
      margin-top: 1px;
      transition: 100ms transform ease;
    }
    .navbar > ul > li.dropdown.active > a svg {
      transform: rotate(180deg);
    }

    .navbar > ul > li.dropdown ul {
      position: absolute;
      top: 100%;
      margin-top: 0px;
      padding-bottom: 15px;
      box-shadow: 0 20px 40px 0 rgba(0,0,0,0.02), 0 14px 6px 0 rgba(0,0,0,0.03);
      opacity: 0;
      pointer-events: none;
      transition: 80ms transform ease, 100ms opacity ease;
      transform: translateY(-10px);
      z-index: 4;
    }

    .navbar > ul > li.dropdown.active ul {
      transition: 80ms transform ease;
      opacity: 1;
      pointer-events: inherit;
      transform: none;
    }

    .navbar > ul > li.dropdown ul li a {
      padding: 10px 34px 10px 26px;
      display: block;
    }

    .navbar > ul > li a:hover,
    .navbar > ul > li.dropdown.active > a,
    .navbar > ul > li a.active {
      color: var(--black);
    }

    .navbar > ul > li.dropdown ul li a:hover {
      background: var(--grey-lighter);
    }
  }
</style>
