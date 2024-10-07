/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'vuetify',
    './.eslintrc-auto-import.json',
    '@vue/standard'
  ],
  overrides:[
    {
      files:['src/layouts/**','src/pages/**'],
      rules: {
        'vue/multi-word-component-names': 'off', // 用.vue檔一定要是兩個字的規定
      },
    }
  ]
}
