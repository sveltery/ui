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

test('the D key toggles dark mode outside text fields, and the theme toggle switches dark mode and remembers it', async ({ page }) => {
  await visit(page, '/');
  const html = page.locator('html');
  const themeColor = page.locator('meta[name="theme-color"]');
  await expect(html).not.toHaveClass(/dark/);
  await page.keyboard.press('d');
  await expect(html).toHaveClass(/dark/);
  await expect(themeColor).toHaveAttribute('content', '#09090b');
  await page.keyboard.press('d');
  await expect(html).not.toHaveClass(/dark/);
  await expect(themeColor).toHaveAttribute('content', '#ffffff');

  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await expect(html).toHaveClass(/dark/);
  await page.reload();
  await expect(html).toHaveAttribute('data-ready');
  await expect(html).toHaveClass(/dark/);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#09090b');
});

test('a docs page keeps step titles out of the TOC, the Installation section shows the CLI command first and the manual steps on the Manual tab, ComponentPreview renders the example and reveals its source as an app that ran add imports it, and the page links to its markdown', async ({ page, request, context, browserName }) => {
  await visit(page, '/docs/components/button', 30_000);
  await expect(page.getByRole('navigation', { name: 'On this page' }).getByRole('link')).toHaveText(['Installation', 'Usage', 'API reference']);

  const cli = page.getByRole('tab', { name: 'CLI', exact: true });
  const manual = page.getByRole('tab', { name: 'Manual', exact: true });
  await expect(cli).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel').filter({ hasText: '@sveltery/ui@latest add button' }).first()).toBeVisible();
  await expect(page.locator('[data-slot=component-source]')).toBeHidden();
  await manual.click();
  await expect(manual).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Copy the component' })).toBeVisible();
  await expect(page.locator('[data-slot=component-source]')).toContainText('These files use the Nova style and Lucide icons.');
  await expect(page.locator('[data-slot=code-block]').filter({ hasText: 'cn class-variance-authority @sveltery/base' })).toBeVisible();
  await cli.click();
  await expect(page.locator('[data-slot=component-source]')).toBeHidden();

  const preview = page.locator('[data-slot=component-preview]').first();
  await expect(preview.getByRole('button', { name: 'Secondary' }).first()).toBeVisible();
  await preview.getByRole('button', { name: 'View Code' }).click();
  const imports = "import { Button, buttonVariants } from '#lib/components/ui/button';";
  await expect(preview.locator('[data-slot=code] pre')).toContainText(imports);
  await expect(preview.locator('[data-slot=code] pre')).not.toContainText('$registry/');
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await preview.getByRole('button', { name: 'Copy' }).click();
  if (browserName === 'chromium') {
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain(imports);
    expect(copied).not.toContain('$registry/');
  }

  await page.getByRole('button', { name: 'More page actions' }).click();
  await expect(page.getByRole('menuitem', { name: 'View as Markdown' })).toHaveAttribute('href', /\/docs\/components\/button\.md$/);
  const response = await request.get('/docs/components/button.md');
  expect(response.headers()['content-type']).toBe('text/markdown; charset=utf-8');
  const markdown = await response.text();
  expect(markdown).toMatch(/^---\ntitle: Button\n/);
  expect(markdown).toContain(imports);
  expect(markdown).not.toContain('$registry/');
});

test('the Drawer page renders its examples in the Rhea style, and other pages stay in Nova', async ({ page }) => {
  await visit(page, '/docs/components/drawer');
  await page.locator('[data-slot=component-preview]').first().getByRole('button', { name: 'right', exact: true }).first().click();
  const drawer = page.locator('[data-slot=drawer-popup]');
  await expect.poll(() => drawer.evaluate((node) => {
    const box = node.getBoundingClientRect();
    return { left: Math.round(box.left), right: Math.round(box.right), top: Math.round(box.top), bottom: Math.round(box.bottom), radius: getComputedStyle(node).borderRadius };
  })).toEqual({ left: 1280 - 8 - 384, right: 1280 - 8, top: 8, bottom: 900 - 8, radius: '24px' });
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);

  await page.getByRole('navigation', { name: 'Docs' }).getByRole('link', { name: 'Button', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible();
  const button = page.locator('[data-slot=component-preview]').first().getByRole('button', { name: 'Secondary' }).first();
  await expect(button).toHaveCSS('border-radius', '8px');
});

test('docs tooltips open without the default delay, like the upstream site', async ({ page }) => {
  await visit(page, '/docs/components/tooltip');
  await page.getByRole('button', { name: 'Show Tooltip' }).first().hover();
  await expect(page.locator('[data-slot=tooltip-content]')).toBeVisible({ timeout: 400 });
});

test('the mobile menu opens as a popover and closes on navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page, '/docs');
  await expect(page.getByRole('heading', { level: 1, name: 'Introduction' })).toBeVisible();
  await page.getByRole('button', { name: 'Menu' }).click();
  const menu = page.getByRole('navigation', { name: 'Site' });
  await expect(menu).toBeVisible();
  await menu.getByRole('link', { name: 'Theming' }).first().click();
  await expect(page).toHaveURL('/docs/theming');
  await expect(menu).toBeHidden();
});

test('the Field Select example offers the departments and shows the chosen one', async ({ page }) => {
  await visit(page, '/docs/components/field', 30_000);
  const department = page.locator('[data-name="base/FieldSelectExample"]').getByRole('combobox');
  await expect(department).toHaveText('Choose department');
  await department.click();
  await expect(page.locator('[role=listbox]:visible').getByRole('option')).toHaveText(['Choose department', 'Engineering', 'Design', 'Marketing', 'Sales', 'Customer Support', 'Human Resources', 'Finance', 'Operations']);
  await page.locator('[role=listbox]:visible').getByRole('option', { name: 'Design', exact: true }).click();
  await expect(page.locator('[role=listbox]:visible').getByRole('option')).toHaveCount(0);
  await expect(department).toHaveText('Design');
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
