---
permalink: guides/model-relations/many-to-many
category: Relationships
group: Database
---

# Many to Many
The `ManyToMany` relationship allows an entity have a relationship with multiple other entities. For example: A **user has many skills**, and the **same skill can also belongs to many different users**.

When working with a many to many relationship, you will always need a 3rd table (commonly known as a pivot table) to represent the relationship.

## When to use a many to many relationship?

Let's imagine, you have a `users` table and a `skills` table and you decided to put the `user_id` inside the `skills` table.

```markup{}{skills}
+----------------------+
| skills               |
+------------+---------+
| id         | int     |
+------------+---------+
| user_id    | int     |
+------------+---------+
| name       | varchar |
+------------+---------+
```

With the above table, you will have to create a new skill for every user. Also, the `skills` table will have many duplicate skills one for each user. To solve this problem:

- You should remove the `user_id` from the `skills` table and keep it as an independent database table.
- By making the table independent, you can pre-fill the skills table and also use it to create a dropdown for selecting skills.
- Create a new pivot table called the `skill_user`. This table will hold the ids to create a relationship with a user and a skill.

You will end up with something similar to the following table structure.

![](https://res.cloudinary.com/adonis-js/image/upload/q_100/v1588083600/adonisjs.com/many-to-many.png)

## Relationship models
Just like the other relationships, you will have to create just two models. The pivot table doesn't need a different model.

Following is an example of the User model.

```ts{}{app/Models/User.ts}
import { column, BaseModel, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Skill from 'App/Models/Skill'

export default class User extends BaseModel {
  // highlight-start
  @manyToMany(() => Skill)
  public skills: ManyToMany<typeof Skill>
  // highlight-end
}
```

The Skill model will have a set of standard properties, since there isn't any foreign key in the `skills` table.

```ts{}{app/Models/Skill.ts}
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class Skill extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
}
```

## Relationship keys
A many to many relation relies on many different keys to properly setup the relationship. All of these are keys are computed using standard conventions. However, you are free to override them.

### `localKey`
The local key is mostly the primary key of the **parent model**. In our example: User is the parent model and `localKey` will be the `id`.

### `relatedKey`
The related key is mostly the primary key of the **related model**. In our example: Skill is the related model and `relatedKey` will also be the `id`.

### `foreignKey`
The foreign key is in the pivot table to create the relationship with the **parent model**. Conventionally, it is camelCase representation of the model name and its primary key. In our example: The `foreignKey` will be `userId`.

### `relatedForeignKey`
The related foreign key is in the pivot table to create the relationship with the **related model**. Conventionally, it is camelCase representation of the model name and its primary key. In our example: The `relatedForeignKey` will be `skillId`.

```ts
@manyToMany(() => Skill, {
  localKey: 'id',
  foreignKey: 'user_id',
  relatedKey: 'id',
  relatedForeignKey: 'skill_id',
})
public skills: ManyToMany<typeof Skill>
```

## Custom pivot table
By default, the `pivotTable` name is the snake case representation of the **parent model name** and the **related model name**. Also, the model names are sorted before joining them together.

| Parent Model Name | Related Model Name | Sorted Combination | Pivot Table |
|-------------|-------------|-------------|-------------|
| User | Skill | Skill_User | skill_user |

However, you can also define a custom pivot table.

```ts
@manyToMany(() => Skill, {
  pivotTable: 'user_skills',
})
public skills: ManyToMany<typeof Skill>
```

## Preloading relationship
The preloading API for a many to many relationship is similar to the [other relationships](/guides/model-relations/introduction#preloading-relationship). However, the values of the pivot table are prefixed and moved to the `$extras` object on the model instance. For example:

```ts
const user = await User.query().preload('skills').first()

user.skills.forEach((skill) => {
  console.log(skill.$extras.pivot_user_id)
  console.log(skill.$extras.pivot_skill_id)
})
```

- The columns names of the pivot table are prefixed with `pivot_`. This is done to avoid any conflicts and convey a clear purpose.
- Also, the values are not defined on the `skill` model instance, but on the `$extras` object.
  - Skill model has no pre-defined properties like `pivot_user_id`. So, the typescript compiler will never allow you to read this property, unless it is defined.
  - When serializing the model to JSON, the `$extras` object is ignored and it means you are not leaking these properties in your API.
  - If for some reason, you want to serialize some properties of the `$extras` object, you can create a computed property on your `skill` model and then expose it.
    ```ts
    class Skill extends BaseModel {
      @computed()
      public get proficiency () {
        return this.$extras.pivot_proficiency
      }
    }
    ```

## Many to many query builder
The query builder for the many to many relationship has a few extra methods over the standard query builder.

### `pivotColumns`
By default, only the foreign keys are selected from the pivot table. However, you can also select extra columns. For example:

```ts{4}
const user = await User
  .query()
  .preload('skills', (query) => {
    query.pivotColumns(['proficiency'])
  })
  .first()

user.skills.forEach((skill) => {
  console.log(skill.$extras.pivot_proficiency)
})
```

You can also specify `pivotColumns` on the relationship definition as well. As per the following example, the `proficiency` key will always be selected.

```ts
@manyToMany(() => Skill, {
  pivotColumns: ['proficiency'],
})
public skills: ManyToMany<typeof Skill>
```

### `wherePivot`
The `wherePivot` method allows adding constraints on the pivot table.

```ts
const user = await User
  .query()
  .preload('skills', (query) => {
    query.wherePivot('proficiency', 'expert')
  })
  .first()
```

The following variations are available.

- `whereNotPivot`
- `whereInPivot`
- `whereNotInPivot`

## Persisting relationship
The standard persistance methods will make sure to setup the relationship inside the `pivotTable`. By default, the duplicate entries will be ignored, however, you can disable that behavior.

### `save/saveMany`

```ts
const user = await User.find(1)

const skill = new Skill()
skill.name = 'Programming'

await user.related('skills').save(skill)

// or saveMany
await user.related('skills').saveMany([skill])
```

Pass `false (boolean)` as the second argument to create duplicate entries inside the pivot table.

```ts
await user.related('skills').save(skill, false)
```

### `create/createMany`

```ts
const user = await User.find(1)

const skill = new Skill()
skill.name = 'Programming'

await user.related('skills').create({
  name: 'Programming'
})

// or createMany
await user.related('skills').createMany([
  {
    name: 'Programming'
  },
  {
    name: 'Cooking'
  }
])
```

Pass `false (boolean)` as the second argument to create duplicate entries inside the pivot table.

```ts
await user.related('skills').save({
  name: 'Programming'
}, false)
```

### `attach`
The `attach` method allows you to setup relationships inside the pivot table, using just the id. For example:

```ts
const user = await User.find(1)
const skill = await Skill.find(1)

await user.related('skills').attach([skill.id])
```

You can also pass custom pivot table attributes to the `attach` method.

```ts
await user.related('skills').attach({
  [skill.id]: {
    proficiency: 'master',
  }
})
```

### `detach`
The `detach` method is the opposite of the `attach` method. You can remove relationships for the selected ids or remove all relationships.

```ts
const user = await User.find(1)
const skill = await Skill.find(1)

await user.related('skills').detach([skill.id])

// or detach all skills
await user.related('skills').detach()
```

### `sync`
The `sync` method is a combination of `detach` and `attach`, but a little bit smarter. Instead of removing all the relationship and then re-defining them, it will perform sync by computing a diff.

Following is an example of performing `detach` and then `attach`.

```ts
const user = await User.find(1)
const userSelectedSkills = [1, 2, 3, 4]

// remove all
await user.related('skills').detach()

// attach fresh
await user.related('skills').attach(userSelectedSkills)
```

In the above example, even when the `userSelectedSkills` are same, you will unnecessary remove all the rows and then re-insert them. This also make the auto-increment counter jump for no reasons.

Whereas the `diff` approach performs only the required set of operations.

```ts
const user = await User.find(1)
const userSelectedSkills = [1, 2, 3, 4]

await user.related('skills').sync(userSelectedSkills)
```
