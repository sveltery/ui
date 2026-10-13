import { expect, test } from '@playwright/test';

const sidebar = '[data-slot=sidebar]';
const container = '[data-slot=sidebar-container]';

test.beforeEach(async ({ page }) => {
  await page.goto('/sidebar');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

test('the trigger collapses the sidebar to icons and expands it again', async ({ page }) => {
  await expect(page.locator(sidebar)).toHaveAttribute('data-state', 'expanded');
  await expect(page.locator(container)).toHaveCSS('width', '256px');

  await page.locator('[data-slot=sidebar-trigger]').click();
  await expect(page.locator(sidebar)).toHaveAttribute('data-state', 'collapsed');
  await expect(page.locator(sidebar)).toHaveAttribute('data-collapsible', 'icon');
  await expect(page.locator(container)).toHaveCSS('width', '48px');

  await page.locator('[data-slot=sidebar-trigger]').click();
  await expect(page.locator(sidebar)).toHaveAttribute('data-state', 'expanded');
  await expect(page.locator(container)).toHaveCSS('width', '256px');
});

test('Ctrl+B toggles the sidebar', async ({ page }) => {
  await page.keyboard.press('Control+b');
  await expect(page.locator(sidebar)).toHaveAttribute('data-state', 'collapsed');
  await page.keyboard.press('Control+b');
  await expect(page.locator(sidebar)).toHaveAttribute('data-state', 'expanded');
});

test('a collapsed menu button shows its tooltip, and an expanded one does not', async ({ page }) => {
  const tooltip = page.locator('[data-slot=tooltip-content][data-open]');
  const button = page.locator('[data-slot=sidebar-menu-button]', { hasText: 'Inbox' });
  await expect(button).toHaveAttribute('data-active', 'true');

  await button.hover();
  await page.waitForTimeout(1000);
  await expect(tooltip).toBeHidden();

  await page.locator('[data-slot=sidebar-trigger]').click();
  await expect(page.locator(sidebar)).toHaveAttribute('data-state', 'collapsed');
  await page.getByText('Page content').hover();
  await button.hover();
  await expect(tooltip).toHaveText('Go to inbox');
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveAttribute('data-side', 'right');
});

test('the open state survives a reload through the sidebar_state cookie', async ({ page, context }) => {
  await page.locator('[data-slot=sidebar-trigger]').click();
  await expect(page.locator(sidebar)).toHaveAttribute('data-state', 'collapsed');
  expect((await context.cookies()).find(cookie => cookie.name === 'sidebar_state')?.value).toBe('false');

  await page.reload();
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  await expect(page.locator(sidebar)).toHaveAttribute('data-state', 'collapsed');

  await page.locator('[data-slot=sidebar-trigger]').click();
  await page.reload();
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  await expect(page.locator(sidebar)).toHaveAttribute('data-state', 'expanded');
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test('the trigger opens the sidebar as a sheet and Escape closes it', async ({ page }) => {
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Inbox' })).toHaveCount(0);

    await page.locator('[data-slot=sidebar-trigger]').click();
    const sheet = page.getByRole('dialog', { name: 'Sidebar' });
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveAttribute('data-mobile', 'true');
    await expect(sheet.getByRole('button', { name: 'Inbox' })).toBeVisible();
    await expect(sheet).toHaveCSS('width', '288px');

    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();

    await page.keyboard.press('Control+b');
    await expect(sheet).toBeVisible();
  });
});
