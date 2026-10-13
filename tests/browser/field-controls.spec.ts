import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/field-controls');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

test('a Field labels and describes its Textarea and Native Select', async ({ page }) => {
  const bio = page.getByRole('textbox', { name: 'Bio' });
  await expect(bio).toHaveJSProperty('tagName', 'TEXTAREA');
  await expect(bio).toHaveAccessibleDescription('Shown on your profile.');
  await expect(page.getByRole('combobox', { name: 'Country' })).toHaveJSProperty('tagName', 'SELECT');
  await page.getByText('Country', { exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Country' })).toBeFocused();
});

test('submitting shows each field error, then the values once they are valid', async ({ page }) => {
  const bio = page.getByRole('textbox', { name: 'Bio' });
  const country = page.getByRole('combobox', { name: 'Country' });
  await bio.fill('');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('alert')).toHaveText(['Write a short bio.', 'Choose a country.']);
  await expect(bio).toHaveAttribute('aria-invalid', 'true');
  await expect(country).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByTestId('submitted')).toHaveText('');

  await bio.fill('Hi there');
  await country.selectOption('fr');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByTestId('submitted')).toHaveText('{"bio":"Hi there","country":"fr"}');
});

test('a disabled Field disables its Textarea and Native Select', async ({ page }) => {
  await expect(page.getByRole('textbox', { name: 'Notes' })).toBeDisabled();
  await expect(page.getByRole('combobox', { name: 'Region' })).toBeDisabled();
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
