<template>
  <Layout>
    <a-header />
    <a-hero />
    <div class="doctrine">
      <div class="container">
        <div class="doctrine-container">
          <p>AdonisJS was started as an open source project in early 2016. The framework was <strong>intentionally created</strong> to serve as an alternative to other frameworks in the Node.js ecosystem.</p>

          <p>
            I (Harminder Virk) had past experience of working with Laravel (from PHP), and after pivoting to Node.js, I was unable to find a framework that was close enough to Laravel or Rails.
          </p>

          <ul>
            <li>
              Frameworks like Express, Koa are mainly routing libraries with great support for middleware.
            </li>
            <li>
              Frameworks like SailsJS are badly architected. Understanding the statement is harsh, but <a href="https://kevin.burke.dev/kevin/dont-use-sails-or-waterline/">that's the truth</a>.
            </li>
            <li>
              A common theme across frameworks is to wrap ExpressJs in a glorified app object and marketing it as the Rails for Node.
            </li>
          </ul>

          <p>
            On the other hand, AdonisJS has been created from ground up with strong principles and clear goals in mind.
          </p>

          <div class="section">
            <h2 class="section-title">Optimize for Programmer Happiness</h2>
          </div>

          <div class="section">
            <h2 class="section-title">Resistence for the shiny new thing</h2>
            <p>
              The Node.js and Javascript eco-system is going through the phase of rapid innovation. You will see new tools, frameworks and programming patterns appearing every day and it is very easy to fall into the trap of supporting every tool, idiom in the framework.
            </p>

            <p>
              A great example of this is Typescript. AdonisJS took a lot of time before making Typescript as a first class citizen in the framework.  We waited to make sure that Typescript is here to stay and can be used in real world projects vs dying as a concept in its early days.
            </p>
          </div>

          <div class="section">
            <h2 class="section-title">Value integrated systems</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section">
      <div class="features-section-container">
        <h2>Developer Experience</h2>

        <div class="grid">
          <div class="col">
            <a-feature title="Typescript support" icon="">
              Type safety is baked into the framework with first class support for Typescript. No need to install any additional build tools, Typescript just works with AdonisJS.
            </a-feature>
          </div>

          <div class="col">
            <a-feature title="Extensive Documentation" icon="">
              Type safety is baked into the framework with first class support for Typescript. No need to install any additional build tools, Typescript just works with AdonisJS.
            </a-feature>
          </div>

          <div class="col">
            <a-feature title="Powerful CLI" icon="">
              Type safety is baked into the framework with first class support for Typescript. No need to install any additional build tools, Typescript just works with AdonisJS.
            </a-feature>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
  import AHeader from '~/components/Sections/Header.vue'
  import AHero from '~/components/WhyAdonis/Hero.vue'
  import AFeature from '~/components/Feature'

  export default {
    components: { AHeader, AHero, AFeature },
  }
</script>

<style>
  .doctrine-container {
    width: 620px;
    margin: auto;
    color: var(--grey-800);
    font-size: 2rem;
    line-height: 1.3;
    padding: 80px 0;
  }

  .doctrine-container p {
    margin-bottom: 4rem;
  }

  .doctrine-container ul {
    list-style: none;
    margin-bottom: 5rem;
  }

  .doctrine-container li {
    position: relative;
    padding-left: 30px;
    margin-bottom: 20px;
  }

  .doctrine-container li:before {
    content: '—';
    width: 15px;
    overflow: hidden;
    position: absolute;
    left: 0;
  }

  h2.section-title {
    color: var(--grey-900);
  }

  .features-section {
    background-color: var(--grey-300);
    padding: 80px 0;
  }

  .features-section-container {
    max-width: 960px;
    margin: auto;
  }

  .grid {
    display: flex;
    max-width: none;
    margin: 0 -12px;
  }

  .col {
    flex: 1;
    padding: 0 12px;
  }
</style>
