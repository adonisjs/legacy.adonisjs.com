<template>
  <section class="video">
    <div class="container">
      <div class="video-container">

        <span class="label"> AdonisJS in Action </span>
        <SectionTitle theme="light"> Build a Blog in 15 Mins </SectionTitle>

        <SectionSubTitle theme="light">
          Inspired by the popular Ruby on Rails demo, let's create a blog together to feel the essence of the framework.
        </SectionSubTitle>

        <div class="embed-player" ref="embed-player">
          <p> Coming Next Week </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import SectionTitle from '~/components/SectionTitle'
  import SectionSubTitle from '~/components/SectionSubTitle'

  export default {
    components: { SectionSubTitle, SectionTitle },

    mounted () {
      // const script1 = document.createElement('script')
      // script1.setAttribute('src', 'https://fast.wistia.com/embed/medias/1ca836h6wc.jsonp')
      // script1.setAttribute('async', true)

      // const script2 = document.createElement('script')
      // script2.setAttribute('src', 'https://fast.wistia.com/assets/external/E-v1.js')
      // script2.setAttribute('async', true)

      // this.$refs['embed-player'].appendChild(script1)
      // this.$refs['embed-player'].appendChild(script2)
    }
  }
</script>

<style scoped>
  .video {
    background: var(--brand);
    background-image: linear-gradient(180deg, var(--brand) 0%, #4434BF 100%);
  }

  .label {
    background: #FFFFFF;
    border-radius: 2px;
    font-weight: 600;
    font-family: var(--font-secondary);
    padding: 10px 15px;
    display: inline-block;
    font-size: 1.3rem;
    color: var(--brand);
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  .video-container {
    padding-top: 100px;
  }

  .embed-player {
    margin-top: 40px;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: var(--pre-bg);
    font-size: 2.5rem;
    font-family: var(--font-mono);
    color: #7a7b90;
    z-index: 1;
    position: relative;
  }

  @media (min-width: 768px) {
    .video-container {
      max-width: 600px;
      text-align: center;
      margin: auto;
    }
  }

  @media (min-width: 1024px) {
    .video-container {
      max-width: 800px;
      padding-top: 160px;
    }

    .video-container .subtitle {
      padding: 0 60px;
    }

    .embed-player {
      margin-top: 80px;
      padding: 0 50px;
    }
  }
</style>
