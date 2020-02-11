const higlight = require('./extensions/highlight')
const args = process.argv.splice(2)

function wrapPre (code) {
  return `<pre><code>${code}</code></pre>`
}

if (args[0] === 'routes') {
  console.log(wrapPre(higlight(`/**
 * Inline Route Handler
 */
Route.get('/', async ({ view }) => {
  return view.render('home')
})

/**
 * Using Controller
 */
Route.get('posts', 'PostsController.index')
Route.post('posts', 'PostsController.store')`,
    'language-ts'
  )))
}

if (args[0] === 'controllers') {
  console.log(wrapPre(higlight(`import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostsController {
  /**
   * Return all posts
   */
  public async index () {
    return Post.all()
  }

  /**
   * Create a new post
   */
  public async store ({ request }: HttpContextContract) {
    const data = request.only([ 'title', 'body' ])
    const post = await Post.create(data)

    return post
  }
}`,
    'language-ts'
  )))
}

if (args[0] === 'models') {
  console.log(wrapPre(higlight(`import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public body: string
}`,
    'language-ts'
  )))
}
