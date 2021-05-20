module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  globals: {
    browser: true,
    chrome: true,
    cloneInto: true,
    exportFunction: true,
  },
  plugins: [],
  rules: {
    'no-continue': 'off',
    'no-plusplus': 'off',
  },
};
