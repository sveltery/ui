import { expect, test } from '@playwright/test';

test('PaginationLink is a Base Button rendered as a link, so Space follows it', async ({ page }) => {
  await page.goto('/pagination');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached({ timeout: 30_000 });
  const link = page.locator('[data-slot=pagination-link]', { hasText: '2' });
  await expect(link).toHaveJSProperty('tagName', 'A');
  await expect(link).toHaveAttribute('href', '#page-2');
  await link.focus();
  await page.keyboard.press('Space');
  await expect(page).toHaveURL(/#page-2$/);
  await expect(link).toHaveAttribute('role', 'button');
});

test('caller key handlers run alongside Base, so Space still follows the link', async ({ page }) => {
  await page.goto('/pagination');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached({ timeout: 30_000 });
  const link = page.locator('[data-slot=pagination-link]', { hasText: '3' });
  await link.focus();
  await page.keyboard.press('Space');
  await expect(page.getByTestId('keys')).toHaveText('2');
  await expect(page).toHaveURL(/#page-3$/);
});
