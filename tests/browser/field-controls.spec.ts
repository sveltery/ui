import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/field-controls');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

test('a FieldLabel names its Textarea and Native Select through for', async ({ page }) => {
  const bio = page.getByRole('textbox', { name: 'Bio' });
  await expect(bio).toHaveJSProperty('tagName', 'TEXTAREA');
  await expect(bio).toHaveAccessibleDescription('Shown on your profile.');
  await expect(page.getByRole('combobox', { name: 'Country' })).toHaveJSProperty('tagName', 'SELECT');
  await page.getByText('Country', { exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Country' })).toBeFocused();
});

test('a native reset restores the Textarea and Native Select defaults', async ({ page }) => {
  const bio = page.getByRole('textbox', { name: 'Bio' });
  const country = page.getByRole('combobox', { name: 'Country' });
  await expect(bio).toHaveValue('Hello');
  await bio.fill('Changed');
  await country.selectOption('ca');
  await expect(page.getByTestId('country')).toHaveText('ca');

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(bio).toHaveValue('Hello');
  await expect(country).toHaveValue('');
  await expect(page.getByTestId('country')).toHaveText('');
});
