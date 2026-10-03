import { expect, test } from '@playwright/test';
import { separatorMeasurements, separatorAssertions } from './separator-cases';
for (const width of [1280, 390]) for (const theme of ['light', 'dark']) test(`pinned Separator genuine orientation variants and native rendering at ${width}px ${theme}`, async ({ page, context }, testInfo) => {
 const reference = await context.newPage(); const errors: string[] = [];
 try {
  for (const current of [page, reference]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); await current.setViewportSize({ width, height: 900 }); }
  await page.goto('/separator-probe'); await reference.goto('/separator-probe-reference');
  for (const current of [page, reference]) { await expect(current.locator('[data-separator-probe]')).toHaveAttribute('data-hydrated', 'true'); if (theme === 'dark') await current.evaluate(() => { document.documentElement.classList.add('dark'); document.documentElement.style.setProperty('--border', 'rgb(77, 88, 99)'); }); }
  const baseline = await separatorMeasurements(reference); expect(await separatorMeasurements(page)).toEqual(baseline);
  await testInfo.attach('actual-react-complete-css-orientation', { body: JSON.stringify({ width, theme, baseline }, null, 2), contentType: 'application/json' });
  await separatorAssertions(page); await separatorAssertions(reference);
  await expect(reference.getByTestId('reference-clicks')).toHaveText('1');
  expect(await separatorMeasurements(page)).toEqual(await separatorMeasurements(reference));
  const nativeState = page.getByTestId('separator-state'); await expect(nativeState).toContainText('"clicks":1'); await expect(nativeState).toContainText('"attaches":2'); await expect(nativeState).toContainText('"detaches":1');
  expect(errors).toEqual([]);
 } finally { await reference.close(); }
});
test('all four actual Separator gallery compositions retain DOM content and paired geometry', async ({ page, context }) => {
 const reference = await context.newPage();
 try {
  await page.goto('/separator'); await reference.goto('/separator-reference');
  for (const current of [page, reference]) await expect(current.locator('[data-separator-gallery]')).toHaveAttribute('data-hydrated', 'true');
  const snapshot = (current: typeof page) => current.locator('[data-separator-gallery]').evaluate(node => ({ titles: [...node.querySelectorAll('[data-slot=example] > div:first-child')].map(item => item.textContent?.trim()), content: [...node.querySelectorAll('[data-slot=example-content]')].map(item => item.textContent?.replace(/\s+/g, ' ').trim()), slots: [...node.querySelectorAll('[role=separator]')].map(item => item.getAttribute('aria-orientation')) }));
  expect(await snapshot(page)).toEqual(await snapshot(reference)); expect(await page.locator('[role=separator]').count()).toBe(7);
  expect(await separatorMeasurements(page, '[data-separator-gallery] [role=separator]')).toEqual(await separatorMeasurements(reference, '[data-separator-gallery] [role=separator]'));
 } finally { await reference.close(); }
});
test('SSR Separator hosts survive actual hydration with no replaced nodes', async ({ page, context }) => {
 const reference = await context.newPage(); const errors: string[] = [];
 const pairs = [[page, '/separator-probe'], [reference, '/separator-probe-reference']] as const;
 for (const [current, route] of pairs) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); await current.goto(route, { waitUntil: 'networkidle' }); await expect(current.locator('[data-separator-probe]')).toHaveAttribute('data-hydrated', 'true'); }
 let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
 for (const [current] of pairs) await current.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
 try {
  const captured = [];
  for (const [current, route] of pairs) { await current.goto(route, { waitUntil: 'commit' }); await expect(current.locator('[data-separator-probe]')).toHaveAttribute('data-hydrated', 'false'); const hosts = await current.locator('[role=separator]').elementHandles(); expect(hosts.length).toBe(7); captured.push({ current, hosts }); }
  release();
  for (const { current, hosts } of captured) { await expect(current.locator('[data-separator-probe]')).toHaveAttribute('data-hydrated', 'true'); for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, index) => node.isConnected && node === document.querySelectorAll('[role=separator]')[index], index)).toBe(true); }
  expect(errors).toEqual([]);
 } finally { release(); await reference.close(); }
});
