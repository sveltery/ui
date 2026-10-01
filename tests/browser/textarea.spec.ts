import { expect, test, type Page } from '@playwright/test';
// Source-derived paired probes, not copied shadcn test ports; see textarea-sources.json.
async function measurements(page: Page) {
  return page.locator('[data-gallery] textarea').evaluateAll(nodes => Object.fromEntries(nodes.map(node => {
    const s = getComputedStyle(node); const p = getComputedStyle(node, '::placeholder'); const r = node.getBoundingClientRect();
    return [node.getAttribute('data-testid'), { width: r.width, height: r.height, minHeight: s.minHeight, padding: s.padding, radius: s.borderRadius, fontSize: s.fontSize, lineHeight: s.lineHeight, background: s.backgroundColor, color: s.color, border: s.borderColor, borderWidth: s.borderWidth, opacity: s.opacity, cursor: s.cursor, shadow: s.boxShadow, outline: s.outline, resize: s.resize, fieldSizing: s.getPropertyValue('field-sizing'), placeholder: p.color }];
  })));
}
for (const width of [1280, 390]) test(`native Textarea Nova styles match pinned wrapper at ${width}px`, async ({ page, context }, testInfo) => {
  await page.setViewportSize({ width, height: 1100 }); await page.goto('/textarea'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  const reference = await context.newPage(); await reference.setViewportSize({ width, height: 1100 }); await reference.goto('/textarea-reference'); await expect(reference.locator('main > div > div')).toHaveAttribute('data-hydrated', 'true');
  await page.mouse.move(0, 0); await reference.mouse.move(0, 0);
  expect(await measurements(page)).toEqual(await measurements(reference));
  expect((await measurements(page)).basic.fontSize).toBe(width < 768 ? '16px' : '14px');
  expect((await measurements(page)).disabled.opacity).toBe('0.5'); expect((await measurements(page)).invalid.shadow).not.toBe('none');
  for (const id of ['basic', 'invalid', 'override']) {
    await page.getByTestId(id).focus(); await reference.getByTestId(id).focus(); await page.waitForTimeout(200); await reference.waitForTimeout(200);
    expect((await measurements(page))[id]).toEqual((await measurements(reference))[id]);
    expect((await measurements(page))[id].shadow).not.toBe('none');
  }
  await page.getByTestId('basic').fill('One\nTwo\nThree\nFour\nFive\nSix'); await reference.getByTestId('basic').fill('One\nTwo\nThree\nFour\nFive\nSix');
  expect(await measurements(page)).toEqual(await measurements(reference));
  await testInfo.attach(`svelte-textarea-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await testInfo.attach(`pinned-react-textarea-${width}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' }); await reference.close();
});
test('paired native typing, labels, readOnly, disabled, validation, form association and reset', async ({ page, context }) => {
  const reference = await context.newPage();
  for (const [current, route] of [[page, '/textarea'], [reference, '/textarea-reference']] as const) {
    await current.goto(route); await expect(current.locator('[data-hydrated=true]').first()).toBeVisible();
    await current.locator('label[for=textarea-demo-message]').click(); await expect(current.getByTestId('labelled')).toBeFocused();
    await expect(current.getByTestId('disabled')).toBeDisabled();
    await expect(current.getByRole('textbox', { name: 'Message form', exact: true })).toHaveAccessibleDescription('Form description');
    await expect(current.locator('#readonly')).toHaveAttribute('readonly', '');
    await current.locator('#readonly').focus(); await current.keyboard.type('Ignored'); await expect(current.locator('#readonly')).toHaveValue('Read only');
    await current.locator('#message').fill('Typed'); await current.keyboard.press('Enter'); await current.keyboard.type('Second');
    await expect(current.locator('#message')).toHaveValue('Typed\nSecond');
    await current.locator('#draft').fill('Unsaved'); await current.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(current.getByTestId('submitted')).toHaveText(JSON.stringify([['message', 'Typed\nSecond'], ['draft', 'Unsaved'], ['external', 'Outside']]));
    await current.getByRole('button', { name: 'Reset', exact: true }).click(); await expect(current.locator('#draft')).toHaveValue('Draft');
    await current.getByRole('button', { name: 'Update value', exact: true }).click(); await expect(current.locator('#message')).toHaveValue('Updated');
    await current.locator('#message').fill(''); await current.getByRole('button', { name: 'Submit', exact: true }).click();
    expect(await current.locator('#message').evaluate(node => (node as HTMLTextAreaElement).validity.valueMissing)).toBe(true);
    await expect(current.locator('#message')).toBeFocused();
    // maxlength limits trusted input; programmatic fill does not claim a user-input limit.
    await current.keyboard.type('x'.repeat(50)); await expect(current.locator('#message')).toHaveValue('x'.repeat(40));
  }
  await expect(page.getByTestId('state')).toContainText('"changes":');
  await page.getByRole('button', { name: 'Inspect lifecycle' }).click(); await expect(page.getByTestId('lifecycle')).toHaveText('{"attached":1,"detached":0,"ref":"message"}');
  await page.getByRole('button', { name: 'Remove', exact: true }).click(); await page.getByRole('button', { name: 'Inspect lifecycle' }).click(); await expect(page.getByTestId('lifecycle')).toHaveText('{"attached":1,"detached":1,"ref":null}');
  await reference.close();
});
test('SSR textarea value and IDs survive hydration including typing before hydration', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
  try {
    await page.goto('/textarea', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    await expect(page.locator('#message')).toHaveValue('Initial'); await expect(page.locator('#draft')).toHaveValue('Draft');
    const ids = await page.locator('textarea[id]').evaluateAll(nodes => nodes.map(node => node.id));
    await page.locator('#message').fill('Before hydration');
    release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await expect(page.locator('#message')).toHaveValue('Before hydration'); await expect(page.getByTestId('state')).toContainText('"value":"Before hydration"');
    expect(await page.locator('textarea[id]').evaluateAll(nodes => nodes.map(node => node.id))).toEqual(ids);
    await page.locator('#message').fill('After hydration'); await expect(page.getByTestId('state')).toContainText('"inputs":1,"changes":0');
    await page.locator('#draft').focus(); await expect(page.getByTestId('state')).toContainText('"changes":1');
    expect(errors).toEqual([]);
  } finally { release(); }
});
