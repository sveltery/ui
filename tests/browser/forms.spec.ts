import { expect, test, type Page } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

async function visit(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-ready', '', { timeout: 20_000 });
}

test('the remote form demo reaches its fields through Form and Field context', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await visit(page, '/docs/forms/remote-forms');
  const demo = page.locator('[data-slot=component-preview]').first();
  const name = demo.getByRole('textbox', { name: 'Name' });
  const email = demo.getByRole('textbox', { name: 'Email' });
  await expect(email).toHaveAccessibleDescription('Try taken@example.com to see an issue from the server.');
  await name.fill('A');
  await email.fill('ada@example.com');
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(demo.locator('[data-slot=field]').filter({ has: page.getByRole('textbox', { name: 'Name' }) }).locator('[data-slot=field-error]')).toHaveText('Use at least 2 characters.');
  await expect(demo.locator('[data-slot=field-error]')).toHaveCount(1);
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(name).toHaveAccessibleDescription('Use at least 2 characters.');
  expect(posts).toEqual([]);

  await name.fill('Ada');
  await email.fill('taken@example.com');
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(demo.locator('[data-slot=field]').filter({ has: page.getByRole('textbox', { name: 'Email' }) }).locator('[data-slot=field-error]')).toHaveText('That email is already registered.');
  await expect(demo.locator('[data-slot=field-error]')).toHaveCount(1);
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  expect(posts).toHaveLength(1);

  await email.fill('ada@example.com');
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(demo.getByText('Welcome, Ada.')).toBeVisible();
  await expect(demo.locator('[data-slot=field-error]')).toHaveCount(0);
});

test('the remote form demo works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto('/docs/forms/remote-forms');
    const demo = page.locator('[data-slot=component-preview]').first();
    await demo.getByRole('textbox', { name: 'Name' }).fill('Ada');
    await demo.getByRole('textbox', { name: 'Email' }).fill('taken@example.com');
    await demo.getByRole('button', { name: 'Sign up' }).click();
    const after = page.locator('[data-slot=component-preview]').first();
    const email = after.getByRole('textbox', { name: 'Email' });
    await expect(after.locator('[data-slot=field]').filter({ has: page.getByRole('textbox', { name: 'Email' }) }).locator('[data-slot=field-error]')).toHaveText('That email is already registered.');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(after.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada');
  } finally { await context.close(); }
});

test('the form action demo shows schema and server issues in their fields, then the result', async ({ page }) => {
  await visit(page, '/docs/forms/form-actions');
  const demo = page.locator('[data-slot=component-preview]').first();
  const name = demo.getByRole('textbox', { name: 'Name' });
  const email = demo.getByRole('textbox', { name: 'Email' });
  await name.fill('A');
  await email.fill('ada@example.com');
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(demo.locator('[data-slot=field-error]')).toHaveText(['Use at least 2 characters.']);
  await expect(name).toHaveAttribute('aria-invalid', 'true');

  await name.fill('Ada');
  await email.fill('taken@example.com');
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(demo.locator('[data-slot=field-error]')).toHaveText(['That email is already registered.']);

  await email.fill('ada@example.com');
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(demo.getByText('Welcome, Ada.')).toBeVisible();
  await expect(demo.locator('[data-slot=field-error]')).toHaveCount(0);
});

test('the form action demo sends no request when Form blocks an invalid submit', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await visit(page, '/docs/forms/form-actions');
  const demo = page.locator('[data-slot=component-preview]').first();
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(demo.getByRole('textbox', { name: 'Name' })).toBeFocused();
  await page.waitForTimeout(500);
  expect(posts).toEqual([]);
});

test('the form action demo works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto('/docs/forms/form-actions');
    const demo = page.locator('[data-slot=component-preview]').first();
    await demo.getByRole('textbox', { name: 'Name' }).fill('Ada');
    await demo.getByRole('textbox', { name: 'Email' }).fill('taken@example.com');
    await demo.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.locator('[data-slot=component-preview]').first().locator('[data-slot=field-error]')).toHaveText(['That email is already registered.']);
    await expect(page.locator('[data-slot=component-preview]').first().getByRole('textbox', { name: 'Name' })).toHaveValue('Ada');
  } finally { await context.close(); }
});

test('composite controls submit under their field names and validate', async ({ page }) => {
  await visit(page, '/docs/forms');
  const demo = page.locator('[data-slot=component-preview]').first();
  await demo.getByRole('radio', { name: 'Pro' }).click();
  await demo.getByRole('switch', { name: 'Newsletter' }).click();
  await demo.getByRole('button', { name: 'Continue' }).click();
  await expect(demo.locator('[data-slot=field-error]')).toHaveText(['Accept the terms to continue.']);
  await expect(demo.locator('[data-slot=preview] pre')).toHaveCount(0);
  await demo.getByRole('checkbox', { name: 'Accept the terms' }).click();
  await demo.getByRole('button', { name: 'Continue' }).click();
  await expect(demo.locator('[data-slot=preview] pre')).toHaveText(JSON.stringify({ plan: 'pro', seats: 5, newsletter: true, terms: true }));
});
