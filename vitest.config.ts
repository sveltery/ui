import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: [
      { find: /^\$ui\//, replacement: new URL('./apps/docs/registry/bases/base/ui/', import.meta.url).pathname },
      { find: /^@sveltery\/command$/, replacement: new URL('./packages/command/src/lib/index.ts', import.meta.url).pathname },
      { find: /^@sveltery\/message-scroller$/, replacement: new URL('./packages/message-scroller/src/lib/index.ts', import.meta.url).pathname },
      { find: /^@sveltery\/questionnaire$/, replacement: new URL('./packages/questionnaire/src/lib/index.ts', import.meta.url).pathname },
      { find: /^@sveltery\/resizable$/, replacement: new URL('./packages/resizable/src/lib/index.ts', import.meta.url).pathname },
    ],
    conditions: ['browser'],
  },
  test: { environment: 'jsdom', include: ['tests/dom/*.test.ts', 'packages/day-picker/src/**/*.test.ts', 'apps/docs/registry/*.test.ts', 'apps/docs/src/routes/init/*.test.ts', 'packages/cli/test/**/*.test.ts'] },
});
