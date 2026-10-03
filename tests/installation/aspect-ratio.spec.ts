import { expect, test } from '@playwright/test';
import { ratioAssertions } from '../browser/aspect-ratio-cases';
import { aspectGalleryHosts, aspectGallerySnapshot, aspectImages, aspectTheme, aspectStyles, assertAspectGallery } from '../browser/aspect-ratio-gallery-cases';
test('fresh archive/source-copy AspectRatio: actual SSR, responsive styles, caller precedence, refs and cleanup', async ({ page, request }) => {
  const html = await (await request.get('/aspect-ratio-probe')).text(); expect(html).toContain('data-slot="aspect-ratio"'); expect(html).toContain('data-hydrated="false"'); expect(html).toContain('--ratio:');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto('/aspect-ratio-probe'); await expect(page.locator('[data-aspect-ratio-probe]')).toHaveAttribute('data-hydrated', 'true');
    await ratioAssertions(page, width);
    const state = () => page.getByTestId('ratio-state').textContent().then(text => JSON.parse(text!));
    expect(await state()).toMatchObject({ ref: 'DIV', attached: 2, cleaned: 1 });
    await page.getByRole('button', { name: 'Swap ratio attachments' }).click(); expect(await state()).toMatchObject({ ref: 'DIV', attached: 3, cleaned: 2 });
    await page.getByRole('button', { name: 'Remove ratio' }).click(); expect(await state()).toMatchObject({ ref: null, attached: 3, cleaned: 3 });
  }
  expect(errors).toEqual([]);
});

test('fresh actual four-function AspectRatio gallery delivers original SSR hosts, hydration identity and decoded responsive source variants', async ({ page, request }) => {
  test.setTimeout(120_000);
  const html = await (await request.get('/aspect-ratio')).text(); expect(html).toContain('data-hydrated="false"');
  for (const slot of ['example-wrapper', 'example', 'example-content', 'aspect-ratio']) expect(html).toContain(`data-slot="${slot}"`);
  expect(html).toContain('https://avatar.vercel.sh/shadcn1'); expect(html).toContain('alt="Photo"');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await aspectImages(page); await page.goto('/aspect-ratio'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  // Warm actual development dependency discovery, then preserve every genuine SSR host.
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
  try {
    await page.goto('/aspect-ratio', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    const hosts = await page.locator(aspectGalleryHosts).elementHandles(); expect(hosts).toHaveLength(22); const before = await aspectGallerySnapshot(page);
    release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: aspectGalleryHosts, index })).toBe(true);
    expect(await aspectGallerySnapshot(page)).toEqual(before);
    for (const style of aspectStyles) for (const dark of [false, true]) {
      await aspectTheme(page, style, dark);
      for (const width of [390, 640, 768, 1024, 1536]) { await page.setViewportSize({ width, height: 1600 }); await assertAspectGallery(page, width, 1600, style); }
    }
    expect(errors).toEqual([]);
  } finally { release(); }
});
