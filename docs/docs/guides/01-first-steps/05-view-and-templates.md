---
permalink: guides/first-steps/views-and-templates
category: First Steps
---

# View & Templates

In the last part of this tutorial, you learned about the routing and the controllers. In this part, let's take a step forward and make use of the AdonisJS template engine for rendering HTML documents.

## What is a Template Engine?


AdonisJS uses Edge *__(a home grown template engine)__* for making HTML documents with dynamic data. In other words, using Edge you can create HTML elements 

Open the terminal and run the following command to create a new view.

```sh
node ace make:view posts/index
✔  create    resources/views/posts/index.edge
```

The view templates live inside the `resources/views` directory. To properly organize your code, you are free to create any number of sub directories here, just like we created the `posts` directory.

Next, open the newly created file and paste the following code snippet inside it.

```edge{}{resources/views/posts/index.edge}
<html>
  <head></head>
  <body>
    <div>
      <ul>
        @each(post in posts)
          <li>
            <a href="/posts/{{ post.id }}">{{ post.title }}</a>
            <p> {{ post.description }} </p>
          </li>
        @endeach
      </ul>
    </div>
  </body>
</html>
```

- The edge templates have `.edge` extension. You can write standard HTML inside them along with the edge markup.
- The `@each` is called the **each tag** and we use it to loop over an array of values. In the above example, we loop over an array of `posts` to display an `li` for each post.
- The mustache braces `{{ }}` are used to write [Javascript expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions). You can write almost every Javascript expression inside them.

Finally, open the `PostsController` and replace the `index` method with the following code snippet.

```ts{}{app/Controllers/Http/PostsController.ts}
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {
  /**
   * An array of posts. Later we will fetch them from the
   * database.
   */
  private posts = [
    {
      id: '1',
      title: 'Adonis 101',
      description: 'Welcome to AdonisJS!',
    },
    {
      id: '2',
      title: 'Deployments 101',
      description: 'Time to deploy your application!',
    },
  ]

  /**
   * Return all posts
   */
  // highlight-start
  public async index ({ view }: HttpContextContract) {
    return view.render('posts/index', { posts: this.posts })
  }
  // highlight-end
}
```

After starting the development server `(node ace serve --watch)` if you visit [http://localhost:3333](http://localhost:3333), you must see a list of blog posts being returned as HTML.

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1580962189/adonis-view-templates-demo.png)

### How Templates Work?

As mentioned earlier, AdonisJS uses Edge *(a home grown template engine)* for rendering dynamic HTML. In the league of template engines, Edge stands on the side of logical template engines. In other words, you can write logic within your templates. For example:

[codegroup]
```edge{}{If block}
@if(post.isPublic)
  // HTML for the post goes here
@endif
```

```edge{}{Components}
@!component('button', {
  type: 'primary',
  size: 'large',
})
```

```edge{}{Javascript Expressions}
<span> {{
  posts.map((post) => {
    return `Received ${post.comments.length} comments`
  })
}} </span>
```
[/codegroup]

Coming back to the blog example:

- You can render views from your controllers using the `view.render` method.
- It accepts a total of two arguments, first is the template path (relative from the `resources/views` directory) and second is the data you want to share with the view.
- In the above example, we share an object with an array of posts `{ posts: this.posts }`

Now let's repeat the same steps and create a view to display an individual blog post.

```sh
node ace make:view posts/show
✔  create    resources/views/posts/show.edge
```

Open the newly created file in your text editor and paste following contents inside it.

```edge{}{resources/views/posts/show.edge}
<html>
  <head></head>
  <body>
    <div>
      <p><a href="/"> Back to all posts </a></p>

      <h1>{{ post.title }}</h1>
      <p>{{ post.description }}</p>
    </div>
  </body>
</html>
```

Finally, open the `PostsController` and update the `show` method to return the view this time.

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {
  /**
   * An array of posts. Later we will fetch them from the
   * database.
   */
  private posts = [
    {
      id: '1',
      title: 'Adonis 101',
      description: 'Welcome to AdonisJS!',
    },
    {
      id: '2',
      title: 'Deployments 101',
      description: 'Time to deploy your application!',
    },
  ]

  /**
   * Return all posts
   */
  public async index ({ view }: HttpContextContract) {
    return view.render('posts/index', { posts: this.posts })
  }

  /**
   * Display a single post using it's id
   */
  // highlight-start
  public async show ({ params, response, view }: HttpContextContract) {
    const matchingPost = this.posts.find((post) => post.id === params.id)

    if (!matchingPost) {
      return response.status(404).send('Post not found')
    }

    return view.render('posts/show', { post: matchingPost })
  }
  // highlight-end
}
```

Now, refresh the page in the browser and must be able to navigate between the blog posts.

[video url="https://res.cloudinary.com/adonis-js/video/upload/q_100/v1580962130/adonisjs.com/adonis-blog-views-nav.mp4", controls]

## Public Assets
The Web pages we have created so far are not styled. So, let's take a step further and write some css to improve the aesthetics of our blog.

In AdonisJS, the static/public assets like **CSS files**, **images**, **frontend Javascript** and so on, lives inside the `public` directory of your project root. The files from this directory will be served directly without any restrictions.

For demonstration, let's create a dummy css file and access it from the browser.

1. Open the terminal and run the following commands
   ```sh
   mkdir -p public
   echo "body {\n color: #000;\n}" > public/style.css
   ```
2. Start the development server `node ace serve --watch` and visit [http://localhost:3333/style.css](http://localhost:3333/style.css) to see the contents of the CSS file.

Now, that Open the newly created css file inside your text editor and replace it's contents with the following code snippet.

```css{}{public/style.css}
@import url('https://fonts.googleapis.com/css?family=Merriweather:400,700&display=swap');

* {
  margin: 0;
  padding: 0;
}

html {
  font-size: 10px;
}

body {
  color: #444;
  font-family: 'Merriweather', serif;
  font-size: 1.7rem;
  line-height: 1.7;
}

.container {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 30px;
}

.post {
  margin: 30px 0 60px;
}

.post .title a {
  font-size: 3rem;
  color: #e30000;
  text-decoration: none;
}

.post .title a:hover {
  border-bottom: 3px solid #e30000;
}

.post .meta {
  margin: 2px 0 30px;
  font-size: 1.2rem;
  color: #999;
}

aside.nav {
  padding: 30px 30px;
}

aside.nav a {
  color: #999;
}
```

Next, you will have re-structure the HTML a bit and apply the required css classes on it. Let's do it one by one for both the templates.

```edge{3}{resources/views/posts/index.edge}
<html>
  <head>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <div class="container">
      @each(post in posts)
        <div class="post">
          <h2 class="title">
            <a href="/posts/{{ post.id }}">{{ post.title }}</a>
          </h2>
          <p class="meta"></p>
          <p> {{ post.description }} </p>
        </div>
      @endeach
    </div>
  </body>
</html>
```

```edge{3}{resources/views/posts/show.edge}
<html>
  <head>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <aside class="nav">
      <p><a href="/"> &larr; Back to all posts </a></p>
    </aside>
    <div class="container">
      <div class="post">
        <h2 class="title">
          <a href="">
            {{ post.title }}
          </a>
        </h2>
        <p class="meta"></p>
        <p>{{ post.description }}</p>
      </div>
    </div>
  </body>
</html>
```
