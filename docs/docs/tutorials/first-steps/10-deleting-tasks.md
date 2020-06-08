---
permalink: tutorials/first-steps/deleting-tasks
category: First Steps
group: Tutorials
author: Chimezie Enyinnaya
---

# Deleting tasks

Lastly, let’s give users a way to delete a task.

## Creating the route

This will be similar to the route for marking a task as completed:

```ts
// start/routes.ts

Route.delete('tasks/:id', 'TasksController.destroy')
```

## Adding the delete button

Just as the mark as completed button, we want the delete button to be next to each task as well. Replace the `<!-- delete task button here -->` with the following code:

```html
<!-- resources/views/tasks/index.edge -->

<form action="{{ 'tasks/' + task.id + '?_method=DELETE' }}" method="POST">
  <button type="submit" class="button is-danger is-outlined">
    <span class="icon is-small">
      <i class="fa fa-trash" aria-hidden="true"></i>
    </span>
  </button>
</form>
```

Again, we are attach the ID of task to the form action. Also, we pass the request method (`DELETE`) as query string.

[https://res.cloudinary.com/adonis-js/image/upload/v1583320074/adonisjs.com/Screenshot_2020-02-20_Tasks_5_ag7fle.png](https://res.cloudinary.com/adonis-js/image/upload/v1583320074/adonisjs.com/Screenshot_2020-02-20_Tasks_5_ag7fle.png)

## Deleting the task

Next, we add the `destroy()` to `TaskController.ts`. Paste the code below into it just after the `store()`:

```ts
// app/Controllers/Http/TasksController.ts

public async destroy ({ params, session, response }: HttpContextContract) {
  const task = await Task.findOrFail(params.id)
  await task.delete()

  session.flash({ notification: 'Task deleted!' })

  return response.redirect('back')
}
```

We fetch the task with the ID matching that ID in `params` from database. Then we delete the task. Lastly, we flash a success message and redirect back to the page.

[https://res.cloudinary.com/adonis-js/image/upload/v1583320075/adonisjs.com/Screenshot_2020-02-20_Tasks_6_saqtxd.png](https://res.cloudinary.com/adonis-js/image/upload/v1583320075/adonisjs.com/Screenshot_2020-02-20_Tasks_6_saqtxd.png)
