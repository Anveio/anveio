import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    environment: 'edge-runtime',
    globals: true,
    include: ['convex/**/*.convex.test.ts'],
    server: {
      deps: {
        inline: ['convex-test'],
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(rootDir, '.'),
    },
  },
})
