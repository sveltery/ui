import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: [
      { find: /^\$ui\//, replacement: new URL('./apps/docs/registry/bases/base/ui/', import.meta.url).pathname },
    ],
    conditions: ['browser'],
  },
  test: { projects: [{ extends: true, test: { environment: 'jsdom', include: ['tests/dom/*.test.ts', 'apps/docs/registry/*.test.ts', 'apps/docs/markdown/*.test.ts', 'apps/docs/src/routes/init/*.test.ts', 'packages/cli/test/**/*.test.ts'] } }, 'packages/charts'] },
});
