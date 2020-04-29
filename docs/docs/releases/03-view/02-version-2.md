---
permalink: releases/view/version-2
group: View
---

# View `2.0`

The release `@adonisjs/view@2.0` includes `edge.js@3.0.0`. Edge has been rewritten from scratch and addresses all of the long pending issues.

Upgrade using the following command:

[codegroup]
```sh{}{npm}
npm i @adonisjs/view
```

```sh{}{yarn}
yarn add @adonisjs/view
```
[/codegroup]

## Re-write highlights
Check complete [release notes](https://github.com/edge-js/edge/releases/tag/v3.0.0)

- The error tracking is super solid. Compile time and runtime error will point back to the actual source code and not some compiled gibberish.
- Almost every Javascript expression is supported inside Mustache braces.
- Expression inside mustache can be written in multiple lines.
- The components and slots exposes some great ways to create powerful components. Just like vue, you can pass data to slots when using them inside a component.
- The inspect helper allows inspecting objects while pretty printing them.
