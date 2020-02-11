<template>
  <h3 class="subtitle" :class="theme"><slot /></h3>
</template>

<script>
  export default {
    props: ['theme']
  }
</script>

<style scoped>
  .subtitle {
    font-size: 1.8rem;
    font-weight: 500;
    line-height: 28px;
  }

  .subtitle.light {
    color: rgba(255, 255, 255, 0.65);
  }

  @media (min-width: 1024px) {
    .subtitle {
      font-size: 2rem;
    }
  }
</style>
