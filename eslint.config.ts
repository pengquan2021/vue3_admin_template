import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'

export default defineConfig([
  // 忽略文件
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', '*.min.js'],
  },

  // JavaScript 配置
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // TypeScript 配置
  ...tseslint.configs.recommended,

  // Vue 配置
  ...vue.configs['flat/recommended'],

  // Vue 文件设置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // 自定义规则
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',
    },
  },
])
