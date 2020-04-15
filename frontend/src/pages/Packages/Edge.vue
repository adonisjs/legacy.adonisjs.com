<template>
  <Layout>
    <a-header />

    <a-article>
      <template v-slot:hero>
        <h1> Edge </h1>
        <h3 class="lede">
          Edge is a batteries included template engine for Node.js. It is written from ground up and attempts to solve every little issue you had with template engines in the past.
        </h3>
        <!-- <div class="hero-dummy-wrapper"></div> -->
      </template>

      <div class="package-content">
        <!-- <div class="code-showcase-wrapper" v-if="codeHighlightSections.length">
          <a-code-group :sections="codeHighlightSections" />
        </div> -->

        <ul>
          <li>
            Fully featured with support for <strong>conditionals</strong>, <strong>loops</strong> and <strong>partials</strong>
          </li>
          <li>
            The only Node.js template engine that has <strong>Components</strong>
          </li>
          <li>
            Stack traces that points to the original filename and line number
          </li>
          <li>
            Runtime debugging using Chrome DevTools
          </li>
          <li>
            Extensible API for adding custom Edge tags
          </li>
        </ul>

        <h2>The Edge Syntax</h2>
        <p>We have put a lot of thoughts in finalizing the Edge syntax. The main goals were to keep API surface area small and writing Edge should feel like writing regular JavaScript.</p>

        <p>
          Finally, we ended up with <strong>two distinct ways</strong> for writing dynamic code inside Edge template files.
        </p>

        <div class="toggle-actions">
          <a href=""> The Curly Braces </a>
          <a href=""> Edge Tags </a>
        </div>

        <div class="code-editor">
          <div class="code-editor-wrapper">
            <div class="code-editor-nav">
              <a href="" class="active"> Output Variable </a>
              <a href=""> Array.Map </a>
              <a href=""> Standard Globals </a>
              <a href=""> Template Literals </a>
            </div>
            <div class="code-editor-content">
              <a-code-block theme="light" v-if="codeHighlightSections.length">
                <div v-html="codeHighlightSections[2].code"></div>
              </a-code-block>
            </div>
          </div>
        </div>

        <h2>Handles Newlines the right way</h2>
        <p>Most of the template engines poorly handles new lines. Since, many of us use template engines to output HTML, we never notice the extra newlines as HTML is not sensitive to the <code>\n</code> character.</p>

        <p>
          Let's try to build a YAML file using <strong>Nunjucks</strong> and <strong>Edge</strong> both to witness the real issue.
        </p>

        <div class="toggle-actions">
          <a href=""> Edge </a>
          <a href=""> Nunjucks </a>
        </div>

        <h2>Helpful Stack Trace</h2>
        <p>
          Again, most of the template engines fall short with error stack trace. Since, the templates are compiled to a Javascript function, it is not always easy to point back to original source code.
        </p>

        <p>
          However, Edge will not disappoint you. Both compile-time and run-time errors always points back to the original source file.
        </p>
      </div>

    </a-article>
    <a-footer />
  </Layout>
</template>

<script>
  import AHeader from '~/components/Sections/Header.vue'
  import AFooter from '~/components/Sections/Footer.vue'
  import ACodeGroup from '~/components/Home/CodeGroup.vue'
  import AArticle from '~/components/Article.vue'
  import ACodeBlock from '~/components/CodeBlock.vue'

  export default {
    metaInfo: {
      title: 'Packages - Edge',
    },
    components: { AHeader, AArticle, AFooter, ACodeGroup, ACodeBlock },
    data () {
      return {
        codeHighlightSections: []
      }
    },
    mounted () {
      this.codeHighlightSections = this.$static.showCaseTabs.edges.map((edge) => edge.node)
    }
  }
</script>

<static-query>
  query {
    showCaseTabs: allEdgeShowCaseTabs(order: ASC) {
      edges {
        node {
          title
          code
        }
      }
    }
  }
</static-query>

<style scoped>
  .code-showcase-wrapper {
    margin-bottom: 100px;
    position: relative;
    z-index: 1;
  }

  .hero-dummy-wrapper {
    height: 100px;
  }

  .code-showcase-wrapper div {
    border-radius: 6px;
    background-color: var(--pre-bg);
  }

  .package-content {
    margin-top: 100px;
  }

  .code-editor {
    box-shadow: 4px 4px #c3c3c3;
    border: 1px solid var(--grey-100);
    border-radius: 4px;
    margin-left: -50px;
    margin-right: -50px;
  }

  .code-editor-wrapper {
    display: flex;
  }

  .code-editor-nav {
    width: 30%;
    flex-shrink: 0;
    padding: 40px 0 40px 14px;
  }

  .code-editor-nav a {
    display: block;
    font-family: var(--font-mono);
    font-size: 1.4rem;
    padding: 4px 12px;
    color: inherit;
  }

  .code-editor-nav a.active {
    background: #5a45ffc7;
    color: #fff;
    border-radius: 10px 0 0 10px;
  }

  .code-editor-content {
    border-left: 1px solid var(--grey-100);
    flex: 1;
    width: 70%;
  }

  .code-editor-content > div {
    overflow: scroll;
  }
</style>
