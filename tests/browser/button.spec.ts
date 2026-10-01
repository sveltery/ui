import { expect, test, type Page } from '@playwright/test';
async function setup(page: Page, scenario: string) {
  await page.goto(`/button?case=${scenario}`);
  await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  return page.locator('#tested-button');
}
async function calls(page: Page) { return JSON.parse(await page.getByTestId('calls').innerText()) as Record<string, number>; }
async function pointer(page: Page) {
  const box = await page.locator('#tested-button').boundingBox(); expect(box).not.toBeNull();
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
}
test('SSR Button labels/classes survive hydration, bind:ref and render attachments', async ({ page, request }) => {
  const response = await request.get('/button?case=attachment'); const html = await response.text();
  expect(html).toContain('cn-button-variant-default'); expect(html).toContain('data-hydrated="false"'); expect(html).toContain('role="button"');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  const button = await setup(page, 'attachment');
  await expect(button).toHaveAttribute('data-consumer-attached'); await expect(button).toHaveAttribute('data-slot', 'button');
  await expect(page.getByTestId('ref')).toHaveText('tested-button'); expect((await calls(page)).attached).toBe(1);
  await expect(button).toMatchAriaSnapshot('- button "Save"'); expect(errors).toEqual([]);
});
for (const scenario of ['default', 'custom', 'link']) test(`trusted pointer, Enter and Space activation: ${scenario}`, async ({ page }) => {
  const button = await setup(page, scenario);
  await page.keyboard.press('Tab'); await expect(button).toBeFocused();
  await page.keyboard.press('Enter'); expect((await calls(page)).click).toBe(1);
  // Native same-page link navigation moves focus; refocus before testing Space.
  if (scenario === 'link') await expect.poll(() => new URL(page.url()).hash).toBe('#target');
  await button.focus(); await expect(button).toBeFocused(); await page.keyboard.press('Space'); expect((await calls(page)).click).toBe(2); await pointer(page);
  expect((await calls(page)).click).toBe(3);
  if (scenario === 'custom') for (const channel of ['capture', 'render', 'ancestor']) expect((await calls(page))[channel]).toBe(3);
  if (scenario === 'link') expect(new URL(page.url()).hash).toBe('#target');
});
for (const scenario of ['native-disabled', 'custom-disabled', 'native-focusable', 'custom-focusable']) test(`disabled Tab and pointer/keyboard guards: ${scenario}`, async ({ page }) => {
  const button = await setup(page, scenario); const focusable = scenario.endsWith('focusable');
  await page.keyboard.press('Tab'); if (focusable) await expect(button).toBeFocused(); else await expect(button).not.toBeFocused();
  await pointer(page); await page.keyboard.press('Enter'); await page.keyboard.press('Space');
  await expect(button).toHaveAttribute('data-disabled');
  if (scenario === 'native-disabled') await expect(button).toHaveAttribute('disabled'); else await expect(button).toHaveAttribute('aria-disabled', 'true');
  for (const channel of ['click', 'pointer', 'mouse', 'keydown', 'keyup']) expect((await calls(page))[channel]).toBe(0);
  // Render handlers run before Base guards; disabled Base callbacks stay suppressed.
  if (scenario.startsWith('custom')) expect((await calls(page)).render).toBe(1);
  if (focusable) { await expect(button).toBeFocused(); await page.keyboard.press('Tab'); await expect(button).not.toBeFocused(); }
});
for (const scenario of ['default', 'submit', 'reset', 'undefined-type', 'null-type', 'submit-disabled', 'submit-focusable', 'reset-disabled', 'reset-focusable']) test(`native form defaults and disabled submission/reset: ${scenario}`, async ({ page }) => {
  const button = await setup(page, scenario); const disabled = scenario.includes('disabled') || scenario.includes('focusable');
  if (scenario.startsWith('reset')) await page.getByRole('textbox', { name: 'Reset field' }).fill('changed');
  if (!scenario.includes('disabled')) { await button.focus(); await page.keyboard.press('Enter'); await page.keyboard.press('Space'); }
  await pointer(page);
  const count = disabled ? 0 : 3; const result = await calls(page);
  expect(result.click).toBe(count); expect(result.submit).toBe(['submit', 'undefined-type', 'null-type'].includes(scenario) ? count : 0); expect(result.reset).toBe(scenario === 'reset' ? count : 0);
  if (scenario.startsWith('reset')) await expect(page.getByRole('textbox', { name: 'Reset field' })).toHaveValue(disabled ? 'changed' : 'initial');
});
for (const scenario of ['render-cancel', 'click-cancel', 'cancel-base', 'cancel-enter', 'cancel-space']) test(`render/consumer cancellation: ${scenario}`, async ({ page }) => {
  const button = await setup(page, scenario); await button.focus();
  await page.keyboard.press(scenario === 'cancel-space' ? 'Space' : 'Enter');
  const result = await calls(page);
  expect(result.click).toBe(scenario === 'click-cancel' ? 1 : 0);
  if (scenario.endsWith('cancel')) { expect(result.render).toBe(1); expect(result.ancestor).toBe(1); }
});
test('reactive state classes preserve a focused host while becoming disabled', async ({ page }) => {
  const button = await setup(page, 'becomes-disabled'); await page.keyboard.press('Tab'); await expect(button).toBeFocused();
  await expect(button).toHaveClass(/cn-button/); await expect(button).toHaveClass(/enabled-class/);
  await page.keyboard.press('Enter'); await expect(button).toHaveClass(/disabled-class/); await expect(button).toHaveClass(/px-6/); await expect(button).not.toHaveClass(/px-4/);
  await expect(button).toBeFocused(); await pointer(page); await page.keyboard.press('Space'); expect((await calls(page)).click).toBe(1);
});
test('minimal Button form exposes accessible names and completion feedback', async ({ page }) => {
  await page.goto('/button'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.getByRole('button', { name: 'Unavailable', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Save preferences', exact: true }).click(); await expect(page.getByText('Preferences saved locally')).toBeVisible();
});
