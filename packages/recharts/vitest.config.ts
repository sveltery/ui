import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'recharts',
    environment: 'jsdom',
    globals: true,
    restoreMocks: true,
    include: ['test/**/*.spec.ts'],
    setupFiles: ['./test/vitest.setup.ts', './test/helper/toBeRechartsScale.ts', './test/helper/expectStackGroups.ts', './test/helper/expectFunctionReturning.ts'],
  },
});
