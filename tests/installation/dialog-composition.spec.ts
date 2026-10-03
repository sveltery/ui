// Authored distribution regression, run unchanged for real archive/source-copy modes.
import { expect, test } from '@playwright/test';

test('fresh Dialog loads its canonical Button/icon closure and preserves close focus', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  // The guide's SSR-visible trigger must hydrate before trusted activation.
  await page.goto('/', { waitUntil: 'networkidle' });
  const trigger = page.getByRole('button', { name: 'Open welcome dialog' }); await trigger.click();
  const popup = page.getByRole('dialog', { name: 'Welcome', exact: true });
  const close = popup.getByRole('button', { name: 'Close', exact: true });
  await expect(close).toHaveAttribute('data-slot', 'dialog-close'); await expect(close).toHaveAttribute('tabindex', '0');
  await expect(close).toHaveClass(/cn-button-variant-ghost.*cn-button-size-icon-sm.*cn-dialog-close/);
  await expect(close.locator('svg')).toHaveClass(/lucide-x/);
  await expect(close.locator('svg')).not.toHaveAttribute('aria-hidden');
  await expect(close.locator('.sr-only')).toHaveText('Close');
  await expect(popup.locator('button button')).toHaveCount(0);
  await close.focus(); await page.keyboard.press('Enter'); await expect(popup).toHaveCount(0); await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});
