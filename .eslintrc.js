module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    // Add this next line to configure ESLint for Jest, see:
    // https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments
    jest: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {},
};
