import { expect, test } from '@playwright/test';

const cnClasses = (classes: string | null) => classes!.split(' ').filter(name => name.startsWith('cn-'));

test.beforeEach(async ({ page }) => {
  await page.goto('/button-render');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached({ timeout: 30_000 });
});

test('a caller render replaces the default Button of AlertDialogCancel', async ({ page }) => {
  const cancel = page.locator('[data-slot=alert-dialog-cancel]');
  await expect(cancel).toHaveText('Keep editing');
  expect(cnClasses(await cancel.getAttribute('class'))).toEqual(['cn-alert-dialog-cancel']);
});

test('a caller render replaces the default Button of ToastAction', async ({ page }) => {
  const action = page.locator('[data-slot=toast-action]');
  await expect(action).toHaveText('Undo');
  await expect(action).toHaveAttribute('class', 'shrink-0');
});

test('a caller render replaces the default Button of ToastClose', async ({ page }) => {
  const close = page.locator('[data-slot=toast-close]');
  await expect(close).toHaveAttribute('aria-label', 'Close toast');
  await expect(close).toHaveAttribute('class', "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground");
});

test('a caller render replaces the default Button of MessageScrollerButton', async ({ page }) => {
  const scroller = page.locator('[data-slot=message-scroller-button]');
  await expect(scroller).toHaveText('Jump');
  expect(cnClasses(await scroller.getAttribute('class'))).toEqual(['cn-message-scroller-button']);
});
