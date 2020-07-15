/*
|--------------------------------------------------------------------------
| Site header
|--------------------------------------------------------------------------
|
| The following array contains the nav items for the website header. Each
| entry can contain only a single list of nested children
|
*/
exports.header = [
  {
    title: 'Why AdonisJS',
    permalink: 'why-adonisjs',
    children: [],
    isExternal: false,
  },
  {
    title: 'Guides',
    permalink: '/guides/quick-start',
    children: [],
    isExternal: false,
  },
  {
    title: 'Blog',
    permalink: '/blog',
    children: [],
    isExternal: false,
  },
  {
    title: 'Community',
    permalink: '',
    isExternal: false,
    children: [
      {
        title: 'Github',
        permalink: 'https://github.com/adonisjs',
        isExternal: true,
      },
      {
        title: 'Discussions',
        permalink: 'https://github.com/adonisjs/core/discussions',
        isExternal: true,
      },
      {
        title: 'Twitter',
        permalink: 'https://twitter.com/adonisframework',
        isExternal: true,
      }
    ]
  },
]

/*
|--------------------------------------------------------------------------
| Website footer
|--------------------------------------------------------------------------
|
| The following array contains the nav items for the website footer. Each
| entry can contain only a single list of nested children.
|
*/
exports.footer = [
  {
    title: 'Project',
    permalink: '',
    isExternal: false,
    children: [
      {
        title: 'Roadmap',
        permalink: 'https://trello.com/b/3klaHbfP',
        children: [],
        isExternal: true,
      },
      {
        title: 'Changelog',
        permalink: '/releases/core/preview-rc-5',
        isExternal: false,
      },
    ]
  },
  {
    title: 'About',
    permalink: '',
    isExternal: false,
    children: [
      {
        title: 'Security',
        permalink: '/security',
        isExternal: false,
      },
      {
        title: 'Code of Conduct',
        permalink: '/code-of-conduct',
        isExternal: false,
      },
      {
        title: 'Release Process',
        permalink: '/release-process',
        isExternal: false,
      },
    ]
  },
]

/*
|--------------------------------------------------------------------------
| Showcase tabs
|--------------------------------------------------------------------------
|
| Following is an array of showcase tabs with title and their codeblocks.
| The codeblocks are pre-formatted using the Dimer API and manually
| copied to this file.
|
| Feel free to reach us on Github, if you want to make modifications
| to the code blocks and confused on how to approach it.
|
*/
exports.homePageShowCaseTabs = [
  {
    title: 'Routes',
    code: `<pre><code><span class="token comment">/**
 * Inline Route Handler
 */</span>
Route<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'/'</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> view <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> view<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token string">'home'</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token comment">/**
 * Using Controller
 */</span>
Route<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'posts'</span><span class="token punctuation">,</span> <span class="token string">'PostsController.index'</span><span class="token punctuation">)</span>
Route<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'posts'</span><span class="token punctuation">,</span> <span class="token string">'PostsController.store'</span><span class="token punctuation">)</span></code></pre>`
  },
  {
    title: 'Controllers',
    code: `<pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> HttpContextContract <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@ioc:Adonis/Core/HttpContext'</span>
<span class="token keyword">import</span> Post <span class="token keyword">from</span> <span class="token string">'App/Models/Post'</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">PostsController</span> <span class="token punctuation">{</span>
  <span class="token comment">/**
   * Return all posts
   */</span>
  <span class="token keyword">public</span> <span class="token keyword">async</span> <span class="token function">index</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> Post<span class="token punctuation">.</span><span class="token function">all</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token comment">/**
   * Create a new post
   */</span>
  <span class="token keyword">public</span> <span class="token keyword">async</span> <span class="token function">store</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> request <span class="token punctuation">}</span><span class="token operator">:</span> HttpContextContract</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> data <span class="token operator">=</span> request<span class="token punctuation">.</span><span class="token function">only</span><span class="token punctuation">(</span><span class="token punctuation">[</span> <span class="token string">'title'</span><span class="token punctuation">,</span> <span class="token string">'body'</span> <span class="token punctuation">]</span><span class="token punctuation">)</span>
    <span class="token keyword">const</span> post <span class="token operator">=</span> <span class="token keyword">await</span> Post<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>

    <span class="token keyword">return</span> post
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>`
  },
  {
    title: 'Models',
    code: `<pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> BaseModel<span class="token punctuation">,</span> column <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@ioc:Adonis/Lucid/Orm'</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Post</span> <span class="token keyword">extends</span> <span class="token class-name">BaseModel</span> <span class="token punctuation">{</span>
  @<span class="token function">column</span><span class="token punctuation">(</span><span class="token punctuation">{</span> isPrimary<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token keyword">public</span> id<span class="token operator">:</span> <span class="token builtin">number</span>

  @<span class="token function">column</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">public</span> title<span class="token operator">:</span> <span class="token builtin">string</span>

  @<span class="token function">column</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">public</span> body<span class="token operator">:</span> <span class="token builtin">string</span>
<span class="token punctuation">}</span></code></pre>`
  }
]

exports.edgeShowCaseTabs = [
  {
    title: 'Conditionals',
    code: `<pre><code><span class="token other"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span></span>
<span class="token tag"><span class="token function">  @if</span>(user)</span>
    <span class="token other"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span> Hello</span> <span class="token mustache"><span class="token punctuation">{{</span> user.username <span class="token punctuation">}}</span></span> <span class="token other"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span></span>
<span class="token tag"><span class="token function">  @endif</span></span>
<span class="token other"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span></span></code></pre>`
  },
  {
    title: 'Multiline Mustache',
    code: `<pre><code><span class="token other"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>
  {{
    user<span class="token punctuation">.</span>earnings<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">earning</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> earning <span class="token operator">*</span> <span class="token number">100</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">','</span><span class="token punctuation">)</span>
  }}
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span></span></code></pre>`
  },
  {
    title: 'Components',
    code: `<pre><code><span class="token other"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span></span>
<span class="token tag"><span class="token function">  @component</span>(<span class="token string"><span class="token punctuation">'</span>components/modal<span class="token punctuation">'</span></span>, { title: <span class="token string"><span class="token punctuation">'</span>Are you sure?<span class="token punctuation">'</span></span> })</span><span class="token tag"><span class="token function">
    @slot</span>(<span class="token string"><span class="token punctuation">'</span>body<span class="token punctuation">'</span></span>)</span>
      <span class="token other"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span> Select yes, will delete the blog post permanently <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span></span>
<span class="token tag"><span class="token function">    @endslot</span></span><span class="token tag"><span class="token function">

    @slot</span>(<span class="token string"><span class="token punctuation">'</span>actions<span class="token punctuation">'</span></span>)</span>
      <span class="token other"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span><span class="token punctuation">></span></span> Cancel <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span><span class="token punctuation">></span></span> Yes, delete it <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span></span>
<span class="token tag"><span class="token function">    @endslot</span></span><span class="token tag"><span class="token function">
  @endcomponent</span></span>
<span class="token other"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span></span></code></pre>`
  }
]

/*
|--------------------------------------------------------------------------
| Primary Features
|--------------------------------------------------------------------------
|
| The primary features displayed on the website home page. We display a
| total of 3 main features with their svg icons.
|
*/
exports.primaryFeatures = [
  {
    title: 'Type-safe',
    icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g transform="translate(1.25 1.25)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path d="M37.5 17.5C37.5 7.5 28.683 0 18.75 0 8.818 0 .71 7.73.062 17.5H15v6.25C15 29.962 20.038 35 26.25 35S37.5 29.962 37.5 23.75V17.5z" stroke="#17161A"/><path stroke="#5A45FF" d="M0 22.5v10L12.5 30"/><circle stroke="#5A45FF" cx="26.25" cy="23.75" r="3.75"/></g></g></svg>`,
    body: `Type safety is baked into the framework with first class support for TypeScript. No need to install any additional build tools, TypeScript just works with AdonisJS.`
  },
  {
    title: 'Extensible',
    icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path d="M21.667 8.333h6.666a3.333 3.333 0 013.334 3.334v6.666M8.333 21.667v6.666a3.333 3.333 0 003.334 3.334h6.666" stroke="#17161A"/><path stroke="#5A45FF" d="M1.667 1.667H15V15H1.667zM25 25h13.333v13.333H25z"/></g></g></svg>`,
    body: `Instead of writing the same code across multiple projects, build your own first class primitives on top of the framework core.`
  },
  {
    title: 'Ton of Packages',
    icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path stroke="#17161A" d="M3.333 3.334H15V15H3.333z"/><path stroke="#5A45FF" d="M30.833.918l8.25 8.25-8.25 8.25-8.25-8.25z"/><path stroke="#17161A" d="M25 25h11.667v11.667H25zM3.333 25H15v11.667H3.333z"/></g></g></svg>`,
    body: `Stop spending hours to find the perfect NPM packages. AdonisJS comes with a ton of first party packages with unified API semantics.`
  }
]

/*
|--------------------------------------------------------------------------
| Secondary Features
|--------------------------------------------------------------------------
|
| The list of secondary features on the home page.
|
*/
exports.secondaryFeatures = [
  {
    title: 'HTTP',
    features: [
      {
        title: 'Router',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" stroke-width="3.333"><path stroke="#17161A" d="M5.667 24.667l6.666 6.666L19 24.667M12.333 31.333V9.423"/><path stroke="#5A45FF" d="M22.333 14.667L29 8l6.667 6.667M29 8v21.91"/></g></g></svg>`,
        body: `AdonisJS ships with one of the fastest HTTP router without compromising its features set. Features like Route groups, Subdomains, Resourceful routes are all baked in.`,
      },
      {
        title: 'Form Validator',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g transform="translate(1 5)"><rect stroke="#5A45FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" x=".667" y=".667" width="37" height="13.333" rx="1"/><circle fill="#17161A" cx="7.5" cy="7.5" r="2.5"/><circle fill="#17161A" cx="15.5" cy="7.5" r="2.5"/><circle fill="#17161A" cx="23.5" cy="7.5" r="2.5"/><circle fill="#17161A" cx="31.5" cy="7.5" r="2.5"/><rect stroke="#17161A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" x="17.333" y="21" width="20" height="8" rx="1"/></g></g></svg>`,
        body: `Being a TypeScript first framework, AdonisJS exposes the API to define runtime validations on the request body and also extract the static type information at the same time.`,
      },
      {
        title: 'Template Engine',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path stroke="#17161A" d="M5.652 5.652h9.13v10.435h-9.13z"/><path stroke="#5A45FF" d="M22.609 5.652h11.739v28.696H22.609z"/><path stroke="#17161A" d="M5.652 23.913h9.13v10.435h-9.13z"/></g></g></svg>`,
        body: `In the era of SPA's, sometimes writing server rendered Apps is fun. The template engine (Edge) has got all the features you need to construct dynamic webpages.`,
      },
      {
        title: 'JSON Serializers',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round"><path stroke="#17161A" stroke-width="2.5" d="M35 35.059V11.25l-10-10H5v33.809"/><path stroke="#5A45FF" stroke-width="2.5" d="M25 1.25v10h10z"/><path stroke="#17161A" stroke-width="2.5" d="M5 33.75v5h30v-5"/><path d="M10.095 30.244a3.946 3.946 0 01-.845-.087v-1.278c.089.015.182.035.281.055.106.022.214.033.322.032a.658.658 0 00.578-.246c.138-.258.198-.55.174-.84v-5.63h1.638v5.489a2.834 2.834 0 01-.537 1.874 1.993 1.993 0 01-1.61.631zM17.249 26.397c.006.342-.088.677-.27.964a1.78 1.78 0 01-.778.655 2.837 2.837 0 01-1.192.233 4.753 4.753 0 01-.958-.082 3.483 3.483 0 01-.801-.285v-1.405c.293.154.6.275.919.36.285.083.58.127.876.13.175.014.35-.028.5-.12a.377.377 0 00.096-.52.768.768 0 00-.207-.18 9.166 9.166 0 00-.76-.376 3.602 3.602 0 01-.84-.503 1.536 1.536 0 01-.414-.559 1.883 1.883 0 01-.135-.746c-.021-.49.193-.96.575-1.258a2.498 2.498 0 011.58-.45c.626.007 1.242.15 1.81.418l-.473 1.218a3.367 3.367 0 00-1.384-.376.712.712 0 00-.438.109.33.33 0 00-.137.267.39.39 0 00.174.307c.301.19.617.357.945.496.395.154.747.404 1.026.728.198.284.298.627.286.975z" fill="#5A45FF" fill-rule="nonzero"/><path d="M23.242 25.248a3.027 3.027 0 01-.762 2.231 3.02 3.02 0 01-2.23.764 3.014 3.014 0 01-2.22-.768 3.012 3.012 0 01-.771-2.24 2.998 2.998 0 01.768-2.218 3.032 3.032 0 012.23-.76 3.017 3.017 0 012.226.76c.548.623.82 1.423.759 2.231zm-4.233 0c0 1.124.413 1.686 1.24 1.686a1.09 1.09 0 00.937-.407c.234-.387.34-.832.305-1.277a2.162 2.162 0 00-.309-1.287 1.081 1.081 0 00-.924-.416c-.832-.001-1.248.566-1.25 1.701zM30.246 28.25h-2.23l-2.3-4.227h-.033c.055.664.082 1.172.082 1.523v2.704H24.25v-6h2.222l2.298 4.17h.025c-.04-.605-.06-1.091-.06-1.457V22.25h1.515l-.004 6z" fill="#5A45FF" fill-rule="nonzero"/></g></g></svg>`,
        body: `AdonisJS is the only Node.js framework that has first class support for JSON:API. If your team has settled on using JSON:API, then adding it to backend is just a matter of few minutes.`,
      }
    ],
  },
  {
    title: 'Database',
    features: [
      {
        title: 'SQL First',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" transform="translate(4 3.333)" stroke-width="2.5"><ellipse stroke="#17161A" cx="16" cy="5" rx="15" ry="5"/><path d="M31 16.667c0 2.766-6.667 5-15 5s-15-2.234-15-5" stroke="#5A45FF"/><path d="M1 17v11.333c0 2.767 6.667 5 15 5s15-2.233 15-5V17" stroke="#5A45FF"/><path d="M1 5v7.333M31 5v7.333" stroke="#17161A"/></g></g></svg>`,
        body: `AdonisJS is one of the few Node.js frameworks to treat SQL as the first class citizen. We support all the main stream SQL servers like PostgreSQL, MySQL, MSSQL, MariaDB and many more.`,
      },
      {
        title: 'Active Record ORM',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><rect stroke="#17161A" transform="rotate(-45 20 20)" x="5.858" y="5.858" width="28.284" height="28.284" rx="3.75"/><path stroke="#5A45FF" d="M13.75 16.25h12.5M13.75 23.75h12.5"/></g></g></svg>`,
        body: `Inspired by Rails and Laravel, AdonisJS ships with an implementation of Active Record ORM. The ORM offers a rich API for running complex SQL queries and managing relationships.`,
      },
      {
        title: 'Migrations',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path stroke="#5A45FF" d="M20 37.5v-20M13.75 23.75L20 17.5l6.25 6.25"/><path d="M25 28.75h7.5c3.5-.375 6.25-3.25 6.25-6.875S36 15.375 32.5 15c-.625-6.25-6-11.25-12.5-11.25-5.625 0-10.375 3.75-12 8.875-3.75.625-6.75 4-6.75 8 0 4.25 3.25 7.75 7.5 8.125H15" stroke="#17161A"/></g></g></svg>`,
        body: `AdonisJS has in-built support for database migrations. As your application evolves, you can <strong>create</strong> and <strong>alter</strong> the database schema using the JavaScript code.`,
      },
      {
        title: 'Seeds & Factories',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle id="a" cx="8" cy="8" r="8"/></defs><g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(2.333 22.333)" stroke-width="2.5"><rect stroke="#17161A" x=".667" y=".667" width="29" height="14" rx="3.333"/><path stroke="#5A45FF" d="M6.667 7.667h7M22.667 7.667h1"/></g><g transform="translate(2.33 8)" stroke-width="2.5"><rect stroke="#17161A" x=".667" y=".667" width="29" height="14" rx="3.333"/><path stroke="#5A45FF" d="M6.667 7.667h7M26.667 7.667h1"/></g><g transform="translate(22 2)"><use stroke="#17161A" stroke-width="4" fill="#FFF" xlink:href="#a"/><circle stroke="#FFF" stroke-width="2.1" cx="8" cy="8" r="9.05"/></g><path stroke="#5A45FF" stroke-width="2.5" d="M30 7v6M27 10h6"/></g></svg>`,
        body: `No need to share SQL dump with your team mates anymore. Instead, use the database seeders to quickly seed your database with dummy data.`,
      }
    ],
  },
  {
    title: 'Auth',
    features: [
      {
        title: 'Multi Driver Auth',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path stroke="#5A45FF" d="M13.75 20h12.5v8.75h-12.5zM16.25 20v-3.75A3.75 3.75 0 0120 12.5h0a3.75 3.75 0 013.75 3.75V20"/><path d="M35 23.75c0 8.284-6.716 15-15 15-8.284 0-15-6.716-15-15V6.25L20 2.5l15 3.75v17.5z" stroke="#17161A"/></g></g></svg>`,
        body: `There is no one size fit authentication process for all apps and hence AdonisJS has let you choose between Sessions, Opaque tokens and JWT tokens.`,
      },
      {
        title: 'InBuilt RBAC',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path d="M24.436 29.483l-6.156-1.76a1.25 1.25 0 01-.895-1.025l-.519-3.632a7.5 7.5 0 004.384-6.816v-3.435A7.707 7.707 0 0013.981 5a7.5 7.5 0 00-7.731 7.5v3.75a7.5 7.5 0 004.384 6.816l-.519 3.632c-.07.488-.42.89-.895 1.024l-6.156 1.76a2.5 2.5 0 00-1.814 2.404v4.364h25v-4.364a2.5 2.5 0 00-1.814-2.403z" stroke="#17161A"/><path d="M31.25 36.25h7.5v-6.797a2.5 2.5 0 00-1.894-2.427l-7.291-1.822a1.25 1.25 0 01-.934-1.037l-.515-3.6A7.5 7.5 0 0032.5 13.75v-3.435A7.707 7.707 0 0025.231 2.5a7.471 7.471 0 00-3.981 1" stroke="#5A45FF"/></g></g></svg>`,
        body: `Role based access control is baked into the framework, providing you the fine grained API for implementing authorization across the application.`,
      },
    ],
  },
  {
    title: 'Security',
    features: [
      {
        title: 'CSRF Protection',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path d="M20 1.25C9.625 1.25 1.25 9.625 1.25 20S9.625 38.75 20 38.75 38.75 30.375 38.75 20 30.375 1.25 20 1.25z" stroke="#17161A"/><path d="M6.25 20c0-7.563 6.188-13.75 13.75-13.75 2.875 0 5.563.875 7.813 2.438L8.688 27.811A13.62 13.62 0 016.25 20zM20 33.75a13.62 13.62 0 01-7.813-2.438l19.126-19.125A13.62 13.62 0 0133.75 20c0 7.563-6.188 13.75-13.75 13.75z" stroke="#5A45FF"/></g></g></svg>`,
        body: `Cross-site request forgery (CSRF) protection is built into the framework to keep your applications safe from unintended form submissions.`,
      },
      {
        title: 'Web Shield',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path d="M20 2.5C15 6.25 7.5 8.75 2.5 8.75 2.5 20.416 8.334 32.5 20 37.5c11.666-5 17.5-17.084 17.5-28.75-5 0-12.5-2.5-17.5-6.25z" stroke="#17161A"/><path stroke="#5A45FF" d="M13.361 20h13.278M20 28.5v-17"/></g></g></svg>`,
        body: `THe shield package of AdonisJS comes with a suite of guards to protect your applications from common attacks like <strong>XSS</strong>, <strong>clickjacking</strong>, <strong>script injection</strong> and many more.`,
      },
      {
        title: 'CORS Enabled',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path stroke="#5A45FF" d="M13.75 20h12.5v8.75h-12.5zM16.25 20v-3.75A3.75 3.75 0 0120 12.5h0a3.75 3.75 0 013.75 3.75V20"/><path d="M35 23.75c0 8.284-6.716 15-15 15-8.284 0-15-6.716-15-15V6.25L20 2.5l15 3.75v17.5z" stroke="#17161A"/></g></g></svg>`,
        body: `AdonisJS let you manage the security settings for <strong>Cross Origin HTTP Requests</strong> to make sure that only authorized and valid requests are making their way through the application.`,
      }
    ],
  },
  {
    title: 'And Much More',
    features: [
      {
        title: 'Health Checks',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"><path d="M34.75 33.75v1a2.5 2.5 0 01-2.5 2.5h-25a2.5 2.5 0 01-2.5-2.5v-1" stroke="#5A45FF"/><path stroke="#17161A" d="M14.75 5.75v-3.5h10v3.5M4.75 9.75h30a2.5 2.5 0 012.5 2.5v17.5h-35v-17.5a2.5 2.5 0 012.5-2.5z"/><path stroke="#5A45FF" d="M19.75 14.75v10M14.75 19.75h10"/></g></g></svg>`,
        body: `In the era of containers and orchestration, health checks plays an important role to effectively manage resources. AdonisJS comes with handful of in-built health checks.`,
      },
      {
        title: 'Unified Profiler',
        icon: `<svg class="feature-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h40v40H0z"/><g stroke-linecap="round" stroke-linejoin="round" transform="translate(3.125 3.125)" stroke="#000" stroke-width="2.5"><path d="M33.75 33.75L23.473 23.473"/><circle cx="13.75" cy="13.75" r="13.75"/></g><g><path d="M9 9h16v16H9z"/><g stroke-linecap="round" stroke-linejoin="round" stroke="#5A45FF" stroke-width="2.5"><path d="M11.667 20.333l4-4-4-4M17 21.666h5.334"/></g></g></g></svg>`,
        body: `The framework comes with an embeddable profiler (with minimum overhead) to time different areas of your application and find potential bottlenecks`,
      }
    ],
  }
]
