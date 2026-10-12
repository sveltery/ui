import { expect, test, type Page } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

async function visit(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-ready');
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
