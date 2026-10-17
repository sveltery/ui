import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

const source = readFileSync(new URL('../../apps/docs/src/lib/typeset/typeset.css', import.meta.url), 'utf8');

test('the Typeset page lists every section, is linked from the Sections group and Get Started after Theming, and styles its own prose with Typeset', async ({ page }) => {
  await page.goto('/docs/typeset');
  await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 30_000 });
  await expect(page.getByRole('heading', { level: 1, name: 'Typeset' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'On this page' }).getByRole('link')).toHaveText([
    'Principles',
    'Features',
    'Building Your Typeset',
    'Custom Typesets',
    'Custom Themes',
    'Accessibility and Dark Mode',
    'Responsive Table',
    'Overrides',
    'Opting Out',
    'Streaming',
    'Prior Art',
  ]);

  const prose = page.locator('.typeset').first();
  await expect(prose).toHaveCSS('line-height', /px$/);
  const flow = await prose.locator(':scope > h2').first().evaluate((h2) => getComputedStyle(h2).marginBlockStart);
  expect(parseFloat(flow)).toBeGreaterThan(0);
  await expect(prose.locator('.typeset-scroll table')).toHaveCount(1);

  const sidebar = page.getByRole('navigation', { name: 'Docs' });
  await expect(sidebar.getByRole('link', { name: 'Typeset', exact: true })).toHaveCount(2);
  await sidebar.getByRole('link', { name: 'Theming', exact: true }).first().click();
  await expect(page).toHaveURL('/docs/theming');
  await page.getByRole('navigation', { name: 'Pagination' }).getByRole('link', { name: 'Typeset' }).click();
  await expect(page).toHaveURL('/docs/typeset');
});

test('/typeset.css serves the Typeset stylesheet source', async ({ request }) => {
  const response = await request.get('/typeset.css');
  expect(response.status()).toBe(200);
  expect(await response.text()).toBe(source);
});

test('the Typography page redirects to Typeset', async ({ request, page }) => {
  const response = await request.get('/docs/components/typography', { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe('/docs/typeset');
  await page.goto('/docs/components/typography');
  await expect(page).toHaveURL('/docs/typeset');
});
