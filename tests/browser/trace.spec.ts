import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/trace');
  await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true', { timeout: 15_000 });
});

test('a collapsible line is a button that shows and hides its detail and turns its chevron', async ({ page }) => {
  const row = page.getByTestId('closed');
  const trigger = row.getByRole('button', { name: 'Ran node --version' });
  const detail = row.getByText('v24.18.0');
  const chevron = trigger.locator('[data-slot=trace-icon]');
  // Degrees the chevron is turned: 0 when it points right, 90 when the row is open.
  const rotation = () => chevron.evaluate((element) => parseFloat(getComputedStyle(element).rotate) || 0);

  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(detail).toBeHidden();
  expect(await rotation()).toBe(0);

  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(detail).toBeVisible();
  await expect.poll(rotation).toBe(90);

  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(detail).toBeHidden();
  await expect.poll(rotation).toBe(0);
});

test('open starts a row open, and bind:open reads and sets a row from outside', async ({ page }) => {
  const startsOpen = page.getByTestId('starts-open');
  await expect(startsOpen.getByRole('button', { name: 'Ran npm --version' })).toHaveAttribute('aria-expanded', 'true');
  await expect(startsOpen.getByText('11.6.2')).toBeVisible();
  await startsOpen.getByRole('button', { name: 'Ran npm --version' }).click();
  await expect(startsOpen.getByText('11.6.2')).toBeHidden();

  const row = page.getByTestId('controlled');
  const trigger = row.getByRole('button', { name: 'Ran pnpm --version' });
  await expect(row.locator('output')).toHaveText('closed');
  await row.getByRole('button', { name: 'Toggle pnpm output' }).click();
  await expect(row.locator('output')).toHaveText('open');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(row.getByText('10.33.4')).toBeVisible();

  await trigger.click();
  await expect(row.locator('output')).toHaveText('closed');
  await expect(row.getByText('10.33.4')).toBeHidden();
});

test('keepMounted keeps a nested row open when its parent closes and reopens', async ({ page }) => {
  for (const [id, step, output, keeps] of [
    ['kept', 'Kept step', 'kept output', true],
    ['dropped', 'Dropped step', 'dropped output', false],
  ] as const) {
    const turn = page.getByTestId(id);
    const turnTrigger = turn.getByRole('button', { name: id === 'kept' ? 'Kept turn' : 'Dropped turn' });
    await turn.getByRole('button', { name: step }).click();
    await expect(turn.getByText(output)).toBeVisible();

    await turnTrigger.click();
    await expect(turn.getByRole('button', { name: step })).toBeHidden();
    await turnTrigger.click();
    await expect(turn.getByRole('button', { name: step })).toBeVisible();
    await expect(turn.getByRole('button', { name: step })).toHaveAttribute('aria-expanded', keeps ? 'true' : 'false');
  }
});

test('status sets data-status and changes how the line looks, and a description follows the title', async ({ page }) => {
  const lines = page.getByTestId('lines').locator('[data-slot=trace-line]');
  expect(await lines.evaluateAll((all) => all.map((line) => line.getAttribute('data-status')))).toEqual([null, 'error', 'running', 'pending', null]);

  const done = lines.nth(0);
  const failed = lines.nth(1);
  const pending = lines.nth(3);
  const doneColor = await done.evaluate((line) => getComputedStyle(line).color);
  expect(await failed.evaluate((line) => getComputedStyle(line).color)).not.toBe(doneColor);
  await expect(pending).toHaveCSS('opacity', '0.6');
  await expect(done).toHaveCSS('opacity', '1');

  await expect(lines.nth(4).locator('[data-slot=trace-description]')).toHaveText('14s');
});

test('a line inside an anchor is a real link, named by its title with the new-tab hint', async ({ page }) => {
  const link = page.getByTestId('link').getByRole('link', { name: 'Install Astro (opens in a new tab)' });
  await expect(link).toHaveAttribute('href', 'https://docs.astro.build/en/install-and-setup/');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link.locator('[data-slot=trace-line]')).toHaveCSS('cursor', 'pointer');
  await link.focus();
  await expect(link).toBeFocused();
});

test('a line inside a dialog trigger opens the dialog, and Escape closes it and returns focus', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Searched the web for cache keys' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Cache key results' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
