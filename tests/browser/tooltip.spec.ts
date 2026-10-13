import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tooltip');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

test('a tooltip opens on hover and on keyboard focus, and Escape closes it', async ({ page }) => {
  const content = page.locator('[data-slot=tooltip-content][data-open]');
  await page.getByRole('button', { name: 'Save' }).hover();
  await expect(content).toHaveText('Save changes');
  await expect(content).toHaveAttribute('data-side', 'top');

  await page.getByRole('button', { name: 'Elsewhere' }).hover();
  await expect(content).toHaveCount(0);

  await page.getByRole('button', { name: 'Save' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Share' })).toBeFocused();
  await expect(content).toHaveText('Share with your team');
  await expect(content).toHaveAttribute('data-side', 'bottom');
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
});

test('a hover card opens on hover and stays open while the pointer moves into it', async ({ page }) => {
  const card = page.locator('[data-slot=hover-card-content]');
  await page.getByRole('link', { name: '@sveltery' }).hover();
  await expect(card).toContainText('Svelte components on Base UI behavior.');

  await card.getByRole('link', { name: 'Repository' }).hover();
  await expect(card).toBeVisible();

  await page.getByRole('button', { name: 'Elsewhere' }).hover();
  await expect(card).toHaveCount(0);
});
