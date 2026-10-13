import { expect, test, type Page } from '@playwright/test';

const single = (page: Page) => page.getByRole('region', { name: 'Single' });
const range = (page: Page) => page.getByRole('region', { name: 'Range' });

test.beforeEach(async ({ page }) => {
  await page.goto('/calendar');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

test('arrow keys, End and Page Down move focus through the grid and skip disabled days', async ({ page }) => {
  const grid = single(page);
  await grid.getByRole('button', { name: 'Today, Wednesday, June 18th, 2025, selected' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(grid.getByRole('button', { name: 'Friday, June 20th, 2025' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(grid.getByRole('button', { name: 'Friday, June 27th, 2025' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(grid.getByRole('button', { name: 'Saturday, June 28th, 2025' })).toBeFocused();
  await page.keyboard.press('PageDown');
  await expect(grid.getByRole('grid')).toHaveAccessibleName('July 2025');
  await expect(grid.getByRole('button', { name: 'Monday, July 28th, 2025' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('single')).toHaveText('2025-07-28');
});

test('only the selected day takes Tab focus', async ({ page }) => {
  const days = single(page).locator('[data-day] button');
  await expect(single(page).locator('button[tabindex="0"]')).toHaveAccessibleName('Today, Wednesday, June 18th, 2025, selected');
  await expect(days.and(page.locator('[tabindex="-1"]'))).toHaveCount((await days.count()) - 1);
});

test('disabled days cannot be selected', async ({ page }) => {
  const disabled = single(page).getByRole('button', { name: 'Thursday, June 19th, 2025' });
  await expect(disabled).toBeDisabled();
  await expect(single(page).locator('[data-day="2025-06-22"]')).toHaveAttribute('data-disabled', 'true');
  await disabled.click({ force: true });
  await expect(page.getByTestId('single')).toHaveText('2025-06-18');
});

test('a range takes two clicks across months and marks the days between', async ({ page }) => {
  const grid = range(page);
  await expect(grid.getByRole('grid')).toHaveCount(2);
  await expect(grid.getByRole('button', { name: 'Wednesday, June 4th, 2025' })).toBeDisabled();
  await grid.getByRole('grid', { name: 'June 2025' }).getByRole('button', { name: 'Monday, June 30th, 2025' }).click();
  await expect(page.getByTestId('range')).toHaveText('2025-06-30 to 2025-06-30');
  await grid.getByRole('grid', { name: 'July 2025' }).getByRole('button', { name: 'Thursday, July 3rd, 2025' }).click();
  await expect(page.getByTestId('range')).toHaveText('2025-06-30 to 2025-07-03');
  const july = grid.getByRole('grid', { name: 'July 2025' });
  await expect(july.locator('[data-range-start=true]')).toHaveText(['30']);
  await expect(july.locator('[data-range-middle=true]')).toHaveText(['1', '2']);
  await expect(july.locator('[data-range-end=true]')).toHaveText(['3']);
  await grid.getByRole('button', { name: 'Go to the Next Month' }).click();
  await expect(grid.getByRole('grid').first()).toHaveAccessibleName('July 2025');
});
