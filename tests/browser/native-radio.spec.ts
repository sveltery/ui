import { expect, test, type Page } from '@playwright/test';
// Design D: styled native radios take Kit's `.as('radio', option)` spread with no Base parts.
test.use({ baseURL: 'http://127.0.0.1:5174' });
const radio = (page: Page, plan: string) => page.getByTestId(`radio-${plan}`);
const submit = (page: Page) => page.getByRole('button', { name: 'Submit' }).click();
async function debug(page: Page) { return JSON.parse(await page.getByTestId('debug').innerText()); }
async function hydrated(page: Page) { await page.goto('/native-radio'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true'); }
const checked = (page: Page) => page.locator('input[type="radio"]').evaluateAll((inputs: HTMLInputElement[]) => inputs.filter(input => input.checked).map(input => input.value));

test.describe('with JS', () => {
  test('rejects free with an issue, clears it, and submits pro', async ({ page }) => {
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await hydrated(page);
    expect(await checked(page)).toEqual([]);
    await radio(page, 'free').click();
    await expect.poll(async () => (await debug(page)).kit).toEqual({ plan: 'free' });
    await submit(page);
    await expect(page.getByTestId('error')).toHaveText('The free plan is full');
    await expect(radio(page, 'free')).toHaveAttribute('aria-invalid', 'true');
    expect(await checked(page)).toEqual(['free']);
    await radio(page, 'pro').click();
    await submit(page);
    await expect.poll(async () => (await debug(page)).result).toEqual({ received: { plan: 'pro' } });
    await expect(page.getByTestId('error')).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('the browser moves focus and selection with arrow keys', async ({ page }) => {
    await hydrated(page);
    await radio(page, 'free').focus();
    await page.keyboard.press('ArrowDown');
    await expect(radio(page, 'pro')).toBeFocused();
    await expect(radio(page, 'pro')).toBeChecked();
    await expect.poll(async () => (await debug(page)).kit).toEqual({ plan: 'pro' });
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Submit' })).toBeFocused();
  });

  test('form reset clears the DOM and Kit', async ({ page }) => {
    await hydrated(page);
    await radio(page, 'pro').click();
    await expect.poll(async () => (await debug(page)).kit).toEqual({ plan: 'pro' });
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.waitForTimeout(100);
    expect(await checked(page)).toEqual([]);
    expect((await debug(page)).kit).toEqual({});
  });
});

test.describe('without JS', () => {
  test.use({ javaScriptEnabled: false });
  test('a rejected choice comes back selected with its issue', async ({ page }) => {
    await page.goto('/native-radio');
    await page.getByText('free', { exact: true }).click();
    await submit(page);
    await expect(radio(page, 'free')).toBeChecked();
    await expect(radio(page, 'free')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByTestId('error')).toHaveText('The free plan is full');
  });
  test('an accepted choice submits', async ({ page }) => {
    await page.goto('/native-radio');
    await page.getByText('pro', { exact: true }).click();
    await submit(page);
    expect((await debug(page)).result).toEqual({ received: { plan: 'pro' } });
  });
});
