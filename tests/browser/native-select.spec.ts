import { expect, test } from '@playwright/test';

test('native select picks, binds, submits and resets with its form', async ({ page }) => {
  await page.goto('/native-select');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  const plain = page.getByLabel('Plain');
  const bound = page.getByLabel('Bound', { exact: true });
  const many = page.getByLabel('Many');

  await bound.selectOption('cherry');
  await plain.selectOption('apple');
  await many.selectOption(['b']);
  await expect(page.getByTestId('bound')).toHaveText('cherry');
  await expect(page.getByTestId('many')).toHaveText('b');

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByTestId('submitted')).toHaveText('bound=cherry&plain=apple&many=b');

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(plain).toHaveValue('banana');
  await expect(bound).toHaveValue('banana');
  await expect(many.locator('option:checked')).toHaveText(['A', 'C']);
  await expect(page.getByTestId('bound')).toHaveText('banana');
  await expect(page.getByTestId('many')).toHaveText('a,c');
});
