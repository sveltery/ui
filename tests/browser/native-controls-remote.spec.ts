import { expect, test, type Page } from '@playwright/test';
// Each native control, and each UI part that forwards to a native element, takes Kit's `.as(...)` spread as it is.
test.use({ baseURL: 'http://127.0.0.1:5174' });
const save = (page: Page) => page.getByRole('button', { name: 'Save' }).click();
async function result(page: Page) { return JSON.parse(await page.getByTestId('debug').innerText()).result; }
const avatar = { name: 'a.txt', mimeType: 'text/plain', buffer: Buffer.from('hi') };

async function fill(page: Page) {
  await page.getByTestId('topic-updates').check();
  await page.getByTestId('notify').focus();
  await page.keyboard.press('Space');
  await page.getByTestId('volume').fill('7');
  await page.getByTestId('day').fill('2026-10-17');
  await page.getByTestId('fruits').selectOption(['apple', 'grapes']);
  await page.getByTestId('format-italic').click();
  await page.getByTestId('code2').fill('123456');
  await page.getByTestId('avatar').setInputFiles(avatar);
  await page.getByTestId('color').fill('#2563eb');
  await page.getByTestId('note').fill('Hello');
  await page.getByTestId('bio').fill('About me');
}
const received = { topics: ['updates'], notify: true, volume: 7, day: '2026-10-17', fruits: ['apple', 'grapes'], format: ['italic'], code2: '123456', avatar: 'a.txt:2', color: '#2563eb', note: 'Hello', bio: 'About me', action: 'save' };

for (const javaScriptEnabled of [true, false]) {
  test.describe(javaScriptEnabled ? 'with JS' : 'without JS', () => {
    test.use({ javaScriptEnabled });

    test('the server renders each spread as a native input', async ({ page }) => {
      await page.goto('/native-controls');
      await expect(page.getByTestId('agree')).toHaveAttribute('type', 'checkbox');
      await expect(page.getByTestId('agree')).toHaveAttribute('name', /^b:agree\//);
      await expect(page.getByTestId('topic-news')).toHaveAttribute('name', /^topics\[\]\//);
      await expect(page.getByTestId('notify')).toHaveAttribute('role', 'switch');
      await expect(page.getByTestId('volume')).toHaveAttribute('type', 'range');
      await expect(page.getByTestId('volume')).toHaveAttribute('name', /^n:volume\//);
      await expect(page.getByTestId('fruits')).toHaveAttribute('multiple', '');
      await expect(page.getByTestId('avatar')).toHaveAttribute('type', 'file');
    });

    test('a rejected form comes back with its values and the issue', async ({ page }) => {
      await page.goto('/native-controls');
      if (javaScriptEnabled) await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
      await fill(page);
      await save(page);
      await expect(page.getByTestId('error')).toHaveText('Accept the terms');
      await expect(page.getByTestId('agree')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.getByTestId('topic-updates')).toBeChecked();
      await expect(page.getByTestId('topic-news')).not.toBeChecked();
      await expect(page.getByTestId('notify')).toBeChecked();
      await expect(page.getByTestId('volume')).toHaveValue('7');
      await expect(page.getByTestId('day')).toHaveValue('2026-10-17');
      expect(await page.getByTestId('fruits').evaluate((select: HTMLSelectElement) => [...select.selectedOptions].map(option => option.value))).toEqual(['apple', 'grapes']);
    });

    test('an accepted form submits every control', async ({ page }) => {
      await page.goto('/native-controls');
      if (javaScriptEnabled) await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
      await page.getByText('Agree').click();
      await fill(page);
      await save(page);
      await expect.poll(() => result(page)).toMatchObject({ received: { agree: true, ...received } });
    });
  });
}
