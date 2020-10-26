<template>
  <div id="topbar">
    <div class="container">
      <ul>
        <li v-for="group in groups" :key="group.permalink">
          <GLink
            :to="`/${group.permalink}`"
            :class="{ active: hasSameParent(`/${group.permalink}`) }"
          >
            {{ group.name }}
          </GLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['groups'],
  methods: {
    hasSameParent(url) {
      const currentRoute = this.$route.fullPath.split('/')
      if (currentRoute.length <= 3) {
        return url === currentRoute
      }

      return (
        this.$route.fullPath.split('/').slice(0, -1).join('/') ===
        url.split('/').slice(0, -1).join('/')
      )
    },
  },
}
</script>

<style scoped>
#topbar {
  display: none;
}

@media (min-width: 1024px) {
  #topbar {
    display: flex;
    background-color: white;
    box-shadow: 0 20px 40px 0 rgba(0, 0, 0, 0.02), 0 4px 6px 0 rgba(0, 0, 0, 0.03);
    position: fixed;
    height: 50px;
    width: 100%;
    z-index: 2;
  }

  #topbar .container {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    width: 100%;
  }

  #topbar ul {
    display: flex;
    list-style: none;
  }

  #topbar ul li {
    margin-right: 4rem;
  }

  #topbar li a {
    color: inherit;
    transition: color 200ms ease;
    font-weight: 500;
  }

  #topbar li a:hover {
    color: var(--grey-900);
  }

  #topbar li a.active {
    color: var(--brand);
  }
}
</style>
