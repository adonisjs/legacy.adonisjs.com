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
    metaInfo: {
      title: 'Home',
      meta: [
        { name: 'description', content: 'AdonisJS is a fully-featured MVC framework for Node.js. It takes care of most of your web development hassles, offering you a clean and stable API to build web apps or microservices.' },
        { name: 'keywords', content: 'adonis, framework, node.js, mvc, javascript' },
        { property: 'og:title', content: 'AdonisJS Framework - The MVC Framework For Node.js' },
        { property: 'og:description', content: 'AdonisJS is a fully-featured MVC framework for Node.js. It takes care of most of your web development hassles, offering you a clean and stable API to build web apps or microservices.' },
        { property: 'og:image', content: 'https://preview.adonisjs.com/adonis-readme.jpg' },
      ],
    },
    components: { AHeader, AHero, APrimaryFeatures, AFooter, AVideo, ASecondaryFeatures },
  }
</script>
