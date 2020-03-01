<template>
  <div class="article">
    <div class="hero">
      <div class="container">
        <div class="hero-container">
          <slot name="hero"></slot>
        </div>
      </div>
    </div>

    <section class="main">
      <div class="container">
        <div class="article-container">
          <slot />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
  }
</script>

<style scoped>
  .article {
    color: var(--grey-800);
    font-size: 2rem;
    line-height: 1.3;
  }

  .article code {
    font-size: 1.6rem;
    border-radius: 3px;
    padding: 0 4px;
    background-color: var(--grey-400);
  }

  .hero {
    background: var(--grey-300);
    padding: 80px 0;
    position: relative;
  }

  .hero:after {
    background: inherit;
    position: absolute;
    content: '';
    display: block;
    height: 50%;
    left: 0;
    right: 0;
    bottom: 0;
    transform: skewY(-1.5deg);
    transform-origin: 100%;
    z-index: -1;
    backface-visibility: hidden;
  }

  .article-container, .hero-container {
    max-width: 620px;
    margin: auto;
  }

  .hero-container h1 {
    font-size: 5rem;
    color: var(--grey-900);
    margin-bottom: 15px;
  }

  .hero-container h3.lede {
    font-size: 2.4rem;
    font-weight: 500;
  }

  .main {
    padding-bottom: 80px;
  }

  .article-container h2 {
    margin-top: 6rem;
    padding-top: 5.2rem;
    border-top: 1px solid var(--grey-100);
    margin-bottom: 1.8rem;
    color: var(--grey-900);
    font-size: 3.2rem;
  }
  .article-container h2:first-child {
    border-top: 0;
  }

  .article-container p {
    margin-bottom: 3.2rem;
  }

  .article-container ul {
    list-style: none;
    margin-bottom: 4rem;
  }

  .article-container li {
    position: relative;
    padding-left: 30px;
    margin-bottom: 20px;
  }

  .article-container li:before {
    content: '—';
    width: 15px;
    overflow: hidden;
    position: absolute;
    left: 0;
  }

  .article-container .quote {
    background: var(--selection);
  }
</style>
