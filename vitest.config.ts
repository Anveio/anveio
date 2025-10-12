import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['convex/**/*.convex.test.ts'],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@': resolve(rootDir, '.'),
    },
  },
})
