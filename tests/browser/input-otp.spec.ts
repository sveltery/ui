import { expect, test, type Page } from '@playwright/test';

const slots = (page: Page) => page.locator('[data-slot=input-otp-slot]');

test.beforeEach(async ({ page }) => {
  await page.goto('/input-otp');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

test('typing fills one slot at a time, skips letters, and submits the code', async ({ page }) => {
  await expect(page.getByRole('textbox', { name: 'Code' }).first()).toHaveValue('1');
  await slots(page).nth(2).click();
  await page.keyboard.type('3a4');
  await expect(slots(page).nth(4)).toBeFocused();
  await expect(page.getByTestId('value')).toHaveText('1234');
  await page.keyboard.type('56');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByTestId('submitted')).toHaveText('{"code":"123456"}');
});

test('pasting a code fills every slot from the first', async ({ page }) => {
  await slots(page).first().focus();
  await page.evaluate(() => {
    const data = new DataTransfer();
    data.setData('text/plain', ' 987 654 ');
    document.activeElement!.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
  });
  await expect(page.getByTestId('value')).toHaveText('987654');
  for (const [i, char] of [...'987654'].entries()) await expect(slots(page).nth(i)).toHaveValue(char);
});

test('a native reset restores the default code', async ({ page }) => {
  await slots(page).nth(2).click();
  await page.keyboard.type('3456');
  await expect(page.getByTestId('value')).toHaveText('123456');
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByTestId('value')).toHaveText('12');
  for (const [i, char] of [...'12    '].entries()) await expect(slots(page).nth(i)).toHaveValue(char.trim());
});
