import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/menubar');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

const trigger = (page: import('@playwright/test').Page, name: string) => page.getByRole('menuitem', { name, exact: true }).first();

test('the menubar exposes one trigger per menu and none are open', async ({ page }) => {
  await expect(page.getByRole('menubar')).toHaveAttribute('aria-orientation', 'horizontal');
  await expect(page.getByRole('menubar').getByRole('menuitem')).toHaveText(['File', 'Edit', 'View']);
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.getByRole('menubar').getByRole('menuitem', { expanded: true })).toHaveCount(0);
});

test('clicking a trigger opens its menu of items', async ({ page }) => {
  await trigger(page, 'File').click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('menuitem')).toHaveText(['New Tab⌘T', 'New Incognito Window', 'Share', 'Delete']);
  await expect(trigger(page, 'File')).toHaveAttribute('aria-expanded', 'true');
  await expect(trigger(page, 'Edit')).toHaveAttribute('aria-expanded', 'false');
});

test('a second click on the open trigger closes the menu', async ({ page }) => {
  await trigger(page, 'File').click();
  await expect(page.getByRole('menu')).toBeVisible();
  await trigger(page, 'File').click();
  await expect(page.getByRole('menu')).toHaveCount(0);
});

test('the open trigger gets the muted background and a closed one stays transparent', async ({ page }) => {
  await expect(trigger(page, 'File')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await trigger(page, 'File').click();
  await expect(trigger(page, 'File')).toHaveCSS('background-color', 'oklch(0.97 0 0)');
  await expect(trigger(page, 'Edit')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('hovering another trigger while a menu is open switches menus', async ({ page }) => {
  await trigger(page, 'Edit').hover();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await trigger(page, 'File').click();
  await expect(page.getByRole('menu').getByRole('menuitem', { name: 'New Tab' })).toBeVisible();
  await trigger(page, 'Edit').hover();
  await expect(page.getByRole('menu')).toHaveCount(1);
  await expect(page.getByRole('menu').getByRole('menuitem')).toHaveText(['Undo', 'Redo']);
  await expect(trigger(page, 'Edit')).toHaveAttribute('aria-expanded', 'true');
  await expect(trigger(page, 'File')).toHaveAttribute('aria-expanded', 'false');
  await trigger(page, 'View').hover();
  await expect(page.getByRole('menu').getByRole('menuitemcheckbox')).toHaveText(['Show Grid']);
});

test('ArrowRight and ArrowLeft in an open menu move between menus and wrap around', async ({ page }) => {
  const menu = page.locator('[role=menu][data-open]');
  await trigger(page, 'File').click();
  await expect(page.getByRole('menu')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'New Tab' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(menu.getByRole('menuitem')).toHaveText(['Undo', 'Redo']);
  await expect(trigger(page, 'Edit')).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(menu.getByRole('menuitemcheckbox')).toHaveText(['Show Grid']);
  await expect(trigger(page, 'View')).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(trigger(page, 'File')).toHaveAttribute('aria-expanded', 'true');
  await expect(menu.getByRole('menuitem', { name: 'New Tab' })).toBeVisible();
  await expect(menu).toBeFocused();
  // Base drops a key pressed while a menu that was just reopened still runs its previous exit animation.
  await expect.poll(() => menu.evaluate((element) => element.getAnimations().length)).toBe(0);
  await page.keyboard.press('ArrowLeft');
  await expect(trigger(page, 'View')).toHaveAttribute('aria-expanded', 'true');
  await expect(trigger(page, 'File')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('menu')).toHaveCount(1);
});

test('arrow keys move focus between the triggers of a closed menubar and ArrowDown opens the menu of the focused trigger', async ({ page }) => {
  await trigger(page, 'File').focus();
  await page.keyboard.press('ArrowRight');
  await expect(trigger(page, 'Edit')).toBeFocused();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(trigger(page, 'File')).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(trigger(page, 'View')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menu').getByRole('menuitemcheckbox')).toHaveText(['Show Grid']);
});

test('arrow keys highlight items, a disabled item does not activate and Enter activates and closes the menu', async ({ page }) => {
  await trigger(page, 'File').click();
  const menu = page.getByRole('menu');
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'New Tab' })).toHaveAttribute('data-highlighted', '');
  await page.keyboard.press('ArrowDown');
  const disabled = menu.getByRole('menuitem', { name: 'New Incognito Window' });
  await expect(disabled).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toHaveCount(1);
  await expect(page.locator('output')).toHaveText('Last: none; Grid: true; Profile: benoit');
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Share' })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(menu.getByRole('menuitem', { name: 'New Tab' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.locator('output')).toHaveText('Last: New Tab; Grid: true; Profile: benoit');
});

test('Escape closes the menu and returns focus to its trigger', async ({ page }) => {
  await trigger(page, 'Edit').click();
  await expect(page.getByRole('menu')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Undo' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(trigger(page, 'Edit')).toBeFocused();
  await expect(trigger(page, 'Edit')).toHaveAttribute('aria-expanded', 'false');
});

test('a submenu opens with ArrowRight or hover, shows the open style and closes with ArrowLeft', async ({ page }) => {
  await trigger(page, 'File').click();
  await expect(page.getByRole('menu')).toBeFocused();
  // The File trigger's blur check waits one timer task. A loaded browser can run the keys
  // below first, so focus reaches the submenu before that check, which then closes the menu
  // (sveltery/base#341). Timers with equal delays run in order, so this waits for the check.
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve)));
  const share = page.getByRole('menuitem', { name: 'Share' });
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(share).toBeFocused();
  await expect(share).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menu')).toHaveCount(2);
  await expect(share).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('menuitem', { name: 'Email link' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('menu')).toHaveCount(1);
  await expect(share).toBeFocused();
  await expect(trigger(page, 'File')).toHaveAttribute('aria-expanded', 'true');

  await page.getByRole('menuitem', { name: 'New Tab' }).hover();
  await share.hover();
  await expect(page.getByRole('menu')).toHaveCount(2);
  await expect(share).toHaveCSS('background-color', 'oklch(0.97 0 0)');
  await page.getByRole('menuitem', { name: 'Messages' }).click();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.locator('output')).toHaveText('Last: Messages; Grid: true; Profile: benoit');
});

test('a checkbox item toggles and keeps the menu open', async ({ page }) => {
  await trigger(page, 'View').click();
  const item = page.getByRole('menuitemcheckbox', { name: 'Show Grid' });
  await expect(item).toHaveAttribute('aria-checked', 'true');
  await item.click();
  await expect(item).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.locator('output')).toHaveText('Last: none; Grid: false; Profile: benoit');
  await item.click();
  await expect(item).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('output')).toHaveText('Last: none; Grid: true; Profile: benoit');
});

test('a radio group selects exactly one item', async ({ page }) => {
  await trigger(page, 'View').click();
  await expect(page.getByRole('menuitemradio')).toHaveText(['Andy', 'Benoit', 'Luis']);
  await expect(page.getByRole('menuitemradio', { checked: true })).toHaveText(['Benoit']);
  await page.getByRole('menuitemradio', { name: 'Luis' }).click();
  await expect(page.getByRole('menuitemradio', { checked: true })).toHaveText(['Luis']);
  await expect(page.getByRole('menuitemradio', { name: 'Benoit' })).toHaveAttribute('aria-checked', 'false');
  await expect(page.locator('output')).toHaveText('Last: none; Grid: true; Profile: luis');
});

test('a destructive item carries the variant and renders in the destructive color', async ({ page }) => {
  await trigger(page, 'File').click();
  const destructive = page.getByRole('menuitem', { name: 'Delete' });
  await expect(destructive).toHaveAttribute('data-variant', 'destructive');
  await expect(destructive).toHaveCSS('color', 'oklch(0.577 0.245 27.325)');
  const regular = page.getByRole('menuitem', { name: 'New Tab' });
  await expect(regular).toHaveAttribute('data-variant', 'default');
  await expect(regular).toHaveCSS('color', 'oklch(0.145 0 0)');
});

test('parts carry the menubar data-slot values', async ({ page }) => {
  await trigger(page, 'File').click();
  await expect(page.getByRole('menubar')).toHaveAttribute('data-slot', 'menubar');
  await expect(trigger(page, 'File')).toHaveAttribute('data-slot', 'menubar-trigger');
  await expect(page.getByRole('menu')).toHaveAttribute('data-slot', 'menubar-content');
  await expect(page.getByRole('menuitem', { name: 'New Tab' })).toHaveAttribute('data-slot', 'menubar-item');
  await expect(page.getByRole('menuitem', { name: 'Share' })).toHaveAttribute('data-slot', 'menubar-sub-trigger');
});
