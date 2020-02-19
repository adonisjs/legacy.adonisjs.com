<template>
  <h2 class="title" :class="theme"><slot /></h2>
</template>

<script>
  export default {
    props: ['theme']
  }
</script>


<style scoped>
  .title {
    font-size: 5rem;
    line-height: 48px;
    margin-bottom: 20px;
    margin-top: 40px;
    font-weight: 900;
    color: var(--grey-900);
  }

  .title.light {
    color: #fff;
  }
</style>
