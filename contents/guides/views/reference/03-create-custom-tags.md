---
permalink: guides/views/creating-custom-tags
group: Views & Templates
category: Reference
draft: true
---

# Creating Custom Tags
So far you have used the inbuilt tags shipped with the core of the template engine. However, you can also create your own tags to add custom features. By the end of this guide, you will know:

- How to register a custom tag with the template engine.
- A brief understanding of the Edge **lexer** and the **parser**.
- Self implemented an `svg` tag for embedding SVG icons.

## Terms
Lets briefly talk about the terms, we will using through out this guide.

### Lexer

Lexer is a program that breaks down the input source code into a sequence of tokens. Lexer for a real programming language like Javascript may have to inspect every character during the lexical analysis.

However, Edge syntax is embedded into other languages like HTML, or Markdown. Hence, the edge lexer only inspects the [whitelisted syntax](https://github.com/edge-js/syntax).

When creating a custom tag, you will be dealing with only one type of lexer token, called the [tag token](https://github.com/edge-js/lexer#tag-token). For example:

```edge
@svg('home')
```

The above mentioned `@svg` tag will be tokenized into following JSON structure.

```json{5-9}
[
  {
    "type": "tag",
    "filename": "welcome.edge",
    "properties": {
      "name": "svg",
      "jsArg": "'home'",
      "selfclosed": false
    },
    "loc": {
      "start": {
        "line": 1,
        "col": 5
      },
      "end": {
        "line": 1,
        "col": 12
      }
    },
    "children": []
  }
]
```

- Most of the times, you will be dealing with the `properties` object.
- The `loc` is mainly used for raising exceptions with correct line and the column number.
- The `children` array is useful for block level tags like `@if` and `@each`. So, just ignore it for now.

### Parser
Within your tag implementation, you will parse the `properties.jsArg` value using the [edge-parser](https://github.com/edge-js/parser). Parser returns an [acorn expression](https://github.com/acornjs/acorn/tree/master/acorn) and using that expression, you can find if the user entered value is a variable, a string, an array or so on.

If you pass the value of `properties.jsArg` to the parser, it will return the following JSON object. The `type = 'Literal'` means, it is a raw value and not reference to a variable.

```json
{
  "type": "Literal",
  "start": 0,
  "end": 6,
  "value": "home",
  "raw": "'home'"
}
```

You can also modify these expressions and then use the parser again convert it back to valid Javascript code.

### Edge Buffer
Edge buffer is the final piece in the puzzle. Once you are done parsing/validating the user input. You can write back to the compiled output using the Edge buffer.

## Registering tag
Let's begin by creating a new edge tag inside `app/ViewTags/Svg.ts` file. You will have to create this file manually and then paste the following code snippet inside it.

```ts{}{app/ViewTags/Svg.ts}
```
