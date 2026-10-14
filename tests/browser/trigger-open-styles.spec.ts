import { expect, test, type Locator, type Page } from '@playwright/test';

// Base UI sets data-popup-open and data-panel-open on triggers, and data-open only on popups, panels and roots.
// The docs blocks are tested on the docs server, the collapsible trigger on the fixture app.
const docs = process.env.DOCS_ORIGIN ?? 'http://127.0.0.1:5175';

const style = (locator: Locator, property: string) => locator.evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), property);

async function visitBlock(page: Page, name: string) {
  await page.goto(`${docs}/view/${name}`);
  await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 30_000 });
}

test('data-popup-open highlights a sidebar menu button that triggers a dropdown menu', async ({ page }) => {
  await visitBlock(page, 'sidebar-01');
  const trigger = page.getByRole('button', { name: /^Documentation v/ });
  await page.mouse.move(1, 1);
  await expect(trigger).not.toHaveAttribute('data-popup-open');
  const closed = await style(trigger, 'background-color');
  expect(closed).toBe('rgba(0, 0, 0, 0)');

  await trigger.click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.mouse.move(1, 1);
  await expect(trigger).toHaveAttribute('data-popup-open', '');
  await expect(trigger).not.toHaveAttribute('data-open');
  await expect.poll(() => style(trigger, 'background-color')).not.toBe(closed);
});

test('group-data-open on the collapsible root rotates the chevron inside its trigger', async ({ page }) => {
  await visitBlock(page, 'sidebar-07');
  const trigger = page.getByRole('button', { name: 'Models' });
  const chevron = trigger.locator('svg').last();
  const root = page.locator('[class~="group/collapsible"]').filter({ has: trigger });
  await expect(root).toHaveAttribute('data-closed', '');
  expect(await style(chevron, 'rotate')).toBe('none');

  await trigger.click();
  await expect(root).toHaveAttribute('data-open', '');
  await expect(trigger).not.toHaveAttribute('data-open');
  await expect.poll(() => style(chevron, 'rotate')).toBe('90deg');
});

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
