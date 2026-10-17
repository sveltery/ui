import { expect, test } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

test('sidebar-16 previews 800px tall (798px inside its border) and sidebar-15 at the default 930px (928px)', async ({ page }) => {
  await page.goto('/blocks/sidebar');
  await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 30_000 });
  const height = (id: string) => page.locator(`#${id} iframe`).evaluate((frame) => frame.getBoundingClientRect().height);
  expect(await height('sidebar-16')).toBe(798);
  expect(await height('sidebar-15')).toBe(928);
});
