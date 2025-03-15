module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['@tanstack/eslint-plugin-query', 'prettier'],
  rules: {
    '@tanstack/query/exhaustive-deps': 'warn',
    'prettier/prettier': 'error',
  },
};
