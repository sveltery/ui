import { defineConfig } from '@playwright/test';
import { browserProjects } from './scripts/browser-projects';
const preview = process.env.SVELTERY_DOCS_PREVIEW;
if (preview !== undefined && preview !== '1') throw new Error('SVELTERY_DOCS_PREVIEW must be 1 when supplied');
export default defineConfig({
  testDir: './tests/browser', workers: 1, fullyParallel: false, retries: 0, reporter: [['list']],
  projects: browserProjects,
  use: {
    baseURL: 'http://127.0.0.1:5173', viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1, locale: 'en-US', colorScheme: 'light', reducedMotion: 'no-preference',
  },
  webServer: [
    // Kit writes the nested fixture tsconfig at startup; finish before the parent Docs watcher starts.
    {
      command: 'node ../../../node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5174 --strictPort',
      cwd: './apps/docs/remote-fields-fixture', url: 'http://127.0.0.1:5174', reuseExistingServer: false,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    },
    {
      command: 'node node_modules/vite/bin/vite.js --config tests/reference/themes/reference-app/vite.config.ts --host 127.0.0.1 --port 5175 --strictPort',
      url: 'http://127.0.0.1:5175', reuseExistingServer: false,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    },
    {
      command: preview === '1'
        ? 'node ../../node_modules/vite/bin/vite.js build && node ../../node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 5173 --strictPort'
        : 'node ../../node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173',
      cwd: './apps/docs', url: 'http://127.0.0.1:5173', reuseExistingServer: false,
      timeout: 120000,
      stdout: 'pipe',
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    },
  ],
});
