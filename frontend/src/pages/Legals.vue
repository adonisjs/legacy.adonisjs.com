<template>
  <Layout>
    <a-header />
    <main>
      <div class="container">
        <h1>Legals</h1>

        <p>AdonisJS is a registered trademark owned by Harminder Virk</p>

        <p>
          The trademarks, logos, and service marks (collectively the "Trademarks") displayed on our website are registered and unregistered Trademarks used by us, or other third parties. Nothing contained on this website should be construed as granting, by implication, estoppel, or otherwise, any license or right to use any Trademark displayed on the website without written permission from us or such third party that may own the Trademarks displayed on the website.
        </p>

        <h2>The AdonisJS License</h2>
        <p>
          The most current AdonisJS license details can be found on <a href="https://github.com/adonisjs/core">GitHub</a>.
        </p>

        <h2> Branding Assets </h2>
        <p>
          AdonisJS logos are the main identifier of our brand, so we're careful with how we use them. They may not be manipulated in any way, and may never be incorporated into other logos.
        </p>

        <h3>Primary Logo</h3>

        <h3>Icon</h3>

        <h2>Documentation Images</h2>
        <p>
          The graphs, diagrams and charts in the AdonisJS Guides have been released under the Creative Commons Attribution-NonCommercial-ShareAlike (CC BY-NC-SA) license.
        </p>

        <p>
          This license allows others to remix, tweak, and build upon the instructional materials non-commercially, as long as they credit AdonisJS and license any new creations under the identical terms.
        </p>

        <h2>Subprojects</h2>
        <p>
          We creatively give names to our internal packages like. <code>Edge (the template engine)</code>, <code>Antl (the transations package)</code> and so on. We do not explicitly hold any copyrights on these names and happy to rename them, if you hold copyrights for the same terms.
        </p>
      </div>
    </main>
    <a-footer />
  </Layout>
</template>

<script>
  import AFooter from '~/components/Sections/Footer.vue'
  import AHeader from '~/components/Sections/Header.vue'

  export default {
    components: { AHeader, AFooter },
  }
</script>
