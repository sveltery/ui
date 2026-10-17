import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineProject } from 'vitest/config';

export default defineProject({
  plugins: [svelte()],
  resolve: { conditions: ['browser'] },
  test: {
    name: 'recharts',
    environment: 'jsdom',
    globals: true,
    restoreMocks: true,
    include: ['test/**/*.spec.ts', 'test/**/*.test.ts'],
    setupFiles: ['./test/vitest.setup.ts', './test/helper/toBeRechartsScale.ts', './test/helper/expectStackGroups.ts', './test/helper/expectFunctionReturning.ts'],
  },
});
