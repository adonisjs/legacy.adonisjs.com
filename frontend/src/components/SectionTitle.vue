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
    font-size: 3.4rem;
    line-height: 34px;
    margin-bottom: 16px;
    margin-top: 40px;
    color: var(--black);
  }

  .title.light {
    color: #fff;
  }
</style>
