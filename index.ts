// export type UnwrapPromise<T> = T extends PromiseLike<infer PT> ? PT : never
// export type DefaultExport<T> = Promise<{ default: T }>

// interface Route {
//   get<T extends () => DefaultExport<{ new (): any }>>(
//     pattern: '/',
//     handler: [controller: T, method: keyof InstanceType<UnwrapPromise<ReturnType<T>>['default']>]
//   ): void
// }

// const R = {} as Route

// R.get('/', [() => import('App/Controllers/Http/HomeController'), 'index'])
