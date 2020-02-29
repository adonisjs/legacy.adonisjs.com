<template>
  <Layout>
    <a-header />

    <a-article>
      <template v-slot:hero>
        <h1> Why AdonisJS? </h1>
        <h3 class="lede">
          Choosing a framework is a tricky business. So, let’s hold hands together and see what makes AdonisJS different from other Node.js frameworks.
        </h3>
      </template>

      <h2> History </h2>
      <p>
        AdonisJS was started as an open source project in early 2016. The framework was <strong>intentionally created</strong> to serve as an alternative to other frameworks in the Node.js ecosystem.
      </p>

      <p>
        I (the author) had past experience of working with Laravel (which was fun). After pivoting to Node.js, I had a hard time finding a framework which was joy to work with.
      </p>

      <ul>
        <li>
          Frameworks like Express, Koa are mainly routing libraries with support for middleware
        </li>
        <li>
          Frameworks like SailsJS are <a href="https://kevin.burke.dev/kevin/dont-use-sails-or-waterline/">badly architected</a>.
        </li>
        <li>
          Meteor unnecessarily takes everything to the next level all together. For example, their own package manager.
        </li>
      </ul>

      <p>
        To summarize: A common theme among all the frameworks is to stay super small and unopinionated. Of course, libraries like Koa and Express are useful in certain use cases, but there is huge section of people who can benefit from a full stack framework like Rails or Laravel, but for Node.js.
      </p>

      <p>
        Also, I have never been a fan of <strong>duck taping</strong> and hence AdonisJS is not a wrapper on top of ExpressJs, over selling the idea of re-using the Express middleware. AdonisJS is written from ground up with strong principles and clear goals in mind.
      </p>

      <h2>Value Integrated Systems</h2>
      <p>
        At AdonisJS we highly believe in integrated systems. Instead of pointing you to 10 different libraries and saying <span class="quote">“you can choose whatever you want”</span>, we have invested in creating first class primitives for every corner of your app.
      </p>

      <p>
        The statement <span class="quote">“you can choose whatever you want”</span> is a nice way of saying <span class="quote">“please do all the hard work yourself, we have curated a list of libraries for you”</span>.
      </p>

      <p>
        Well, a curated list is not bad, but a framework has a bigger job to accomplish. Also, when frameworks doesn’t value integrated systems, they leave you alone in the land of <a href="https://en.wikipedia.org/wiki/Glue_code">glue code</a>.
      </p>

      <p>Let’s go through a small example and see how glue code makes its way into your code.</p>

      <ul>
        <li>You choose a main framework that does only the routing for you. </li>
        <li>Then you pick the popular body parser to access form input and uploaded files.</li>
        <li>Next step maybe is to use a validation engine to validate the form. But wait, the validation engine has no idea about the properties that exists on the file object created by the bodyparser. Hmmmm, let’s write some <strong>glue code</strong> between both of them.</li>
        <li>Wait, you also want to validate the email address to ensure it’s unique inside the database. Again, the validation engine has no idea about your Database ORM. So, another glue?</li>
      </ul>

      <p>Well, the reality is, a working real world application always have overlapping parts and without an integrated system, you will always find yourself writing more glue code than the actual code.</p>

      <p>Also, do not mistake integrated systems with hardcoded features. AdonisJS itself treats its ORM and the validation engine as two separate modules. The fact, we believe in integrated systems, we created extensible API’s, which allows the <span class="quote">module authors to write the glue code and not the module consumers</span>.</p>

      <h2>Optimize for Developer Experience</h2>
      <p>At AdonisJS, we put a lot of emphasis on improving the developer experience. Adopting Typescript, CLI commands and extensive documentation are all that contributes to this goal.</p>

      <p>Also, it is not only about the tooling, we give similar care to the aesthetics of the code as well. Every part of the framework feels like a member of the same family. In fact, this is one of the reasons for writing AdonisJS from ground up vs wrapping existing frameworks in our own packaging.</p>

      <h2>Features Highlights</h2>
      <p>
        Being a complete web framework, AdonisJS has ton of features that you can explore through documentation. Following are some of the handpicked one's.
      </p>

      <ul>
        <li>
          A well thought and robust SQL ORM. It comes with a Query builder, Migrations and Active Record Models.
        </li>
        <li>
          One of the most advanced HTTP router with features like: Route groups, subdomains, pattern matching and resourceful routes.
        </li>
        <li>
          Form validator that provides type information, along with the runtime validations. There is no need to maintain separate interfaces for HTTP request body.
        </li>
        <li>
          Inbuilt health check module that you can use with orchestrators like Kubernetes.
        </li>
        <li>
          A strong emphasis of Web security. We guard for websites against many of the common web attacks.
        </li>
      </ul>
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
