<template>
  <div class="sponsors">
    <div class="container">
      <div class="sponsors-container">
        <div class="grid">
          <div class="why-become-sponsor">
            <SectionTitle>Sponsor AdonisJS</SectionTitle>
            <div class="subtitle-container">
              <SectionSubTitle>
                AdonisJS is an open source framework under MIT License and completely free to use. However, the amount of effort needed to maintain and develop new features for the project is not sustainable without proper financial backing.
              </SectionSubTitle>

              <div class="sponsors-benefits">
                <ul>
                  <li> Become part of a members only private slack group. </li>
                  <li> Get your product listed on the homepage of this website. </li>
                  <li> Have a monthly one to one video call with the creator of the framework. </li>
                </ul>
              </div>

              <div class="cta">
                <!-- @hardcoded -->
                <Button title="Become a Sponsor" href="https://www.patreon.com/adonisframework" :external="true" />
              </div>
            </div>
          </div>

          <div class="sponsors-list">
            <h2> Current Sponsors </h2>
            <div class="sponsor-card">
              <a href="https://pickaw.com/?utm_source=adonisjs" target="_blank" referrerpolicy="origin">
                <img src="https://res.cloudinary.com/adonis-js/image/upload/q_100/v1593875255/adonisjs.com/square_iq1dtk.png" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Button from '~/components/Button.vue'
  import SectionTitle from '~/components/SectionTitle'
  import SectionSubTitle from '~/components/SectionSubTitle'

  export default {
    components: {
      SectionTitle,
      SectionSubTitle,
      Button,
    },
    data () {
      return {
        activeCategoryIndex: 0,
      }
    }
  }
</script>

<style scoped>
  .sponsors {
    padding: 60px 0 100px 0;
    background-color: var(--grey-300);
  }

  .grid {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }

  .sponsors-list {
    margin-top: 40px;
  }

  .sponsor-card {
    background: #fff;
    padding: 0 60px;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.05), 0 10px 40px 0 rgba(0,0,0,0.05);
    border-radius: 6px;
    height: 100%;
    display: flex;
    align-items: center;
    max-width: 300px;
  }

  .sponsor-card img {
    max-width: 100%;
  }

  .why-become-sponsor .title {
    font-size: 4.2rem;
  }

  .why-become-sponsor .subtitle {
    font-size: 2.2rem;
  }

  .why-become-sponsor ul {
    list-style: none;
    margin: 40px 0;
    font-size: 2rem;
  }

  .why-become-sponsor ul li {
    position: relative;
    padding-left: 3rem;
    margin-bottom: 1rem;
  }

  .why-become-sponsor ul li:before {
    content: '—';
    width: 15px;
    overflow: hidden;
    position: absolute;
    left: 0;
    color: var(--grey-800);
  }

  .sponsors-list h2 {
    color: var(--grey-600);
    font-weight: 600;
    font-size: 1.4rem;
    letter-spacing: 0.6px;
    margin-bottom: 10px;
    font-family: var(--font-secondary);
  }

  @media (min-width: 768px) {
    .grid {
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: flex-start;
    }

    .why-become-sponsor {
      width: 55%;
      flex-grow: 0;
    }

    .sponsors-list {
      width: 40%;
      flex-shrink: 0;
    }
  }

  @media (min-width: 1024px) {
    .main-features {
      padding: 190px 0 100px 0;
    }

    .why-become-sponsor {
      width: 60%;
    }

    .sponsors-list {
      width: 36%;
      padding: 0 60px;
    }
  }
</style>
