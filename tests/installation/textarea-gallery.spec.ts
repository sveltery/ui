// Authored actual fresh gallery delivery checks, not ordinary upstream test ports.
import { expect, test } from '@playwright/test';
import { assertTextareaGallery, textareaGalleryTree, textareaGalleryMeasurements, textareaGalleryTheme } from '../browser/textarea-gallery-cases';
test('fresh package/source-copy genuine two-body Textarea gallery matches complete original CSS', async ({ page, context }) => {
  const original = await context.newPage();
  try {
    await page.goto('/textarea-gallery'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await original.goto('http://127.0.0.1:5175/textarea-gallery');
    await assertTextareaGallery(page); await assertTextareaGallery(original);
    expect(await textareaGalleryTree(page)).toEqual(await textareaGalleryTree(original));
    for (const width of [390, 1280]) {
      for (const current of [page, original]) { await current.setViewportSize({ width, height: 1400 }); await textareaGalleryTheme(current, 'nova', false); }
      expect(await textareaGalleryMeasurements(page)).toEqual(await textareaGalleryMeasurements(original));
    }
    const fields = page.locator('[data-slot=example-wrapper] textarea');
    await fields.nth(0).fill('Actual fresh consumer'); await expect(fields.nth(0)).toHaveValue('Actual fresh consumer');
    await expect(fields.nth(1)).toHaveAttribute('aria-invalid', 'true');
  } finally { await original.close(); }
});
