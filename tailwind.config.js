const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./resources/views/**/*.edge'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        move: 'left width',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              fontFamily: theme('fontFamily.display'),
            },
            h2: {
              fontFamily: theme('fontFamily.display'),
            },
            h3: {
              fontFamily: theme('fontFamily.display'),
            },
            h4: {
              fontFamily: theme('fontFamily.display'),
            },
          },
        },
      }),
      height: {
        '3px': '3px',
      },
      fontSize: {
        3.5: '2rem',
        2.5: '1.6rem',
      },
    },
    colors: {
      body: '#f9f9f9',
      inherit: 'inherit',
      transparent: 'transparent',
      gray: colors.coolGray,
      coolGray: {
        200: '#e9ecf1',
      },
      white: '#fff',
      brand: {
        DEFAULT: '#5a45ff',
      },
      green: {
        400: '#14B8A6',
      },
      blue: {
        100: 'rgba(2,226,255,.24)',
        200: '#02e2ff',
        900: '#08343c',
      },
      purple: {
        600: '#84819c',
      },
    },
    boxShadow: {
      DEFAULT: '0 0 0 1px rgba(17, 1, 34, 0.06), 0 2px 5px 0 rgba(17, 1, 34, 0.06)',
      dropdown: '0px 4px 16px rgba(46,41,51,0.08),0px 8px 24px rgba(71,63,79,0.16)',
    },
    fontFamily: {
      sans: ['Calibre', 'sans-serif'],
      display: ['Basic sans', 'sans-serif'],
      mono: ['Operator Mono', 'Menlo', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    },
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    animation: false,
  },
  plugins: [require('@tailwindcss/typography')],
}
