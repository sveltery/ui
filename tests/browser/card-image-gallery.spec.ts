import { expect, test } from '@playwright/test';
import { assertCardImages, cardImageTree, cardImageTextBounds, cardImageMeasurements, cardImageTheme, assertCardImageGeometry, cardImageStyles, cardImageLibraries, cardImageHosts, cardImageHydrated, settleCardImages } from './card-image-gallery-cases';

// Reference is independently client mounted; only native SSR host identity is claimed here.
test('two original Card image galleries retain native SSR HTML hosts through hydration', async ({ page, context }) => {
  const reference = await context.newPage(); const errors: string[] = [];
  for (const current of [page, reference]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  try {
    await reference.goto('/card-images-reference'); await expect(reference.locator(cardImageHydrated)).toHaveAttribute('data-hydrated', 'true'); await assertCardImages(reference);
    const originalCount = await reference.locator(cardImageHosts).evaluateAll(nodes => nodes.filter(node => node.namespaceURI === 'http://www.w3.org/1999/xhtml').length);
    expect(originalCount).toBeGreaterThan(0);
    await page.goto('/card-images'); await assertCardImages(page);
    await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
    await page.goto('/card-images', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    const hosts = await page.locator(cardImageHosts).elementHandles();
    const nativeHTML = []; for (const host of hosts) if (await host.evaluate(node => node.namespaceURI === 'http://www.w3.org/1999/xhtml')) nativeHTML.push(host);
    expect(nativeHTML).toHaveLength(originalCount);
    release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true'); await assertCardImages(page);
    for (const host of nativeHTML) expect(await host.evaluate(node => node.isConnected && [...document.querySelectorAll('div:has(> [data-slot=example-wrapper]), [data-slot=example-wrapper], [data-slot=example-wrapper] *')].includes(node))).toBe(true);
    expect(await cardImageTree(page)).toEqual(await cardImageTree(reference));
    expect(await cardImageTextBounds(page)).toEqual(await cardImageTextBounds(reference)); expect(errors).toEqual([]);
  } finally { release?.(); await reference.close(); }
});

for (const library of cardImageLibraries) test('genuine Card images and ' + library + ' icons preserve full original CSS/tree/individual text bounds', async ({ page, context }) => {
  test.setTimeout(120_000); // New finite paired source matrix; no existing deadline changes.
  const reference = await context.newPage(); const errors: string[] = [];
  try {
    for (const [current, route] of [[page, '/card-images?library=' + library], [reference, 'http://127.0.0.1:5175/card-images?library=' + library]] as const) {
      current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await current.goto(route); await settleCardImages(current);
    }
    const styles = library === 'lucide' ? cardImageStyles : ['nova'];
    for (const style of styles) for (const dark of [false, true]) for (const width of [390, 768, 1536]) {
      await test.step(style + '/' + dark + '/' + width, async () => {
        for (const current of [page, reference]) { await current.setViewportSize({ width, height: 1600 }); await cardImageTheme(current, style, dark); await assertCardImages(current); await assertCardImageGeometry(current); }
        expect(await cardImageTree(page)).toEqual(await cardImageTree(reference));
        expect(await cardImageTextBounds(page)).toEqual(await cardImageTextBounds(reference));
        expect(await cardImageMeasurements(page)).toEqual(await cardImageMeasurements(reference));
      });
    }
    expect(errors).toEqual([]);
  } finally { await reference.close(); }
});
