<template>
  <div id="topbar">
    <div class="container">
      <ul>
        <li v-for="group in groups"  :key="group.name">
          <GLink :to="`/${group.categories[0].docs[0].permalink}`">{{ group.name }}</GLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['groups'],
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
      border-bottom: 2px solid var(--brand);
      position: fixed;
      height: 50px;
      width: 100%;
      z-index: 2;
    }

    #topbar .container {
      align-items: center;
      display: flex;
      justify-content: start;
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