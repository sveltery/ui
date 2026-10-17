import { expect, test } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

test('the typography page shows the whole demo and switches the RTL example between languages', async ({ page }) => {
  await page.goto('/docs/components/typography');
  await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 30_000 });

  const demo = page.locator('[data-name="base/TypographyDemoExample"] [data-slot=preview]');
  await expect(demo.getByRole('heading', { level: 1 })).toHaveText('Taxing Laughter: The Joke Tax Chronicles');
  const { clientHeight, scrollHeight } = await demo.evaluate((element) => ({ clientHeight: element.clientHeight, scrollHeight: element.scrollHeight }));
  expect(scrollHeight).toBe(clientHeight);
  await expect(demo.getByRole('table')).toBeVisible();

  const preview = page.locator('[data-name="base/TypographyRtlExample"]');
  const rtl = preview.locator('[data-slot=preview]');
  const article = rtl.locator('[dir]');
  await expect(article).toHaveAttribute('dir', 'rtl');
  await expect(rtl.getByRole('heading', { level: 1 })).toHaveText('فرض الضرائب على الضحك: سجلات ضريبة النكتة');
  await preview.locator('[data-name="language-selector"]').click();
  await page.getByRole('option', { name: 'Hebrew (עברית)' }).click();
  await expect(rtl.getByRole('heading', { level: 1 })).toHaveText('מיסוי הצחוק: כרוניקות מס הבדיחה');
  await preview.locator('[data-name="language-selector"]').click();
  await page.getByRole('option', { name: 'English' }).click();
  await expect(article).toHaveAttribute('dir', 'ltr');
  await expect(rtl.getByRole('heading', { level: 1 })).toHaveText('Taxing Laughter: The Joke Tax Chronicles');
});
