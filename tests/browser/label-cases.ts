import { expect, test, type Page } from '@playwright/test';
// Source-derived native acceptance probes; Svelte refs/attachments are framework-specific.
export async function labelState(page: Page) { return JSON.parse(await page.getByTestId('probe-state').innerText()); }
export async function labelNativeAssertions(page: Page) {
  await expect(page.locator('#probe-label')).toHaveAttribute('for', 'probe-first');
  await expect(page.locator('#probe-first')).toHaveAccessibleName(/Account name/);
  await page.locator('#probe-label').click();
  await expect(page.locator('#probe-first')).toBeFocused();
  expect((await labelState(page)).clicks).toBe(1);
  const style = (id: string) => page.getByTestId(id).evaluate(node => {
    const css = getComputedStyle(node);
    return { opacity: css.opacity, pointerEvents: css.pointerEvents, cursor: css.cursor };
  });
  expect(await style('group-true')).toEqual({ opacity: '0.5', pointerEvents: 'none', cursor: 'auto' });
  for (const id of ['group-false', 'group-empty', 'group-missing', 'no-group', 'peer-enabled', 'no-peer', 'peer-after', 'plain-data-empty', 'aria-only', 'aria-missing']) {
    expect(await style(id), id).toEqual({ opacity: '1', pointerEvents: 'auto', cursor: 'auto' });
  }
  expect(await style('peer-disabled')).toEqual({ opacity: '0.5', pointerEvents: 'auto', cursor: 'not-allowed' });
  for (const id of ['aria-data-empty', 'aria-data-false']) expect(await style(id), id).toEqual({ opacity: '0.5', pointerEvents: 'auto', cursor: 'auto' });
  expect(await page.locator('#probe-label').evaluate(node => {
    const css = getComputedStyle(node);
    return { display: css.display, gap: css.gap, fontSize: css.fontSize, fontWeight: css.fontWeight, lineHeight: css.lineHeight, userSelect: css.userSelect, color: css.color };
  })).toEqual({ display: 'flex', gap: '8px', fontSize: '14px', fontWeight: '500', lineHeight: '14px', userSelect: 'none', color: 'rgb(30, 40, 50)' });
  await page.getByRole('button', { name: 'Update label', exact: true }).click();
  await expect(page.locator('#probe-label')).toHaveAttribute('for', 'probe-second');
  await expect(page.locator('#probe-label')).toHaveAttribute('data-slot', 'label-override');
  await expect(page.locator('#probe-label')).toHaveAttribute('data-custom', 'updated');
  await expect(page.locator('#probe-label')).toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('#probe-second')).toHaveAccessibleName(/Updated name/);
  await expect(page.locator('#probe-first')).toHaveAccessibleName('');
  expect(await page.locator('#probe-label').evaluate(node => {
    const css = getComputedStyle(node);
    return { gap: css.gap, fontSize: css.fontSize, color: css.color, pointerEvents: css.pointerEvents, opacity: css.opacity };
  })).toEqual({ gap: '16px', fontSize: '18px', color: 'rgb(60, 70, 80)', pointerEvents: 'auto', opacity: '1' });
  // aria-disabled does not disable a native label or prevent its default focus association.
  await page.locator('#probe-label').click();
  await expect(page.locator('#probe-second')).toBeFocused();
  expect((await labelState(page)).clicks).toBe(2);
}
export function labelLifecycleCases(route = '/label-probe') {
  test('native Label SSR retains identity; initially undefined refs and symbol attachments assign, replace and clean up', async ({ page, request }) => {
    const html = await (await request.get(route)).text();
    expect(html).toContain('data-hydrated="false"'); expect(html).toContain('Account name'); expect(html).toContain('undefined');
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    // Complete development dependency discovery before capturing a fresh SSR document.
    await page.goto(route); await expect(page.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'true');
    let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*', async requestRoute => { if (requestRoute.request().resourceType() === 'script') await gate; await requestRoute.continue(); });
    try {
      await page.goto(route, { waitUntil: 'commit' });
      await expect(page.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'false');
      const host = await page.locator('#probe-label').elementHandle(); expect(host).not.toBeNull();
      expect((await labelState(page)).tag).toBe('undefined');
      release(); await expect(page.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'true');
      await expect.poll(async () => (await labelState(page)).tag).toBe('LABEL');
      expect((await labelState(page)).attachments).toBe(1);
      expect(await host!.evaluate(node => node === document.querySelector('#probe-label'))).toBe(true);
      await expect(page.locator('#probe-label')).toHaveAttribute('data-probed', 'label');
      await page.getByRole('button', { name: 'Swap attachments', exact: true }).click();
      await expect.poll(async () => (await labelState(page)).attachments).toBe(2);
      expect((await labelState(page)).cleanups).toBe(1);
      expect(await host!.evaluate(node => node === document.querySelector('#probe-label'))).toBe(true);
      await page.getByRole('button', { name: 'Remove label', exact: true }).click();
      await expect(page.locator('#probe-label')).toHaveCount(0);
      await expect.poll(async () => (await labelState(page)).tag).toBe(null);
      expect((await labelState(page)).cleanups).toBe(2);
      expect(await host!.evaluate(node => node.isConnected)).toBe(false);
      await page.getByRole('button', { name: 'Restore label', exact: true }).click();
      await expect.poll(async () => (await labelState(page)).tag).toBe('LABEL');
      expect((await labelState(page)).attachments).toBe(3);
      expect(await page.locator('#probe-label').evaluate((node, old) => node === old, host)).toBe(false);
      expect(errors).toEqual([]);
    } finally { release(); }
  });
}
