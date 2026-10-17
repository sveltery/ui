import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'resizable',
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    setupFiles: './vitest.setup.ts'
  }
});
