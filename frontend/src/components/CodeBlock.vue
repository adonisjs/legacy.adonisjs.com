<template>
  <div class="code-highlight">
    <span class="title" v-if="title">{{ title }}</span>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: ['title']
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
    font-size: 1.3rem;
    overflow: auto;
    width: 100%;
    max-width: 100%;
    color: #d6deeb;
    white-space: pre-wrap;
    word-break: break-word;
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

  .code-highlight .token.prolog,
  .code-highlight .token.cdata {
    color: #b362ff;
  }

  .code-highlight .token.delimiter,
  .code-highlight .token.keyword,
  .code-highlight .token.selector,
  .code-highlight .token.important,
  .code-highlight .token.atrule {
    color: #ff9d00;
  }

  .code-highlight .token.operator,
  .code-highlight .token.attr-name {
    color: rgb(255, 180, 84);
  }

  .code-highlight .token.punctuation {
    color: #ffffff;
  }

  .code-highlight .token.boolean {
    color: rgb(255, 98, 140);
  }

  .code-highlight .token.tag,
  .code-highlight .token.doctype,
  .code-highlight .token.builtin {
    color: rgb(255, 157, 0);
  }

  .code-highlight .token.entity,
  .code-highlight .token.symbol {
    color: #6897bb;
  }

  .code-highlight .token.number {
    color: #ff628c;
  }

  .code-highlight .token.property,
  .code-highlight .token.constant,
  .code-highlight .token.variable {
    color: #ff628c;
  }

  .code-highlight .token.string,
  .code-highlight .token.char {
    color: #a5ff90;
  }

  .code-highlight .token.attr-value,
  .code-highlight .token.attr-value .punctuation,
  .code-highlight .token.mustache {
    color: #a5c261;
  }

  .code-highlight .token.attr-value .punctuation:first-child {
    color: #a9b7c6;
  }

  .code-highlight .token.url {
    color: #287bde;
    text-decoration: underline;
  }

  .code-highlight .token.function {
    color: rgb(250, 208, 0);
  }

  .code-highlight .token.regex {
    background: #364135;
  }

  .code-highlight .token.bold {
    font-weight: 500;
  }

  .code-highlight .token.italic {
    font-style: italic;
  }

  .code-highlight .token.inserted {
    background: #00ff00;
  }

  .code-highlight .token.deleted {
    background: #ff000d;
  }

  .code-highlight .language-css .token.property,
  .code-highlight .language-css .token.property + .code-highlight .token.punctuation {
    color: #a9b7c6;
  }

  .code-highlight .language-css .token.id {
    color: #ffc66d;
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

  .code-highlight .token.operator,
  .code-highlight .token.entity,
  .code-highlight .token.url,
  .language-css .code-highlight .token.string,
  .style .code-highlight .token.string {
    background: none;
  }
</style>
