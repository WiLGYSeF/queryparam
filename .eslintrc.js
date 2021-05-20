module.exports = {
  env: {
    jest: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  globals: {},
  plugins: [],
  rules: {
    'no-continue': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 0,
  },
};
