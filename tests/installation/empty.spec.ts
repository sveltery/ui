import { expect, test } from '@playwright/test';
import { emptyLifecycleCases, emptyNativeAssertions } from '../browser/empty-cases';

emptyLifecycleCases();
test('fresh archive/source-copy Empty native variants, selectors and reactive props at desktop/mobile widths', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.goto('/empty-probe');
    await expect(page.locator('[data-empty-probe]')).toHaveAttribute('data-hydrated', 'true');
    await emptyNativeAssertions(page);
  }
  expect(errors).toEqual([]);
});

import { assertEmptyGallery, emptyTree, emptyMeasurements, emptyLibraries, emptyStyles, emptyTheme, emptyTrustedActions } from '../browser/empty-gallery-cases';

// Every case also runs in the retained experimental remote-field archive/copy phases.
for (const library of emptyLibraries) test(`fresh selected Empty gallery retains genuine ${library} glyphs, full tree and trusted actions`, async ({ page, context }) => {
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
    expect(await emptyTrustedActions(page)).toEqual(await emptyTrustedActions(reference)); expect(errors).toEqual([]);
  } finally { await reference.close(); }
});
for (const style of emptyStyles) test(`fresh selected Empty gallery matches complete original ${style} light/dark responsive geometry`, async ({ page, context }) => {
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
