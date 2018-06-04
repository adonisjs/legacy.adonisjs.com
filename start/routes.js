'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

Route.on('/').render('home')
Route.get('docs/:version?/:permalink?', 'GuideController.render').as('guides')
Route.get('recipes/:version?/:permalink?', 'GuideController.renderRecipes').as('recipes')
Route.on('packages').render('packages')
Route.on('screencasts').render('screencasts')
Route.on('sponsors').render('sponsors')
