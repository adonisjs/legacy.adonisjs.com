<template>
  <div class="layout"><slot></slot></div>
</template>

<style>
  @import url('https://fonts.googleapis.com/css?family=Poppins:400,500&display=swap');

  :root {
    --black: #17161A;
    --dark-grey: #666976;
    --pre-bg: #1e1e3f;
    --grey: rgba(102, 105, 118, 0.75);
    --inactive: #B1BACC;
    --outlines: #D7DEEB;
    --selection: #e6e2ff;
    --grey-moderate: #A8A6B8;
    --grey-light: #F0F3F9;
    --grey-lighter: #F7F8FA;
    --grey-lightest: #91939F;
    --white: #fff;
    --brand: #5A45FF;
    --brand-darker: #3f2dbd;
    --green: #70D787;
    --red: #DF4A4A;

    --font-base: "Calibre";
    --font-interface: 'Poppins', sans-serif;
    --font-secondary: Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
    --font-mono: Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;

    --header-height: 56px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: 0;
    outline: 0;
  }

  html {
    font-size: 10px;
    text-rendering: optimizeSpeed;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: var(--font-base);
    font-size: 1.9rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    vertical-align: text-bottom;
    color: var(--dark-grey);
    /* line-height: 1.2; */
    font-weight: 400;
    background: #fff;
  }

  ::-moz-selection {
    background: var(--brand);
  }

  ::selection {
    background: var(--selection);
  }

  .container {
    max-width: 1260px;
    padding: 0 30px;
    margin: auto;
  }

  a {
    color: var(--brand);
    text-decoration: none;
  }

  code {
    font-family: var(--font-mono);
  }

  /**
   * The icon svg with the following class is added dynamically
   * and hence it has to be in global css and not the scoped
   * css.
  */
  .feature-icon {
    margin-right: 16px;
    width: 30px;
  }
</style>
