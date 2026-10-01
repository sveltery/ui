import { expect, test } from '@playwright/test';
for (const route of ['/dialog', '/reference']) test(`${route}: keyboard, labels, native close, isolation and focus return`, async ({ page }) => {
  await page.goto(route); await expect(page.locator('[data-hydrated=true]')).toBeVisible();
  const trigger = page.getByTestId('trigger'); await trigger.focus(); await page.keyboard.press('Enter');
  const popup = page.getByRole('dialog', { name: 'Edit profile' }); await expect(popup).toBeVisible();
  await expect(popup).toHaveAttribute('data-slot', 'dialog-content');
  await expect(popup).toHaveAccessibleDescription('Make changes to your profile here. Choose Save when you’re done.');
  await expect(page.getByRole('button', { name: 'Before', exact: true })).toHaveCount(0);
  await expect(page.getByTestId('announcement')).toMatchAriaSnapshot('- generic: Profile editor ready');
  await expect(page.getByRole('textbox', { name: 'Name' })).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await expect(popup.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('textbox', { name: 'Name' })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(popup).toHaveCount(0); await expect(trigger).toBeFocused();
  await page.keyboard.press('Space'); await expect(popup).toBeVisible(); await popup.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(popup).toHaveCount(0); await expect(trigger).toBeFocused();
  await expect(page.getByRole('button', { name: 'Before', exact: true })).toBeVisible();
});
test('native owner props, actions, render children, attachment symbols and refs reach actual replacements', async ({ page }) => {
  await page.goto('/dialog?scenario=custom'); await expect(page.locator('[data-hydrated=true]')).toBeVisible();
  await page.getByTestId('trigger').focus(); await page.keyboard.press('Enter');
  const popup = page.getByRole('dialog'); await expect(popup).toHaveAttribute('data-replacement', 'content');
  await expect(popup.getByRole('button', { name: 'Close', exact: true })).toBeVisible();
  const state = async () => JSON.parse(await page.getByTestId('state').textContent() ?? '{}');
  await expect.poll(async () => (await state()).popup).toBe('content'); await expect.poll(async () => (await state()).trigger).toBe('trigger');
  await expect.poll(async () => (await state()).attachments).toBe(1);
  await page.getByTestId('action-close').evaluate((node: HTMLButtonElement) => node.click()); await expect(popup).toHaveCount(0);
  await expect.poll(async () => (await state()).cleanups).toBe(1);
  await page.getByTestId('trigger').press('Enter'); await expect(popup).toBeVisible();
  await page.getByTestId('remove').evaluate((node: HTMLButtonElement) => node.click()); await expect(popup).toHaveCount(0);
  await expect.poll(async () => (await state()).cleanups).toBe(2); await expect.poll(async () => (await state()).popup).toBe(false);
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
});
for (const scenario of ['ordinary', 'footer', 'no-close']) test(`registry close options (${scenario})`, async ({ page }) => {
  await page.goto(`/dialog?scenario=${scenario}`); await page.getByTestId('trigger').click();
  const popup = page.getByRole('dialog'); await expect(popup).toBeVisible();
  await expect(popup.getByRole('button', { name: 'Close', exact: true })).toHaveCount(scenario === 'no-close' ? 0 : 1);
  if (scenario === 'footer') await expect(popup.locator('[data-slot=dialog-footer] button').last()).toHaveClass(/cn-button-variant-outline/);
  if (scenario === 'ordinary') await expect(popup.getByRole('button', { name: 'Close', exact: true })).toHaveClass(/cn-button-variant-ghost.*cn-button-size-icon-sm.*cn-dialog-close/);
  await popup.getByTestId('save').click(); await expect(popup).toHaveCount(0);
});
test('SSR/hydration preserves trigger IDs and mounts initially open content without console errors', async ({ page, request }) => {
  const url = '/dialog?scenario=initial'; const response = await request.get(url); expect(response.ok()).toBe(true);
  const html = await response.text(); expect(html).not.toContain('role="dialog"'); expect(html).not.toContain('data-base-ui-portal');
  const triggerId = html.match(/id="([^"]+)"[^>]*name="dialog-trigger"/)?.[1] ?? html.match(/id="([^"]+)"[^>]*aria-haspopup="dialog"/)?.[1]; expect(triggerId).toBeTruthy();
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(url); await expect(page.locator('[data-hydrated=true]')).toBeVisible(); await expect(page.getByTestId('trigger')).toHaveAttribute('id', triggerId!);
  const popup = page.getByRole('dialog', { name: 'Edit profile' }); await expect(popup).toBeVisible(); await expect(page.getByTestId('trigger')).toHaveAttribute('aria-controls', await popup.getAttribute('id') ?? '');
  await page.keyboard.press('Escape'); await expect(popup).toHaveCount(0); expect(errors).toEqual([]);
});
test('Nova animation holds exit presence, removes it after completion and cancels stale close on reopen', async ({ page }) => {
  await page.goto('/dialog'); await page.getByTestId('trigger').click(); const popup = page.getByRole('dialog'); await expect(popup).toBeVisible();
  await expect.poll(() => popup.evaluate(node => getComputedStyle(node).animationDuration)).toBe('0.1s');
  const exiting = await page.getByTestId('owner-close').evaluate((node: HTMLButtonElement) => {
    node.click(); return new Promise(resolve => requestAnimationFrame(() => { const popup = document.querySelector('[data-slot=dialog-content]')!; resolve({ connected: popup.isConnected, closed: popup.hasAttribute('data-closed'), animations: popup.getAnimations().length, overlay: !!document.querySelector('[data-slot=dialog-overlay][data-closed]') }); }));
  });
  expect(exiting).toMatchObject({ connected: true, closed: true, overlay: true }); expect((exiting as { animations: number }).animations).toBeGreaterThan(0);
  await expect(popup).toHaveCount(0); await expect(page.locator('[data-slot=dialog-overlay]')).toHaveCount(0);
  await page.getByTestId('trigger').press('Enter'); await expect(popup).toBeVisible();
  await page.getByTestId('owner-close').evaluate((node: HTMLButtonElement) => { node.click(); requestAnimationFrame(() => (document.querySelector('[data-testid=reopen]') as HTMLButtonElement).click()); });
  await expect(popup).toHaveAttribute('data-open', ''); await page.waitForTimeout(180); await expect(popup).toBeVisible();
  const state = JSON.parse(await page.getByTestId('state').textContent() ?? '{}'); expect(state.open).toBe(true); expect(state.completions.filter((value: boolean) => !value)).toHaveLength(1);
  await page.keyboard.press('Escape'); await expect(popup).toHaveCount(0);
});
test('canceled deferral does not affect a later accepted close (Base fix gate)', async ({ page }) => {
  await page.goto('/dialog'); await page.getByTestId('trigger').click(); const popup = page.getByRole('dialog'); await expect(popup).toBeVisible();
  await page.getByTestId('cancel-next').evaluate((node: HTMLButtonElement) => node.click()); await page.keyboard.press('Escape'); await expect(popup).toBeVisible();
  await page.keyboard.press('Escape'); await expect(popup).toHaveCount(0);
});
