// Supplemental source-derived comparisons executing actual immutable wrappers, not an upstream test-port inventory.
import { expect, test, type Page } from '@playwright/test';
import { alertLifecycleCases, alertNativeAssertions } from './alert-cases';
alertLifecycleCases();
const selector = '[data-testid="composition"] *, [data-testid="selectors"] *';
async function snapshot(page: Page) {
  return page.locator(selector).evaluateAll(nodes => nodes.map(node => ({
    tag: node.tagName, attrs: Object.fromEntries([...node.attributes].filter(attr => attr.name !== 'data-probed').map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))),
    text: node.textContent?.replace(/\s+/g, ' ').trim(),
  })));
}
async function measurements(page: Page) {
  return page.locator(selector).evaluateAll(nodes => nodes.map(node => {
    const css = getComputedStyle(node); const rect = node.getBoundingClientRect();
    return { width: rect.width, height: rect.height, display: css.display, position: css.position, gridTemplateColumns: css.gridTemplateColumns, gridColumnStart: css.gridColumnStart, gridRow: css.gridRow, gap: css.gap, padding: css.padding, margin: css.margin, fontSize: css.fontSize, fontWeight: css.fontWeight, color: css.color, backgroundColor: css.backgroundColor, border: css.border, borderRadius: css.borderRadius, textWrap: css.textWrap, transform: css.transform, top: css.top, right: css.right, textDecoration: css.textDecoration };
  }));
}
test('paired pinned React/Svelte four native parts retain SSR host identity through hydration', async ({ page, context }) => {
  const reference = await context.newPage(); const pairs = [[page, '/alert-probe'], [reference, '/alert-probe-reference']] as const;
  const errors: string[] = [];
  for (const [current] of pairs) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
  await Promise.all(pairs.map(async ([current, route]) => { await current.goto(route); await expect(current.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'true'); }));
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  for (const [current] of pairs) await current.route('**/*', async requestRoute => { if (requestRoute.request().resourceType() === 'script') await gate; await requestRoute.continue(); });
  try {
    const captured = [];
    for (const [current, route] of pairs) {
      await current.goto(route, { waitUntil: 'commit' }); await expect(current.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'false');
      const hosts = await current.locator(selector).elementHandles(); expect(hosts.length).toBeGreaterThan(30); captured.push({ current, hosts });
    }
    const before = await snapshot(page); expect(before).toEqual(await snapshot(reference)); release();
    for (const { current, hosts } of captured) {
      await expect(current.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'true');
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector, index })).toBe(true);
      expect(await snapshot(current)).toEqual(before);
    }
    expect(errors).toEqual([]);
  } finally { release(); await reference.close(); }
});
for (const width of [1280, 390]) for (const theme of ['light', 'dark']) test(`paired Alert native behavior and Nova selector/style witnesses at ${width}px ${theme}`, async ({ page, context }, testInfo) => {
  const reference = await context.newPage(); const errors: string[] = [];
  for (const current of [page, reference]) {
    current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await current.setViewportSize({ width, height: 1400 });
  }
  await page.goto('/alert-probe'); await reference.goto('/alert-probe-reference');
  for (const current of [page, reference]) {
    await expect(current.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'true');
    if (theme === 'dark') await current.evaluate(() => document.documentElement.classList.add('dark'));
  }
  expect(await snapshot(page)).toEqual(await snapshot(reference)); expect(await measurements(page)).toEqual(await measurements(reference));
  await alertNativeAssertions(page); await alertNativeAssertions(reference);
  expect(await snapshot(page)).toEqual(await snapshot(reference)); expect(await measurements(page)).toEqual(await measurements(reference)); expect(errors).toEqual([]);
  await testInfo.attach(`svelte-alert-${width}-${theme}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await testInfo.attach(`pinned-react-alert-${width}-${theme}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' });
  await reference.close();
});
test('bounded Basic function preserves paired text, roles, classes and desktop/mobile measurements', async ({ page, context }) => {
  const reference = await context.newPage();
  for (const width of [1280, 390]) {
    for (const current of [page, reference]) await current.setViewportSize({ width, height: 1000 });
    await page.goto('/alert'); await reference.goto('/alert-reference');
    for (const current of [page, reference]) await expect(current.locator('[data-alert-gallery]')).toHaveAttribute('data-hydrated', 'true');
    const semantic = (current: Page) => current.locator('[data-alert-gallery] [role="alert"], [data-alert-gallery] [data-slot="alert-title"], [data-alert-gallery] [data-slot="alert-description"], [data-alert-gallery] h2').evaluateAll(nodes => nodes.map(node => {
      const rect = node.getBoundingClientRect(); const css = getComputedStyle(node);
      return { tag: node.tagName, text: node.textContent?.replace(/\s+/g, ' ').trim(), class: node.className, role: node.getAttribute('role'), slot: node.getAttribute('data-slot'), width: rect.width, height: rect.height, color: css.color, fontSize: css.fontSize };
    }));
    expect(await semantic(page)).toEqual(await semantic(reference)); await expect(page.locator('[data-alert-gallery] [role="alert"]')).toHaveCount(3);
  }
  await reference.close();
});
