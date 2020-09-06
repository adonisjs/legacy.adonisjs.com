---
permalink: guides/validator/schema-caching
group: Validator
---

# Schema Caching
The schema created using `schema.create` method is first complied to an executable function and then executed to validate the data against the defined rules.

The compilation process does takes some time **(1ms to 2ms)** before the validation begins. Based upon the performance expectations you have, you may want to consider caching the compiled schema and hence don't pay the compilation penalty on every request.

## Using the `cacheKey`
Caching a schema is straightforward, you just need to define a unique `cacheKey` during the `request.validate` call.

[note]

It is recommended to use `ctx.routeKey` over `request.url()` as the cache key. Since, your application can have two same URLs using different HTTP methods and hence their schemas will conflict.

[/note]


```ts
await request.validate({
  schema: schema.create({...}),
  cacheKey: request.url(),
})
```

- The first call to `request.validate` will compile the schema and saves the output in reference to the `cacheKey`.
- Until the `cacheKey` is same, the schema won't be compiled again.

## Caching caveats
Caching in any form is not free and same is the case with the schema caching. If your schema relies on runtime values, then caching schema will not give desired outcome. Consider the following example:

- You are creating a form that accepts the user **state** and their **city**.
- The city options are based upon the value of the selected **state**.

```ts
/**
 * Assuming following variables holds data
 */
const STATES = []
const CITIES = {}

export default class AddressValidator {
  public selectedState = this.ctx.request.input('state') // 👈

  public schema = schema.create({
    state: schema.enum(STATES),
    city: schema.enum(CITIES[this.selectedState] || [])
  })
}
```

If you look at the above example, the enum options for the `city` are dependent on the `selectedState` and will vary with every HTTP request. **Hence, there is no simple way to cache the schema with a fixed key**.

### Option 1 (Give up caching)
The first option is to give up caching. This will add a delay of couple of milliseconds to your requests, but gives you the simplest API to use to runtime values within your schema definition.

### Option 2 (Create a unique key)
Considering the above example, you can append the selected state to the `cacheKey` and hence each state will have its own copy of cache schema. For example:

```ts{9}
export default class AddressValidator {
  public selectedState = this.ctx.request.input('state')

  public schema = schema.create({
    state: schema.enum(STATES),
    city: schema.enum(CITIES[this.selectedState] || [])
  })

  public cacheKey = `${this.ctx.routeKey}-${selectedState}`
}
```

The above approach has its own set of downsides. If there are 37 states, then there will be 37 cached copies of the same schema with a small variation. Also, this number will grow exponentially if you need more than one dynamic value.

In fact, giving up caching is better than caching too many schemas with small variations.

### Option 3 (Using refs)
Refs gives you the best of the both worlds. You can still cache your schema and also reference the runtime values inside them. Following is an example of the same:

```ts{4-6}
export default class AddressValidator {
  public selectedState = this.ctx.request.input('state')

  public refs = schema.refs({
    cities: CITIES[this.selectedState] || []
  })

  public schema = schema.create({
    state: schema.enum(STATES),
    city: schema.enum(this.refs.cities)
  })
}
```

Instead of referencing `CITIES[this.selectedState]` directly, you move it to the `schema.refs` object and from there on, the cities will be picked up at runtime without re-compiling the schema.

[note]
Refs only work if the **validation rule** or the **schema type** supports them.
[/note]
