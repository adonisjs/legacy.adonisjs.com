export default [
  {
    path: "/guides/http/views-and-templates/",
    component: () => import(/* webpackChunkName: "page--src--templates--guides-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/templates/Guides.vue")
  },
  {
    path: "/guides/http/web-security/",
    component: () => import(/* webpackChunkName: "page--src--templates--guides-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/templates/Guides.vue")
  },
  {
    path: "/guides/http/sessions/",
    component: () => import(/* webpackChunkName: "page--src--templates--guides-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/templates/Guides.vue")
  },
  {
    path: "/guides/http/routing/",
    component: () => import(/* webpackChunkName: "page--src--templates--guides-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/templates/Guides.vue")
  },
  {
    path: "/guides/http/middleware/",
    component: () => import(/* webpackChunkName: "page--src--templates--guides-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/templates/Guides.vue")
  },
  {
    path: "/guides/http/introduction/",
    component: () => import(/* webpackChunkName: "page--src--templates--guides-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/templates/Guides.vue")
  },
  {
    path: "/guides/http/http-hooks/",
    component: () => import(/* webpackChunkName: "page--src--templates--guides-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/templates/Guides.vue")
  },
  {
    path: "/guides/http/form-submissions/",
    component: () => import(/* webpackChunkName: "page--src--templates--guides-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/templates/Guides.vue")
  },
  {
    path: "/guides/http/file-uploads/",
    component: () => import(/* webpackChunkName: "page--src--templates--guides-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/templates/Guides.vue")
  },
  {
    path: "/guides/http/exception-handling/",
    component: () => import(/* webpackChunkName: "page--src--templates--guides-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/templates/Guides.vue")
  },
  {
    path: "/guides/http/components-in-depth/",
    component: () => import(/* webpackChunkName: "page--src--templates--guides-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/templates/Guides.vue")
  },
  {
    path: "/guides/http/controllers/",
    component: () => import(/* webpackChunkName: "page--src--templates--guides-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/templates/Guides.vue")
  },
  {
    name: "404",
    path: "/404/",
    component: () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/node_modules/gridsome/app/pages/404.vue")
  },
  {
    name: "home",
    path: "/",
    component: () => import(/* webpackChunkName: "page--src--pages--index-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/src/pages/Index.vue")
  },
  {
    name: "*",
    path: "*",
    component: () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/Users/virk/code/adonis-final/adonisjs.com/frontend/node_modules/gridsome/app/pages/404.vue")
  }
]

