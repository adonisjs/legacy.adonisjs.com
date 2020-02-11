<template>
  <div class="doc wysiwyg">
    <dimer-tree :node="doc.content" />
  </div>
</template>

<script>
  export default {
    props: ['doc']
  }
</script>

<style scoped>
  .doc {
    max-width: 100%;
    padding: 40px 0;
    color: #4f525d;
    font-size: 2rem;
  }

  .wysiwyg h1, .wysiwyg h2, .wysiwyg h3, .wysiwyg h4 {
    color: var(--black);
    font-weight: 700;
  }

  .wysiwyg h1 {
    font-size: 5rem;
    margin-bottom: 2.2rem;
  }

  .wysiwyg h2 {
    font-size: 3.2rem;
    border-top: .1rem solid var(--outlines);
    margin-bottom: 2rem;
    margin-top: 5.6rem;
    padding-top: 4rem;
  }

  .wysiwyg h3 {
    font-size: 2.4rem;
    margin-top: 5rem;
    margin-bottom: 1rem;
  }

  .wysiwyg h4 {
    font-size: 2rem;
    margin-top: 5rem;
    margin-bottom: 1rem;
  }

  .wysiwyg code {
    font-size: 1.5rem;
    background: #f6f6ff;
    padding: 1px 3px;
  }

  .wysiwyg p,
  .wysiwyg .alert,
  .wysiwyg .embed,
  .wysiwyg img,
  .wysiwyg .code-highlight,
  .wysiwyg video {
    margin-bottom: 3.2rem;
  }

  .wysiwyg video {
    max-width: 100%;
  }

  .wysiwyg ul, .wysiwyg ol {
    margin-bottom: 4rem;
  }

  .wysiwyg ul, .wysiwyg ol {
    list-style: none;
  }

  .wysiwyg li {
    padding-left: 2rem;
    margin-left: .4rem;
    position: relative;
    margin-bottom: 1.6rem;
  }

  .wysiwyg ul li:before {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    content: "\2022";
    font-size: 2.6rem;
    color: var(--grey);
    line-height: 1.1;
  }

  .wysiwyg ol {
    counter-reset: numbered-counter;
  }

  .wysiwyg a {
    color: var(--brand);
    text-decoration: none;
    background-image: linear-gradient(to bottom, transparent 50%, var(--brand) 50%);
    background-position: 0 93%;
    background-repeat: repeat-x;
    background-size: 100% .15rem;

    text-shadow: 0.1rem 0 #fff,
      0.15rem 0 #fff,
      -0.1rem 0 #fff,
      -0.15rem 0 #fff;
  }

  .wysiwyg .alert a {
    text-shadow: 0.1rem 0 var(--grey-light),
      0.15rem 0 var(--grey-light),
      -0.1rem 0 var(--grey-light),
      -0.15rem 0 var(--grey-light);
  }

  .wysiwyg ol li:before {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    content: counter(numbered-counter, decimal) ".";
    counter-increment: numbered-counter;
  }

  .wysiwyg .alert {
    position: relative;
    border-radius: 6px;
    background: var(--grey-light);
    padding: 19px 15px 19px 55px;
  }

  .wysiwyg .alert code {
    background: #dbe0ea;
  }

  .wysiwyg li p:last-of-type {
    margin-bottom: 10px;
  }

  .wysiwyg li p:first-of-type {
    margin-top: 0;
  }

  .wysiwyg .alert p:last-of-type {
    margin-bottom: 0;
  }

  .wysiwyg .alert p:first-of-type {
    margin-top: 0;
  }

  .wysiwyg .alert:before {
    border-radius: 6px 0 0 6px;
    content: "";
    width: 40px;
    left: 0;
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .wysiwyg .alert-note {
    border-bottom: 4px solid var(--brand);
  }

  .wysiwyg .alert-note:before {
    background: url("data:image/svg+xml;charset=utf8,%3Csvg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Crect id='a' x='0' y='.5' width='640' height='113' rx='2'/%3E%3C/defs%3E%3Cg transform='translate(-17 -19)' fill='none' fill-rule='evenodd'%3E%3Cmask id='b' fill='%23fff'%3E%3Cuse xlink:href='%23a'/%3E%3C/mask%3E%3Cuse xlink:href='%23a'/%3E%3Cg mask='url(%23b)'%3E%3Cg transform='rotate(-180 17 18)'%3E%3Ccircle stroke='%235A45FF' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' cx='8' cy='8' r='8'/%3E%3Ccircle fill='%235A45FF' fill-rule='nonzero' cx='8' cy='10.7' r='1'/%3E%3Cpath stroke='%235A45FF' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' d='M8 4.8V8'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat 20px 25px transparent;
  }

  .wysiwyg .alert-tip {
    border-bottom: 4px solid var(--green);
  }

  .wysiwyg .alert-tip:before {
    background: url("data:image/svg+xml;charset=utf8,%3Csvg width='12' height='16' viewBox='0 0 12 16' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Crect id='a' x='0' y='.5' width='640' height='113' rx='2'/%3E%3C/defs%3E%3Cg transform='translate(-20 -20)' fill='none' fill-rule='evenodd'%3E%3Cmask id='b' fill='%23fff'%3E%3Cuse xlink:href='%23a'/%3E%3C/mask%3E%3Cuse xlink:href='%23a'/%3E%3Cg mask='url(%23b)'%3E%3Cpath d='M18 20h16v16H18z'/%3E%3Cpath d='M31.5 26.5h-4.872l1.36-5.888a.5.5 0 00-.874-.43l-7 8.5a.5.5 0 00.386.818h4.872l-1.36 5.887a.5.5 0 00.874.431l7-8.5a.5.5 0 00-.386-.818z' fill='%2370D787' fill-rule='nonzero'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat 20px 25px transparent;
  }

  .wysiwyg img {
    max-width: 100%;
  }

  .wysiwyg .code-highlight {
    margin-left: -30px;
    margin-right: -30px;
    border-radius: 0;
  }

  @media (min-width: 768px) {
    .wysiwyg .code-highlight {
      margin-left: auto;
      margin-right: auto;
      border-radius: inherit;
    }
  }

  @media (min-width: 1024px) {
    .doc {
      padding: 60px 0 0 100px;
      max-width: 760px;
    }
  }
</style>
