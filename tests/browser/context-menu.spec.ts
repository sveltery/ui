import { expect, test, type Locator, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/context-menu');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached({ timeout: 30_000 });
});

const rightClick = (page: Page, x: number, y: number) => page.mouse.click(x, y, { button: 'right' });
const positionerBox = (menu: Locator) => menu.evaluate((popup) => {
  const { x, y } = popup.parentElement!.getBoundingClientRect();
  return { x, y };
});

test('a right click opens the menu at the pointer and a left click does not', async ({ page }) => {
  await page.mouse.click(300, 100);
  await expect(page.getByRole('menu')).toHaveCount(0);
  await rightClick(page, 300, 100);
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect.poll(() => positionerBox(menu)).toEqual({ x: 300, y: 104 });
  await expect(menu.getByRole('menuitem')).toHaveText(['Back⌘[', 'Forward', 'Reload', 'More Tools', 'Delete']);
  await expect(menu.getByRole('menuitemcheckbox')).toHaveText(['Show Bookmarks Bar']);
  await expect(menu.getByRole('menuitemradio')).toHaveText(['Light', 'Dark', 'System']);
});

test('the menu follows the pointer on each right click', async ({ page }) => {
  await rightClick(page, 300, 100);
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await rightClick(page, 150, 60);
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect.poll(() => positionerBox(menu)).toEqual({ x: 150, y: 64 });
});

test('side="left" places the menu against the left of the pointer', async ({ page }) => {
  const area = page.getByTestId('left-area');
  const box = (await area.boundingBox())!;
  const x = Math.round(box.x + 300);
  const y = Math.round(box.y + 20);
  await rightClick(page, x, y);
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect.poll(async () => {
    const rect = await menu.evaluate((popup) => popup.parentElement!.getBoundingClientRect().toJSON());
    return { right: rect.right, bottom: rect.bottom };
  }).toEqual({ right: x, bottom: y - 4 });
});

test('a right click outside the trigger does not open the menu', async ({ page }) => {
  await rightClick(page, 800, 500);
  await expect(page.getByRole('menu')).toHaveCount(0);
});

test('the trigger marks itself while the menu is open', async ({ page }) => {
  const area = page.getByTestId('area');
  await expect(area).not.toHaveAttribute('data-popup-open');
  await rightClick(page, 300, 100);
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(area).toHaveAttribute('data-popup-open', '');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(area).not.toHaveAttribute('data-popup-open');
});

test('a disabled root does not open', async ({ page }) => {
  const [x, y] = await centerOf(page.getByTestId('second-area'));
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await rightClick(page, x, y);
  await expect(page.getByRole('menu')).toHaveCount(0);
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await rightClick(page, x, y);
  await expect(page.getByRole('menuitem', { name: 'Second action' })).toBeVisible();
});

test('arrow keys, Home and End move the highlight, and Enter activates the item and closes the menu', async ({ page }) => {
  await rightClick(page, 300, 100);
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Back' })).toBeFocused();
  await expect(menu.getByRole('menuitem', { name: 'Back' })).toHaveAttribute('data-highlighted', '');
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Forward' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Reload' })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Reload' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(menu.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(menu.getByRole('menuitem', { name: 'Back' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.locator('output')).toHaveText('Last: Reload; Bookmarks: true; Theme: light');
});

test('typeahead moves the highlight to the item that starts with the typed text', async ({ page }) => {
  await rightClick(page, 300, 100);
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.type('del');
  await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
});

test('typeahead on a single letter jumps to the next item with that letter', async ({ page }) => {
  await rightClick(page, 300, 100);
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('r');
  await expect(page.getByRole('menuitem', { name: 'Reload' })).toBeFocused();
});

test('clicking an item runs it and closes the menu', async ({ page }) => {
  await rightClick(page, 300, 100);
  await page.getByRole('menuitem', { name: 'Back' }).click();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.locator('output')).toHaveText('Last: Back; Bookmarks: true; Theme: light');
});

test('clicking the disabled item neither runs it nor closes the menu', async ({ page }) => {
  await rightClick(page, 300, 100);
  const forward = page.getByRole('menuitem', { name: 'Forward' });
  await expect(forward).toHaveAttribute('data-disabled', '');
  await forward.click({ force: true });
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(forward).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.locator('output')).toHaveText('Last: none; Bookmarks: true; Theme: light');
});

test('a press outside closes the menu', async ({ page }) => {
  const [x, y] = await centerOf(page.getByRole('button', { name: 'Outside' }));
  await rightClick(page, 300, 100);
  await expect(page.getByRole('menu')).toBeVisible();
  await page.mouse.click(x, y);
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.locator('output')).toHaveText('Last: none; Bookmarks: true; Theme: light');
});

test('Escape closes the menu', async ({ page }) => {
  await rightClick(page, 300, 100);
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Back' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
});

test('a submenu opens with ArrowRight or hover and closes with ArrowLeft', async ({ page }) => {
  await rightClick(page, 300, 100);
  const subTrigger = page.getByRole('menuitem', { name: 'More Tools' });
  await expect(subTrigger).toHaveAttribute('aria-expanded', 'false');
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowDown');
  await expect(subTrigger).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menu')).toHaveCount(2);
  await expect(subTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('menuitem', { name: 'Save Page...' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('menu')).toHaveCount(1);
  await expect(subTrigger).toBeFocused();

  await page.getByRole('menuitem', { name: 'Reload' }).hover();
  await subTrigger.hover();
  await expect(page.getByRole('menu')).toHaveCount(2);
  await page.getByRole('menuitem', { name: 'Developer Tools' }).click();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.locator('output')).toHaveText('Last: Developer Tools; Bookmarks: true; Theme: light');
});

test('the submenu trigger keeps its accent background while focus is inside the submenu', async ({ page }) => {
  await rightClick(page, 300, 100);
  const subTrigger = page.getByRole('menuitem', { name: 'More Tools' });
  const background = (item: Locator) => item.evaluate((node) => getComputedStyle(node).backgroundColor);
  await expect.poll(() => background(subTrigger)).toBe('rgba(0, 0, 0, 0)');
  await subTrigger.hover();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Save Page...' })).toBeFocused();
  await expect(subTrigger).not.toBeFocused();
  await expect(subTrigger).toHaveAttribute('data-popup-open', '');
  await expect.poll(() => background(subTrigger)).not.toBe('rgba(0, 0, 0, 0)');
});

test('a checkbox item toggles and keeps the menu open', async ({ page }) => {
  await rightClick(page, 300, 100);
  const item = page.getByRole('menuitemcheckbox', { name: 'Show Bookmarks Bar' });
  await expect(item).toHaveAttribute('aria-checked', 'true');
  await item.click();
  await expect(item).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.locator('output')).toHaveText('Last: none; Bookmarks: false; Theme: light');
  await item.click();
  await expect(item).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('output')).toHaveText('Last: none; Bookmarks: true; Theme: light');
});

test('a radio group selects exactly one item', async ({ page }) => {
  await rightClick(page, 300, 100);
  await expect(page.getByRole('menuitemradio', { checked: true })).toHaveText(['Light']);
  await page.getByRole('menuitemradio', { name: 'Dark' }).click();
  await expect(page.getByRole('menuitemradio', { checked: true })).toHaveText(['Dark']);
  await expect(page.getByRole('menuitemradio', { name: 'Light' })).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.locator('output')).toHaveText('Last: none; Bookmarks: true; Theme: dark');
});

test('a destructive item carries the destructive variant and color', async ({ page }) => {
  await rightClick(page, 300, 100);
  const destructive = page.getByRole('menuitem', { name: 'Delete' });
  const color = (item: Locator) => item.evaluate((node) => getComputedStyle(node).color);
  await expect(destructive).toHaveAttribute('data-variant', 'destructive');
  await expect(page.getByRole('menuitem', { name: 'Reload' })).toHaveAttribute('data-variant', 'default');
  await expect.poll(() => color(destructive)).toBe('oklch(0.577 0.245 27.325)');
  await expect.poll(() => color(page.getByRole('menuitem', { name: 'Reload' }))).not.toBe('oklch(0.577 0.245 27.325)');
});

test('inside a dialog the menu opens above it, and Escape closes only the menu', async ({ page }) => {
  await page.getByRole('button', { name: 'Open Dialog' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await rightClick(page, ...(await centerOf(page.getByTestId('dialog-area'))));
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('menuitem')).toHaveText(['Copy', 'Paste']);
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(dialog).toBeVisible();

  await rightClick(page, ...(await centerOf(page.getByTestId('dialog-area'))));
  await page.getByRole('menuitem', { name: 'Paste' }).click();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(dialog).toBeVisible();
  await expect(page.locator('output')).toHaveText('Last: Paste; Bookmarks: true; Theme: light');
});

async function centerOf(locator: Locator): Promise<[number, number]> {
  const box = (await locator.boundingBox())!;
  return [box.x + box.width / 2, box.y + box.height / 2];
}
