import { expect, test, type Page } from '@playwright/test';
import { cardConsumerCases } from './card-cases';
cardConsumerCases();
// Paired source-derived probes; selected actual example bodies execute unchanged in the React reference.
async function measurements(page: Page) {
  return page.locator('[data-gallery] [data-slot]').evaluateAll(nodes => nodes.map(node => {
    const s = getComputedStyle(node); const rect = node.getBoundingClientRect();
    // Svelte retains whitespace between component tags; compare visible text chunks rather than their serialization.
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT); const parts: string[] = [];
    let textNode: Node | null;
    while ((textNode = walker.nextNode())) { const text = textNode.textContent?.replace(/\s+/g, ' ').trim(); if (text) parts.push(text); }
    return {
      tag: node.tagName, slot: node.getAttribute('data-slot'), size: node.getAttribute('data-size'), text: parts.join(' '),
      width: rect.width, height: rect.height, display: s.display, spacing: s.getPropertyValue('--card-spacing'), padding: s.padding, margin: s.margin,
      gap: s.gap, borderWidth: s.borderWidth, borderStyle: s.borderStyle, borderColor: s.borderColor, radius: s.borderRadius, shadow: s.boxShadow,
      background: s.backgroundColor, color: s.color, fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight,
      direction: s.flexDirection, align: s.alignItems, justify: s.justifyContent, gridColumns: s.gridTemplateColumns, gridRows: s.gridTemplateRows,
      column: s.gridColumn, row: s.gridRow, alignSelf: s.alignSelf, justifySelf: s.justifySelf, role: node.getAttribute('role'), tabIndex: (node as HTMLElement).tabIndex,
    };
  }));
}
for (const width of [1280, 390]) test(`Card seven selected examples and supplemental Nova probes match pinned React at ${width}px`, async ({ page, context }, testInfo) => {
  await page.setViewportSize({ width, height: 1600 }); await page.goto('/card'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  const reference = await context.newPage(); await reference.setViewportSize({ width, height: 1600 }); await reference.goto('/card-reference'); await expect(reference.locator('main > div > div')).toHaveAttribute('data-hydrated', 'true');
  const actual = await measurements(page); expect(actual).toEqual(await measurements(reference));
  expect(actual).toHaveLength(55);
  const cards = actual.filter(value => value.slot === 'card'); expect(cards).toHaveLength(8);
  expect(cards.map(value => value.size)).toEqual(['default', 'sm', 'default', 'default', 'default', 'sm', 'sm', 'default']);
  expect(cards[0].gap).toBe('16px'); expect(cards[1].gap).toBe('12px');
  expect(cards[0].display).toBe('flex'); expect(cards[0].direction).toBe('column');
  expect(actual.filter(value => value.tag === 'DIV').every(value => value.role === null && value.tabIndex === -1)).toBe(true);
  for (const current of [page, reference]) {
    const action = current.locator('[data-supplemental="action"] [data-slot="card-action"]');
    expect(await action.evaluate(node => { const s = getComputedStyle(node); return { column: s.gridColumnStart, rowStart: s.gridRowStart, rowEnd: s.gridRowEnd }; })).toEqual({ column: '2', rowStart: '1', rowEnd: 'span 2' });
    expect(await action.evaluate(node => getComputedStyle(node.parentElement!).gridTemplateColumns.split(' ').length)).toBe(2);
    const override = current.locator('[data-slot="custom-card"]'); await expect(override).toHaveAttribute('data-size', 'default');
    expect(await override.evaluate(node => { const s = getComputedStyle(node); return { direction: s.flexDirection, radius: s.borderRadius, padding: s.paddingTop }; })).toEqual({ direction: 'row', radius: '0px', padding: '8px' });
    const edge = current.locator('[data-gallery] > section').nth(2).locator('[data-slot="card-content"]');
    expect(await edge.evaluate(node => getComputedStyle(node).paddingLeft)).toBe('0px');
    expect(await edge.evaluate(node => getComputedStyle(node).marginBottom)).toBe('-16px');
  }
  await testInfo.attach(`svelte-card-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await testInfo.attach(`pinned-react-card-${width}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' });
  await reference.close();
});
