<template>
  <Layout>
    <a-header />

    <a-article>
      <template v-slot:hero>
        <h1>Release Process</h1>
        <h3 class="lede">
          Starting with version 5.0, we decided to have an official release process for the framework. AdonisJS will follow a 6 week release cycle and a strong commitment to <a href="https://semver.org">Semantic Versioning</a>.
        </h3>
      </template>

      <h2> How is AdonisJS structured? </h2>
      <p>
        AdonisJS is a collection of several first party packages built around the <a href="https://github.com/adonisjs/adonis-framework">core of the framework</a>. Whenever, you hear us mentioning the AdonisJS version, just assume that we are talking about the version of the framework core.
      </p>

      <p>
        Every other package like <code>@adonisjs/lucid</code>, or <code>@adonisjs/mail</code> have their own independent versions and they are free to have their own release cycle.
      </p>

      <h2> Goals </h2>
      <p>Following is the list of goals we want to achieve with our release process.</p>

      <ul>
        <li>
          Add new features in a way that doesn't break existing apps.
        </li>

        <li>
          Ship security and bug fixes every week and bump the <code>patch</code> version of the framework
        </li>

        <li>
          Make a minor release about every six weeks. This is the time when we ship new feature, without disturbing existing features or APIs.
        </li>

        <li>
          Plan breaking changes ahead of time and deprecate them before they get removed.
        </li>

        <li>
          Let every deprecated API live in the codebase until the next major release. This gives enough time to the teams to make changes to their code.
        </li>
      </ul>

      <h2> Shipping Breaking Changes </h2>
      <p>
        As per the semver, a package should only have a major release when there is a breaking change and vice-versa.
      </p>

      <p>
        However, with AdonisJS, we follow a slightly different approach of not releasing breaking changes right away, but instead following the depreciation policy.
      </p>

      <ul>
        <li>
          Everytime there is a breaking change, we will first depereciate the old API and implement the breaking change behavior as a new API.
        </li>
        <li>
          Everyone using AdonisJS will receive depreciation warnings for the older API and they can apply fixes at their own convience.
        </li>
        <li>
          Once, we are confident about the stability of the newer API, we will rollout a major release just removing the depreciated code.
        </li>
      </ul>

      <h2> Shipping New Features </h2>
      <p>
        We follow a 6 weeks release cycle for shipping new features. If you are interested in using the unreleased and undocumented features, then you can install the <code>@next</code> version of the desired package from npm registry.
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
    components: { AHeader, AArticle, AFooter },
  }
</script>
