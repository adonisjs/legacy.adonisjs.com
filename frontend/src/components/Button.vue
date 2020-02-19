<template>
  <a :href="href" class="button big primary">{{ title }}</a>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    href: {
      type: String,
    },
  },
  computed: {
    classes () {
      return {
        [this.type]: true,
        [this.size]: true,
      }
    }
  }
}
</script>

<style scoped>
  .button {
    display: inline-block;
    border-radius: 3px;
    border: 2px solid transparent;
    text-transform: uppercase;
    text-decoration: none;
    transition: background-color 200ms ease;
  }

  .button.big {
    font-weight: 600;
    padding: 12px 30px 12px 30px;
    font-size: 1.6rem;
    letter-spacing: 1px;
  }

  .button.primary {
    background-color: var(--brand);
    color: #fff;
  }
  .button.primary:hover {
    background-color: var(--brand-darker);
  }

  @media (min-width: 1024px) {
    .button.big {
      padding: 14px 32px 14px 32px;
      font-size: 1.6rem;
    }
  }
</style>
