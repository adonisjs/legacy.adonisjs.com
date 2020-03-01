<template>
  <div class="feature">
    <h2 class="feature-title">
      <div v-html="icon" class="icon"></div>
      <span>{{ title }}</span>
    </h2>
    <div><slot></slot></div>
  </div>
</template>

<script>
export default {
  props: ['title', 'icon']
}
</script>

<style scoped>
  .feature {
    background: #FFFFFF;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.05), 0 10px 40px 0 rgba(0,0,0,0.05);
    border-radius: 6px;
    padding: 44px 40px;
    height: 100%;
  }

  .feature-title {
    color: var(--grey-900);
    margin-bottom: 10px;
    font-size: 2.1rem;
    font-weight: 700;
    display: flex;
    align-items: center;
  }

  .feature-title span {
    display: block;
  }

  .feature p {
    line-height: var(--loose-line-height);
  }

  @media (min-width: 1024px) {
    .feature-title {
      font-size: 2.3rem;
    }
  }
</style>
