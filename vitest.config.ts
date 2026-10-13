import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: [
      { find: /^\$ui\//, replacement: new URL('./packages/ui/src/lib/', import.meta.url).pathname },
      { find: /^@sveltery\/resizable$/, replacement: new URL('./packages/resizable/src/lib/index.ts', import.meta.url).pathname },
      { find: /^@sveltery\/ui\/icons$/, replacement: new URL('./packages/ui/src/lib/icons/index.ts', import.meta.url).pathname },
    ],
    conditions: ['browser'],
  },
  test: { environment: 'jsdom', include: ['tests/dom/*.test.ts'] },
});
