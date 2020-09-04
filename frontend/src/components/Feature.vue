<template>
  <div class="feature">
    <div class="feature-title">
      <div v-html="icon" class="icon"></div>
      <h2><span>{{ title }}</span></h2>
    </div>
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
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .feature-title h2 {
    color: var(--grey-900);
    font-size: 2.1rem;
    font-weight: 700;
  }

  .feature-title span {
    display: block;
  }

  .feature p {
    line-height: var(--loose-line-height);
  }

  @media (min-width: 1024px) {
    .feature-title h2 {
      font-size: 2.3rem;
    }
  }
</style>
