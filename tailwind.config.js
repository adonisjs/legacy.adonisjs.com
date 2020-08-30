const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Calibre',
          ...defaultTheme.fontFamily.sans,
        ],
        mono: [
          'SF Mono',
          'Cascadia Code',
          'JetBrains Mono',
          ...defaultTheme.fontFamily.mono,
        ]
      },
      colors: {
        grey: {
          900: '#17161a',
          800: '#46444c',
          700: '#666976',
          600: '#91939f',
          500: '#a8a6b8',
          400: '#b1bacc',
          300: '#d7deeb',
          200: '#f0f3f9',
          100: '#f7f8fa',
        },
        adonis: {
          'pre-bg': '#1e1e3f',
          selection: '#e6e2ff',
          brand: '#5a45ff',
          'brand-dark': '#3f2dbd',
          green: '#70d787',
          red: '#df4a4a',
        },
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui')
  ],
}
