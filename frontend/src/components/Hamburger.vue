<template>
  <div class="hamburger" @click="$emit('toggle')" :class="{ expanded: isExpanded }">
    <span class="hamburger-top-bun"></span>
    <span class="hamburger-bottom-bun"></span>
  </div>
</template>

<script>
  export default {
    props: ['toggle', 'isExpanded'],
  }
</script>

<style scoped>
  .hamburger {
    height: 48px;
    width: 18px;
    cursor: pointer;
    position: absolute;
    right: 30px;
    top: 4px;
  }

  .hamburger span {
    border-radius: 1.3px;
    background-color: var(--grey-700);
    height: 2px;
    width: 17px;
    display: block;
    position: absolute;
    -webkit-transform: rotate(0);
    transform: rotate(0);
    transition: -webkit-transform .25s;
    transition: transform .25s;
    transition: transform .25s,-webkit-transform .25s;
  }

  .hamburger .hamburger-top-bun {
    transform: translateY(-5px);
    top: 23px;
  }

  .hamburger .hamburger-bottom-bun {
    transform: translateY(5px);
    bottom: 23px;
  }

  .hamburger.expanded span {
    background-color: var(--grey-900);
  }

  .hamburger.expanded .hamburger-top-bun {
    transform: rotate(45deg) translateY(0);
  }

  .hamburger.expanded .hamburger-bottom-bun {
    transform: rotate(-45deg) translateY(0);
  }
</style>
