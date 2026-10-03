import { expect, test } from '@playwright/test';
import { avatarGallery, avatarHosts, avatarStyles, portraitPNG, avatarSnapshot, avatarMeasurements, assertAvatarGallery, assertAvatarLifecycle } from './avatar-cases';

test('seven genuine Avatar galleries match independently complete original CSS, actual decoded trees, all styles and dark selectors', async ({ page, context }) => {
  // Identical valid PNG response at each genuine original URL; no component callback mocking.
  await context.route('https://github.com/*.png', route => route.fulfill({ status: 200, contentType: 'image/png', body: portraitPNG }));
  const original = await context.newPage(); const errors: string[] = [];
  try {
    for (const [current, path] of [[page, '/avatar'], [original, 'http://127.0.0.1:5175/avatar']] as const) {
      current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await current.goto(path); await expect(current.locator('[data-hydrated="true"]')).toHaveCount(1);
      await expect(current.locator(`${avatarGallery} [data-slot="avatar-image"]`)).toHaveCount(39);
      await expect(current.locator(`${avatarGallery} [data-slot="avatar-fallback"]`)).toHaveCount(9);
      await expect(current.locator(`${avatarGallery} [data-starting-style], ${avatarGallery} svg.lucide-square`)).toHaveCount(0);
      expect(await current.locator(`${avatarGallery} img`).evaluateAll(async nodes => { await Promise.all(nodes.map(node => (node as HTMLImageElement).decode())); return nodes.every(node => (node as HTMLImageElement).naturalWidth === 1 && node.hasAttribute('alt')); })).toBe(true);
    }
    expect(await avatarSnapshot(page)).toEqual(await avatarSnapshot(original));
    for (const width of [390, 640, 768, 1024, 1536]) {
      for (const current of [page, original]) { await current.setViewportSize({ width, height: 1600 }); await assertAvatarGallery(current, width); }
    }
    for (const style of avatarStyles) for (const dark of [false, true]) {
      for (const current of [page, original]) await current.evaluate(({ style, dark }) => { document.documentElement.className = `style-${style}${dark ? ' dark' : ''}`; }, { style, dark });
      expect(await avatarMeasurements(page)).toEqual(await avatarMeasurements(original));
      const counts = await page.locator(`${avatarGallery} [data-slot="avatar-group-count"]`).evaluateAll(nodes => nodes.map(node => getComputedStyle(node).fontSize));
      expect(counts).toEqual(Array(7).fill(['lyra', 'mira'].includes(style) ? '12px' : '14px'));
    }
    expect(errors).toEqual([]);
  } finally { await original.close(); }
});

test('Avatar complete initial HTML hosts preserve SSR hydration identity while genuine image requests remain pending', async ({ page, context }) => {
  let releaseImages!: () => void; const imageGate = new Promise<void>(resolve => { releaseImages = resolve; });
  await context.route('https://github.com/*.png', async route => { await imageGate; await route.fulfill({ status: 200, contentType: 'image/png', body: portraitPNG }); });
  const original = await context.newPage(); const errors: string[] = [];
  try {
    for (const current of [page, original]) current.on('pageerror', error => errors.push(error.message));
    await original.goto('http://127.0.0.1:5175/avatar', { waitUntil: 'domcontentloaded' });
    await expect(original.locator('[data-hydrated="true"]')).toHaveCount(1); await expect(original.locator(`${avatarGallery} svg.lucide-square`)).toHaveCount(0);
    await page.goto('/avatar', { waitUntil: 'domcontentloaded' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    let releaseScripts!: () => void; const scriptGate = new Promise<void>(resolve => { releaseScripts = resolve; });
    await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await scriptGate; await route.fallback(); });
    try {
      await page.goto('/avatar', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
      const hosts = await page.locator(avatarHosts).elementHandles(); const sourceCount = await original.locator(avatarHosts).count(); expect(hosts.length).toBe(sourceCount); expect(hosts.length).toBe(161);
      await expect(page.locator(`${avatarGallery} [data-slot="avatar-fallback"]`)).toHaveCount(48); await expect(page.locator(`${avatarGallery} img`)).toHaveCount(0);
      releaseScripts(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true'); await expect(page.locator(`${avatarGallery} svg.lucide-square`)).toHaveCount(0);
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, input) => node.isConnected && node === document.querySelectorAll(input.selector)[input.index], { selector: avatarHosts, index })).toBe(true);
      expect(await avatarSnapshot(page)).toEqual(await avatarSnapshot(original));
      releaseImages(); await expect(page.locator(`${avatarGallery} img`)).toHaveCount(39); await expect(original.locator(`${avatarGallery} img`)).toHaveCount(39);
      await expect(page.locator(`${avatarGallery} [data-slot="avatar-fallback"]`)).toHaveCount(9); expect(errors).toEqual([]);
    } finally { releaseScripts(); }
  } finally { releaseImages(); await original.close(); }
});

test('six-part Avatar preserves native decode/source/error/cache, refs, attachments, overrides and disposal', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await assertAvatarLifecycle(page); expect(errors).toEqual([]);
});
