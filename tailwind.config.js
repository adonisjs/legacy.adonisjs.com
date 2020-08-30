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
        adonis: {
          black: '#17161a',
          'grey-dark': '#666976',
          inactive: '#b1bacc',
          background: '#f0f3f9',
          background2: '#f7f8fa',
          outline: '#d7deeb',
          brand: '#5a45ff',
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
