<template>
  <details class="collapsible" open>
    <summary>{{ title }}</summary>
    <div class="collapsible-content">
      <dimer-tree :node="content" />
    </div>
  </details>
</template>

<script>
export default {
  props: ['title', 'content']
}
</script>

<style scoped>
  .collapsible {
    margin-top: 2rem;
    -webkit-appearance: none;
    appearance: none;
  }

  .collapsible summary {
    -webkit-appearance: none;
    appearance: none;
    font-size: 2.1rem;
    font-weight: 600;
    color: var(--grey-900);
    cursor: pointer;
  }

  .collapsible summary::-webkit-details-marker {
    display: none;
  }

  .collapsible summary:before {
    position: relative;
    content: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik05IDE4bDYtNi02LTYiLz48L3N2Zz4=");
    display: inline-block;
    margin-right: 10px;
    top: 2px;
    transition: transform .2s ease-out;
  }

  .collapsible-content {
    padding-left: 13px;
    padding-top: 5px;
  }

  .collapsible[open] summary:before {
    transform: rotate(90deg);
  }
</style>
