<template>
  <Layout>
    <a-header />

    <a-article>
      <template v-slot:hero>
        <h1>Security</h1>
        <h3 class="lede">
          AdonisJS takes security very seriously. We make sure that all security related issues are addressed and get fixed on priority.
        </h3>
      </template>

      <h2> Reporting Security Issues </h2>
      <p>
        Security issues must be handled with proper care, since they can have a serious impact on existing the applications using AdonisJS.
        You must not report security issues on Github and always email us at <a href="mailto:virk@adonisjs.com">virk@adonisjs.com</a>.
      </p>

      <p>
        Once you have submitted an issue via email, you should receive an acknowledgment within 48 hours, and depending on the action to be taken, you may receive further followup emails.
      </p>

      <h2> Supported Versions </h2>
      <p>
        At the time of security disclosure, AdonisJS will publish a new patch release. We will also publish security patches for last 2 minor versions. For example:
      </p>

      <p>
        If the current version is <code>v5.4.2</code>, then we will also publish the patch for <code>v5.3.x</code> and <code>v5.2.x</code>.
      </p>

      <h2> Disclosure Policy </h2>
      <p>
        After the fix has been applied, we will publish the new releases to the npm registy without making any public announcements. The security vulnerability is only disclosed only after 7 days of publishing the fix.
      </p>

    </a-article>
    <a-footer />
  </Layout>
</template>


<script>
  import AHeader from '~/components/Sections/Header.vue'
  import AFooter from '~/components/Sections/Footer.vue'
  import AArticle from '~/components/Article.vue'

  export default {
    metaInfo: {
      title: 'Security',
    },
    components: { AHeader, AArticle, AFooter },
  }
</script>
