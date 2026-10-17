import { expect, test, type Page } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

async function visit(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-ready', '', { timeout: 20_000 });
}

test('the remote form demo shows each field\'s issues from the remote form', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await visit(page, '/docs/forms/remote-forms');
  const demo = page.locator('[data-slot=component-preview]').first();
  const name = demo.getByRole('textbox', { name: 'Name' });
  const email = demo.getByRole('textbox', { name: 'Email' });
  await name.fill('A');
  await email.fill('ada@example.com');
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(demo.locator('[data-slot=field]').filter({ has: page.getByRole('textbox', { name: 'Name' }) }).locator('[data-slot=field-error]')).toHaveText('Use at least 2 characters.');
  await expect(demo.locator('[data-slot=field-error]')).toHaveCount(1);
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  expect(posts).toEqual([]);

  await name.fill('Ada');
  await email.fill('taken@example.com');
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(demo.locator('[data-slot=field]').filter({ has: page.getByRole('textbox', { name: 'Email' }) }).locator('[data-slot=field-error]')).toHaveText('That email is already registered.');
  await expect(demo.locator('[data-slot=field-error]')).toHaveCount(1);
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

test('the form action demo shows schema and server errors in their fields', async ({ page }) => {
  await visit(page, '/docs/forms/form-actions');
  const demo = page.locator('[data-slot=component-preview]').first();
  const name = demo.getByRole('textbox', { name: 'Name' });
  const email = demo.getByRole('textbox', { name: 'Email' });
  const emailField = demo.locator('[data-slot=field]').filter({ has: page.getByRole('textbox', { name: 'Email' }) });
  await name.fill('A');
  await email.fill('ada@example.com');
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(demo.locator('[data-slot=field]').filter({ has: page.getByRole('textbox', { name: 'Name' }) }).locator('[data-slot=field-error]')).toHaveText('Use at least 2 characters.');
  await expect(demo.locator('[data-slot=field-error]')).toHaveCount(1);
  await expect(name).toHaveAttribute('aria-invalid', 'true');

  await name.fill('Ada');
  await email.fill('taken@example.com');
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(emailField.locator('[data-slot=field-error]')).toHaveText('That email is already registered.');
  await expect(demo.locator('[data-slot=field-error]')).toHaveCount(1);
  await expect(emailField).toHaveAttribute('data-invalid', 'true');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(name).toHaveAttribute('aria-invalid', 'false');

  await email.fill('ada@example.com');
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(demo.getByText('Welcome, Ada.')).toBeVisible();
  await expect(demo.locator('[data-slot=field-error]')).toHaveCount(0);
});

test('the form action demo sends no request when the browser blocks an invalid submit', async ({ page }) => {
  const posts: (string | null)[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.postData()); });
  await visit(page, '/docs/forms/form-actions');
  const demo = page.locator('[data-slot=component-preview]').first();
  const name = demo.getByRole('textbox', { name: 'Name' });
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(name).toBeFocused();

  await name.fill('Ada');
  await demo.getByRole('textbox', { name: 'Email' }).fill('ada@example.com');
  await demo.getByRole('button', { name: 'Sign up' }).click();
  await expect(demo.getByText('Welcome, Ada.')).toBeVisible();
  expect(posts).toEqual(['name=Ada&email=ada%40example.com']);
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
    const after = page.locator('[data-slot=component-preview]').first();
    const email = after.getByRole('textbox', { name: 'Email' });
    await expect(after.locator('[data-slot=field]').filter({ has: page.getByRole('textbox', { name: 'Email' }) }).locator('[data-slot=field-error]')).toHaveText('That email is already registered.');
    await expect(after.locator('[data-slot=field-error]')).toHaveCount(1);
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveValue('taken@example.com');
    await expect(after.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada');
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
  await expect(demo.locator('[data-slot=preview] pre')).toHaveText(JSON.stringify({ plan: 'pro', seats: '5', newsletter: 'on', terms: 'on' }));
});
