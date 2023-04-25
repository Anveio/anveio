module.exports = {
  plugins: {
    tailwindcss: {},
    'tailwindcss/nesting': {},
    'postcss-focus-visible': {
      replaceWith: '[data-focus-visible-added]',
    },
    autoprefixer: {},
  },
}
