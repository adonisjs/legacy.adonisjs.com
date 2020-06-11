<template>
  <section class="features">
    <div class="container">
      <div class="features-container">
        <div class="grid">
          <div class="col" v-for="feature in $static.features.edges" :key="feature.node.id">
            <Feature :title="feature.node.title" :icon="feature.node.icon">
              <div v-html="feature.node.body"></div>
            </Feature>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<static-query>
  query {
    features: allPrimaryFeatures(order: ASC) {
      edges {
        node {
          id
          title
          body
          icon
        }
      }
    }
  }
</static-query>

<script>
  import Feature from '~/components/Feature.vue'

  export default {
    components: { Feature },
  }
</script>

<style scoped>
  .features {
    background-color: var(--grey-300);
    padding: 80px 0;
    margin-top: -48px;
  }

  .grid {
    display: flex;
    flex-direction: column;
  }

  .col {
    padding: 12px 0;
  }

  @media (min-width: 768px) {
    .grid {
      max-width: 600px;
      margin: auto;
    }
  }

  @media (min-width: 1024px) {
    .features {
      padding: 160px 0 120px 0;
    }

    .grid {
      flex-direction: row;
      max-width: none;
      margin: 0 -12px;
    }

    .col {
      flex: 1;
      padding: 0 12px;
    }
  }
</style>
