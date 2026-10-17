import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/trace');
  await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true', { timeout: 15_000 });
});

test('a collapsible line is a button that shows and hides its detail and turns its chevron', async ({ page }) => {
  const row = page.getByTestId('closed');
  const trigger = row.getByRole('button', { name: 'Ran node --version', exact: true });
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
  await expect(startsOpen.getByRole('button', { name: 'Ran npm --version', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(startsOpen.getByText('11.6.2')).toBeVisible();
  await startsOpen.getByRole('button', { name: 'Ran npm --version', exact: true }).click();
  await expect(startsOpen.getByText('11.6.2')).toBeHidden();

  const row = page.getByTestId('controlled');
  const trigger = row.getByRole('button', { name: 'Ran pnpm --version', exact: true });
  await expect(row.locator('output')).toHaveText('closed');
  await row.getByRole('button', { name: 'Toggle pnpm output', exact: true }).click();
  await expect(row.locator('output')).toHaveText('open');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(row.getByText('10.33.4')).toBeVisible();

  await trigger.click();
  await expect(row.locator('output')).toHaveText('closed');
  await expect(row.getByText('10.33.4')).toBeHidden();
});

test('a row bound to a getter and setter opens while running, closes when it ends, and keeps a click', async ({ page }) => {
  const row = page.getByTestId('follows-running');
  const trigger = row.locator('[data-slot=trace-collapsible-trigger]');
  const detail = row.getByText('reasoning text');
  const toggle = row.getByRole('button', { name: 'Toggle running', exact: true });

  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toHaveText('Thought');

  await toggle.click();
  await expect(trigger).toHaveText('Thinking');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(detail).toBeVisible();

  await toggle.click();
  await expect(trigger).toHaveText('Thought');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(detail).toBeHidden();
});

test('a click on a running row wins over the running default until the row is clicked again', async ({ page }) => {
  const row = page.getByTestId('follows-running');
  const trigger = row.locator('[data-slot=trace-collapsible-trigger]');
  const detail = row.getByText('reasoning text');
  const toggle = row.getByRole('button', { name: 'Toggle running', exact: true });

  await toggle.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(detail).toBeHidden();

  await toggle.click();
  await expect(trigger).toHaveText('Thought');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await toggle.click();
  await expect(trigger).toHaveText('Thinking');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await toggle.click();
  await expect(trigger).toHaveText('Thought');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(detail).toBeVisible();
});

test('keepMounted keeps a nested row open when its parent closes and reopens', async ({ page }) => {
  for (const [id, step, output, keeps] of [
    ['kept', 'Kept step', 'kept output', true],
    ['dropped', 'Dropped step', 'dropped output', false],
  ] as const) {
    const turn = page.getByTestId(id);
    const turnTrigger = turn.getByRole('button', { name: id === 'kept' ? 'Kept turn' : 'Dropped turn', exact: true });
    await turn.getByRole('button', { name: step, exact: true }).click();
    await expect(turn.getByText(output)).toBeVisible();

    await turnTrigger.click();
    await expect(turn.getByRole('button', { name: step, exact: true })).toBeHidden();
    await turnTrigger.click();
    await expect(turn.getByRole('button', { name: step, exact: true })).toBeVisible();
    await expect(turn.getByRole('button', { name: step, exact: true })).toHaveAttribute('aria-expanded', keeps ? 'true' : 'false');
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

test('a running title shimmers, and stops when the reader prefers reduced motion', async ({ page }) => {
  const title = page.getByTestId('lines').locator('[data-slot=trace-line]').nth(2).locator('[data-slot=trace-title]');
  await expect(title).not.toHaveCSS('background-image', 'none');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(title).toHaveCSS('background-image', 'none');
});

test('a line inside an anchor is a real link, named by its title with the new-tab hint', async ({ page }) => {
  const link = page.getByTestId('link').getByRole('link', { name: 'Install Astro (opens in a new tab)', exact: true });
  await expect(link).toHaveAttribute('href', 'https://docs.astro.build/en/install-and-setup/');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link.locator('[data-slot=trace-line]')).toHaveCSS('cursor', 'pointer');
  await link.focus();
  await expect(link).toBeFocused();
});

test('a line inside a dialog trigger opens the dialog, and Escape closes it and returns focus', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Searched the web for cache keys', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Cache key results', exact: true });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
