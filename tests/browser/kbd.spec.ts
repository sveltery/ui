import { expect, test, type Page } from '@playwright/test';
import { kbdConsumerCases } from './kbd-cases';
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
  expect(await measurements(page)).toEqual(await measurements(reference));
  const keys = await measurements(page); expect(keys[0].height).toBe(20); expect(keys[0].minWidth).toBe('20px'); expect(keys[0].fontSize).toBe('12px'); expect(keys[0].fontWeight).toBe('500'); expect(keys[0].pointerEvents).toBe('none'); expect(keys[0].userSelect).toBe('none');
  expect(keys.find(key => key.slot === 'kbd-group')?.gap).toBe('4px'); expect(keys.every(key => key.tag === 'KBD' && key.tabIndex === -1 && key.role === null)).toBe(true);
  expect(keys.at(-1)?.height).toBe(32); expect(keys.at(-1)?.padding).toBe('0px 12px');
  for (const current of [page, reference]) {
    await current.getByRole('button', { name: 'Before keys', exact: true }).focus(); await current.keyboard.press('Tab'); await expect(current.getByRole('button', { name: 'After keys', exact: true })).toBeFocused();
    await current.keyboard.press('k'); await current.keyboard.press('ArrowRight'); await expect(current.getByRole('button', { name: 'After keys', exact: true })).toBeFocused();
  }
  await testInfo.attach(`svelte-kbd-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' }); await testInfo.attach(`pinned-react-kbd-${width}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' }); await reference.close();
});
