<template>
  <div class="code-highlight" :class="{ light: theme === 'light' }">
    <span class="title" v-if="title">{{ title }}</span>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: ['title', 'theme']
  }
</script>

<style>
  .code-highlight {
    font-family: var(--text-mono);
	  background: var(--pre-bg);
    text-align: left;
    border-radius: 4px;
    line-height: 1.6;
  }

  .code-highlight.light {
    background: #fff;
  }

  .code-highlight .title {
    padding: 16px 0 10px 0;
    margin: 0 30px;
    border-bottom: 1px solid rgba(102, 105, 118, 0.34);
    font-family: var(--font-secondary);
    letter-spacing: 0.8px;
    font-size: 1.2rem;
    color: var(--grey-100);
    font-weight: 500;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .code-highlight pre {
    display: block;
    padding: 30px 30px;
    font-size: 1.4rem;
    overflow: auto;
    width: 100%;
    max-width: 100%;
    color: #d6deeb;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .code-highlight.light pre {
    color: #393A34;
  }

  .dimer-highlight-code-line {
    display: block;
    margin: 0 -30px;
    padding: 0 30px;
    background: rgba(17, 17, 37, 0.6);
  }

  .code-highlight pre code {
    white-space: pre;
  }

  .code-highlight .token {
    display: inline;
  }

  .code-highlight .token.comment {
    color: #6c6c90;
  }
  .code-highlight.light .token.comment {
    color: #525252;
  }

  .code-highlight .token.prolog,
  .code-highlight .token.cdata {
    color: #b362ff;
  }
  .code-highlight.light .token.prolog,
  .code-highlight.light .token.cdata {
    color: #008000;
  }

  .code-highlight .token.delimiter,
  .code-highlight .token.keyword,
  .code-highlight .token.selector,
  .code-highlight .token.important,
  .code-highlight .token.atrule {
    color: #ff9d00;
  }
  .code-highlight.light .token.delimiter,
  .code-highlight.light .token.keyword,
  .code-highlight.light .token.selector,
  .code-highlight.light .token.important,
  .code-highlight.light .token.atrule {
    color: #0000ff;
  }

  .code-highlight .token.operator,
  .code-highlight .token.attr-name {
    color: rgb(255, 180, 84);
  }
  .code-highlight.light .token.operator,
  .code-highlight.light .token.attr-name {
    color: #f99157;
  }

  .code-highlight .token.punctuation {
    color: #ffffff;
  }
  .code-highlight.light .token.punctuation {
    color: #393A34;
  }

  .code-highlight .token.boolean {
    color: rgb(255, 98, 140);
  }
  .code-highlight.light .token.boolean {
    color: #f99157;
  }

  .code-highlight .token.tag,
  .code-highlight .token.doctype,
  .code-highlight .token.builtin {
    color: rgb(255, 157, 0);
  }
  .code-highlight.light .token.tag,
  .code-highlight.light .token.doctype,
  .code-highlight.light .token.builtin {
    color: #525252;
  }

  .code-highlight .token.entity,
  .code-highlight .token.symbol {
    color: #6897bb;
  }
  .code-highlight.light .token.entity,
  .code-highlight.light .token.symbol {
    color: #ff0000;
  }

  .code-highlight .token.number {
    color: #ff628c;
  }
  .code-highlight.light .token.number {
    color: #f99157;
  }

  .code-highlight .token.property,
  .code-highlight .token.constant,
  .code-highlight .token.variable {
    color: #ff628c;
  }
  .code-highlight.light .token.property,
  .code-highlight.light .token.constant,
  .code-highlight.light .token.variable {
    color: #fac863;
  }

  .code-highlight .token.string,
  .code-highlight .token.char {
    color: #a5ff90;
  }
  .code-highlight.light .token.string,
  .code-highlight.light .token.char {
    color: #5fb3b3;
  }

  .code-highlight .token.attr-value,
  .code-highlight .token.attr-value .punctuation,
  .code-highlight .token.mustache {
    color: #a5c261;
  }
  .code-highlight.light .token.attr-value,
  .code-highlight.light .token.attr-value .punctuation,
  .code-highlight.light .token.mustache {
    color: #99c794;
  }

  .code-highlight .token.attr-value .punctuation:first-child {
    color: #a9b7c6;
  }

  .code-highlight.light .token.attr-value .punctuation:first-child {
    color: #b294bb;
  }

  .code-highlight .token.url {
    color: #287bde;
    text-decoration: underline;
  }
  .code-highlight.light .token.url {
    color: #5fb3b3;
    text-decoration: underline;
  }

  .code-highlight .token.function {
    color: rgb(250, 208, 0);
  }
  .code-highlight.light .token.function {
    color: #69c;
  }

  .code-highlight .token.regex {
    color: rgb(238, 95, 143);
  }

  .code-highlight .token.bold {
    font-weight: 500;
  }

  .code-highlight .token.italic {
    font-style: italic;
  }

  .code-highlight .token.inserted {
    display: block;
    color: #84f1a6;
  }

  .code-highlight .token.deleted {
    color: #e25f68;
    display: block;
  }

  .code-highlight .language-css .token.property,
  .code-highlight .language-css .token.property + .code-highlight .token.punctuation {
    color: #a9b7c6;
  }
  .code-highlight.light .language-css .token.property,
  .code-highlight.light .language-css .token.property + .code-highlight .token.punctuation {
    color: #fac863;
  }

  .code-highlight .language-css .token.id {
    color: #ffc66d;
  }
  .code-highlight.light .language-css .token.id {
    color: #5fb3b3;
  }

  .code-highlight .language-css .token.selector > .code-highlight .token.class,
  .code-highlight .language-css .token.selector > .code-highlight .token.attribute,
  .code-highlight .language-css .token.selector > .code-highlight .token.pseudo-class,
  .code-highlight .language-css .token.selector > .code-highlight .token.pseudo-element {
    color: #ffc66d;
  }

  .code-highlight .token.class-name {
    color: #fb94ff;
  }
  .code-highlight.light .token.class-name {
    color: #f99157;
  }

  .code-highlight .token.operator,
  .code-highlight .token.entity,
  .code-highlight .token.url,
  .language-css .code-highlight .token.string,
  .style .code-highlight .token.string {
    background: none;
  }
</style>
