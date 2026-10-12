import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: [
      { find: /^\$ui\//, replacement: new URL('./apps/docs/registry/bases/base/ui/', import.meta.url).pathname },
      { find: /^@sveltery\/ui\/icons$/, replacement: new URL('./apps/docs/registry/bases/base/ui/icons/index.ts', import.meta.url).pathname },
    ],
    conditions: ['browser'],
  },
  test: { environment: 'jsdom', include: ['tests/dom/*.test.ts'] },
});
