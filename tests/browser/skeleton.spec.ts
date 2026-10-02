import { expect, test, type Page } from '@playwright/test';
// Paired source-derived probes; unchanged selected upstream functions execute in the reference gallery.
async function measurements(page: Page) {
  return page.locator('[data-gallery] [data-slot]').evaluateAll(nodes => nodes.map(node => {
    const s = getComputedStyle(node); const r = node.getBoundingClientRect();
    return { host: node.tagName, slot: node.getAttribute('data-slot'), width: r.width, height: r.height, radius: s.borderRadius, background: s.backgroundColor, display: s.display, shrink: s.flexShrink, animationName: s.animationName, animationDuration: s.animationDuration, animationTiming: s.animationTimingFunction, animationCount: s.animationIterationCount };
  }));
}
for (const width of [1280, 390]) test(`Skeleton selected examples and Nova match pinned wrapper at ${width}px`, async ({ page, context }, testInfo) => {
  await page.setViewportSize({ width, height: 1400 }); await page.goto('/skeleton'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  const reference = await context.newPage(); await reference.setViewportSize({ width, height: 1400 }); await reference.goto('/skeleton-reference'); await expect(reference.locator('main > div > div')).toHaveAttribute('data-hydrated', 'true');
  const actual = await measurements(page); expect(actual).toEqual(await measurements(reference));
  expect(actual).toHaveLength(22); expect(actual.every(value => value.host === 'DIV')).toBe(true);
  expect(actual[0].animationName).toBe('pulse'); expect(actual[0].animationDuration).toBe('2s'); expect(actual[0].animationCount).toBe('infinite');
  expect(actual[0].radius).not.toBe('0px'); expect(actual[1].width).toBe(40); expect(actual[1].height).toBe(40); expect(parseFloat(actual[1].radius)).toBeGreaterThanOrEqual(20);
  expect(actual.at(-1)!.animationName).toBe('none'); expect(actual.at(-1)!.radius).toBe('0px');
  for (const current of [page, reference]) {
    expect(await current.locator('[data-gallery] input, [data-gallery] table, [data-gallery] [role], [data-gallery] [aria-busy]').count()).toBe(0);
    await current.emulateMedia({ reducedMotion: 'reduce' });
  }
  // The source supplies animate-pulse unconditionally; preserve it even with reduced motion.
  expect(await measurements(page)).toEqual(await measurements(reference)); expect((await measurements(page))[0].animationName).toBe('pulse');
  await testInfo.attach(`svelte-skeleton-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await testInfo.attach(`pinned-react-skeleton-${width}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' }); await reference.close();
});
test('Skeleton SSR host and undefined ref survive hydration, updates and native attachment cleanup', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  // Discover development dependencies before capturing a fresh SSR document.
  await page.goto('/skeleton'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
  try {
    await page.goto('/skeleton', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    const host = page.locator('#lifecycle-skeleton'); await expect(host).toHaveText('Initial'); await expect(host).toHaveAttribute('title', 'Initial placeholder');
    await expect(host).toHaveAttribute('data-slot', 'skeleton'); expect(await host.evaluate(node => node.tagName)).toBe('DIV');
    await host.evaluate(node => { (window as unknown as { skeletonSSRNode: Element }).skeletonSSRNode = node; });
    release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    expect(await host.evaluate(node => (window as unknown as { skeletonSSRNode: Element }).skeletonSSRNode === node)).toBe(true);
    await page.getByRole('button', { name: 'Inspect Skeleton lifecycle' }).click(); await expect(page.getByTestId('skeleton-lifecycle')).toHaveText('{"attached":1,"detached":0,"ref":"lifecycle-skeleton"}');
    await page.getByRole('button', { name: 'Update placeholder' }).click(); await expect(host).toHaveText('Updated'); await expect(host).toHaveAttribute('title', 'Updated placeholder');
    expect(await host.evaluate(node => (window as unknown as { skeletonSSRNode: Element }).skeletonSSRNode === node)).toBe(true);
    await page.getByRole('button', { name: 'Toggle placeholder' }).click(); await expect(host).toHaveCount(0);
    await page.getByRole('button', { name: 'Inspect Skeleton lifecycle' }).click(); await expect(page.getByTestId('skeleton-lifecycle')).toHaveText('{"attached":1,"detached":1,"ref":null}');
    await page.getByRole('button', { name: 'Toggle placeholder' }).click(); await expect(host).toHaveText('Updated');
    expect(await host.evaluate(node => (window as unknown as { skeletonSSRNode: Element }).skeletonSSRNode === node)).toBe(false);
    await page.getByRole('button', { name: 'Inspect Skeleton lifecycle' }).click(); await expect(page.getByTestId('skeleton-lifecycle')).toHaveText('{"attached":2,"detached":1,"ref":"lifecycle-skeleton"}');
    expect(errors).toEqual([]);
  } finally { release(); }
});
