/* eslint-env node */
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['@tanstack/eslint-plugin-query', 'prettier', 'local-rules'],
  rules: {
    '@tanstack/query/exhaustive-deps': 'warn',
    'prettier/prettier': 'error',
    'local-rules/no-domain-type-redefinition': 'error',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'local-rules/no-domain-type-redefinition': 'error',
      },
    },
  ],
};
