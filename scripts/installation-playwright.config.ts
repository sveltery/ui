import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { browserProjects } from './browser-projects';
const consumer = process.env.SVELTERY_INSTALLATION_CONSUMER;
if (!consumer) throw new Error('Run bash scripts/check-installation.sh --browser');
export default defineConfig({
  testMatch: process.env.SVELTERY_INSTALLATION_REMOTE === '1' ? ['**/remote-fields.spec.ts', '**/avatar.spec.ts', '**/aspect-ratio.spec.ts', '**/kbd.spec.ts', '**/alert.spec.ts', '**/empty.spec.ts', '**/textarea-gallery.spec.ts', '**/button-gallery.spec.ts'] : undefined,
  testIgnore: process.env.SVELTERY_INSTALLATION_REMOTE === '1' ? undefined : '**/remote-fields.spec.ts',
  testDir: '../tests/installation', workers: 1, fullyParallel: false, retries: 0, reporter: [['list']],
  projects: browserProjects,
  use: {
    baseURL: 'http://127.0.0.1:5174', viewport: { width: 1280, height: 900 },
    colorScheme: 'light', reducedMotion: 'no-preference',
  },
  webServer: [{
    command: 'pnpm dev --port 5174 --strictPort',
    cwd: consumer, url: 'http://127.0.0.1:5174', reuseExistingServer: false,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
  }, {
    // Actual unchanged original source and complete CSS for paired pointer states.
    command: 'node node_modules/vite/bin/vite.js --config tests/reference/themes/reference-app/vite.config.ts --host 127.0.0.1 --port 5175 --strictPort',
    cwd: fileURLToPath(new URL('..', import.meta.url)),
    url: 'http://127.0.0.1:5175', reuseExistingServer: false,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
  }],
});
