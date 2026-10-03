import { expect, test, type Page } from '@playwright/test';
import { cardConsumerCases, cardBodySelector, cardGallerySelector, cardGalleryHosts, cardGalleryHydrated, cardGallerySnapshot, assertCardGalleryScaffold, assertCardGalleryVariants } from './card-cases';
cardConsumerCases();
// Paired source-derived probes; selected actual example bodies execute unchanged in the React reference.
async function measurements(page: Page) {
  return page.locator(cardBodySelector).evaluateAll(nodes => nodes.map(node => {
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
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setViewportSize({ width, height: 1600 }); await page.goto('/card'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  const reference = await context.newPage();
  reference.on('pageerror', error => errors.push(error.message)); reference.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await reference.setViewportSize({ width, height: 1600 }); await reference.goto('/card-reference'); await expect(reference.locator('main > div > div')).toHaveAttribute('data-hydrated', 'true');
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
    const examples = current.locator(`${cardGallerySelector} > [data-slot="example"]`); await expect(examples).toHaveCount(7);
    const edge = examples.nth(2).locator('[data-slot="example-content"] [data-slot="card-content"]'); await expect(edge).toHaveCount(1);
    expect(await edge.evaluate(node => getComputedStyle(node).paddingLeft)).toBe('0px');
    expect(await edge.evaluate(node => getComputedStyle(node).marginBottom)).toBe('-16px');
  }
  await testInfo.attach(`svelte-card-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await testInfo.attach(`pinned-react-card-${width}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' });
  expect(errors).toEqual([]); await reference.close();
});

// Authored whole-source scaffold and native-host evidence, not an ordinary upstream test port.
test('seven genuine Card scaffolds preserve full original SSR hosts through hydration', async ({ page, context }) => {
  const reference = await context.newPage();
  const pairs = [[page, '/card'], [reference, '/card-reference']] as const;
  const errors: string[] = [];
  for (const [current] of pairs) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
  await Promise.all(pairs.map(async ([current, route]) => { await current.goto(route); await expect(cardGalleryHydrated(current)).toHaveAttribute('data-hydrated', 'true'); }));
  // The independent immutable-source SSR proof derives 74 actual native hosts, including shell/grid.
  // /card-reference uses its existing client mounting harness, so it supplies the source DOM/tree
  // before the native SSR document is withheld, rather than pretending it renders React SSR.
  const sourceCount = await reference.locator(cardGalleryHosts).count(); expect(sourceCount).toBe(74);
  const original = await cardGallerySnapshot(reference);
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
  try {
    await page.goto('/card', { waitUntil: 'commit' }); await expect(cardGalleryHydrated(page)).toHaveAttribute('data-hydrated', 'false');
    const hosts = await page.locator(cardGalleryHosts).elementHandles(); expect(hosts).toHaveLength(sourceCount);
    const before = await cardGallerySnapshot(page); expect(before).toEqual(original);
    release(); await expect(cardGalleryHydrated(page)).toHaveAttribute('data-hydrated', 'true');
    expect(await page.locator(cardGalleryHosts).count()).toBe(sourceCount);
    for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: cardGalleryHosts, index })).toBe(true);
    expect(await cardGallerySnapshot(page)).toEqual(before); expect(errors).toEqual([]);
  } finally { release(); await reference.close(); }
});
test('seven genuine Card scaffolds preserve original responsive layout and dark/Lyra/Sera selectors', async ({ page, context }) => {
  const reference = await context.newPage(); const errors: string[] = [];
  try {
    for (const [current, route] of [[page, '/card'], [reference, '/card-reference']] as const) {
      current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await current.goto(route); await expect(cardGalleryHydrated(current)).toHaveAttribute('data-hydrated', 'true');
    }
    for (const width of [390, 640, 768, 1024, 1536]) {
      await page.setViewportSize({ width, height: 1600 }); await reference.setViewportSize({ width, height: 1600 });
      expect(await assertCardGalleryScaffold(page, width, 1600)).toEqual(await assertCardGalleryScaffold(reference, width, 1600));
    }
    for (const current of [page, reference]) await assertCardGalleryVariants(current);
    expect(errors).toEqual([]);
  } finally { await reference.close(); }
});

// Independent document executes the genuine gallery with complete pinned globals/eight styles.
// The registered consumer radius mapping remains an explicit prior adaptation, not equal CSS.
test('actual Card gallery scaffold matches independent complete original CSS geometry and source variants', async ({ page, context }) => {
  const reference = await context.newPage(); const errors: string[] = [];
  try {
    for (const [current, route] of [[page, '/card'], [reference, 'http://127.0.0.1:5175/card']] as const) {
      current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await current.goto(route); await expect(cardGalleryHydrated(current)).toHaveAttribute('data-hydrated', 'true');
    }
    expect(await cardGallerySnapshot(page)).toEqual(await cardGallerySnapshot(reference));
    for (const width of [390, 640, 768, 1024, 1536]) {
      await page.setViewportSize({ width, height: 1600 }); await reference.setViewportSize({ width, height: 1600 });
      const actual = await assertCardGalleryScaffold(page, width, 1600); const original = await assertCardGalleryScaffold(reference, width, 1600, true);
      expect({ ...actual, examples: actual.examples.map(example => ({ ...example, radius: undefined })) }).toEqual({ ...original, examples: original.examples.map(example => ({ ...example, radius: undefined })) });
    }
    for (const current of [page, reference]) await assertCardGalleryVariants(current);
    expect(errors).toEqual([]);
  } finally { await reference.close(); }
});
