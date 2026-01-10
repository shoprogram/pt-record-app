import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.spec.ts'],
    exclude: ['node_modules/', 'tests/e2e/**', '**/*.config.ts', '**/types/**', '**/constants/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '**/*.spec.ts', '**/*.config.ts', '**/types/**', '**/constants/**'],
    },
    globals: true,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '@': resolve(__dirname, '.'),
      '#app': resolve(__dirname, '.'),
    },
  },
})
