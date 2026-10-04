// Isolated experimental bounds; ordinary projects, predicates and timings are untouched.
import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { browserProjects } from '../../scripts/browser-projects';

const root = fileURLToPath(new URL('../../', import.meta.url));
const chromium = browserProjects.filter(project => project.name === 'chromium');
const launchOptions = chromium[0]?.use as { launchOptions?: { chromiumSandbox?: boolean } } | undefined;
if (chromium.length !== 1 || launchOptions?.launchOptions?.chromiumSandbox !== true) throw new Error('Expected the existing secured Chromium project');
export default defineConfig({
  testDir: '.', testMatch: 'segmentation.spec.ts', workers: 1, fullyParallel: false, retries: 0,
  timeout: 180_000, globalTimeout: 600_000, reporter: [['list']],
  outputDir: '../../.checks/alert-child-segmentation-results', projects: chromium,
  use: { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, locale: 'en-US', colorScheme: 'light', reducedMotion: 'no-preference' },
  webServer: [
    { command: 'node node_modules/vite/bin/vite.js --config tests/reference/themes/reference-app/vite.config.ts --host 127.0.0.1 --port 5175 --strictPort', cwd: root, url: 'http://127.0.0.1:5175', reuseExistingServer: false, gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 } },
    { command: 'SVELTERY_ALERT_SEGMENTATION_VARIANT=split node node_modules/vite/bin/vite.js --config diagnostics/alert-child-segmentation/vite.config.ts --host 127.0.0.1 --port 5176 --strictPort', cwd: root, url: 'http://127.0.0.1:5176', reuseExistingServer: false, gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 } },
    { command: 'SVELTERY_ALERT_SEGMENTATION_VARIANT=joined node node_modules/vite/bin/vite.js --config diagnostics/alert-child-segmentation/vite.config.ts --host 127.0.0.1 --port 5177 --strictPort', cwd: root, url: 'http://127.0.0.1:5177', reuseExistingServer: false, gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 } },
  ],
});
