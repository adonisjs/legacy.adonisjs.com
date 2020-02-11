<template>
  <a :href="href" class="button" :class="classes">{{ title }}</a>
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
    type: {
      type: String,
      default () {
        return 'primary'
      },
      validator (value) {
        return ['primary', 'secondary', 'tertiary']
      }
    },
    size: {
      type: String,
      default () {
        return 'big'
      },
      validator (value) {
        return ['small', 'big'].includes(value)
      }
    }
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
    font-family: var(--font-interface);
  }

  .button.big {
    font-weight: 600;
    padding: 9px 30px 9px 30px;
    font-size: 1.5rem;
    letter-spacing: 1px;
  }

  .button.small {
    font-weight: 600;
    padding: 7px 14px 7px 14px;
    font-size: 1.1rem;
    letter-spacing: 0.4px;
  }

  .button.primary {
    background-color: var(--brand);
    color: #fff;
  }
  .button.primary:hover {
    background-color: var(--brand-darker);
  }

  .button.secondary {
    color: var(--brand);
    border-color: var(--brand);
  }
  .button.secondary:hover {
    background-color: var(--grey-light);
  }

  .button.tertiary {
    color: var(--black);
    border-color: var(--outlines);
  }
  .button.tertiary:hover {
    background: var(--grey-lighter);
  }

  @media (min-width: 1024px) {
    .button.big {
      padding: 10px 32px 10px 32px;
      font-size: 1.6rem;
    }

    .button.small {
      font-size: 1.4rem;
    }
  }
</style>
