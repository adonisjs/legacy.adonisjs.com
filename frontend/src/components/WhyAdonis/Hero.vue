<template>
  <section class="hero">
    <div class="container">
      <div class="hero-container">
        <h1 class="title"> Why AdonisJS? </h1>
        <h3 class="subtitle">
          Choosing a framework can get tricky. Let’s explore AdonisJS together and see what makes it different from other Node.js frameworks.
        </h3>
      </div>

      <div class="seperator">
        <img src="https://assets.dimerapp.com/site/images/seperator-large.svg?v=10">
      </div>
    </div>
  </section>
</template>

<script>
  export default {
  }
</script>

<static-query>
  query {
    hero: allHero {
      edges {
        node {
          title
          subtitle
        }
      }
    },
    showCaseTabs: allShowCaseTabs(order: ASC) {
      edges {
        node {
          title
          code
        }
      }
    }
  }
</static-query>

<style scoped>
  .hero {
    /* background: var(--brand); */
  }

  .hero-container {
    padding: 100px 0 60px 0;
  }

  .title {
    font-size: 5rem;
    color: var(--grey-900);
    font-weight: 700;
    line-height: 46px;
    margin-bottom: 34px;
  }

  .subtitle {
    font-weight: 500;
    font-size: 2.4rem;
    line-height: 28px;
    color: var(--grey-700);
  }

  @media (min-width: 768px) {
    .hero-container {
      max-width: 620px;
      text-align: center;
      margin: auto;
    }

    .title {
      font-size: 5.4rem;
      line-height: 48px;
      padding: 0 30px;
    }

    .subtitle {
      font-size: 2.4rem;
    }
  }

  @media (min-width: 1024px) {
    .hero {
      position: relative;
    }

    .hero-container {
      width: 670px;
    }

    .title {
      font-size: 6.2rem;
      line-height: 60px;
      margin-bottom: 28px;
    }

    .subtitle {
      line-height: 32px;
      font-size: 2.6rem;
    }

    .seperator {
      width: 770px;
      margin: auto;
    }

    .seperator img {
      width: 100%;
    }
  }
</style>
