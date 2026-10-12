import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', workers: 1, fullyParallel: false, retries: 0, reporter: [['list']],
  projects: [
    // CHROMIUM_PATH runs a preinstalled local Chromium, typically as root in a container where the sandbox cannot start.
    { name: 'chromium', use: { browserName: 'chromium', launchOptions: { executablePath: process.env.CHROMIUM_PATH, chromiumSandbox: !process.env.CHROMIUM_PATH } } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  use: { baseURL: 'http://127.0.0.1:5173', viewport: { width: 1280, height: 900 }, locale: 'en-US', colorScheme: 'light' },
  webServer: [
    {
      // The fixture imports the parent Kit config, so sync it before either server starts.
      command: 'pnpm --dir .. exec svelte-kit sync && node ../../../node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5174 --strictPort',
      cwd: './apps/docs/remote-fields-fixture', url: 'http://127.0.0.1:5174', reuseExistingServer: false,
    },
    {
      command: 'node ../../node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173 --strictPort',
      cwd: './apps/docs', url: 'http://127.0.0.1:5173', reuseExistingServer: false,
    },
  ],
});
