import plugin_gridsome_plugin_google_analytics_5 from "/Users/virk/code/adonis/adonisjs.com/frontend/node_modules/@gridsome/plugin-google-analytics/gridsome.client.js"
import plugin_gridsome_plugin_service_worker_8 from "/Users/virk/code/adonis/adonisjs.com/frontend/node_modules/gridsome-plugin-service-worker/gridsome.client.js"

export default [
  {
    run: plugin_gridsome_plugin_google_analytics_5,
    options: {"id":"UA-62429600-3"}
  },
  {
    run: plugin_gridsome_plugin_service_worker_8,
    options: {"networkFirst":{"routes":["/*"],"cacheName":"nf-v1","fileTypes":[]},"cacheFirst":{"routes":["/fonts","/img"],"cacheName":"cf-v1","fileTypes":[]},"cacheOnly":{"cacheName":"co-v1","routes":[],"fileTypes":[]},"networkOnly":{"cacheName":"no-v1","routes":[],"fileTypes":[]},"precachedRoutes":[],"staleWhileRevalidate":{"cacheName":"swr-v1","routes":[],"fileTypes":[]}}
  }
]
