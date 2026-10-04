import { expect, test, type Page } from '@playwright/test';
import { emptyLifecycleCases, emptyNativeAssertions } from './empty-cases';
// Source-derived probes, not copied upstream assertions; see empty-sources.json.
emptyLifecycleCases();
const selector = '[data-empty-host], [data-testid="media-selectors"] > div';
async function snapshot(page: Page) {
  return page.locator(selector).evaluateAll(nodes => nodes.map(node => ({
    tag: node.tagName,
    attrs: Object.fromEntries([...node.attributes].filter(attr => !['data-probed', 'style'].includes(attr.name)).map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))),
    style: (node as HTMLElement).style.cssText,
    text: node.textContent,
  })));
}
async function measurements(page: Page) {
  return page.locator(`${selector}, [data-empty-probe] svg, [data-empty-probe] a`).evaluateAll(nodes => nodes.map(node => {
    const css = getComputedStyle(node); const rect = node.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, gap: css.gap, display: css.display, fontSize: css.fontSize, fontWeight: css.fontWeight, lineHeight: css.lineHeight, letterSpacing: css.letterSpacing, borderRadius: css.borderRadius, borderStyle: css.borderStyle, padding: css.padding, margin: css.margin, color: css.color, background: css.backgroundColor, pointerEvents: css.pointerEvents, flexShrink: css.flexShrink, textDecoration: css.textDecorationLine, underlineOffset: css.textUnderlineOffset };
  }));
}
test('paired pinned React and Svelte six Empty native SSR hosts retain identity through hydration', async ({ page, context }) => {
  const reference = await context.newPage(); const pairs = [[page, '/empty-probe'], [reference, '/empty-probe-reference']] as const;
  const errors: string[] = [];
  for (const [current] of pairs) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
  await Promise.all(pairs.map(async ([current, route]) => { await current.goto(route); await expect(current.locator('[data-empty-probe]')).toHaveAttribute('data-hydrated', 'true'); }));
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  for (const [current] of pairs) await current.route('**/*', async requestRoute => { if (requestRoute.request().resourceType() === 'script') await gate; await requestRoute.continue(); });
  try {
    const captured = [];
    for (const [current, route] of pairs) {
      await current.goto(route, { waitUntil: 'commit' }); await expect(current.locator('[data-empty-probe]')).toHaveAttribute('data-hydrated', 'false');
      const hosts = await current.locator(selector).elementHandles(); expect(hosts).toHaveLength(11); captured.push({ current, hosts });
    }
    const before = await snapshot(page); expect(before).toEqual(await snapshot(reference)); release();
    for (const { current, hosts } of captured) {
      await expect(current.locator('[data-empty-probe]')).toHaveAttribute('data-hydrated', 'true');
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector, index })).toBe(true);
      expect(await snapshot(current)).toEqual(before);
    }
    expect(errors).toEqual([]);
  } finally { release(); await reference.close(); }
});
for (const width of [1280, 390]) for (const theme of ['light', 'dark']) test(`paired Empty primitive native props and scoped Nova selectors at ${width}px ${theme} class context`, async ({ page, context }, testInfo) => {
  const reference = await context.newPage(); const errors: string[] = [];
  for (const current of [page, reference]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); await current.setViewportSize({ width, height: 1100 }); }
  await page.goto('/empty-probe'); await reference.goto('/empty-probe-reference');
  for (const current of [page, reference]) {
    await expect(current.locator('[data-empty-probe]')).toHaveAttribute('data-hydrated', 'true');
    if (theme === 'dark') await current.evaluate(() => {
      // Historical supplemental selector-context assertion has a fixed light-primary witness.
      // Genuine dark palette assertions independently use immutable tokens in themes.spec.ts.
      document.documentElement.style.setProperty('--primary', 'oklch(0.205 0 0)');
      document.documentElement.classList.add('dark');
    });
  }
  expect(await snapshot(page)).toEqual(await snapshot(reference)); expect(await measurements(page)).toEqual(await measurements(reference));
  await emptyNativeAssertions(page); await emptyNativeAssertions(reference);
  expect(await snapshot(page)).toEqual(await snapshot(reference)); expect(await measurements(page)).toEqual(await measurements(reference)); expect(errors).toEqual([]);
  await testInfo.attach(`svelte-empty-${width}-${theme}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await testInfo.attach(`pinned-react-empty-${width}-${theme}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' }); await reference.close();
});

import { assertEmptyGallery, emptyHTMLHosts, emptyTree, emptyMeasurements, emptyLibraries, emptyStyles, emptyTheme, settledEmpty, emptyTrustedActions } from './empty-gallery-cases';

test('four selected Empty galleries preserve all 48 warm SSR HTML hosts through hydration', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/empty'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true'); await settledEmpty(page);
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.fallback(); });
  try {
    await page.goto('/empty', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    const hosts = await page.locator(emptyHTMLHosts).elementHandles(); expect(hosts).toHaveLength(48);
    const before = await emptyTree(page, false); release();
    await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true'); await settledEmpty(page);
    for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: emptyHTMLHosts, index })).toBe(true);
    expect(await emptyTree(page, false)).toEqual(before); expect(errors).toEqual([]);
  } finally { release(); }
});
for (const library of emptyLibraries) test(`selected original Empty full composition and genuine ${library} glyphs match complete original CSS`, async ({ page, context }) => {
  const reference = await context.newPage(); const errors: string[] = [];
  for (const current of [page, reference]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
  try {
    await page.goto(`/empty?library=${library}`); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await reference.goto(`http://127.0.0.1:5175/empty?library=${library}`);
    await assertEmptyGallery(page, library); await assertEmptyGallery(reference, library);
    expect(await emptyTree(page)).toEqual(await emptyTree(reference));
    for (const width of [390, 1280]) {
      for (const current of [page, reference]) { await current.setViewportSize({ width, height: 1600 }); await emptyTheme(current, 'nova', false); }
      expect(await emptyMeasurements(page)).toEqual(await emptyMeasurements(reference));
    }
    expect(await emptyTrustedActions(page)).toEqual(await emptyTrustedActions(reference));
    expect(errors).toEqual([]);
  } finally { await reference.close(); }
});
for (const style of emptyStyles) test(`four selected Empty bodies match full original ${style} light/dark responsive classes and geometry`, async ({ page, context }) => {
  const reference = await context.newPage(); const errors: string[] = [];
  for (const current of [page, reference]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
  try {
    await page.goto('/empty'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true'); await reference.goto('http://127.0.0.1:5175/empty');
    await assertEmptyGallery(page); await assertEmptyGallery(reference);
    for (const dark of [false, true]) for (const width of [390, 640, 768, 1024, 1536]) {
      for (const current of [page, reference]) { await current.setViewportSize({ width, height: 1600 }); await emptyTheme(current, style, dark); }
      expect(await emptyMeasurements(page)).toEqual(await emptyMeasurements(reference));
    }
    expect(errors).toEqual([]);
  } finally { await reference.close(); }
});
