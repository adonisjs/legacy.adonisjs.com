---
 permalink: tutorials/first-steps/09-completing-tasks
 category: First Steps
 author: Chimezie Enyinnaya
---

# Completing tasks

Let’s give users a way to mark a task as completed.

## Creating the route

Just as we did with adding a new task, we start by adding the route:

```ts
// start/routes.ts

Route.patch('tasks/:id', 'TasksController.update')
```

Unlike the routes we have seen so far, this route takes the ID of the task to mark as completed as a parameter.

## Adding the complete button

We want the button for marking a task as completed to be next to each task. Replace the `<!-- mark task as complete button here -->` with the following code:

```html
<!-- resources/views/tasks/index.edge -->

<form action="{{ 'tasks/' + task.id + '?_method=PATCH' }}" method="POST">
  <button type="submit" class="button is-success is-outlined">
    <span class="icon is-small">
      <i class="fa fa-check" aria-hidden="true"></i>
    </span>
  </button>
</form>
```

Since the route for marking a task as completed takes the ID of the task as a parameter, we are attach the ID of task to the form action. Also, we pass the request method (`PATCH`) as query string. This is the AdonisJS way of doing method spoofing, since HTML forms aren’t capable of making requests other than `GET` and `POST`.

For this to work, we need to first allow method spoofing inside `config/app.ts`:

```ts
// config/app.ts

allowMethodSpoofing: true,
```

[https://res.cloudinary.com/adonis-js/image/upload/v1583320072/adonisjs.com/Screenshot_2020-02-20_Tasks_3_vdojcx.png](https://res.cloudinary.com/adonis-js/image/upload/v1583320072/adonisjs.com/Screenshot_2020-02-20_Tasks_3_vdojcx.png)

## Marking the task as completed

Next, we add the `update()` to `TaskController.ts`. Paste the code below into it just after the `store()`:

```ts
// app/Controllers/Http/TasksController.ts

public async update ({ params, session, response }: HttpContextContract) {
  const task = await Task.findOrFail(params.id)

  task.isCompleted = true
  await task.save()

  session.flash({ notification: 'Task updated!' })

  return response.redirect('back')
}
```

We first get the ID of the task from the `params` and then use it to retrieve the task from the database. Then we set `isCompleted` to `true` and persist the changes to the database. Lastly, we flash a success message and redirect back to the page.

[https://res.cloudinary.com/adonis-js/image/upload/v1583320073/adonisjs.com/Screenshot_2020-02-20_Tasks_4_ltpwaf.png](https://res.cloudinary.com/adonis-js/image/upload/v1583320073/adonisjs.com/Screenshot_2020-02-20_Tasks_4_ltpwaf.png)
