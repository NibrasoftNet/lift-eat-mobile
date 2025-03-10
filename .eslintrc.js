import pluginQuery from '@tanstack/eslint-plugin-query'

// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier', { '@tanstack/query': pluginQuery }],
  rules: {
    'prettier/prettier': 'error',
    '@tanstack/query/exhaustive-deps': 'error',
  },
};
