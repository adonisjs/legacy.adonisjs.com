<template>
  <div class="toc">
    <div class="toc-content">
      <h3 class="title">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" d="M1.5 1.5h11v5h-11zM1.5 9.5h11M1.5 12.5h6"/></svg>
        <span>On this page</span>
      </h3>
      <dimer-tree :node="node" />
    </div>
  </div>
</template>

<script>
  export default {
    props: ['node']
  }
</script>

<style>
  .toc {
    position: fixed;
    right: 0;
    bottom: 0;
    top: calc(var(--header-height) + 6px);
  }

  .toc-content {
    height: 100%;
    width: 300px;
    overflow: scroll;
    padding: 60px 90px 60px 55px;
  }

  .toc .title {
    color: var(--grey-200);
    font-size: 1.6rem;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }

  .toc .title svg {
    margin-right: 8px;
    position: relative;
    top: 1px;
  }

  .toc-container h2 {
    display: none;
  }

  .toc-container ul {
    list-style: none;
  }

  .toc-container ul li ul {
    display: none;
  }

  .toc-container ul li a {
    color: var(--grey-200);
    font-size: 1.6rem;
    font-weight: 500;
    margin-bottom: 8px;
    display: block;
    white-space: wrap;
  }

  .toc-container ul li a:hover {
    color: inherit;
  }
</style>
