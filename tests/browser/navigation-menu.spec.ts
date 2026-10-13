import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/navigation-menu');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

test('hovering a trigger opens its content, and moving to another trigger swaps it', async ({ page }) => {
  const gettingStarted = page.getByRole('button', { name: 'Getting started' });
  const components = page.getByRole('button', { name: 'Components', exact: true });
  const content = page.locator('[data-slot=navigation-menu-content][data-open]');

  await expect(gettingStarted).toHaveAttribute('aria-expanded', 'false');
  await gettingStarted.hover();
  await expect(gettingStarted).toHaveAttribute('aria-expanded', 'true');
  await expect(content).toHaveText('Introduction Installation');

  // The open trigger's safe polygon turns off pointer events on the other triggers, which fails
  // Playwright's hover hit test, so the pointer moves there the way a mouse does.
  const box = await components.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2, { steps: 10 });
  await expect(components).toHaveAttribute('aria-expanded', 'true');
  await expect(gettingStarted).toHaveAttribute('aria-expanded', 'false');
  await expect(content).toHaveText('Tabs');
});

test('clicking a trigger opens its content, and Escape closes it and returns focus to the trigger', async ({ page }) => {
  const components = page.getByRole('button', { name: 'Components', exact: true });
  const content = page.locator('[data-slot=navigation-menu-content]');

  await components.click();
  await expect(components).toHaveAttribute('aria-expanded', 'true');
  await expect(content).toHaveText('Tabs');

  await page.getByRole('link', { name: 'Tabs' }).focus();
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  await expect(components).toHaveAttribute('aria-expanded', 'false');
  await expect(components).toBeFocused();
});

test('ArrowRight and ArrowLeft move focus between the top-level items', async ({ page }) => {
  await page.getByRole('button', { name: 'Getting started' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: 'Components', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('link', { name: 'Documentation' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('button', { name: 'Components', exact: true })).toBeFocused();
});

test('links are anchors with their href, and the active link is marked as the current page', async ({ page }) => {
  const docs = page.getByRole('link', { name: 'Documentation' });
  await expect(docs).toHaveAttribute('href', '#docs');
  await expect(docs).toHaveAttribute('aria-current', 'page');
  await expect(docs).toHaveAttribute('data-active', '');

  await page.getByRole('button', { name: 'Getting started' }).click();
  const introduction = page.getByRole('link', { name: 'Introduction' });
  await expect(introduction).toHaveAttribute('href', '#introduction');
  await expect(introduction).not.toHaveAttribute('aria-current');
  await expect(introduction).not.toHaveAttribute('data-active');
});

test('bind:value reports the open item and opens the item it is set to', async ({ page }) => {
  const output = page.locator('output');
  await expect(output).toHaveText('closed');
  await page.getByRole('button', { name: 'Getting started' }).click();
  await expect(output).toHaveText('getting-started');

  await page.getByRole('button', { name: 'Open Components' }).click();
  await expect(output).toHaveText('components');
  await expect(page.getByRole('button', { name: 'Components', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[data-slot=navigation-menu-content][data-open]')).toHaveText('Tabs');
});

test('the close export closes the open menu', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Getting started' });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('c');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('output')).toHaveText('closed');
});
