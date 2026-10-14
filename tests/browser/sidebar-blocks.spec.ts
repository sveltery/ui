import { expect, test, type Locator, type Page } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

const style = (locator: Locator, property: string) => locator.evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), property);

async function visit(page: Page, name: string) {
  await page.goto(`/view/${name}`);
  await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 30_000 });
}

test('sidebar-09 user menu highlights its trigger while open', async ({ page }) => {
  await visit(page, 'sidebar-09');
  const trigger = page.locator('[data-sidebar=footer] [data-sidebar=menu-button]');
  await page.mouse.move(1, 1);
  await expect(trigger).not.toHaveAttribute('data-popup-open');
  expect(await style(trigger, 'background-color')).toBe('rgba(0, 0, 0, 0)');

  await trigger.click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.mouse.move(1, 1);
  await expect(trigger).toHaveAttribute('data-popup-open', '');
  await expect.poll(() => style(trigger, 'background-color')).toBe('oklch(0.97 0 0)');
});

test('sidebar-10 page actions popover is open after load and marks its trigger', async ({ page }) => {
  await visit(page, 'sidebar-10');
  const popup = page.getByRole('dialog');
  const trigger = page.locator('[data-slot=popover-trigger]');
  await expect(popup.getByText('Customize Page')).toBeVisible();
  await expect(trigger).toHaveAttribute('data-popup-open', '');

  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
  await expect(trigger).not.toHaveAttribute('data-popup-open');

  await trigger.click();
  await expect(popup.getByText('Customize Page')).toBeVisible();
  await expect(trigger).toHaveAttribute('data-popup-open', '');
});

test('sidebar-11 open folders rotate their chevron', async ({ page }) => {
  await visit(page, 'sidebar-11');
  const folder = page.getByRole('button', { name: 'components', exact: true });
  const chevron = folder.locator('svg').first();
  await expect.poll(() => style(chevron, 'rotate')).toBe('90deg');

  await folder.click();
  await expect.poll(() => style(chevron, 'rotate')).toBe('none');
});

test('sidebar-16 previews 800px tall (798px inside its border) and sidebar-15 at the default 930px (928px)', async ({ page }) => {
  await page.goto('/blocks/sidebar');
  await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 30_000 });
  const height = (id: string) => page.locator(`#${id} iframe`).evaluate((frame) => frame.getBoundingClientRect().height);
  expect(await height('sidebar-16')).toBe(798);
  expect(await height('sidebar-15')).toBe(928);
});

for (const name of ['sidebar-10', 'sidebar-15']) {
  test(`${name} expanding a workspace rotates its chevron`, async ({ page }) => {
    await visit(page, name);
    const item = page.locator('[data-sidebar=menu-item]').filter({ hasText: 'Personal Life Management' });
    const toggle = item.locator('[data-sidebar=menu-action]').first();
    expect(await style(toggle, 'rotate')).toBe('none');

    await toggle.click();
    await expect(toggle).toHaveAttribute('data-panel-open', '');
    await expect.poll(() => style(toggle, 'rotate')).toBe('90deg');
  });
}
