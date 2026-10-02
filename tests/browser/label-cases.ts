import { expect, test, type Page } from '@playwright/test';
// Source-derived native acceptance probes; Svelte refs/attachments are framework-specific.
export async function labelState(page: Page) { return JSON.parse(await page.getByTestId('probe-state').innerText()); }
// Source-derived native HTML witness, with the same flex label/child and two-input anatomy.
// Firefox retains the first input.labels cache after for changes, including for native HTML.
export async function nativeLabelAssociation(page: Page) {
  // Capture the actual association before creating the isolated document. Inserting/removing
  // another label in the actual document invalidates Firefox's cached input.labels observation.
  const actual = await page.locator('#probe-label').evaluate((label: HTMLLabelElement) => {
    const first = document.querySelector<HTMLInputElement>('#probe-first')!;
    const second = document.querySelector<HTMLInputElement>('#probe-second')!;
    return { control: label.control?.id, first: Array.from(first.labels ?? [], item => item.id), second: Array.from(second.labels ?? [], item => item.id) };
  });
  const witness = await page.context().newPage();
  try {
    await witness.setContent('<main><section><label id="native-label" for="native-first" style="display:flex">Account name<span>optional</span></label><input id="native-first" type="text"><input id="native-second" type="text"></section></main>');
    // Prime the original native association exactly as the actual probe's initial name assertion does.
    await expect(witness.locator('#native-first')).toHaveAccessibleName('Account name optional');
    expect(await witness.locator('#native-first').evaluate((input: HTMLInputElement) => Array.from(input.labels ?? [], label => label.id))).toEqual(['native-label']);
    await witness.locator('label').evaluate((label: HTMLLabelElement) => { label.htmlFor = 'native-second'; label.firstChild!.textContent = 'Updated name'; });
    const result = await witness.evaluate(() => {
      const label = document.querySelector('label')!;
      return { control: label.control?.id, first: Array.from(document.querySelector<HTMLInputElement>('#native-first')!.labels ?? [], item => item.id), second: Array.from(document.querySelector<HTMLInputElement>('#native-second')!.labels ?? [], item => item.id) };
    });
    expect(result.control).toBe('native-second'); expect(result.second).toEqual(['native-label']);
    const firstName = result.first.length ? 'Updated name optional' : '';
    expect(result.first).toEqual(firstName ? ['native-label'] : []);
    await expect(witness.locator('#native-first')).toHaveAccessibleName(firstName);
    await expect(witness.locator('#native-second')).toHaveAccessibleName('Updated name optional');
    await witness.locator('label').click(); await expect(witness.locator('#native-second')).toBeFocused();
    expect(actual.control).toBe('probe-second'); expect(actual.second).toEqual(['probe-label']);
    expect(actual.first).toEqual(result.first.map(() => 'probe-label'));
    return { firstName, firstLabels: result.first.map(() => 'probe-label') };
  } finally { await witness.close(); }
}
export async function labelNativeAssertions(page: Page) {
  await expect(page.locator('#probe-label')).toHaveAttribute('for', 'probe-first');
  await expect(page.locator('#probe-first')).toHaveAccessibleName(/Account name/);
  expect(await page.locator('#probe-first').evaluate((input: HTMLInputElement) => Array.from(input.labels ?? [], label => label.id))).toEqual(['probe-label']);
  await page.locator('#probe-label').click();
  await expect(page.locator('#probe-first')).toBeFocused();
  expect((await labelState(page)).clicks).toBe(1);
  const style = (id: string) => page.getByTestId(id).evaluate(node => {
    const css = getComputedStyle(node);
    return { opacity: css.opacity, pointerEvents: css.pointerEvents, cursor: css.cursor };
  });
  // Native Chromium label cursor is default in both pinned/local measurements; only peer-disabled supplies a cursor rule.
  expect(await style('group-true')).toEqual({ opacity: '0.5', pointerEvents: 'none', cursor: 'default' });
  for (const id of ['group-false', 'group-empty', 'group-missing', 'no-group', 'peer-enabled', 'no-peer', 'peer-after', 'plain-data-empty', 'aria-only', 'aria-missing']) {
    expect(await style(id), id).toEqual({ opacity: '1', pointerEvents: 'auto', cursor: 'default' });
  }
  expect(await style('peer-disabled')).toEqual({ opacity: '0.5', pointerEvents: 'auto', cursor: 'not-allowed' });
  for (const id of ['aria-data-empty', 'aria-data-false']) expect(await style(id), id).toEqual({ opacity: '0.5', pointerEvents: 'auto', cursor: 'default' });
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
  const nativeAssociation = await nativeLabelAssociation(page);
  expect(await page.locator('#probe-label').evaluate((label: HTMLLabelElement) => label.control?.id)).toBe('probe-second');
  expect(await page.locator('#probe-second').evaluate((input: HTMLInputElement) => Array.from(input.labels ?? [], label => label.id))).toEqual(['probe-label']);
  expect(await page.locator('#probe-first').evaluate((input: HTMLInputElement) => Array.from(input.labels ?? [], label => label.id))).toEqual(nativeAssociation.firstLabels);
  await expect(page.locator('#probe-first')).toHaveAccessibleName(nativeAssociation.firstName);
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
