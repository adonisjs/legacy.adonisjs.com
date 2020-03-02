<template>
  <div class="main-features">
    <div class="container">
      <div class="main-features-container">
        <a-section-title>What's included?</a-section-title>

        <div class="subtitle-container">
          <a-section-sub-title>
            No need to download a gazillion of packages to create a meaningful application. AdonisJS comes with ton of features for every corner of your app, aiming to make you productive from day one.
          </a-section-sub-title>
        </div>

        <div class="features-list">
          <!-- Sidenav -->
          <div class="features-list-nav">
            <div
              v-for="(category, index) in $static.categories.edges"
              :key="index"
              :class="{ active: activeCategoryIndex === index }"
            >
              <a
                href="#"
                @click.prevent="activeCategoryIndex = index"
              >
                {{ category.node.title }}
              </a>
            </div>
          </div>

          <!-- Nav content -->
          <div class="features-list-content">
            <div class="grid">
              <div
                class="col"
                 v-for="feature in $static.categories.edges[activeCategoryIndex].node.features"
                 :key="feature.title"
              >
                <a-feature :title="feature.title" :icon="feature.icon">
                  <div v-html="feature.body"></div>
                </a-feature>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AFeature from '~/components/Feature.vue'
  import ASectionTitle from '~/components/SectionTitle'
  import ASectionSubTitle from '~/components/SectionSubTitle'

  export default {
    components: {
      AFeature,
      ASectionTitle,
      ASectionSubTitle,
    },
    data () {
      return {
        activeCategoryIndex: 0,
      }
    }
  }
</script>

<static-query>
  query {
    categories: allSecondaryFeatures(order: ASC) {
      edges {
        node {
          title
          features {
            title
            body
            icon
          }
        }
      }
    }
  }
</static-query>

<style scoped>
  .main-features {
    padding: 160px 0 100px 0;
    margin-top: -80px;
    background-color: #fff;
  }

  .features-list {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .features-list-nav {
    padding: 40px 0;
    display: flex;
    overflow: auto;
  }

  .features-list-nav div {
    text-decoration: none;
    margin: 0 0 0 14px;
    white-space: nowrap;
  }

  .features-list-nav div a {
    display: inline-block;
    transition: background 200ms ease;
    text-transform: uppercase;
    padding: 15px 32px;
    background: var(--grey-400);
    border-radius: 4px;
    font-weight: 600;
    font-size: 1.4rem;
    color: var(--grey-900);
    letter-spacing: 1px;
  }
  .features-list-nav div.active a {
    background: var(--brand);
    color: #fff;
  }

  .features-list-content {
    flex: 1;
  }

  .grid {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }

  .col {
    padding: 12px 0;
  }

  .subtitle-container {
    max-width: 650px;
  }

  @media (min-width: 768px) {
   .col {
      width: 50%;
      padding: 15px 15px;
    }

    .grid {
      flex-direction: row;
    }

    .features-list {
      align-items: flex-start;
      min-height: 700px;
    }
  }

  @media (min-width: 1024px) {
    .main-features {
      padding: 190px 0 100px 0;
    }

    .features-list {
      margin-top: 80px;
      flex-direction: row;
      min-height: 500px;
    }

    .features-list-nav {
      flex-direction: column;
      width: 300px;
    }

    .features-list-nav div {
      margin: 0 0 12px 0;
    }
  }
</style>
