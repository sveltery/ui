import { expect, test } from '@playwright/test';
test.use({ baseURL: 'http://127.0.0.1:5175' });
test('probe timing', async ({ page }) => {
  const log: string[] = [];
  for (let i = 0; i < 2; i++) {
    const start = Date.now();
    await page.goto('/view/dashboard-01');
    await expect(page.locator('html')).toHaveAttribute('data-ready', '', { timeout: 60000 });
    log.push(`ready after ${Date.now() - start}ms`);
  }
  expect(log.join('\n')).toBe('');
});
