---
 permalink: tutorials/first-steps/07-adding-tasks
 category: First Steps
 author: Chimezie Enyinnaya
---

# Adding tasks

Let’s allow users to be able to add new tasks.

## Creating the route

Let’s start by creating the route for adding a new task:

```ts
// start/routes.ts

Route.post('tasks', 'TasksController.store')
```

## Creating the add task form

Next, let’s update the `index.edge` to include a form for adding a new task. Replace the `<!-- page content goes here -->` with the following code:

```html
<!-- resources/views/tasks/index.edge -->

<div class="box">
  <h2 class="title">New Task</h2>

  <form action="/tasks" method="POST">
    <div class="field has-addons">
      <div class="control is-expanded">
        <input class="input" type="text" name="title" placeholder="Task title">
      </div>
      <div class="control">
        <button type="submit" class="button is-primary">
          Add Task
        </button>
      </div>
    </div>
  </form>
</div>
```

We have a form with a single field for the title of the task and a submit button. Upon submission, the form will `POST` to the `tasks` route we created earlier for processing.

[https://res.cloudinary.com/adonis-js/image/upload/v1583320069/adonisjs.com/Screenshot_2020-02-20_Tasks_cywozg.png](https://res.cloudinary.com/adonis-js/image/upload/v1583320069/adonisjs.com/Screenshot_2020-02-20_Tasks_cywozg.png)

## Creating the store method

Next, we need to create the `store()`, whoch the `tasks` route will call on the `TasksController`. Open `TasksController.ts` and add the following code:

```ts
// app/Controllers/Http/TasksController.ts

public async store ({ request, session, response }: HttpContextContract) {
  // validate form input

  // persist task to database

  // flash a success message

  // redirect back to the page
}
```

## Validating form input

As good developer that we are, we want to validate form input to make sure users fills the form correctly.

```bash
node ace make:validator Task
```

This will create a new `Validators` directory and within it a `Task.ts` file. The file is heavily commented with examples to get us started with performing validation. Open it up and update as below (for brevity I have remove the comments):

```ts
// app/Validators/Task.ts

import { schema, validator } from '@ioc:Adonis/Core/Validator'

class TaskValidator {
  public schema = validator.compile(schema.create({
    title: schema.string(),
  }))

  public messages = {
    'title.required': 'Enter task title',
  }
}

export default new TaskValidator()
```

First, we define the schema for the `title` field, which must be a string (and required). Also, we define a custom validation message for the `required` rule for the `title` field.

Next, open `TasksController.ts` and add the following code:

```ts
// app/Controllers/Http/TasksController.ts

// add this at the top of the file
import TaskValidator from 'App/Validators/Task'

public async store ({ request, session, response }: HttpContextContract) {
  const data = await request.validate(TaskValidator)

  // persist task to database

  // flash a success message

  // redirect back to the page
}
```

First, we import the `TaskValidator`. Then making use of it, we validate the incoming request. Upon failed validation, AdonisJS will redirect back to the page with appropriate validation error messages. `data` will contain the validated data.

**Display validation message**
Let’s give our users a way to know that have filled the form incorrectly. Update the form as below:

```html
<!-- resources/views/tasks/index.edge -->

<form action="/tasks" method="POST">
  <div class="field has-addons">
    <div class="control is-expanded">
      <input
        class="input {{ flashMessages.has('errors.title') ? 'is-danger' : '' }}"
        type="text"
        name="title"
        placeholder="Task title">
    </div>
    <div class="control">
      <button type="submit" class="button is-primary">
          Add Task
      </button>
    </div>
  </div>

  @if (flashMessages.has('errors.title'))
    <p class="help is-danger">
      {{ flashMessages.get('errors.title') }}
    </p>
  @endif
</form>
```

If there’s an error for the `title` field, we add an `is-danger` class to the input field. To display the actual validation error message, we check if the there’s an error for the `title` field, then we get the error message.

[https://res.cloudinary.com/adonis-js/image/upload/v1583320346/adonisjs.com/screenshot-127.0.0.1_3333-2020.03.04-12_11_52_albnki.png](https://res.cloudinary.com/adonis-js/image/upload/v1583320346/adonisjs.com/screenshot-127.0.0.1_3333-2020.03.04-12_11_52_albnki.png)

## Creating the task

If the form is filled correctly, then we need to persist the task in the database. Update the `store()` as below:

```ts
// app/Controllers/Http/TasksController.ts

// add this at the top of the file
import Task from 'App/Models/Task'

public async store ({ request, session, response }: HttpContextContract) {
  const data = await request.validate(TaskValidator)

  await Task.create(data)

  // flash a success message

  // redirect back to the page
}
```

We first import the `Task` model. Then using the `create()` on the `Task` model, we persist the task to the database. `create()` accepts an object, which in our case is the validated data.

## Flashing a success message

Let’s give our users a feedback that their task was created successfully. Update the `store()` as below:

```ts
// app/Controllers/Http/TasksController.ts

public async store ({ request, session, response }: HttpContextContract) {
  const data = await request.validate(TaskValidator)

  await Task.create(data)

  session.flash({ notification: 'Task added!' })

  return response.redirect('back')
}
```

We flash a message to the session, which will only be available for a single request (that is, won’t be available once the page is refreshed). Lastly, we redirect back to the page.

Next, let’s display the success message. Add the following code inside `index.edge` immediately before `@endsection`:

```html
<!-- resources/views/tasks/index.edge -->

@if (flashMessages.has('notification'))
  <div class="notification is-success">
    {{ flashMessages.get('notification') }}
  </div>
@endif
```

We want to display the success message only if it’s available in the session. Then we get the success message that was flashed.

[https://res.cloudinary.com/adonis-js/image/upload/v1583320070/adonisjs.com/Screenshot_2020-02-20_Tasks_1_jved0b.png](https://res.cloudinary.com/adonis-js/image/upload/v1583320070/adonisjs.com/Screenshot_2020-02-20_Tasks_1_jved0b.png)
