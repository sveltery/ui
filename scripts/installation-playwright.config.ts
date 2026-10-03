import { defineConfig } from '@playwright/test';
import { browserProjects } from './browser-projects';
const consumer = process.env.SVELTERY_INSTALLATION_CONSUMER;
if (!consumer) throw new Error('Run bash scripts/check-installation.sh --browser');
export default defineConfig({
  testMatch: process.env.SVELTERY_INSTALLATION_REMOTE === '1' ? '**/remote-fields.spec.ts' : undefined,
  testIgnore: process.env.SVELTERY_INSTALLATION_REMOTE === '1' ? undefined : '**/remote-fields.spec.ts',
  testDir: '../tests/installation', workers: 1, fullyParallel: false, retries: 0, reporter: [['list']],
  projects: browserProjects,
  use: {
    baseURL: 'http://127.0.0.1:5174', viewport: { width: 1280, height: 900 },
    colorScheme: 'light', reducedMotion: 'no-preference',
  },
  webServer: {
    command: 'pnpm dev --port 5174 --strictPort',
    cwd: consumer, url: 'http://127.0.0.1:5174', reuseExistingServer: false,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
  },
});
