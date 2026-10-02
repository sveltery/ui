import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', workers: 1, fullyParallel: false, retries: 0, reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:5173', browserName: 'chromium', viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1, locale: 'en-US', colorScheme: 'light', reducedMotion: 'no-preference',
    launchOptions: { chromiumSandbox: true, executablePath: process.env.DIALOG_CHROMIUM_PATH },
  },
  webServer: [
    {
      command: 'node node_modules/vite/bin/vite.js --config tests/reference/themes/reference-app/vite.config.ts --host 127.0.0.1 --port 5175 --strictPort',
      url: 'http://127.0.0.1:5175', reuseExistingServer: false,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    },
    {
      command: 'node ../../node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173',
      cwd: './apps/docs', url: 'http://127.0.0.1:5173', reuseExistingServer: false,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    },
    {
      command: 'node ../../../node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5174 --strictPort',
      cwd: './apps/docs/remote-fields-fixture', url: 'http://127.0.0.1:5174', reuseExistingServer: false,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    },
  ],
});
