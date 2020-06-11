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
          <Icon  class="stroke-0" name="chevron" height="16" width="16" :fill="true" />
        </a>

        <!-- Use anchor tag when top level link is external -->
        <a :href="item.node.permalink" v-else-if="item.node.isExternal" target="_blank" rel="noreferrer">
          {{ item.node.title }}
        </a>

        <!-- Otherwise use g-link -->
        <GLink :to="item.node.permalink" v-else><span>{{ item.node.title }}</span></GLink>

        <!-- Dropdown -->
        <ul v-if="item.node.children.length">
          <li v-for="(child, index) in item.node.children" :key="index">
            <a :href="child.permalink" v-if="child.isExternal" target="_blank" rel="noreferrer">
              {{ child.title }}
            </a>
            <GLink :to="child.permalink" v-else>{{ child.title }}</GLink>
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
     watch: {
      '$route.fullPath' () {
        this.activeIndex = -1
      },
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
  .navbar {
    height: 100%;
    padding: 20px 10px 0 10px;
  }

  .navbar ul {
    list-style: none;
  }

  .navbar a {
    color: var(--grey-700);
    font-weight: 500;
    transition: color 300ms ease;
    display: flex;
  }

  .navbar > ul {
    height: 100%;
  }

  .navbar > ul > li {
    position: relative;
    margin-bottom: 30px;
  }

  .navbar > ul > li.dropdown > a {
    color: var(--grey-600);
    font-family: var(--font-mono);
    letter-spacing: 1px;
    font-weight: 600;
    font-size: 1.6rem;
    margin-bottom: 10px;
  }

  .navbar > ul > li.dropdown > a svg {
    display: none;
  }

  .navbar > ul > li.dropdown ul li a {
    display: block;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  @media (min-width: 1024px) {
    .navbar {
      padding: 0;
    }

    .navbar > ul {
      display: flex;
      align-items: center;
    }

    .navbar > ul > li {
      margin-bottom: 0;
    }

    .navbar > ul > li > a {
      align-items: center;
      padding: 17px 17px 17px 17px;
    }

    .navbar > ul > li.dropdown > a {
      color: var(--grey-700);
      letter-spacing: normal;
      font-family: inherit;
      font-size: inherit;
      font-weight: 500;
      margin: 0;
    }

    .navbar > ul > li.dropdown > a svg {
      display: block;
      margin-left: 4px;
      margin-top: 2px;
      transition: 100ms transform ease;
    }
    .navbar > ul > li.dropdown.active > a svg {
      transform: rotate(180deg);
    }

    .navbar > ul > li.dropdown ul {
      position: absolute;
      background: #fff;
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
      padding: 9px 34px 9px 26px;
      display: block;
    }

    .navbar > ul > li a:hover,
    .navbar > ul > li.dropdown.active > a,
    .navbar > ul > li a.active {
      color: var(--grey-900);
    }

    .navbar > ul > li.dropdown ul li a:hover {
      background: var(--grey-300);
    }
  }
</style>
