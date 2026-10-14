import { expect, test } from '@playwright/test';

type Page = import('@playwright/test').Page;

const toaster = (page: Page) => page.locator('[data-sonner-toaster]');
const toast = (page: Page) => page.locator('[data-sonner-toast]');

async function show(page: Page, name: string) {
  await page.getByRole('button', { name, exact: true }).click();
  await expect(toast(page)).toHaveCount(1);
  return toast(page);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/sonner');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

test('toast() shows the title and description in the Notifications region', async ({ page }) => {
  const shown = await show(page, 'Default');
  await expect(page.getByRole('region', { name: /^Notifications/ }).locator('[data-sonner-toast]')).toHaveCount(1);
  await expect(shown.locator('[data-title]')).toHaveText('Event has been created');
  await expect(shown.locator('[data-description]')).toHaveText('Monday, January 3rd at 6:00pm');
  await expect(shown.locator('[data-icon]')).toHaveCount(0);
});

test('the toaster is the toaster group at the bottom right, in the system theme', async ({ page }) => {
  await page.getByRole('button', { name: 'Default', exact: true }).click();
  await expect(toaster(page)).toHaveClass('toaster group');
  await expect(toaster(page)).toHaveAttribute('data-y-position', 'bottom');
  await expect(toaster(page)).toHaveAttribute('data-x-position', 'right');
  await expect(toaster(page)).toHaveAttribute('data-sonner-theme', 'light');
});

test('the system theme follows the color scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.getByRole('button', { name: 'Default', exact: true }).click();
  await expect(toaster(page)).toHaveAttribute('data-sonner-theme', 'dark');
});

test('toasts use the popover colors, the theme radius and the cn-toast class', async ({ page }) => {
  const shown = await show(page, 'Default');
  await expect(shown).toHaveClass(/\bcn-toast\b/);
  const expected = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.cssText = 'background: var(--popover); color: var(--popover-foreground); border: 1px solid var(--border); border-radius: var(--radius);';
    document.body.append(probe);
    const style = getComputedStyle(probe);
    const colors = { background: style.backgroundColor, color: style.color, border: style.borderTopColor, radius: style.borderTopLeftRadius };
    probe.remove();
    return colors;
  });
  await expect(shown).toHaveCSS('background-color', expected.background);
  await expect(shown).toHaveCSS('color', expected.color);
  await expect(shown).toHaveCSS('border-top-color', expected.border);
  await expect(shown).toHaveCSS('border-top-left-radius', expected.radius);
});

for (const [name, spin] of [['Success', false], ['Info', false], ['Warning', false], ['Error', false], ['Loading', true]] as const) {
  test(`a ${name.toLowerCase()} toast shows the 16px icon${spin ? ', spinning' : ''}`, async ({ page }) => {
    const shown = await show(page, name);
    const icon = shown.locator('[data-icon] svg');
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveCSS('width', '16px');
    await expect(icon).toHaveCSS('height', '16px');
    await expect(icon).toHaveClass(spin ? /\banimate-spin\b/ : /^(?!.*\banimate-spin\b)/);
  });
}

test('props passed to Toaster override its defaults', async ({ page }) => {
  await page.getByRole('button', { name: 'Top center' }).click();
  await page.getByRole('button', { name: 'Dark theme' }).click();
  await page.getByRole('button', { name: 'Default', exact: true }).click();
  await expect(toaster(page)).toHaveAttribute('data-y-position', 'top');
  await expect(toaster(page)).toHaveAttribute('data-x-position', 'center');
  await expect(toaster(page)).toHaveAttribute('data-sonner-theme', 'dark');
});
