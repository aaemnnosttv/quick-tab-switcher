module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  rules: {
    'no-console': ['error', { allow: ['log'] }],
    semi: ['error', 'never']
  }
}
