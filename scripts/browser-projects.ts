import type { Project } from '@playwright/test';

// Keep native engine launches separate so a local Chromium executable cannot leak into another engine.
export const browserProjects: Project[] = [
  { name: 'chromium', use: { browserName: 'chromium', launchOptions: { chromiumSandbox: true, executablePath: process.env.DIALOG_CHROMIUM_PATH } } },
  { name: 'firefox', use: { browserName: 'firefox' } },
  { name: 'webkit', use: { browserName: 'webkit' } },
];
