import { expect, test } from '@playwright/test';

test('SSR and hydration retain omitted-child fallback labels and undefined native refs clean up', async ({ page, request }) => {
  const response = await request.get('/dialog-forwarding'); expect(response.ok()).toBe(true);
  const html = await response.text();
  expect((html.match(/Fallback label/g) ?? []).length).toBe(10);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/dialog-forwarding'); await expect(page.locator('[data-hydrated=true]')).toBeVisible();
  for (const part of ['trigger', 'close', 'title', 'description', 'overlay']) {
    for (const kind of ['base', 'ui']) {
      await expect(page.getByTestId(`${kind}-${part}-omitted`)).toHaveText('Fallback label');
      await expect(page.getByTestId(`${kind}-${part}-present`)).toHaveText('Explicit label');
      await expect(page.getByTestId(`${kind}-${part}-empty`)).toBeEmpty();
    }
  }
  await expect(page.getByTestId('refs')).toHaveText('{"header":true,"footer":true,"cleared":false}');
  await page.getByTestId('remove-wrappers').click();
  await expect(page.getByTestId('header')).toHaveCount(0); await expect(page.getByTestId('footer')).toHaveCount(0);
  await expect(page.getByTestId('refs')).toHaveText('{"header":false,"footer":false,"cleared":true}');
  expect(errors).toEqual([]);
});
