---
permalink: guides/database/pagination
group: Database
---

# Pagination
Lucid has inbuilt support for **offset based pagination** using the Database query builder and Models both. By the end of this guide, you will know:

- How to paginate records using the `page` and the `limit` parameters.
- How to create pagination links inside your views.
- How to serialize pagination output for an API response.

## Paginating Records
The database and model query builders comes with the `paginate` method to allow offset based pagination. For example:

```ts
const page = request.input('page', 1)
const limit = 10

const posts = await Post.query().paginate(page, limit)
console.log(posts)
```

Following is the output of the `paginate` method.

```ts
SimplePaginator {
  rows: [
    Post {
     // ...
    },
    Post {
     // ...
    },
  ],
  totalNumber: '50',
  perPage: 10,
  currentPage: 1,
  qs: {},
  url: '/',
  firstPage: 1,
  isEmpty: false,
  total: 50,
  hasTotal: true,
  lastPage: 5,
  hasMorePages: true,
  hasPages: true
}
```

- The `paginate` method accepts a total of two arguments. The `page` number and the `limit` of records to fetch.
- Internally, we execute an additional count query to count the number of total rows.
- The output of the `paginate` method is an instance of the [SimplePaginator](https://github.com/adonisjs/lucid/blob/9876fdad6e7cdec70c6bad9edb6c4dc4bd5c7afd/src/Database/Paginator/SimplePaginator.ts) class.
- The `rows` property contains an array of rows fetched from the database.
- The other properties like `total`, `hasMorePages` is the pagination meta data.

## Displaying pagination links
In this section, we will use the pagination meta data to render the pagination links as anchor tags. The first step is to render the view and pass the posts collection to it.

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

class PostsController {
  public async index ({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const posts = await Post.query().paginate(page, limit)
    // highlight-start
    return view.render('posts/index', { posts })
    // highlight-end
  }
}
``` 

Next open `posts/index.edge` file and paste the following code snippet inside it.

```edge
<div>
  @each(post in posts.rows)
    <h1>{{ post.title }}</h1>
    <p> {{ excerpt(post.body, 200) }} </p>
  @endeach
</div>

<hr>

// highlight-start
<div>
  @each(anchor in posts.getUrlsForRange(1, posts.lastPage))
    <a href="{{ anchor.url }}">
      {{ anchor.page }}
    </a>
  @endeach
</div>
// highlight-end
```

The `getUrlsForRange` method returns an array of objects with following properties.

```ts
[
  {
    url: '/?page=1',
    page: 1,
    isActive: true,
    isSeperator: false,
  },
  {
    url: '/?page=2',
    page: 2,
    isActive: true,
    isSeperator: false,
  },
  // ...
]
```

If you notice carefully, the `url` property uses the `/` route. You can change this inside the controller before rendering the view, as shown in the following example.

```ts
const posts = await Post.query().paginate(page, limit)
// highlight-start
posts.baseUrl('/posts')
// highlight-end

return view.render('posts/index', { posts })
```

Finally, you must see the pagination links appear as shown in the following screenshot.

![](https://res.cloudinary.com/adonis-js/image/upload/v1596970976/adonisjs.com/lucid-pagination.png)

## Serializing to JSON
Serializing SimplePaginator instance to JSON is straight forward. Just call the `.toJSON` method and you will get JSON object as shown below:

```json
{
  "meta": {
    "total": 50,
    "per_page": 5,
    "current_page": 1,
    "last_page": 10,
    "first_page": 1,
    "first_page_url": "/?page=1",
    "last_page_url": "/?page=10",
    "next_page_url": "/?page=2",
    "previous_page_url": null
  },
  "data": []
}
```
