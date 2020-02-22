<template>
  <Layout>
    <a-header />
    <main>
      <div class="container">
        <h1>Release Process</h1>
        <p>
          Starting with version 5.0, we decided to have an official release process for the framework.AdonisJS will follow a 6 week release cycle and a strong commitment to <a href="https://semver.org">Semantic Versioning</a>.
        </p>

        <p>
          The framework is a combination of several first party packages and the mentioned release cycle is just for the <a href="https://github.com/adonisjs/adonis-framework">core of the framework</a>. The other packages will also follow semantic versioning, but they may or may not get new releases every 6 weeks.
        </p>

        <h2> Goals </h2>
        <p>Following are the goals, we want to achieve with our release process. </p>

        <ul>
          <li> Add new features in a way that doesn't break existing apps. </li>
          <li> Ship security and bug fixes every week and bump the <code>patch</code> version of the framework </li>
          <li> Make a minor release about every six weeks. This is the time when we ship new feature, without disturbing existing features or APIs. </li>
          <li> Plan breaking changes ahead of time and deprecate them before deciding to remove them officially. </li>
          <li> Let every deprecated API live in the codebase until the next major release. This gives enough time to the teams to make changes to their code. </li>
        </ul>

        <h2> Shipping Breaking Changes </h2>
        <p>
          Semver advocates to bump the major version number for every breaking change. It means, if a package ships three breaking changes in a week, the package author can safely bump the major version number every time.
        </p>
        <p>
          However, in order to keep the major releases less frequent, we follow the approach of deprecating APIs, before removing them or changing their behavior completely. In other words, the major releases of AdonisJS will not contain any breaking changes, which were not deprecated previously.
        </p>

        <h2> Shipping New Features </h2>
        <p>
          The framework will have a minor release every 6 weeks, containing all the new features, without breaking any existing functionality. If you want to use the unreleased and undocumented changes before hand, you can install them using <code>@next</code> tag.
        </p>

        <h2>LTS</h2>
        <p>
          Most of the work on AdonisJS is still done by a single person. So, we are not in a position to offer LTS as of today.
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
