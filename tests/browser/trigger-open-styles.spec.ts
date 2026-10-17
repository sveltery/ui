import { expect, test, type Locator } from '@playwright/test';

// Base UI sets data-popup-open and data-panel-open on triggers, and data-open only on popups, panels and roots.
// The docs blocks' trigger styles are tested in blocks.spec.ts (sidebar-01, sidebar-07), the collapsible trigger here on the fixture app.

const style = (locator: Locator, property: string) => locator.evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), property);

test('data-panel-open on a collapsible trigger styles the trigger itself', async ({ page }) => {
  await page.goto('/trigger-open-styles');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  const trigger = page.locator('.panel-trigger');
  await expect(trigger).not.toHaveAttribute('data-panel-open');
  expect(await style(trigger, 'background-color')).toBe('rgb(255, 255, 255)');

  await trigger.click();
  await expect(trigger).toHaveAttribute('data-panel-open', '');
  await expect(trigger).not.toHaveAttribute('data-open');
  await expect.poll(() => style(trigger, 'background-color')).toBe('rgb(0, 0, 0)');
});
