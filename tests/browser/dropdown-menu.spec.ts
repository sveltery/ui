import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/dropdown-menu');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

test('clicking the trigger opens a menu of its items', async ({ page }) => {
  await expect(page.getByRole('menu')).toHaveCount(0);
  await page.getByRole('button', { name: 'Actions' }).click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('menuitem')).toHaveText(['Profile⇧⌘P', 'Billing', 'Settings', 'Invite users', 'Delete']);
  await expect(page.getByRole('button', { name: 'Actions' })).toHaveAttribute('aria-expanded', 'true');
});

test('arrow keys move the highlight and Enter activates the item and closes the menu', async ({ page }) => {
  await page.getByRole('button', { name: 'Actions' }).click();
  const menu = page.getByRole('menu');
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Profile' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Settings' })).toBeFocused();
  await expect(menu.getByRole('menuitem', { name: 'Settings' })).toHaveAttribute('data-highlighted', '');
  await page.keyboard.press('ArrowUp');
  await expect(menu.getByRole('menuitem', { name: 'Billing' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.locator('output')).toHaveText('Last: Billing; Status bar: true; Position: bottom');
});

test('Escape closes the menu and returns focus to the trigger', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Actions' });
  await trigger.click();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('a checkbox item toggles and keeps the menu open', async ({ page }) => {
  await page.getByRole('button', { name: 'View' }).click();
  const item = page.getByRole('menuitemcheckbox', { name: 'Status Bar' });
  await expect(item).toHaveAttribute('aria-checked', 'true');
  await item.click();
  await expect(item).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.locator('output')).toHaveText('Last: none; Status bar: false; Position: bottom');
  await item.click();
  await expect(item).toHaveAttribute('aria-checked', 'true');
});

test('a radio group selects exactly one item', async ({ page }) => {
  await page.getByRole('button', { name: 'View' }).click();
  const radios = page.getByRole('menuitemradio');
  await expect(radios).toHaveText(['Top', 'Bottom', 'Right']);
  await expect(page.getByRole('menuitemradio', { checked: true })).toHaveText(['Bottom']);
  await page.getByRole('menuitemradio', { name: 'Top' }).click();
  await expect(page.getByRole('menuitemradio', { checked: true })).toHaveText(['Top']);
  await expect(page.getByRole('menuitemradio', { name: 'Bottom' })).toHaveAttribute('aria-checked', 'false');
  await expect(page.locator('output')).toHaveText('Last: none; Status bar: true; Position: top');
});

test('a submenu opens with ArrowRight or hover and closes with ArrowLeft', async ({ page }) => {
  await page.getByRole('button', { name: 'Actions' }).click();
  const subTrigger = page.getByRole('menuitem', { name: 'Invite users' });
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(subTrigger).toBeFocused();
  await expect(subTrigger).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menu')).toHaveCount(2);
  await expect(subTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('menuitem', { name: 'Email' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('menu')).toHaveCount(1);
  await expect(subTrigger).toBeFocused();

  await page.getByRole('menuitem', { name: 'Settings' }).hover();
  await subTrigger.hover();
  await expect(page.getByRole('menu')).toHaveCount(2);
  await page.getByRole('menuitem', { name: 'Message' }).click();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.locator('output')).toHaveText('Last: Message; Status bar: true; Position: bottom');
});

test('a destructive item carries the destructive variant', async ({ page }) => {
  await page.getByRole('button', { name: 'Actions' }).click();
  await expect(page.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-variant', 'destructive');
  await expect(page.getByRole('menuitem', { name: 'Billing' })).toHaveAttribute('data-variant', 'default');
});
