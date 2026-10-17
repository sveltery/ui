import { expect, test, type Page } from '@playwright/test';

const code = (page: Page) => page.getByRole('textbox', { name: 'Code' });
const slots = (page: Page) => page.locator('form [data-slot=input-otp-slot]');
const activeSlots = (page: Page) => slots(page).evaluateAll((elements) => elements.flatMap((element, i) => (element.getAttribute('data-active') === 'true' ? [i] : [])));
const texts = (page: Page) => slots(page).allTextContents();
// A value change resyncs the selection on timers up to 50ms later, and one landing between a key's caret move and its
// selectionchange undoes that move. A page timer set after the key runs after them, so each key waits for it, as a person's next key would.
const settle = (page: Page) => page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 50)));
async function type(page: Page, text: string) {
  for (const key of text) {
    await page.keyboard.type(key);
    await settle(page);
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/input-otp');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

test('one hidden input carries the code, labelled by the field label', async ({ page }) => {
  await expect(code(page)).toHaveValue('12');
  await expect(code(page)).toHaveAttribute('autocomplete', 'one-time-code');
  await expect(code(page)).toHaveAttribute('inputmode', 'numeric');
  await expect(code(page)).toHaveAttribute('maxlength', '6');
  await expect(code(page)).toHaveAttribute('data-input-otp', 'true');
  await expect(code(page)).toHaveAttribute('data-slot', 'input-otp');
  await expect.poll(() => texts(page)).toEqual(['1', '2', '', '', '', '']);
  await expect.poll(() => activeSlots(page)).toEqual([]);
});

test('typing fills the next slot, drops characters the pattern rejects, and completes once', async ({ page }) => {
  await code(page).click();
  await expect(code(page)).toBeFocused();
  await expect.poll(() => activeSlots(page)).toEqual([2]);
  await expect(slots(page).nth(2).locator('.cn-input-otp-caret')).toBeVisible();
  await type(page, '3a4');
  await expect(page.getByTestId('value')).toHaveText('1234');
  await expect.poll(() => activeSlots(page)).toEqual([4]);
  await type(page, '56');
  await expect(page.getByTestId('value')).toHaveText('123456');
  await expect(page.getByTestId('completed')).toHaveText('123456');
  await expect.poll(() => texts(page)).toEqual(['1', '2', '3', '4', '5', '6']);
  // A full code selects its last slot, so the next key replaces it, and the code does not complete a second time.
  await type(page, '7');
  await expect(page.getByTestId('value')).toHaveText('123457');
  await expect(page.getByTestId('completed')).toHaveText('123456');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByTestId('submitted')).toHaveText('{"code":"123457"}');
});

test('Backspace deletes the last character and arrow keys move the selected slot', async ({ page }) => {
  await code(page).focus();
  await type(page, '3456');
  await page.keyboard.press('Backspace');
  await settle(page);
  await expect(page.getByTestId('value')).toHaveText('12345');
  await expect.poll(() => activeSlots(page)).toEqual([5]);
  await page.keyboard.press('ArrowLeft');
  await expect.poll(() => activeSlots(page)).toEqual([4]);
  await page.keyboard.press('ArrowLeft');
  await expect.poll(() => activeSlots(page)).toEqual([3]);
  await type(page, '9');
  await expect(page.getByTestId('value')).toHaveText('12395');
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => activeSlots(page)).toEqual([5]);
});

test('focusing a full code selects the last slot, and typing replaces it', async ({ page }) => {
  await code(page).focus();
  await type(page, '3456');
  await code(page).blur();
  await expect.poll(() => activeSlots(page)).toEqual([]);
  await code(page).focus();
  await expect.poll(() => activeSlots(page)).toEqual([5]);
  await type(page, '0');
  await expect(page.getByTestId('value')).toHaveText('123450');
});

test('inserting a whole code at once, as a paste or a one-time-code autofill does, fills every slot', async ({ page }) => {
  await code(page).focus();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.insertText('987654');
  await expect(page.getByTestId('value')).toHaveText('987654');
  await expect.poll(() => texts(page)).toEqual(['9', '8', '7', '6', '5', '4']);
  await expect(page.getByTestId('completed')).toHaveText('987654');
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.insertText('12 34');
  await expect(page.getByTestId('value')).toHaveText('987654');
});

test('a disabled input shows its code and cannot be focused', async ({ page }) => {
  const disabled = page.getByRole('textbox', { name: 'Disabled' });
  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveValue('1234');
  await expect(page.locator('[data-input-otp-container]').nth(1)).toHaveCSS('opacity', '0.5');
});
