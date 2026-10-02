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
