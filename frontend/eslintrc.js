// filepath: frontend/.eslintrc.js
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-console': 'warn'
    },
    env: {
      browser: true,
      node: true,
      es6: true
    }
  };