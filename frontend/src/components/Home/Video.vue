<template>
  <section class="video">
    <div class="container">
      <div class="video-container">
        <span class="label"> {{ $static.video.edges[0].node.label }} </span>

        <a-section-title theme="light">{{ $static.video.edges[0].node.title }}</a-section-title>

        <a-section-sub-title theme="light">
          {{ $static.video.edges[0].node.subtitle }}
        </a-section-sub-title>

        <div class="embed-player" ref="embed-player">
          <div class="wistia_responsive_padding" style="padding:83.44% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><div class="wistia_embed wistia_async_1ca836h6wc videoFoam=true" style="height:100%;position:relative;width:100%"><div class="wistia_swatch" style="height:100%;left:0;opacity:0;overflow:hidden;position:absolute;top:0;transition:opacity 200ms;width:100%;"><img src="https://fast.wistia.com/embed/medias/1ca836h6wc/swatch" style="filter:blur(5px);height:100%;object-fit:contain;width:100%;" alt="" aria-hidden="true" onload="this.parentNode.style.opacity=1;" /></div></div></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import ASectionTitle from '~/components/SectionTitle'
  import ASectionSubTitle from '~/components/SectionSubTitle'

  export default {
    components: { ASectionSubTitle, ASectionTitle },

    mounted () {
      const script1 = document.createElement('script')
      script1.setAttribute('src', 'https://fast.wistia.com/embed/medias/1ca836h6wc.jsonp')
      script1.setAttribute('async', true)

      const script2 = document.createElement('script')
      script2.setAttribute('src', 'https://fast.wistia.com/assets/external/E-v1.js')
      script2.setAttribute('async', true)

      this.$refs['embed-player'].appendChild(script1)
      this.$refs['embed-player'].appendChild(script2)
    }
  }
</script>

<static-query>
  query {
    video: allMainVideo {
      edges {
        node {
          label
          title
          subtitle
        }
      }
    },
  }
</static-query>

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
    max-width: 800px;
    margin: auto;
    padding-top: 100px;
  }

  .embed-player {
    margin-top: 40px;
  }

  @media (min-width: 768px) {
    .video-container {
      max-width: 600px;
      text-align: center;
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
