module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'class-methods-use-this': 0,
    camelcase: 0,
    'no-underscore-dangle': 0,
  },
};
