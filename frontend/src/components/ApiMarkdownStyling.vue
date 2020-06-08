<template>
  <div class="api-content">
    <slot />
  </div>
</template>

<style>
  .api-content p,
  .api-content img,
  .api-content video,
  .api-content img,
  .api-content .alert {
    margin-bottom: 2.6rem;
  }

  .api-content ul,
  .api-content ol,
  .api-content table,
  .api-content .code-highlight {
    margin-bottom: 3rem;
  }

  .api-content ul ul,
  .api-content ul ol,
  .api-content ol ul,
  .api-content ol ol {
    margin-bottom: 1.5rem;
  }

  .api-content :not(pre) > code {
    font-size: 1.5rem;
    border-radius: 3px;
    padding: 0 4px;
    background-color: var(--grey-400);
  }

  .api-content h1 {
    margin-bottom: 30px;
  }

  .api-content h1 code {
    font-size: 2.8rem;
    position: relative;
  }

  .api-content h2 {
    border-top: .1rem solid var(--grey-100);
    margin-bottom: 2rem;
    font-size: 3.2rem;
    margin-top: 5.6rem;
    padding-top: 4rem;
  }

  .api-content .bookmark {
    top: -60px;
    position: absolute;
    display: block;
    visibility: hidden;
  }

  .api-content ul, .api-content ol {
    list-style: none;
  }

  .api-content li {
    padding-left: 2rem;
    margin-left: .4rem;
    position: relative;
    margin-bottom: 1rem;
  }

  .api-content ul li {
    position: relative;
    padding-left: 3rem;
    margin-bottom: 1rem;
  }

  .api-content ul li:before {
    content: '-';
    width: 15px;
    overflow: hidden;
    position: absolute;
    left: 0;
    color: var(--grey-800);
  }

  .api-content ol {
    counter-reset: numbered-counter;
  }

  .api-content ol li:before {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    content: counter(numbered-counter, decimal) ".";
    counter-increment: numbered-counter;
  }

  .api-content li p:last-of-type {
    margin-bottom: 10px;
  }

  .api-content li p:first-of-type {
    margin-top: 0;
  }

  .api-content a {
    color: var(--brand);
    text-decoration: none;
    background-image: linear-gradient(to bottom, transparent 50%, var(--brand) 50%);
    background-position: 0 93%;
    background-repeat: repeat-x;
    background-size: 100% .15rem;
  }

  .api-content strong {
    font-weight: 600;
  }

  .api-content .alert {
    position: relative;
    border-radius: 6px;
    background: var(--grey-300);
    padding: 19px 15px 19px 55px;
  }

  .api-content .alert *:last-child {
    margin-bottom: 0;
  }

  .api-content .alert *:first-child {
    margin-top: 0;
  }

  .api-content .alert:before {
    border-radius: 6px 0 0 6px;
    content: "";
    width: 40px;
    left: 0;
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .api-content .alert-note {
    border-bottom: 4px solid var(--brand);
  }

  .api-content .alert-note:before {
    background: url("data:image/svg+xml;charset=utf8,%3Csvg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Crect id='a' x='0' y='.5' width='640' height='113' rx='2'/%3E%3C/defs%3E%3Cg transform='translate(-17 -19)' fill='none' fill-rule='evenodd'%3E%3Cmask id='b' fill='%23fff'%3E%3Cuse xlink:href='%23a'/%3E%3C/mask%3E%3Cuse xlink:href='%23a'/%3E%3Cg mask='url(%23b)'%3E%3Cg transform='rotate(-180 17 18)'%3E%3Ccircle stroke='%235A45FF' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' cx='8' cy='8' r='8'/%3E%3Ccircle fill='%235A45FF' fill-rule='nonzero' cx='8' cy='10.7' r='1'/%3E%3Cpath stroke='%235A45FF' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' d='M8 4.8V8'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat 20px 25px transparent;
  }

  .api-content .alert-tip {
    border-bottom: 4px solid var(--green);
  }

  .api-content .alert-tip:before {
    background: url("data:image/svg+xml;charset=utf8,%3Csvg width='12' height='16' viewBox='0 0 12 16' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Crect id='a' x='0' y='.5' width='640' height='113' rx='2'/%3E%3C/defs%3E%3Cg transform='translate(-20 -20)' fill='none' fill-rule='evenodd'%3E%3Cmask id='b' fill='%23fff'%3E%3Cuse xlink:href='%23a'/%3E%3C/mask%3E%3Cuse xlink:href='%23a'/%3E%3Cg mask='url(%23b)'%3E%3Cpath d='M18 20h16v16H18z'/%3E%3Cpath d='M31.5 26.5h-4.872l1.36-5.888a.5.5 0 00-.874-.43l-7 8.5a.5.5 0 00.386.818h4.872l-1.36 5.887a.5.5 0 00.874.431l7-8.5a.5.5 0 00-.386-.818z' fill='%2370D787' fill-rule='nonzero'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat 20px 25px transparent;
  }

  .api-content .code-highlight,
  .api-content .codegroup {
    margin-left: -30px;
    margin-right: -30px;
    border-radius: 0;
  }

  .api-content .codegroup a {
    background: none;
  }

  @media (min-width: 768px) {
   .api-content .code-highlight,
   .api-content .codegroup {
      margin-left: auto;
      margin-right: auto;
      border-radius: 4px;
    }
  }

  .api-card {
    border: 1px solid var(--grey-500);
    margin-bottom: 3.2rem;
    padding: 20px 40px;
  }

  .api-card h3 {
    font-size: 2.4rem;
    padding-bottom: 10px;
  }

  .signature-arg, .signature-returns {
    font-style: italic;
    font-weight: 400;
    font-size: 1.5rem;
    font-family: var(--font-mono);
  }

  .signature-arg {
    display: inline-block;
    color: #b67d47;
    margin-right: 10px;
  }

  .signature-arg:after {
    content: '->';
    margin-left: 5px;
    position: relative;
  }

  .signature-returns {
    color: var(--grey-700);
  }

  .signature {
    padding: 2px 0px;
  }

  .api-content hr {
    height: 1px;
    background: var(--grey-100);
    margin: 20px 0;
  }
</style>
