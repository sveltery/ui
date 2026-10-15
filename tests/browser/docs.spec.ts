import { expect, test, type Page } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

async function visit(page: Page, path: string, timeout = 5000) {
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout });
}

test('sidebar and pagination navigate between docs pages', async ({ page }) => {
  await visit(page, '/docs');
  await expect(page.getByRole('heading', { level: 1, name: 'Introduction' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Docs' }).getByRole('link', { name: 'Button', exact: true }).click();
  await expect(page).toHaveURL('/docs/components/button');
  await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Pagination' }).getByRole('link', { name: 'Button Group' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Button Group' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Usage' })).toHaveAttribute('href', '#usage');
});

test('Cmd+K search opens and goes to the chosen page', async ({ page }) => {
  await visit(page, '/docs');
  await page.keyboard.press('ControlOrMeta+k');
  const input = page.getByRole('combobox');
  await expect(input).toBeFocused();
  await input.fill('textar');
  await expect(page.getByRole('option')).toHaveText(['Textarea']);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/docs/components/textarea');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('the theme toggle switches dark mode and remembers it', async ({ page }) => {
  await visit(page, '/');
  const html = page.locator('html');
  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await expect(html).toHaveClass(/dark/);
  await page.reload();
  await expect(html).toHaveAttribute('data-ready');
  await expect(html).toHaveClass(/dark/);
});

test('ComponentPreview renders the example and reveals its source', async ({ page }) => {
  await visit(page, '/docs/components/button');
  const preview = page.locator('[data-slot=component-preview]').first();
  await expect(preview.getByRole('button', { name: 'Secondary' }).first()).toBeVisible();
  await preview.getByRole('button', { name: 'View Code' }).click();
  await expect(preview.locator('[data-slot=code] pre')).toContainText("import { Button, buttonVariants } from '@sveltery/ui/button';");
  await expect(preview.getByRole('button', { name: 'Copy' })).toBeVisible();
});

test('the Installation section shows the CLI command first and the manual steps on the Manual tab', async ({ page }) => {
  await visit(page, '/docs/components/button', 30_000);
  const cli = page.getByRole('tab', { name: 'CLI', exact: true });
  const manual = page.getByRole('tab', { name: 'Manual', exact: true });
  await expect(cli).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel').filter({ hasText: 'sveltery add button' }).first()).toBeVisible();
  await expect(page.locator('[data-slot=component-source]')).toBeHidden();
  await manual.click();
  await expect(manual).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Copy the component' })).toBeVisible();
  await expect(page.locator('[data-slot=component-source]')).toContainText('These files use the Nova style and Lucide icons.');
  await expect(page.locator('[data-slot=code-block]').filter({ hasText: 'cn class-variance-authority @sveltery/base' })).toBeVisible();
  await cli.click();
  await expect(page.locator('[data-slot=component-source]')).toBeHidden();
});

test('the mobile menu opens as a popover and closes on navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page, '/docs');
  await expect(page.getByRole('heading', { level: 1, name: 'Introduction' })).toBeVisible();
  await page.getByRole('button', { name: 'Menu' }).click();
  const menu = page.getByRole('navigation', { name: 'Site' });
  await expect(menu).toBeVisible();
  await menu.getByRole('link', { name: 'Theming' }).click();
  await expect(page).toHaveURL('/docs/theming');
  await expect(menu).toBeHidden();
});

test('the Field Horizontal Fields example offers Favorite Fruit and shows the chosen fruit', async ({ page }) => {
  await visit(page, '/docs/components/field', 30_000);
  const section = page.locator('[data-slot=example]').filter({ hasText: 'Horizontal Fields' });
  const fruit = section.getByLabel('Favorite Fruit');
  await expect(fruit).toHaveText('Select a fruit');
  await fruit.click();
  await expect(page.locator('[role=listbox]:visible').getByRole('option')).toHaveText(['Select a fruit', 'Apple', 'Banana', 'Orange']);
  await page.locator('[role=listbox]:visible').getByRole('option', { name: 'Banana', exact: true }).click();
  await expect(page.locator('[role=listbox]:visible').getByRole('option')).toHaveCount(0);
  await expect(fruit).toHaveText('Banana');
});

test('the Input Form example labels each control and describes the email field', async ({ page }) => {
  await visit(page, '/docs/components/input');
  const form = page.locator('[data-slot=example]').filter({ has: page.locator('#form-name') });
  await expect(form.getByLabel('Name')).toHaveAttribute('placeholder', 'John Doe');
  const email = form.getByLabel('Email');
  await expect(email).toHaveAttribute('type', 'email');
  await expect(form.getByText("We'll never share your email with anyone.")).toBeVisible();
  await expect(form.getByLabel('Phone')).toHaveAttribute('type', 'tel');
  await expect(form.getByLabel('Address')).toHaveAttribute('placeholder', '123 Main St');
  const country = form.getByRole('combobox', { name: 'Country' });
  await country.click();
  await expect(page.locator('[role=listbox]:visible').getByRole('option')).toHaveText(['United States', 'United Kingdom', 'Canada']);
  await page.locator('[role=listbox]:visible').getByRole('option', { name: 'Canada', exact: true }).click();
  await expect(page.locator('[role=listbox]:visible').getByRole('option')).toHaveCount(0);
  await expect(form.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(form.getByRole('button', { name: 'Submit' })).toBeVisible();
});

test('ComponentSource shows the code that sveltery add writes', async ({ page }) => {
  await visit(page, '/docs/components/select', 30_000);
  const source = page.locator('[data-slot=component-source]');
  await expect(source).toContainText("import CheckIcon from '@lucide/svelte/icons/check';");
  await expect(source).not.toContainText('cn-select-item');
  await expect(source).not.toContainText('IconPlaceholder');
});

test('the registry serves each style item as JSON', async ({ request }) => {
  const response = await request.get('/r/styles/nova/button.json');
  expect(response.headers()['content-type']).toBe('application/json');
  const item = await response.json();
  expect([item.name, item.type, item.files.map((file: { target: string }) => file.target)]).toEqual(['button', 'registry:ui', ['button/Button.svelte', 'button/index.ts', 'button/types.ts', 'button/variants.ts']]);
});
