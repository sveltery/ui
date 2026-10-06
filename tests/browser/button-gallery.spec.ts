import { expect, test } from '@playwright/test';
import { buttonGalleryLibraries, buttonGalleryStyles, buttonWrapper, assertButtonGallery, buttonGalleryTree, buttonGalleryMeasurements, buttonGalleryTheme, settleButtonTransitions, buttonGalleryNativeActions, buttonGalleryQueryDefaults } from './button-gallery-cases';
test('genuine Button server hosts survive hydration with strict native attributes and original child bytes', async ({ page }) => {
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
  await page.goto('/button-gallery', { waitUntil: 'commit' });
  await expect(page.locator(buttonWrapper + ' button')).toHaveCount(124);
  await page.evaluate(() => {
    const wrapper = document.querySelector('[data-slot=example-wrapper]')!;
    (window as unknown as { buttonSSR: Element[] }).buttonSSR = [wrapper.parentElement!, wrapper, ...wrapper.querySelectorAll('*')].filter(n => n.namespaceURI === 'http://www.w3.org/1999/xhtml');
  });
  expect(await page.evaluate(() => (window as unknown as { buttonSSR: Element[] }).buttonSSR.length)).toBe(168);
  release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true'); await assertButtonGallery(page);
  expect(await page.evaluate(() => {
    const wrapper = document.querySelector('[data-slot=example-wrapper]')!;
    const current = [wrapper.parentElement!, wrapper, ...wrapper.querySelectorAll('*')].filter(n => n.namespaceURI === 'http://www.w3.org/1999/xhtml');
    return current.every((n, i) => n === (window as unknown as { buttonSSR: Element[] }).buttonSSR[i]);
  })).toBe(true);
});
for (const library of buttonGalleryLibraries) test('six genuine Button bodies and ' + library + ' glyphs match complete original tree', async ({ page, context }) => {
  const original = await context.newPage(); const errors: string[] = [];
  for (const current of [page, original]) current.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto('/button-gallery?library=' + library); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await original.goto('http://127.0.0.1:5175/button-gallery?library=' + library);
    await assertButtonGallery(page, library); await assertButtonGallery(original, library);
    expect(await buttonGalleryTree(page)).toEqual(await buttonGalleryTree(original));
    await buttonGalleryNativeActions(page); await buttonGalleryNativeActions(original);
    expect(errors).toEqual([]);
  } finally { await original.close(); }
});
for (const style of buttonGalleryStyles) test('six genuine Button bodies match original ' + style + ' responsive light/dark and focus CSS', async ({ page, context }) => {
  const original = await context.newPage();
  try {
    await page.goto('/button-gallery'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await original.goto('http://127.0.0.1:5175/button-gallery');
    await assertButtonGallery(page); await assertButtonGallery(original);
    for (const dark of [false, true]) for (const width of [390, 640, 768, 1024, 1536]) {
      for (const current of [page, original]) { await current.setViewportSize({ width, height: 1400 }); await buttonGalleryTheme(current, style, dark); }
      expect(await buttonGalleryMeasurements(page)).toEqual(await buttonGalleryMeasurements(original));
      // Programmatic focus followed by trusted keyboard input supplies a shared focus-visible modality.
      for (const current of [page, original]) { const button = current.locator(buttonWrapper + ' button').first(); await button.focus(); await button.press('ArrowRight'); await expect(button).toBeFocused(); await settleButtonTransitions(current); }
      expect(await buttonGalleryMeasurements(page)).toEqual(await buttonGalleryMeasurements(original));
      for (const current of [page, original]) await current.locator(buttonWrapper + ' button').first().evaluate(n => n.blur());
      for (const current of [page, original]) await settleButtonTransitions(current);
    }
  } finally { await original.close(); }
});

test('genuine literal parser preserves defaults, invalid inputs and first repeated library value', async ({ page, context }) => {
  const original = await context.newPage();
  try { await buttonGalleryQueryDefaults(page, original); }
  finally { await original.close(); }
});
