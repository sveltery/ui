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
  await expect(emailField).toHaveAttribute('data-invalid', '');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(name).not.toHaveAttribute('aria-invalid');

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
  // Form cancels the browser's bubble and shows its message in each blocked field's FieldError.
  await expect(demo.locator('[data-slot=field-error]')).toHaveCount(2);
  await expect(name).toHaveAttribute('aria-invalid', 'true');

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

test('the native controls demo submits a checkbox group, a switch, a slider and the terms', async ({ page }) => {
  await visit(page, '/docs/components/native-checkbox');
  const demo = page.locator('[data-slot=component-preview]').filter({ has: page.getByRole('button', { name: 'Save' }) });
  await demo.getByRole('button', { name: 'Save' }).click();
  await expect(demo.getByText('Accept the terms to continue.')).toBeVisible();
  await demo.getByLabel('Accept the terms').check();
  await demo.getByRole('button', { name: 'Save' }).click();
  await expect(demo.getByText('Pick a topic or turn on the digest.')).toBeVisible();
  await demo.getByLabel('security').check();
  await demo.getByRole('switch', { name: 'Weekly digest' }).check();
  await demo.getByRole('slider', { name: 'Emails per week' }).fill('3');
  await demo.getByRole('button', { name: 'Save' }).click();
  await expect(demo.getByText('Saved 1 topics, 3 emails a week.')).toBeVisible();
});

test('the native controls demo works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto('/docs/components/native-checkbox');
    const demo = () => page.locator('[data-slot=component-preview]').filter({ has: page.getByRole('button', { name: 'Save' }) });
    await demo().getByLabel('product').check();
    await demo().getByRole('button', { name: 'Save' }).click();
    await expect(demo().getByText('Accept the terms to continue.')).toBeVisible();
    await expect(demo().getByLabel('product')).toBeChecked();
    await demo().getByLabel('Accept the terms').check();
    await demo().getByRole('button', { name: 'Save' }).click();
    await expect(demo().getByText('Saved 1 topics, 5 emails a week.')).toBeVisible();
  } finally { await context.close(); }
});

test('the choices demo submits a multiple select and toggle-style choices', async ({ page }) => {
  await visit(page, '/docs/components/native-select');
  const demo = page.locator('[data-slot=component-preview]').filter({ has: page.getByRole('button', { name: 'Save' }) });
  await demo.getByText('missed', { exact: true }).click();
  await demo.getByText('italic', { exact: true }).click();
  await demo.getByLabel('Fruits').selectOption(['pineapple']);
  await demo.getByRole('button', { name: 'Save' }).click();
  await expect(demo.getByText('Pineapple is out of season.')).toBeVisible();
  await demo.getByLabel('Fruits').selectOption(['apple', 'grapes']);
  await demo.getByRole('button', { name: 'Save' }).click();
  await expect(demo.getByText('Saved apple, grapes.')).toBeVisible();
});

test('the input types demo submits a date, a color, a file and a one-time code', async ({ page }) => {
  await visit(page, '/docs/components/input');
  const demo = page.locator('[data-slot=component-preview]').filter({ has: page.getByRole('button', { name: 'Save profile' }) });
  await demo.getByLabel('Birthday').fill('2000-01-31');
  await demo.getByLabel('Accent color').fill('#2563eb');
  await demo.getByLabel('Avatar').setInputFiles({ name: 'me.png', mimeType: 'image/png', buffer: Buffer.from('png') });
  await demo.getByLabel('Verification code').fill('654321');
  await demo.getByRole('button', { name: 'Save profile' }).click();
  await expect(demo.getByText('That code is wrong. Try 123456.')).toBeVisible();
  await demo.getByLabel('Verification code').fill('123456');
  await demo.getByRole('button', { name: 'Save profile' }).click();
  await expect(demo.getByText('Saved with me.png.')).toBeVisible();
});
