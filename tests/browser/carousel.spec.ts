import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/carousel');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

test('carousel exposes a region of slides', async ({ page }) => {
  const region = page.getByRole('region');
  await expect(region).toHaveAttribute('aria-roledescription', 'carousel');
  await expect(region.getByRole('group')).toHaveText(['One', 'Two', 'Three']);
  await expect(region.getByRole('group').first()).toHaveAttribute('aria-roledescription', 'slide');
});

test('previous and next buttons move between slides and disable at the ends', async ({ page }) => {
  const previous = page.getByRole('button', { name: 'Previous slide' });
  const next = page.getByRole('button', { name: 'Next slide' });
  const selected = page.getByTestId('selected');

  await expect(selected).toHaveText('0');
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();

  await next.click();
  await expect(selected).toHaveText('1');
  await expect(previous).toBeEnabled();

  await next.click();
  await expect(selected).toHaveText('2');
  await expect(next).toBeDisabled();

  await previous.click();
  await expect(selected).toHaveText('1');
  await expect(next).toBeEnabled();
});

test('arrow keys move between slides while focus is inside the carousel', async ({ page }) => {
  const selected = page.getByTestId('selected');
  await page.getByRole('button', { name: 'Next slide' }).focus();

  await page.keyboard.press('ArrowRight');
  await expect(selected).toHaveText('1');
  await page.keyboard.press('ArrowLeft');
  await expect(selected).toHaveText('0');
});

test('changing opts restarts Embla with the new options', async ({ page }) => {
  const previous = page.getByRole('button', { name: 'Previous slide' });
  await expect(previous).toBeDisabled();

  await page.getByLabel('Loop').check();
  await expect(previous).toBeEnabled();
  await previous.click();
  await expect(page.getByTestId('selected')).toHaveText('2');
});
