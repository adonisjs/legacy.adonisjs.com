<template>
  <div class="markdown-content">
    <slot />
  </div>
</template>

<style>
  .markdown-content p,
  .markdown-content img,
  .markdown-content video,
  .markdown-content img,
  .markdown-content .alert {
    margin-bottom: 3.2rem;
  }

  .markdown-content p + .code-highlight {
    margin-top: -2rem;
  }

  .markdown-content li p + .code-highlight {
    margin-top: auto;
  }

  .markdown-content ul,
  .markdown-content ol,
  .markdown-content table,
  .markdown-content .code-highlight {
    margin-bottom: 5rem;
  }

  .markdown-content ul ul,
  .markdown-content ul ol,
  .markdown-content ol ul,
  .markdown-content ol ol {
    margin-bottom: 2rem;
  }

  .markdown-content h1,
  .markdown-content h2,
  .markdown-content h3,
  .markdown-content h4 {
    font-weight: 600;
    color: var(--grey-900);
    position: relative;
  }

  .markdown-content :not(pre) > code {
    font-size: 1.5rem;
    border-radius: 3px;
    padding: 0 4px;
    background-color: var(--grey-400);
  }

  .markdown-content hr {
    height: 1px;
    background: var(--grey-100);
  }

  .markdown-content h1 {
    margin-bottom: 3rem;
    font-size: 4.6rem;
  }

  .markdown-content h1 code {
    font-size: 2.4rem;
    position: relative;
    top: -4px;
  }

  .markdown-content h2 {
    border-top: .1rem solid var(--grey-100);
    margin-bottom: 2rem;
    font-size: 3.2rem;
    margin-top: 5.6rem;
    padding-top: 4rem;
  }

  .markdown-content h2 code {
    font-size: 2.4rem;
  }

  .markdown-content h3 {
    font-size: 2.4rem;
    margin-top: 4rem;
    margin-bottom: 1.2rem;
  }

  .markdown-content h3 code {
    font-size: 1.8rem;
  }

  .markdown-content h4 {
    font-size: 2.2rem;
    margin-top: 5rem;
    margin-bottom: 1rem;
  }

  .markdown-content h1 a, .markdown-content h2 a, .markdown-content h3 a, .markdown-content h4 a {
    position: relative;
  }

  .markdown-content h4 code {
    font-size: 1.7rem;
  }

  .markdown-content .icon.icon-link {
    display: inline-block;
    color: var(--grey-100);
    margin-right: 1rem;
  }

  .markdown-content .icon.icon-link::after {
    content: '#';
  }

  .markdown-content h1 .icon.icon-link {
    display: none;
  }

  .markdown-content .bookmark {
    top: -130px;
    position: absolute;
    display: block;
    visibility: hidden;
  }

  .markdown-content h2 .bookmark {
    top: -100px;
  }

  .markdown-content ul, .markdown-content ol {
    list-style: none;
  }

  .markdown-content li {
    padding-left: 2rem;
    margin-left: .4rem;
    position: relative;
    margin-bottom: 1rem;
  }

  .markdown-content ul li {
    position: relative;
    padding-left: 3rem;
    margin-bottom: 1rem;
  }

  .markdown-content ul li:before {
    content: '—';
    width: 15px;
    overflow: hidden;
    position: absolute;
    left: 0;
    color: var(--grey-800);
  }

  .markdown-content ol {
    counter-reset: numbered-counter;
  }

  .markdown-content ol li:before {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    content: counter(numbered-counter, decimal) ".";
    counter-increment: numbered-counter;
  }

  .markdown-content li p:last-of-type {
    margin-bottom: 10px;
  }

  .markdown-content li p:first-of-type {
    margin-top: 0;
  }

  .markdown-content table {
    border-collapse: collapse;
    width: 100%;
  }

  .markdown-content table tr th,
  .markdown-content table tr td {
    text-align: left;
    padding: 1.3rem 2rem;
  }

  .markdown-content table tr th {
    font-weight: 600;
    background-color: var(--grey-300);
  }

  .markdown-content table tr td {
    border-bottom: 1px solid var(--grey-100);
  }

  .markdown-content img,
  .markdown-content video {
    max-width: 100%;
    border-radius: 5px;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--grey-100);
  }

  .markdown-content a {
    color: var(--brand);
    text-decoration: none;
    background-image: linear-gradient(to bottom, transparent 50%, var(--brand) 50%);
    background-position: 0 93%;
    background-repeat: repeat-x;
    background-size: 100% .15rem;
  }

  .markdown-content strong {
    font-weight: 600;
  }

  .markdown-content .alert {
    position: relative;
    border-radius: 6px;
    background: var(--grey-300);
    padding: 19px 15px 19px 55px;
  }

  .markdown-content .alert *:last-child {
    margin-bottom: 0;
  }

  .markdown-content .alert *:first-child {
    margin-top: 0;
  }

  .markdown-content .alert:before {
    border-radius: 6px 0 0 6px;
    content: "";
    width: 40px;
    left: 0;
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .markdown-content .alert-note {
    border-bottom: 4px solid var(--brand);
  }

  .markdown-content .alert-note:before {
    background: url("data:image/svg+xml;charset=utf8,%3Csvg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Crect id='a' x='0' y='.5' width='640' height='113' rx='2'/%3E%3C/defs%3E%3Cg transform='translate(-17 -19)' fill='none' fill-rule='evenodd'%3E%3Cmask id='b' fill='%23fff'%3E%3Cuse xlink:href='%23a'/%3E%3C/mask%3E%3Cuse xlink:href='%23a'/%3E%3Cg mask='url(%23b)'%3E%3Cg transform='rotate(-180 17 18)'%3E%3Ccircle stroke='%235A45FF' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' cx='8' cy='8' r='8'/%3E%3Ccircle fill='%235A45FF' fill-rule='nonzero' cx='8' cy='10.7' r='1'/%3E%3Cpath stroke='%235A45FF' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' d='M8 4.8V8'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat 20px 25px transparent;
  }

  .markdown-content .alert-tip {
    border-bottom: 4px solid var(--green);
  }

  .markdown-content .alert-tip:before {
    background: url("data:image/svg+xml;charset=utf8,%3Csvg width='12' height='16' viewBox='0 0 12 16' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Crect id='a' x='0' y='.5' width='640' height='113' rx='2'/%3E%3C/defs%3E%3Cg transform='translate(-20 -20)' fill='none' fill-rule='evenodd'%3E%3Cmask id='b' fill='%23fff'%3E%3Cuse xlink:href='%23a'/%3E%3C/mask%3E%3Cuse xlink:href='%23a'/%3E%3Cg mask='url(%23b)'%3E%3Cpath d='M18 20h16v16H18z'/%3E%3Cpath d='M31.5 26.5h-4.872l1.36-5.888a.5.5 0 00-.874-.43l-7 8.5a.5.5 0 00.386.818h4.872l-1.36 5.887a.5.5 0 00.874.431l7-8.5a.5.5 0 00-.386-.818z' fill='%2370D787' fill-rule='nonzero'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat 20px 25px transparent;
  }

  .markdown-content .code-highlight,
  .markdown-content .codegroup {
    border-radius: 0;
  }

  .markdown-content .codegroup a {
    background: none;
  }

  @media (min-width: 768px) {
   .markdown-content .code-highlight,
   .markdown-content .codegroup {
      margin-left: auto;
      margin-right: auto;
      border-radius: 4px;
    }

    .markdown-content .icon.icon-link {
      position: absolute;
      left: -30px;
      top: -2px;
    }
  }
</style>
