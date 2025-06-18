// @ts-check
import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    unocss: false,
    vue: {
      overrides: {
        'vue/no-restricted-syntax': ['error', {
          selector: 'VElement[name=\'a\']',
          message: 'Use NuxtLink instead.',
        }],
        'vue/block-order': ['error', {
          order: [['template', 'script'], 'style'],
        }],
      },

    },
    ignores: [
      'public/**',
      'public-dev/**',
      'public-staging/**',
      'https-dev-config/**',
      'elk-translation-status.json',
      'docs/translation-status.json',
    ],
  },
  {
    rules: {
      // TODO: migrate all process reference to `import.meta.env` and remove this rule
      'node/prefer-global/process': 'off',
      'vue/no-deprecated-slot-attribute': 'off',
      'style/no-tabs': 'off',
    },
  },
  // Sort local files
  {
    files: ['locales/**.json'],
    rules: {
      'jsonc/sort-keys': 'error',
    },
  },
)
