<template>
  <Layout>
    <a-header />
    <a-hero />
    <a-primary-features />
    <a-video />
    <a-secondary-features />
    <a-footer />
  </Layout>
</template>

<script>
  import AFooter from '~/components/Sections/Footer.vue'
  import AHeader from '~/components/Sections/Header.vue'
  import AVideo from '~/components/Home/Video.vue'
  import AHero from '~/components/Home/Hero.vue'
  import APrimaryFeatures from '~/components/Home/PrimaryFeatures.vue'
  import ASecondaryFeatures from '~/components/Home/SecondaryFeatures.vue'

  export default {
    components: { AHeader, AHero, APrimaryFeatures, AFooter, AVideo, ASecondaryFeatures },
  }
</script>
