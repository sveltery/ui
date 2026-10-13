import { expect, test, type Page } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

/** Every ported block and a line of its demo content. */
const blocks: Record<string, string> = {
  'preview-03': 'Preview 03',
  'login-01': 'Login to your account',
  'login-02': 'Login to your account',
  'login-03': 'Welcome back',
  'login-04': 'Welcome back',
  'login-05': 'Welcome to Acme Inc.',
  'signup-01': 'Create an account',
  'signup-02': 'Create your account',
  'signup-03': 'Create your account',
  'signup-04': 'Create your account',
  'signup-05': 'Welcome to Acme Inc.',
};

async function visit(page: Page, path: string) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.location().url.includes('/pagefind/')) errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().includes('/pagefind/')) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-ready');
  return errors;
}

for (const [name, text] of Object.entries(blocks)) {
  test(`${name} renders on its own page`, async ({ page }) => {
    const errors = await visit(page, `/view/${name}`);
    await expect(page.getByText(text, { exact: true }).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('the category nav lists each category and its blocks', async ({ page }) => {
  await visit(page, '/blocks');
  const nav = page.getByRole('navigation', { name: 'Blocks' });
  await expect(nav.getByRole('link')).toHaveText(['Featured', 'Sidebar', 'Login', 'Signup']);
  await expect(nav.getByRole('link', { name: 'Featured' })).toHaveAttribute('aria-current', 'page');

  await nav.getByRole('link', { name: 'Login' }).click();
  await expect(page).toHaveURL('/blocks/login');
  await expect(page.locator('[data-slot=block-viewer]').evaluateAll((viewers) => viewers.map((viewer) => viewer.id))).resolves.toEqual(['login-01', 'login-02', 'login-03', 'login-04', 'login-05']);
  await expect(page.locator('#login-01 iframe')).toHaveAttribute('src', '/view/login-01');
  await expect(page.locator('#login-01').getByRole('link', { name: 'A simple login form' })).toHaveAttribute('href', '#login-01');
});

test('the Code tab shows the files in their app paths', async ({ page }) => {
  await visit(page, '/blocks/login');
  const viewer = page.locator('#login-01');
  await viewer.getByRole('tab', { name: 'Code' }).click();
  await expect(viewer.locator('iframe')).toBeHidden();
  const caption = viewer.locator('figcaption');
  await expect(caption).toHaveText('src/routes/login/+page.svelte Copy');
  await expect(viewer.locator('pre')).toContainText("import LoginForm from '$lib/components/login-form.svelte';");

  await viewer.getByRole('button', { name: 'login-form.svelte' }).click();
  await expect(caption).toHaveText('src/lib/components/login-form.svelte Copy');
  await expect(viewer.locator('pre')).toContainText("import { Button } from '$lib/components/ui/button/index.js';");

  await viewer.getByRole('button', { name: 'components' }).click();
  await expect(viewer.getByRole('button', { name: 'login-form.svelte' })).toBeHidden();

  await viewer.getByRole('tab', { name: 'Preview' }).click();
  await expect(viewer.locator('iframe')).toBeVisible();
});

test('the size toggles resize the preview', async ({ page }) => {
  await visit(page, '/blocks/login');
  const viewer = page.locator('#login-01');
  const panel = viewer.locator('[data-slot=resizable-panel]').first();
  const full = (await panel.boundingBox())!.width;

  await viewer.getByRole('button', { name: 'Mobile' }).click();
  await expect.poll(async () => Math.round(((await panel.boundingBox())!.width / full) * 10)).toBe(3);
  await viewer.getByRole('button', { name: 'Desktop' }).click();
  await expect.poll(async () => Math.round((await panel.boundingBox())!.width)).toBe(Math.round(full));
});
