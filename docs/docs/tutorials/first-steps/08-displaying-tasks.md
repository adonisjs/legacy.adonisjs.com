---
 permalink: tutorials/first-steps/08-displaying-tasks
 category: First Steps
 author: Chimezie Enyinnaya
---

# Displaying tasks

We have been able to add new tasks. Now, let’s display the tasks that have been added. Update the `index()` in the `TasksController` as below:

```ts
// app/Controllers/Http/TasksController.ts

public async index ({ view }: HttpContextContract) {
  const tasks = await Task.query().where('isCompleted', '=', false)

  return view.render('tasks.index', { tasks })
}
```

First, we make the `index()` an `async` method because we’ll be performing an asynchronous operation. Then using the `Task` model, we fetch all tasks that haven’t been marked as completed. Lastly, we pass the tasks to the view as the second argument to the view’s `render()`.

**Rendering data in view**
We have been able to pass the tasks down to the view, all we need to do now is display the tasks. Add the following code inside `index.edge` immediately after `@endif`:

```html
<!-- resources/views/tasks/index.edge -->

<div class="box">
  <h1 class="title">Tasks</h1>

  <table class="table is-bordered is-striped is-narrow is-fullwidth">
    <thead>
      <tr>
        <th>SN</th>
        <th>Title</th>
        <th colspan="2">Action</th>
      </tr>
    </thead>
    <tbody>
      @each(task in tasks)
        <tr>
          <td>
            {{ ($loop.index + 1) }}
          </td>
          <td>
            {{ task.title }}
          </td>
          <td>
            <!-- mark task as complete button here -->
          </td>
          <td>
            <!-- delete task button here -->
          </td>
        </tr>
      @else
        <tr>
          <td colspan="3" class="has-text-centered">No task created yet!</td>
        </tr>
      @endeach
    </tbody>
  </table>
</div>
```

We display the tasks in a table. We loop through the `tasks` array using Edge’s `each` tag. If there are no tasks, we display an appropriate message. For the **SN** of the tasks, we are using the `index` property of Edge’s `$loop` variable. The `index` property holds the iteration index, which starts from 0, hence the addition of 1.

[https://res.cloudinary.com/adonis-js/image/upload/v1583320071/adonisjs.com/Screenshot_2020-02-20_Tasks_2_icyz9u.png](https://res.cloudinary.com/adonis-js/image/upload/v1583320071/adonisjs.com/Screenshot_2020-02-20_Tasks_2_icyz9u.png)
