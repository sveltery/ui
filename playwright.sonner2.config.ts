import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', workers: 1, fullyParallel: false, retries: 0, reporter: [['list']],
  projects: [{ name: 'chromium', use: { browserName: 'chromium', launchOptions: { executablePath: process.env.CHROMIUM_PATH } } }],
  use: { baseURL: 'http://127.0.0.1:5233', viewport: { width: 1280, height: 900 }, locale: 'en-US', colorScheme: 'light' },
  webServer: [{ command: 'node ../../node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5233 --strictPort', cwd: './tests/app', url: 'http://127.0.0.1:5233', reuseExistingServer: false }],
});
