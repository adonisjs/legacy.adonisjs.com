<template>
  <div class="layout"><slot></slot></div>
</template>

<style>
  :root {
    --grey-900: #17161A;
    --grey-800: #46444c;
    --grey-700: #666976;
    --grey-600: #91939F;
    --grey-500: #A8A6B8;
    --grey-400: #F0F3F9;
    --grey-300: #F7F8FA;
    --grey-200: #B1BACC;
    --grey-100: #D7DEEB;

    --pre-bg: #1e1e3f;
    --selection: #e6e2ff;
    --brand: #5A45FF;
    --brand-darker: #3f2dbd;
    --green: #70D787;
    --red: #DF4A4A;

    --font-base: 'Calibre', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    --font-secondary: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    --font-mono: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

    --header-height: 56px;
    --base-text-size: 1.9rem;
    --base-line-height: 1.2;
    --loose-line-height: 1.3;

    --topbar-bar-height: 50px;
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
    font-size: var(--base-text-size);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    vertical-align: text-bottom;
    color: var(--grey-700);
    font-weight: 400;
    line-height: var(--base-line-height);
    background: #fff;
  }

  input, select, optgroup, option {
    font-family: var(--font-base), sans-serif;
  }

  ::-moz-selection {
    background: var(--selection);
  }

  ::selection {
    background: var(--selection);
  }

  .container {
    max-width: 1260px;
    padding: 0 30px;
    margin: auto;
  }

  h1 > a, h2 > a, h3 > a, h4 > a {
   text-decoration: none; 
   background-image: none !important;
  }

  .icon.icon-link {
    display: inline-block;
    color: var(--grey-100);
    margin-right: 1.5rem;   
  }

  .icon.icon-link::after {
    content: '#';
  }

  a {
    color: var(--brand);
    text-decoration: none;
  }

  code {
    font-family: var(--font-mono);
    -webkit-font-smoothing: auto;
    -moz-osx-font-smoothing: auto;
  }

  /**
   * The icon svg with the following class is added dynamically
   * and hence it has to be in global css and not the scoped
   * css.
  */
  .feature-icon {
    margin-right: 16px;
    width: 30px;
    display: block;
  }

  .tab-item .title {
    display: none !important;
  }

  .svg-icon {
    display: inline-block;
    color: inherit;
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
  }

  .svg-fill {
    fill: currentColor;
    stroke: none;
  }

  .svg-up {
    /* default */
    transform: rotate(0deg);
  }

  .svg-right {
    transform: rotate(90deg);
  }

  .svg-down {
    transform: rotate(180deg);
  }

  .svg-left {
    transform: rotate(-90deg);
  }
</style>
