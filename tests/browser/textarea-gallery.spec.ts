// New source-derived supplements. Existing five-state/reset/lifecycle assertions remain unchanged.
import { expect, test } from '@playwright/test';
import { assertTextareaGallery, textareaGalleryTree, textareaGalleryMeasurements, textareaGalleryStyles, textareaGalleryTheme, textareaGalleryHosts } from './textarea-gallery-cases';

test('two genuine Textarea bodies retain all ten SSR hosts and initial values through hydration', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.fallback(); });
  try {
    await page.goto('/textarea-gallery', { waitUntil: 'commit' });
    await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    await assertTextareaGallery(page); const before = await textareaGalleryTree(page);
    const hosts = await page.locator(textareaGalleryHosts).elementHandles(); expect(hosts).toHaveLength(10);
    release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: textareaGalleryHosts, index })).toBe(true);
    expect(await textareaGalleryTree(page)).toEqual(before);
    expect(await page.locator('[data-slot=example-wrapper] textarea').evaluateAll(nodes => nodes.map(n => (n as HTMLTextAreaElement).value))).toEqual(['', '']);
    expect(errors).toEqual([]);
  } finally { release(); }
});
for (const style of textareaGalleryStyles) test(`genuine Textarea full original ${style} CSS, responsive layout and invalid state`, async ({ page, context }) => {
  const original = await context.newPage(); const errors: string[] = [];
  for (const current of [page, original]) { current.on('pageerror', e => errors.push(e.message)); current.on('console', m => { if (m.type() === 'error') errors.push(m.text()); }); }
  try {
    await page.goto('/textarea-gallery'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await original.goto('http://127.0.0.1:5175/textarea-gallery');
    await assertTextareaGallery(page); await assertTextareaGallery(original);
    expect(await textareaGalleryTree(page)).toEqual(await textareaGalleryTree(original));
    for (const dark of [false, true]) for (const width of [390, 640, 768, 1024, 1536]) {
      for (const current of [page, original]) { await current.setViewportSize({ width, height: 1400 }); await textareaGalleryTheme(current, style, dark); }
      expect(await textareaGalleryMeasurements(page)).toEqual(await textareaGalleryMeasurements(original));
    }
    for (const current of [page, original]) {
      const basic = current.locator('[data-slot=example-wrapper] textarea').nth(0);
      await basic.fill('One\nTwo'); await expect(basic).toBeFocused(); await expect(basic).toHaveValue('One\nTwo');
    }
    await page.waitForTimeout(200); await original.waitForTimeout(200);
    expect(await textareaGalleryMeasurements(page)).toEqual(await textareaGalleryMeasurements(original));
    expect(errors).toEqual([]);
  } finally { await original.close(); }
});
