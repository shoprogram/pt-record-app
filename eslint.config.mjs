import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import tseslint from 'typescript-eslint'

export default createConfigForNuxt({
  features: {
    stylistic: true,
  },
})
  .append(
    tseslint.configs.recommendedTypeChecked.map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
    })),
  )
  .append({
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-var': 'error',
      'no-console': 'warn',
      'vue/multi-word-component-names': 'off',
      // TypeScript型チェックルール
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Nuxtのauto-importによる型の問題を許容しつつ、基本的な型エラーは検出
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      // これらは有効にして型の不一致を検出
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: true,
          allowAny: false,
          allowNullish: false,
        },
      ],
    },
  })
  .append(eslintConfigPrettier)
