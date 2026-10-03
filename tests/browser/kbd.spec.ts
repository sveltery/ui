import { expect, test, type Page } from '@playwright/test';
import { kbdConsumerCases } from './kbd-cases';
import { kbdWrapper, kbdHTMLHosts, kbdTree, kbdMeasurements, assertKbdGallery, settledKbd, kbdStyles, kbdLibraries, kbdTheme } from './kbd-gallery-cases';
kbdConsumerCases();
// Byte-exact upstream wrapper plus selected actual example bodies; see kbd-sources.json.
async function measurements(page: Page) {
  return page.locator('[data-gallery] kbd').evaluateAll(nodes => nodes.map(node => {
    const s = getComputedStyle(node); const rect = node.getBoundingClientRect();
    return { tag: node.tagName, slot: node.getAttribute('data-slot'), text: node.textContent, parent: node.parentElement?.tagName, samp: node.querySelector('samp')?.textContent ?? null, width: rect.width, height: rect.height, minWidth: s.minWidth, padding: s.padding, gap: s.gap, radius: s.borderRadius, fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, fontFamily: s.fontFamily, background: s.backgroundColor, color: s.color, display: s.display, align: s.alignItems, justify: s.justifyContent, pointerEvents: s.pointerEvents, userSelect: s.userSelect, tabIndex: (node as HTMLElement).tabIndex, role: node.getAttribute('role') };
  }));
}
for (const width of [1280, 390]) test(`Kbd Nova and five supported pinned examples match React at ${width}px`, async ({ page, context }, testInfo) => {
  await page.setViewportSize({ width, height: 1000 }); await page.goto('/kbd'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  const reference = await context.newPage(); await reference.setViewportSize({ width, height: 1000 }); await reference.goto('/kbd-reference'); await expect(reference.locator('[data-gallery]')).toBeVisible();
  await settledKbd(page); await settledKbd(reference);
  expect(await measurements(page)).toEqual(await measurements(reference));
  const keys = await measurements(page); expect(keys[0].display).toBe('flex'); expect(keys[0].height).toBe(20); expect(keys[0].minWidth).toBe('20px'); expect(keys[0].fontSize).toBe('12px'); expect(keys[0].fontWeight).toBe('500'); expect(keys[0].pointerEvents).toBe('none'); expect(keys[0].userSelect).toBe('none');
  expect(keys.find(key => key.slot === 'kbd-group')?.gap).toBe('4px'); expect(keys.every(key => key.tag === 'KBD' && key.tabIndex === -1 && key.role === null)).toBe(true);
  expect(keys.at(-1)?.height).toBe(32); expect(keys.at(-1)?.padding).toBe('0px 12px');
  for (const current of [page, reference]) {
    await current.getByRole('button', { name: 'Before keys', exact: true }).focus(); await current.keyboard.press('Tab'); await expect(current.getByRole('button', { name: 'After keys', exact: true })).toBeFocused();
    await current.keyboard.press('k'); await current.keyboard.press('ArrowRight'); await expect(current.getByRole('button', { name: 'After keys', exact: true })).toBeFocused();
  }
  await testInfo.attach(`svelte-kbd-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' }); await testInfo.attach(`pinned-react-kbd-${width}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' }); await reference.close();
});

test('seven genuine Kbd bodies retain all 48 SSR HTML hosts while cold Square glyphs settle', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/kbd'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.fallback(); });
  try {
    await page.goto('/kbd', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    const hosts = await page.locator(kbdHTMLHosts).elementHandles(); expect(hosts).toHaveLength(48);
    const before = await kbdTree(page, false); await expect(page.locator(`${kbdWrapper} svg.lucide-square`)).toHaveCount(5);
    release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true'); await settledKbd(page);
    for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: kbdHTMLHosts, index })).toBe(true);
    expect(await kbdTree(page, false)).toEqual(before); expect(errors).toEqual([]);
  } finally { release(); }
});
test('seven original Kbd galleries and five genuine icon libraries match complete original CSS in all eight styles', async ({ page, context }) => {
  test.setTimeout(180_000);
  const reference = await context.newPage(); const errors: string[] = [];
  for (const current of [page, reference]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
  try {
    for (const library of kbdLibraries) {
      await page.goto(`/kbd?library=${library}`); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
      await reference.goto(`http://127.0.0.1:5175/kbd?library=${library}`); await settledKbd(page); await settledKbd(reference);
      expect(await kbdTree(page)).toEqual(await kbdTree(reference));
      for (const width of [390, 1280]) {
        for (const current of [page, reference]) { await current.setViewportSize({ width, height: 1600 }); await kbdTheme(current, 'nova', false); }
        await assertKbdGallery(page, width, 'nova', library); await assertKbdGallery(reference, width, 'nova', library);
        expect(await kbdMeasurements(page)).toEqual(await kbdMeasurements(reference));
      }
    }
    await page.goto('/kbd'); await reference.goto('http://127.0.0.1:5175/kbd');
    for (const style of kbdStyles) for (const dark of [false, true]) for (const width of [390, 640, 768, 1024, 1536]) {
      await test.step(`${style} ${dark ? 'dark' : 'light'} ${width}px: both genuine seven-body galleries`, async () => {
        for (const current of [page, reference]) { await current.setViewportSize({ width, height: 1600 }); await kbdTheme(current, style, dark); }
        await assertKbdGallery(page, width, style); await assertKbdGallery(reference, width, style);
        expect(await kbdMeasurements(page)).toEqual(await kbdMeasurements(reference));
      });
    }
    expect(errors).toEqual([]);
  } finally { await reference.close(); }
});
