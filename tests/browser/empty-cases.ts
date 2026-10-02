import { expect, test, type Page } from '@playwright/test';
// Source-derived native acceptance probes; Svelte refs/attachments are framework-specific.
export async function emptyState(page: Page) { return JSON.parse(await page.getByTestId('probe-state').innerText()); }
export async function emptyNativeAssertions(page: Page) {
  const hosts = page.locator('[data-empty-host]');
  expect(await hosts.count()).toBe(6);
  expect(await hosts.evaluateAll(nodes => nodes.map(node => node.tagName))).toEqual(Array(6).fill('DIV'));
  expect(await hosts.evaluateAll(nodes => nodes.map(node => node.getAttribute('data-slot')))).toEqual(Array(6).fill(null));
  await hosts.nth(2).click(); expect((await emptyState(page)).clicks).toBe(1);
  const dimensions = (id: string) => page.getByTestId(id).evaluate(node => {
    const host = getComputedStyle(node); const svg = node.querySelector('svg')!; const css = getComputedStyle(svg);
    return { width: host.width, height: host.height, svgWidth: css.width, svgHeight: css.height, pointerEvents: css.pointerEvents, shrink: css.flexShrink };
  });
  expect(await dimensions('media-icon')).toEqual({ width: '32px', height: '32px', svgWidth: '16px', svgHeight: '16px', pointerEvents: 'none', shrink: '0' });
  expect(await dimensions('media-sized')).toEqual({ width: '32px', height: '32px', svgWidth: '24px', svgHeight: '24px', pointerEvents: 'none', shrink: '0' });
  // Upstream tests the literal class substring, including non-utility class names.
  expect(await dimensions('media-size-substring')).toEqual({ width: '32px', height: '32px', svgWidth: '28px', svgHeight: '28px', pointerEvents: 'none', shrink: '0' });
  for (const id of ['media-default', 'media-null']) expect(await dimensions(id)).toEqual({ width: '24px', height: '24px', svgWidth: '24px', svgHeight: '24px', pointerEvents: 'none', shrink: '0' });
  await expect(page.getByTestId('media-null')).not.toHaveAttribute('data-variant');
  await expect(page.getByTestId('media-default')).toHaveAttribute('data-slot', 'empty-icon');
  await expect(page.getByTestId('media-icon')).toHaveAttribute('data-variant', 'icon');
  expect(await page.getByTestId('direct-link').evaluate(node => getComputedStyle(node).textDecorationLine)).toBe('underline');
  expect(await page.getByTestId('direct-link').evaluate(node => getComputedStyle(node).textUnderlineOffset)).toBe('4px');
  expect(await page.getByTestId('nested-link').evaluate(node => getComputedStyle(node).textDecorationLine)).toBe('none');
  await page.getByTestId('direct-link').hover();
  expect(await page.getByTestId('direct-link').evaluate(node => getComputedStyle(node).color)).toBe('oklch(0.205 0 0)');
  await page.getByRole('button', { name: 'Update Empty', exact: true }).click();
  for (let index = 0; index < 6; index++) {
    await expect(hosts.nth(index)).toHaveAttribute('data-slot', `override-${index}`);
    await expect(hosts.nth(index)).toHaveAttribute('data-custom', 'updated');
    await expect(hosts.nth(index)).toHaveAttribute('title', 'Updated & <Empty>');
    expect(await hosts.nth(index).evaluate(node => getComputedStyle(node).fontSize)).toBe('18px');
  }
  await expect(hosts.nth(5)).toHaveAttribute('data-variant', 'icon');
  expect(await page.getByTestId('reactive-svg').evaluate(node => getComputedStyle(node).width)).toBe('16px');
  await hosts.nth(2).click(); expect((await emptyState(page)).clicks).toBe(2);
}
export function emptyLifecycleCases(route = '/empty-probe') {
  test('six Empty SSR div identities and undefined/null refs survive hydration, attachment replacement and removal', async ({ page, request }) => {
    const html = await (await request.get(route)).text(); expect(html).toContain('data-hydrated="false"'); expect(html).toContain('Supplemental Empty primitive probe');
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(route); await expect(page.locator('[data-empty-probe]')).toHaveAttribute('data-hydrated', 'true');
    let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*', async requestRoute => { if (requestRoute.request().resourceType() === 'script') await gate; await requestRoute.continue(); });
    try {
      await page.goto(route, { waitUntil: 'commit' }); await expect(page.locator('[data-empty-probe]')).toHaveAttribute('data-hydrated', 'false');
      const hosts = await page.locator('[data-empty-host]').elementHandles(); expect(hosts).toHaveLength(6);
      expect((await emptyState(page)).tags).toEqual(['undefined', null, 'undefined', null, 'undefined', null]);
      release(); await expect(page.locator('[data-empty-probe]')).toHaveAttribute('data-hydrated', 'true');
      await expect.poll(async () => (await emptyState(page)).tags).toEqual(Array(6).fill('DIV'));
      expect((await emptyState(page)).attachments).toBe(6);
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, i) => node === document.querySelectorAll('[data-empty-host]')[i], index)).toBe(true);
      await page.getByRole('button', { name: 'Swap attachments', exact: true }).click();
      await expect.poll(async () => (await emptyState(page)).attachments).toBe(12); expect((await emptyState(page)).cleanups).toBe(6);
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, i) => node === document.querySelectorAll('[data-empty-host]')[i], index)).toBe(true);
      await page.getByRole('button', { name: 'Remove Empty', exact: true }).click(); await expect(page.locator('[data-empty-host]')).toHaveCount(0);
      await expect.poll(async () => (await emptyState(page)).tags).toEqual(Array(6).fill(null)); expect((await emptyState(page)).cleanups).toBe(12);
      for (const host of hosts) expect(await host.evaluate(node => node.isConnected)).toBe(false);
      await page.getByRole('button', { name: 'Restore Empty', exact: true }).click();
      await expect.poll(async () => (await emptyState(page)).tags).toEqual(Array(6).fill('DIV')); expect((await emptyState(page)).attachments).toBe(18);
      for (const [index, host] of hosts.entries()) expect(await page.locator('[data-empty-host]').nth(index).evaluate((node, old) => node === old, host)).toBe(false);
      expect(errors).toEqual([]);
    } finally { release(); }
  });
}
