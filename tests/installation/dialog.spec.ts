import { expect, test } from '@playwright/test';

test('documented fresh Dialog: SSR, hydration, labels, keyboard, focus return and Nova at two widths', async ({ page, request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('Open welcome dialog');
  expect(html).not.toContain('role="dialog"');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const trigger = page.getByRole('button', { name: 'Open welcome dialog' });
  const popup = page.getByRole('dialog', { name: 'Welcome', exact: true });
  for (const width of [1280, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(popup).toBeVisible();
    await expect(popup).toHaveAccessibleDescription('A small Dialog using the Nova theme. Close it to return to the page.');
    const close = popup.getByRole('button', { name: 'Close', exact: true });
    const done = popup.getByRole('button', { name: 'Done', exact: true });
    await expect(done).toBeFocused();
    await page.keyboard.press('Tab'); await expect(close).toBeFocused();
    await page.keyboard.press('Tab'); await expect(done).toBeFocused();
    await page.keyboard.press('Shift+Tab'); await expect(close).toBeFocused();
    await expect.poll(() => popup.evaluate(node => getComputedStyle(node).position)).toBe('fixed');
    const style = await popup.evaluate(node => {
      const css = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return { background: css.backgroundColor, duration: css.animationDuration, centered: Math.abs(rect.x + rect.width / 2 - innerWidth / 2) < 2, fits: rect.width <= innerWidth - 32 };
    });
    expect(style.background).toBe('oklch(1 0 0)');
    expect(style.duration).toBe('0.1s');
    expect(style.centered).toBe(true); expect(style.fits).toBe(true);
    await expect(page.locator('[data-slot=dialog-overlay]')).toBeVisible();
    await page.keyboard.press('Escape'); await expect(popup).toHaveCount(0); await expect(trigger).toBeFocused();
    await page.keyboard.press('Space'); await expect(popup).toBeVisible();
    await close.click(); await expect(popup).toHaveCount(0); await expect(trigger).toBeFocused();
    await page.keyboard.press('Enter'); await expect(popup).toBeVisible();
    await done.click(); await expect(popup).toHaveCount(0); await expect(trigger).toBeFocused();
  }
  expect(errors).toEqual([]);
});
