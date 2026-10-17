// Captures the homepage card showcase as the light and dark images that phones show in its place.
// Run after changing a card: `node scripts/capture-home-cards.mjs`. CHROMIUM_PATH selects a preinstalled Chromium.
import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const repo = fileURLToPath(new URL('../', import.meta.url));
const docs = `${repo}apps/docs/`;
const origin = 'http://127.0.0.1:5186';
const server = spawn(process.execPath, [`${repo}node_modules/vite/bin/vite.js`, '--host', '127.0.0.1', '--port', '5186', '--strictPort'], { cwd: docs, stdio: 'ignore' });

try {
  for (let attempt = 0; ; attempt++) {
    if (server.exitCode !== null || attempt === 600) throw new Error('The docs dev server did not start.');
    try {
      if ((await fetch(origin, { signal: AbortSignal.timeout(1000) })).ok) break;
    } catch { /* The dev server may not be listening yet. */ }
    await setTimeout(100);
  }
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  try {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 1600 }, deviceScaleFactor: 2, colorScheme: theme });
      await context.addInitScript(value => localStorage.setItem('theme', value), theme);
      const page = await context.newPage();
      await page.goto(origin, { timeout: 120_000 });
      await page.locator('html[data-ready]').waitFor({ timeout: 120_000 });
      const demo = page.locator('[data-slot=demo]');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1000);
      const box = await demo.boundingBox();
      await page.screenshot({ path: `${docs}static/images/cards-${theme}.png`, fullPage: true, clip: { x: box.x, y: box.y, width: box.width, height: 1382 } });
      await context.close();
    }
  } finally {
    await browser.close();
  }
} finally {
  server.kill();
}
