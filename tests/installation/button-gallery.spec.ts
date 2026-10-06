// Actual four fresh package/source-copy documented/experimental phases; authored supplement.
import { expect, test } from '@playwright/test';
import { buttonGalleryLibraries, assertButtonGallery, buttonGalleryTree, buttonGalleryMeasurements, buttonGalleryTheme, buttonGalleryNativeActions, buttonGalleryQueryDefaults } from '../browser/button-gallery-cases';
for (const library of buttonGalleryLibraries) test('fresh genuine Button gallery preserves ' + library + ' source tree, attrs and native interaction', async ({ page, context }) => {
  const original = await context.newPage();
  try {
    await page.goto('/button-gallery?library=' + library); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await original.goto('http://127.0.0.1:5175/button-gallery?library=' + library);
    await assertButtonGallery(page, library); await assertButtonGallery(original, library);
    expect(await buttonGalleryTree(page)).toEqual(await buttonGalleryTree(original));
    for (const width of [390, 1280]) {
      for (const current of [page, original]) { await current.setViewportSize({ width, height: 1400 }); await buttonGalleryTheme(current, 'nova', false); }
      expect(await buttonGalleryMeasurements(page)).toEqual(await buttonGalleryMeasurements(original));
    }
    await buttonGalleryNativeActions(page); await buttonGalleryNativeActions(original);
  } finally { await original.close(); }
});

test('genuine literal parser preserves defaults, invalid inputs and first repeated library value', async ({ page, context }) => {
  const original = await context.newPage();
  try { await buttonGalleryQueryDefaults(page, original); }
  finally { await original.close(); }
});
