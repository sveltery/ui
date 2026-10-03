import { expect, test } from '@playwright/test';
import { avatarGallery, avatarHosts, avatarStyles, portraitPNG, assertAvatarGallery, assertAvatarLifecycle, assertAvatarStaleCompletion, assertOriginalAvatarImages } from '../browser/avatar-cases';
test('fresh actual Avatar gallery retains complete original HTML hosts, hydration and style selectors', async ({ page, context, request }, testInfo) => {
  const html = await (await request.get('/avatar')).text(); expect(html).toContain('data-hydrated="false"');
  // Genuine Image SSR is absent; exact source URLs/alt/order are asserted on 39 loaded CSR hosts.
  expect(await page.evaluate(source => { const document = new DOMParser().parseFromString(source, 'text/html'); return { fallback: document.querySelectorAll('[data-slot="avatar-fallback"]').length, image: document.querySelectorAll('[data-slot="avatar-image"]').length }; }, html)).toEqual({ fallback: 48, image: 0 });
  let releaseImages!: () => void; const gate = new Promise<void>(resolve => { releaseImages = resolve; });
  await context.route('https://github.com/*.png', async route => { await gate; await route.fulfill({ status: 200, contentType: 'image/png', body: portraitPNG }); });
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const activeScripts = new Set<string>(); const scriptEvents: { event: string; url: string; error?: string | null }[] = [];
  page.on('request', request => { if (request.resourceType() === 'script') { activeScripts.add(request.url()); scriptEvents.push({ event: 'request', url: request.url() }); } });
  page.on('requestfinished', request => { if (request.resourceType() === 'script') { activeScripts.delete(request.url()); scriptEvents.push({ event: 'finished', url: request.url() }); } });
  page.on('requestfailed', request => { if (request.resourceType() === 'script') { activeScripts.delete(request.url()); scriptEvents.push({ event: 'failed', url: request.url(), error: request.failure()?.errorText }); } });
  let releaseScripts!: () => void; const scripts = new Promise<void>(resolve => { releaseScripts = resolve; });
  try {
    await page.goto('/avatar', { waitUntil: 'domcontentloaded' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    // Match the main witness's preparation boundary in each fresh delivery mode.
    await expect(page.locator(`${avatarGallery} svg.lucide-square`)).toHaveCount(0); await expect.poll(() => activeScripts.size).toBe(0);
    await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await scripts; await route.fallback(); });
    await page.goto('/avatar', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    const hosts = await page.locator(avatarHosts).elementHandles(); expect(hosts.length).toBe(161);
    await expect(page.locator(`${avatarGallery} [data-slot="avatar-fallback"]`)).toHaveCount(48);
    releaseScripts(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, input) => node.isConnected && node === document.querySelectorAll(input.selector)[input.index], { selector: avatarHosts, index })).toBe(true);
    releaseImages(); await expect(page.locator(`${avatarGallery} img`)).toHaveCount(39); await expect(page.locator(`${avatarGallery} [data-slot="avatar-fallback"]`)).toHaveCount(9);
    await assertOriginalAvatarImages(page);
    for (const width of [390, 768, 1536]) { await page.setViewportSize({ width, height: 1600 }); await assertAvatarGallery(page, width); }
    for (const style of avatarStyles) for (const dark of [false, true]) {
      await page.evaluate(({ style, dark }) => { document.documentElement.className = `style-${style}${dark ? ' dark' : ''}`; }, { style, dark });
      await assertAvatarGallery(page, 1536);
      expect(await page.locator(`${avatarGallery} [data-slot="avatar-group-count"]`).evaluateAll(nodes => nodes.map(node => getComputedStyle(node).fontSize))).toEqual(Array(7).fill(['lyra', 'mira'].includes(style) ? '12px' : '14px'));
    }
    expect(errors).toEqual([]);
  } finally {
    if (errors.length || testInfo.status !== testInfo.expectedStatus) await testInfo.attach('fresh-avatar-hydration-module-requests', { body: JSON.stringify({ errors, activeScripts: [...activeScripts], scriptEvents }), contentType: 'application/json' });
    releaseScripts(); releaseImages();
  }
});
test('fresh six-part Avatar consumer preserves actual decode/cache/error/source and native lifecycle', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); await assertAvatarLifecycle(page); expect(errors).toEqual([]);
});
test('fresh actual image owner suppresses an old valid response after the newer error', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); await assertAvatarStaleCompletion(page); expect(errors).toEqual([]);
});
