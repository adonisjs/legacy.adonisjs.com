<template>
  <Layout>
    <Header />
    <Hero />
    <PrimaryFeatures />
    <Video />
    <SecondaryFeatures />
    <Footer />
  </Layout>
</template>

<script>
  import Footer from '~/components/Sections/Footer.vue'
  import Header from '~/components/Sections/Header.vue'
  import Video from '~/components/Home/Video.vue'
  import Hero from '~/components/Home/Hero.vue'
  import PrimaryFeatures from '~/components/Home/PrimaryFeatures.vue'
  import SecondaryFeatures from '~/components/Home/SecondaryFeatures.vue'

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
    components: { Header, Hero, PrimaryFeatures, Footer, Video, SecondaryFeatures },
  }
</script>
