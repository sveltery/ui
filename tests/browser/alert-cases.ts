// Source-derived supplemental native probes; refs/attachments are Svelte-only and not React parity credit.
import { expect, test, type Page } from '@playwright/test';
import { JSDOM } from 'jsdom';
export async function alertState(page: Page) { return JSON.parse(await page.getByTestId('probe-state').innerText()); }
export async function alertNativeAssertions(page: Page) {
  await expect(page.locator('#probe-alert')).toHaveAttribute('role', 'alert');
  await expect(page.locator('#probe-alert')).toHaveAttribute('title', 'Initial & <alert>');
  await expect(page.locator('#probe-alert')).toHaveAttribute('data-custom', 'initial');
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeFocused();
  expect((await alertState(page)).clicks).toBe(1);
  // The Alert parts remain native divs: only the native links/button join the tab order.
  await page.getByRole('button', { name: 'Before alert', exact: true }).focus();
  await page.keyboard.press('Tab'); await expect(page.locator('#probe-title a')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.locator('#probe-description a')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeFocused();
  await page.keyboard.press('Enter'); expect((await alertState(page)).clicks).toBe(2);
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'After alert', exact: true })).toBeFocused();
  const css = (selector: string) => page.locator(selector).evaluate(node => {
    const style = getComputedStyle(node);
    return { display: style.display, paddingRight: style.paddingRight, gap: style.gap, borderRadius: style.borderRadius, color: style.color, width: style.width, height: style.height, gridColumnStart: style.gridColumnStart, marginBottom: style.marginBottom, top: style.top, right: style.right, position: style.position, fontWeight: style.fontWeight, fontSize: style.fontSize, textDecorationLine: style.textDecorationLine, textUnderlineOffset: style.textUnderlineOffset };
  });
  const plain = await css('[data-testid="plain"]');
  expect(plain.display).toBe('grid'); expect(plain.gap).toBe('2px'); expect(plain.paddingRight).toBe('10px'); expect(plain.borderRadius).toBe('10px'); expect(plain.fontSize).toBe('14px');
  expect((await css('[data-testid="nested-action"]')).paddingRight).toBe('72px');
  expect((await css('#probe-alert')).paddingRight).toBe('72px');
  expect((await css('[data-testid="overridden-slots"]')).paddingRight).toBe('10px');
  expect((await css('[data-testid="plain"] [data-slot="alert-title"]')).fontWeight).toBe('500');
  expect((await css('[data-testid="direct-svg"] [data-slot="alert-title"]')).gridColumnStart).toBe('2');
  expect((await css('[data-testid="plain"] [data-slot="alert-title"]')).gridColumnStart).toBe('auto');
  expect((await css('[data-testid="nested-svg"] [data-slot="alert-title"]')).gridColumnStart).toBe('auto');
  for (const property of ['width', 'height'] as const) {
    expect((await css('[data-testid="direct-svg"] > svg'))[property]).toBe('16px');
    expect((await css('[data-testid="sized-svg"] > svg'))[property]).toBe('24px');
  }
  expect((await css('#probe-action')).position).toBe('absolute'); expect((await css('#probe-action')).top).toBe('8px'); expect((await css('#probe-action')).right).toBe('8px');
  expect((await css('#probe-description p:first-child')).marginBottom).toBe('16px'); expect((await css('#probe-description p:last-child')).marginBottom).toBe('0px');
  expect((await css('#probe-title a')).textDecorationLine).toBe('underline'); expect((await css('#probe-title a')).textUnderlineOffset).toBe('3px');
  const muted = (await css('[data-testid="plain"] [data-slot="alert-description"]')).color;
  expect((await css('[data-testid="destructive-nested"] [data-slot="alert-description"]')).color).toBe(muted);
  expect((await css('[data-testid="destructive-nested"] [data-slot="consumer-description"]')).color).toBe(muted);
  expect((await css('[data-testid="destructive"] [data-slot="alert-description"]')).color).not.toBe(muted);
  await page.getByRole('button', { name: 'Update alert', exact: true }).click();
  await expect(page.locator('#probe-alert')).toHaveAttribute('role', 'status');
  await expect(page.locator('#probe-alert')).toHaveAttribute('title', 'Updated & <alert>');
  await expect(page.locator('#probe-alert')).toHaveAttribute('data-custom', 'updated');
  await expect(page.locator('#probe-title')).toHaveText('Updated title Details');
  expect((await css('#probe-alert')).borderRadius).toBe('0px'); expect((await css('#probe-alert')).fontSize).toBe('18px');
  await page.getByRole('button', { name: 'Undo', exact: true }).click(); expect((await alertState(page)).clicks).toBe(3);
}
export function alertLifecycleCases(route = '/alert-probe') {
  test('native Alert parts retain SSR identity; undefined/null refs and attachments replace and clean up', async ({ page, request }) => {
    const html = await (await request.get(route)).text(); expect(html).toContain('data-hydrated="false"'); expect(new JSDOM(html).window.document.querySelector('#probe-alert')?.getAttribute('title')).toBe('Initial & <alert>');
    const errors: string[] = []; page.on('pageerror', error => { errors.push(error.message); console.log('ALERT_PAGEERROR_DIAGNOSTIC', JSON.stringify({ message: error.message, stack: error.stack })); });
    page.on('console', message => { if (message.type() === 'error') { errors.push(message.text()); console.log('ALERT_CONSOLE_DIAGNOSTIC', JSON.stringify({ message: message.text(), location: message.location() })); } });
    page.on('requestfailed', request => console.log('ALERT_REQUESTFAILED_DIAGNOSTIC', JSON.stringify({ url: request.url(), type: request.resourceType(), failure: request.failure() })));
    page.on('response', response => { if (!response.ok()) console.log('ALERT_RESPONSE_DIAGNOSTIC', JSON.stringify({ url: response.url(), status: response.status(), type: response.request().resourceType(), contentType: response.headers()['content-type'] })); });
    await page.goto(route); await expect(page.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'true');
    let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*', async requestRoute => { if (requestRoute.request().resourceType() === 'script') await gate; await requestRoute.continue(); });
    try {
      await page.goto(route, { waitUntil: 'commit' }); await expect(page.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'false');
      const selector = '#probe-alert, #probe-title, #probe-description, #probe-action';
      const hosts = await page.locator(selector).elementHandles(); expect(hosts).toHaveLength(4);
      expect((await alertState(page)).refs).toEqual(['undefined', null, 'undefined', null]);
      release(); await expect(page.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'true');
      await expect.poll(async () => (await alertState(page)).attachments).toBe(4);
      expect((await alertState(page)).refs).toEqual(['probe-alert', 'probe-title', 'probe-description', 'probe-action']);
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node === document.querySelectorAll(args.selector)[args.index], { selector, index })).toBe(true);
      await page.getByRole('button', { name: 'Swap attachments', exact: true }).click();
      await expect.poll(async () => (await alertState(page)).attachments).toBe(8); expect((await alertState(page)).cleanups).toBe(4);
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node === document.querySelectorAll(args.selector)[args.index], { selector, index })).toBe(true);
      await page.getByRole('button', { name: 'Remove alert', exact: true }).click(); await expect(page.locator(selector)).toHaveCount(0);
      await expect.poll(async () => (await alertState(page)).cleanups).toBe(8); expect((await alertState(page)).refs).toEqual([null, null, null, null]);
      for (const host of hosts) expect(await host.evaluate(node => node.isConnected)).toBe(false);
      await page.getByRole('button', { name: 'Restore alert', exact: true }).click();
      await expect.poll(async () => (await alertState(page)).attachments).toBe(12); expect((await alertState(page)).cleanups).toBe(8);
      expect((await alertState(page)).refs).toEqual(['probe-alert', 'probe-title', 'probe-description', 'probe-action']);
      for (const [index, host] of hosts.entries()) expect(await page.locator(selector).nth(index).evaluate((node, old) => node === old, host)).toBe(false);
      expect(errors).toEqual([]);
    } finally { release(); }
  });
}
