import { expect, test, type Page } from '@playwright/test';
const expectedTags = { button: 'BUTTON', trigger: 'BUTTON', portal: 'DIV', overlay: 'DIV', content: 'DIV', title: 'H2', description: 'P', close: 'BUTTON' };
async function state(page: Page) { return JSON.parse(await page.getByTestId('base-pin-state').innerText()); }
async function open(page: Page) {
  await page.goto('/base-pin'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  await page.getByTestId('base-pin-trigger').click();
  await expect.poll(async () => (await state(page)).tags).toEqual(expectedTags);
}
export function basePinCases() {
  test('public initial-undefined refs preserve SSR/hydration host identity and attachment cleanup', async ({ page, request }) => {
    const response = await request.get('/base-pin'); expect(response.ok()).toBe(true);
    const html = await response.text(); expect(html).toContain('Open ref probe'); expect(html).not.toContain('data-base-ui-portal');
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    // Finish Vite dependency discovery, then test a fresh SSR document with scripts gated.
    await page.goto('/base-pin'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
    try {
      await page.goto('/base-pin', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
      const button = await page.getByTestId('base-pin-button').elementHandle(); const trigger = await page.getByTestId('base-pin-trigger').elementHandle();
      expect(button).not.toBeNull(); expect(trigger).not.toBeNull(); release();
      await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
      expect(await button!.evaluate(node => node === document.querySelector('[data-testid=base-pin-button]'))).toBe(true);
      expect(await trigger!.evaluate(node => node === document.querySelector('[data-testid=base-pin-trigger]'))).toBe(true);
      expect((await state(page)).bindingLog).toEqual(['BUTTON']); expect((await state(page)).actions).toBe(true);
      await page.getByTestId('base-pin-trigger').focus(); await page.keyboard.press('Enter');
      await expect.poll(async () => (await state(page)).tags).toEqual(expectedTags);
      expect((await state(page)).attachments).toEqual(Object.fromEntries(Object.keys(expectedTags).map(part => [part, 1])));
      expect(await page.locator('[data-probed]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-probed')).sort())).toEqual(Object.keys(expectedTags).sort());
      await page.getByRole('dialog').getByTestId('base-pin-action-close').click(); await expect(page.getByRole('dialog')).toHaveCount(0);
      await page.getByTestId('base-pin-trigger').click(); await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByTestId('base-pin-close').click(); await expect(page.getByRole('dialog')).toHaveCount(0);
      await page.getByTestId('base-pin-trigger').click(); await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('dialog').getByTestId('base-pin-remove').click();
      await expect.poll(async () => (await state(page)).tags).toEqual(Object.fromEntries(Object.keys(expectedTags).map(part => [part, null])));
      expect((await state(page)).cleanups).toEqual((await state(page)).attachments);
      expect((await state(page)).bindingLog).toEqual(['BUTTON', null]); await expect(page.locator('[data-base-ui-portal]')).toHaveCount(0);
      expect(errors).toEqual([]);
    } finally { release(); }
  });
  test('public Portal retargeting distinguishes empty refs, explicit null and native node precedence', async ({ page }) => {
    await open(page); const outer = page.getByTestId('base-pin-portal');
    await expect.poll(() => outer.evaluate(node => node.parentElement?.id || node.parentElement?.tagName.toLowerCase())).toBe('body');
    expect(await page.getByTestId('base-pin-nested').evaluate(node => node.parentElement?.getAttribute('data-testid'))).toBe('base-pin-portal');
    const node = await outer.elementHandle(); expect(node).not.toBeNull();
    await page.getByRole('dialog').getByTestId('base-pin-element-current').click(); await expect.poll(() => outer.evaluate(node => node.parentElement?.id || node.parentElement?.tagName.toLowerCase())).toBe('base-pin-first');
    expect(await node!.evaluate(element => element === document.querySelector('[data-testid=base-pin-portal]'))).toBe(true);
    await page.getByRole('dialog').getByTestId('base-pin-ref-owner-document').click(); await expect.poll(() => outer.evaluate(node => node.parentElement?.id || node.parentElement?.tagName.toLowerCase())).toBe('base-pin-second');
    await page.getByRole('dialog').getByTestId('base-pin-undefined').click(); await expect.poll(() => outer.evaluate(node => node.parentElement?.id || node.parentElement?.tagName.toLowerCase())).toBe('body');
    await page.getByRole('dialog').getByTestId('base-pin-null').click(); await expect(page.locator('[data-base-ui-portal]')).toHaveCount(0);
    expect(await node!.evaluate(element => element.isConnected)).toBe(false);
    await page.getByTestId('base-pin-null-ref').click(); await expect.poll(() => outer.evaluate(node => node.parentElement?.id || node.parentElement?.tagName.toLowerCase())).toBe('body');
    expect(await node!.evaluate(element => element === document.querySelector('[data-testid=base-pin-portal]'))).toBe(false);
    await page.getByRole('dialog').getByTestId('base-pin-remove').click(); await expect(page.locator('[data-base-ui-portal]')).toHaveCount(0);
    expect((await state(page)).cleanups).toEqual((await state(page)).attachments);
  });
}
