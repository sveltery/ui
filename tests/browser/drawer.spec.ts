import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/drawer');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

test('the trigger opens a labeled drawer, and Close and Escape dismiss it', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Edit profile' });
  const drawer = page.getByRole('dialog', { name: 'Edit profile' });
  await trigger.click();
  await expect(drawer).toBeVisible();
  await expect(drawer).toHaveAttribute('data-slot', 'drawer-popup');
  await expect(drawer).toHaveAttribute('data-swipe-direction', 'down');
  await expect(drawer).toHaveAccessibleDescription('Make changes to your profile here.');
  await drawer.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(drawer).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(drawer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
});

test('a modal drawer renders the overlay and a non-modal drawer does not', async ({ page }) => {
  const overlay = page.locator('[data-slot=drawer-overlay]');
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await expect(page.getByRole('dialog', { name: 'Edit profile' })).toBeVisible();
  await expect(overlay).toHaveCount(1);
  await expect(overlay).toHaveClass(/cn-drawer-overlay/);
  await page.keyboard.press('Escape');
  await expect(overlay).toHaveCount(0);

  await page.getByRole('button', { name: 'Open non-modal' }).click();
  const drawer = page.getByRole('dialog', { name: 'Non-modal drawer' });
  await expect(drawer).toBeVisible();
  await expect(page.locator('[data-slot=drawer-viewport]')).toHaveAttribute('data-modal', 'false');
  await expect(overlay).toHaveCount(0);
  await drawer.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(drawer).toHaveCount(0);
});

test('swipeDirection right places the drawer on the right edge', async ({ page }) => {
  await page.getByRole('button', { name: 'Open right' }).click();
  const drawer = page.getByRole('dialog', { name: 'Right drawer' });
  await expect(drawer).toHaveAttribute('data-swipe-axis', 'x');
  await expect(drawer).toHaveAttribute('data-swipe-direction', 'right');
  await expect.poll(() => drawer.evaluate(node => {
    const box = node.getBoundingClientRect();
    return { left: Math.round(box.left), right: Math.round(box.right), top: Math.round(box.top), bottom: Math.round(box.bottom) };
  })).toEqual({ left: 1280 - 384, right: 1280, top: 0, bottom: 900 });
});

test('a nested drawer opens over the first and closes back to it', async ({ page }) => {
  await page.getByRole('button', { name: 'Edit profile' }).click();
  const parentId = await page.getByRole('dialog', { name: 'Edit profile' }).getAttribute('id');
  const parent = page.locator(`[id="${parentId}"]`);
  await parent.getByRole('button', { name: 'Open nested drawer' }).click();
  const nested = page.getByRole('dialog', { name: 'Nested drawer' });
  await expect(nested).toBeVisible();
  await expect(parent).toHaveAttribute('data-nested-drawer-open', '');
  await expect.poll(() => nested.evaluate(node => {
    const box = node.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return node.contains(hit);
  })).toBe(true);

  await nested.getByRole('button', { name: 'Close nested' }).click();
  await expect(nested).toHaveCount(0);
  await expect(parent).toBeVisible();
  await expect(parent).not.toHaveAttribute('data-nested-drawer-open', '');
});
