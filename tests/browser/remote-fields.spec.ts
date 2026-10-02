import { expect, test, type Page } from '@playwright/test';
// Experimental flags belong only to the dedicated fixture on the pinned Kit/Svelte versions.
test.use({ baseURL: 'http://127.0.0.1:5174' });
const submitters = [['native-submit', 'action', 'native'], ['base-submit', 'baseAction', 'base'], ['ui-submit', 'uiAction', 'ui']] as const;
async function json(page: Page, id: string) { return JSON.parse(await page.locator(`#${id}`).innerText()); }
async function hydrated(page: Page) { await page.goto('/'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true'); }
async function edit(page: Page, native = 'Edited native', ui = 'Edited UI') {
  for (const [id, value] of [['native-text', native], ['ui-text', ui]]) {
    await page.locator(`#${id}`).focus(); await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.type(value);
  }
}
async function parsed(page: Page, expected: Record<string, string>) {
  await expect.poll(async () => (await json(page, 'result'))?.parsed).toEqual(expected);
  await expect(page.locator('#pending')).toHaveText('0');
}

test('direct field spreads retain defaults until trusted edits synchronize fields and FormData', async ({ page }, testInfo) => {
  await hydrated(page); await page.locator('#mode-retain').click();
  await expect(page.locator('#native-text')).toHaveValue('Draft'); await expect(page.locator('#ui-text')).toHaveValue('Draft'); await expect(page.locator('#empty-text')).toHaveValue('');
  expect(await json(page, 'values')).toEqual({});
  await edit(page); await expect.poll(() => json(page, 'values')).toEqual({ nativeText: 'Edited native', text: 'Edited UI' });
  await page.locator('#ui-submit').click(); await parsed(page, { nativeText: 'Edited native', text: 'Edited UI', emptyText: '', uiAction: 'ui' });
  expect(await json(page, 'form-data')).toEqual([['nativeText', 'Edited native'], ['text', 'Edited UI'], ['emptyText', ''], ['uiAction', 'ui']]);
  await testInfo.attach('direct-spread-submit', { body: JSON.stringify({ fields: await json(page, 'values'), formData: await json(page, 'form-data'), result: await json(page, 'result') }), contentType: 'application/json' });
});

test('individual and collection field.set synchronize public Textarea and real submissions', async ({ page }) => {
  await hydrated(page); await page.locator('#mode-retain').click(); await page.locator('#field-set').click();
  await expect(page.locator('#native-text')).toHaveValue('Individual native'); await expect(page.locator('#ui-text')).toHaveValue('Individual UI');
  await expect.poll(() => json(page, 'values')).toEqual({ nativeText: 'Individual native', text: 'Individual UI' });
  await page.locator('#native-submit').click(); await parsed(page, { nativeText: 'Individual native', text: 'Individual UI', emptyText: '', action: 'native' });
  await page.locator('#collection-set').click();
  await expect(page.locator('#native-text')).toHaveValue('Collection native'); await expect(page.locator('#ui-text')).toHaveValue('Collection UI'); await expect(page.locator('#empty-text')).toHaveValue('Collection empty');
  await expect.poll(() => json(page, 'values')).toEqual({ nativeText: 'Collection native', text: 'Collection UI', emptyText: 'Collection empty' });
  await page.locator('#base-submit').click(); await parsed(page, { nativeText: 'Collection native', text: 'Collection UI', emptyText: 'Collection empty', baseAction: 'base' });
});

test('native reset restores defaults and no-default Textarea and subsequent submitted values', async ({ page }) => {
  await hydrated(page); await page.locator('#mode-retain').click(); await page.locator('#collection-set').click(); await page.locator('#reset').click();
  await expect(page.locator('#native-text')).toHaveValue('Draft'); await expect(page.locator('#ui-text')).toHaveValue('Draft'); await expect(page.locator('#empty-text')).toHaveValue('');
  await expect.poll(() => json(page, 'values')).toEqual({ nativeText: 'Draft', text: 'Draft', emptyText: '' });
  await page.locator('#ui-submit').click(); await parsed(page, { nativeText: 'Draft', text: 'Draft', emptyText: '', uiAction: 'ui' });
});

for (const mode of ['default', 'retain', 'reset'] as const) test(`${mode} enhancement preserves its value/reset contract`, async ({ page }) => {
  await hydrated(page); await page.locator(`#mode-${mode}`).click(); await edit(page); await page.locator('#ui-submit').click();
  await parsed(page, { nativeText: 'Edited native', text: 'Edited UI', emptyText: '', uiAction: 'ui' });
  const native = mode === 'retain' ? 'Edited native' : 'Draft'; const ui = mode === 'retain' ? 'Edited UI' : 'Draft';
  await expect(page.locator('#native-text')).toHaveValue(native); await expect(page.locator('#ui-text')).toHaveValue(ui);
  await page.locator('#ui-submit').click(); await parsed(page, { nativeText: native, text: ui, emptyText: '', uiAction: 'ui' });
});

for (const [id, field, value] of submitters) test(`${id} forwards submit attrs and clears the previous submitter`, async ({ page }) => {
  await hydrated(page); await page.locator('#mode-retain').click(); await edit(page); await page.locator(`#${id}`).click();
  await parsed(page, { nativeText: 'Edited native', text: 'Edited UI', emptyText: '', [field]: value });
  expect(await json(page, 'form-data')).toEqual([['nativeText', 'Edited native'], ['text', 'Edited UI'], ['emptyText', ''], [field, value]]);
  const next = submitters[(submitters.findIndex(row => row[0] === id) + 1) % submitters.length];
  await page.locator(`#${next[0]}`).click(); await parsed(page, { nativeText: 'Edited native', text: 'Edited UI', emptyText: '', [next[1]]: next[2] });
  expect((await json(page, 'values'))[field]).toBeUndefined();
});

test('server issues set aria-invalid on direct UI spread and retain the rejected edit', async ({ page }) => {
  await hydrated(page); await edit(page, 'Valid native', 'x'); await page.locator('#ui-submit').click();
  await expect(page.locator('#ui-text')).toHaveAttribute('aria-invalid', 'true'); await expect(page.locator('#text-issues')).toContainText('Use at least two characters');
  await expect(page.locator('#issues')).toContainText('text'); await expect(page.locator('#ui-text')).toHaveValue('x'); await expect(page.locator('#native-text')).toHaveValue('Valid native');
  await expect(page.locator('#result')).toHaveText('null'); await expect(page.locator('#pending')).toHaveText('0');
});

test.describe('progressive enhancement with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });
  for (const [id, field, value] of submitters) test(`${id} submits edits through the actual remote action`, async ({ page }) => {
    await page.goto('/'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    await expect(page.locator('#ui-text')).toHaveText('Draft'); await expect(page.locator('#ui-text')).toHaveValue('Draft');
    await page.locator('#native-text').fill('No JS native'); await page.locator('#ui-text').fill('No JS UI'); await page.locator(`#${id}`).click();
    await parsed(page, { nativeText: 'No JS native', text: 'No JS UI', emptyText: '', [field]: value }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
  });
  test('invalid submission renders issues and retains UI text in returned SSR HTML', async ({ page }) => {
    await page.goto('/'); await page.locator('#native-text').fill('No JS native'); await page.locator('#ui-text').fill('x'); await page.locator('#ui-submit').click();
    await expect(page.locator('#ui-text')).toHaveAttribute('aria-invalid', 'true'); await expect(page.locator('#ui-text')).toHaveText('x'); await expect(page.locator('#ui-text')).toHaveValue('x');
    await expect(page.locator('#text-issues')).toContainText('Use at least two characters'); await expect(page.locator('#result')).toHaveText('null');
  });
  test('known native spread-only SSR baseline omits default textarea content', async ({ page }, testInfo) => {
    await page.goto('/'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    await expect(page.locator('#ui-text')).toHaveText('Draft');
    await expect(page.locator('#native-text')).toHaveAttribute('defaultvalue', 'Draft');
    await testInfo.attach('native-spread-ssr', { body: await page.locator('#native-text').evaluate(node => node.outerHTML), contentType: 'text/html' });
    test.fail(true, 'Kit 2.70.3/Svelte 5.57.1 native spread-only textarea has empty SSR content; separate baseline diagnostic, no UI parity credit.');
    await expect(page.locator('#native-text')).toHaveText('Draft');
  });
});

test('UI SSR ID, identity and edited text survive hydration before scripts are released', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
  try {
    await page.goto('/', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    await expect(page.locator('#ui-text')).toHaveText('Draft'); await expect(page.locator('#ui-text')).toHaveValue('Draft');
    const node = await page.locator('#ui-text').elementHandle(); expect(node).not.toBeNull(); await page.locator('#ui-text').fill('Before hydration');
    release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true'); await expect(page.locator('#ui-text')).toHaveValue('Before hydration');
    expect(await node!.evaluate(element => element === document.getElementById('ui-text'))).toBe(true);
    await expect.poll(async () => (await json(page, 'values')).text).toBe('Before hydration'); expect(errors).toEqual([]);
  } finally { release(); }
});

test('component attachments and refs expose native nodes and clean up on removal', async ({ page }) => {
  await hydrated(page);
  expect(await json(page, 'lifecycle')).toEqual({ attached: 2, detached: 0, tags: ['TEXTAREA', 'BUTTON'], textarea: 'TEXTAREA', submitButton: 'BUTTON' });
  await edit(page); await page.locator('#native-submit').focus();
  const events = await json(page, 'events');
  expect(events).toContainEqual({ type: 'input', tag: 'TEXTAREA', id: 'ui-text', native: true, trusted: true });
  expect(events).toContainEqual({ type: 'change', tag: 'TEXTAREA', id: 'ui-text', native: true, trusted: true });
  await page.locator('#remove').click(); await expect.poll(() => json(page, 'lifecycle')).toEqual({ attached: 2, detached: 2, tags: ['TEXTAREA', 'BUTTON'], textarea: null, submitButton: null });
  await expect(page.locator('#probe')).toHaveCount(0);
});
