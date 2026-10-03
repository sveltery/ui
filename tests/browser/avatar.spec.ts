import { expect, test } from '@playwright/test';
import { avatarGallery, avatarHosts, avatarStyles, portraitPNG, avatarSnapshot, avatarMeasurements, assertAvatarGallery, assertAvatarLifecycle, assertAvatarStaleCompletion, applyAvatarTheme, assertOriginalAvatarImages } from './avatar-cases';

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
      await assertOriginalAvatarImages(current);
      expect(await current.locator(`${avatarGallery} img`).evaluateAll(async nodes => { await Promise.all(nodes.map(node => (node as HTMLImageElement).decode())); return nodes.every(node => (node as HTMLImageElement).naturalWidth === 1 && node.hasAttribute('alt')); })).toBe(true);
    }
    expect(await avatarSnapshot(page)).toEqual(await avatarSnapshot(original));
    for (const width of [390, 640, 768, 1024, 1536]) {
      for (const current of [page, original]) { await current.setViewportSize({ width, height: 1600 }); await assertAvatarGallery(current, width); }
    }
    for (const style of avatarStyles) for (const dark of [false, true]) {
      for (const current of [page, original]) await applyAvatarTheme(current, style, dark);
      expect(await avatarMeasurements(page)).toEqual(await avatarMeasurements(original));
      const counts = await page.locator(`${avatarGallery} [data-slot="avatar-group-count"]`).evaluateAll(nodes => nodes.map(node => getComputedStyle(node).fontSize));
      expect(counts).toEqual(Array(7).fill(['lyra', 'mira'].includes(style) ? '12px' : '14px'));
    }
    expect(errors).toEqual([]);
  } finally { await original.close(); }
});

test('Avatar complete initial HTML hosts preserve SSR hydration identity while genuine image requests remain pending', async ({ page, context }, testInfo) => {
  let releaseImages!: () => void; const imageGate = new Promise<void>(resolve => { releaseImages = resolve; });
  await context.route('https://github.com/*.png', async route => { await imageGate; await route.fulfill({ status: 200, contentType: 'image/png', body: portraitPNG }); });
  const original = await context.newPage(); const errors: string[] = [];
  const activeScripts = new Set<string>();
  const scriptEvents: { page: string; event: string; url: string; error?: string | null }[] = [];
  try {
    for (const [current, label] of [[page, 'native'], [original, 'original']] as const) {
      current.on('pageerror', error => errors.push(error.message));
      current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      current.on('request', request => { if (request.resourceType() === 'script') { activeScripts.add(`${label}:${request.url()}`); scriptEvents.push({ page: label, event: 'request', url: request.url() }); } });
      current.on('requestfinished', request => { if (request.resourceType() === 'script') { activeScripts.delete(`${label}:${request.url()}`); scriptEvents.push({ page: label, event: 'finished', url: request.url() }); } });
      current.on('requestfailed', request => { if (request.resourceType() === 'script') { activeScripts.delete(`${label}:${request.url()}`); scriptEvents.push({ page: label, event: 'failed', url: request.url(), error: request.failure()?.errorText }); } });
    }
    await original.goto('http://127.0.0.1:5175/avatar', { waitUntil: 'domcontentloaded' });
    await expect(original.locator('[data-hydrated="true"]')).toHaveCount(1); await expect(original.locator(`${avatarGallery} svg.lucide-square`)).toHaveCount(0);
    await page.goto('/avatar', { waitUntil: 'domcontentloaded' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    // Finish actual canonical lazy glyph modules before navigating away from the warm document.
    // Images stay pending; source/import failure records and the zero-pageerror gate stay strict.
    await expect(page.locator(`${avatarGallery} svg.lucide-square`)).toHaveCount(0);
    await expect.poll(() => activeScripts.size).toBe(0);
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
  } finally {
    if (errors.length || testInfo.status !== testInfo.expectedStatus) await testInfo.attach('avatar-hydration-module-requests', { body: JSON.stringify({ errors, activeScripts: [...activeScripts], scriptEvents }), contentType: 'application/json' });
    releaseImages(); await original.close();
  }
});

test('six-part Avatar preserves native decode/source/error/cache, refs, attachments, overrides and disposal', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await assertAvatarLifecycle(page); expect(errors).toEqual([]);
});

test('actual old valid image completion cannot replace the newer error/fallback state', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); await assertAvatarStaleCompletion(page); expect(errors).toEqual([]);
});

test('actual Avatar Plus and Check glyphs match genuine five-library resolved providers', async ({ page, context }) => {
  await context.route('https://github.com/*.png', route => route.fulfill({ status: 200, contentType: 'image/png', body: portraitPNG }));
  const original = await context.newPage(); const errors: string[] = [];
  const snapshot = (target: typeof page) => target.locator(`${avatarGallery} svg`).evaluateAll(nodes => {
    const tree = (node: Element): unknown => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), children: [...node.children].map(tree) });
    return nodes.map(tree);
  });
  try {
    for (const current of [page, original]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
    for (const library of ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon']) {
      for (const [current, path] of [[page, `/avatar?library=${library}`], [original, `http://127.0.0.1:5175/avatar?library=${library}`]] as const) {
        await current.goto(path); await expect(current.locator(`${avatarGallery} svg`)).toHaveCount(11); await expect(current.locator(`${avatarGallery} svg.lucide-square`)).toHaveCount(0);
      }
      await expect.poll(() => snapshot(page)).toEqual(await snapshot(original));
      expect(await page.locator(`${avatarGallery} svg`).evaluateAll((nodes, key) => nodes.every(node => Boolean(node.getAttribute(key))), library)).toBe(true);
    }
    expect(errors).toEqual([]);
  } finally { await original.close(); }
});

test('actual caller callback sees preceding parent DOM status and mixed size/after selectors match original source', async ({ page, context }) => {
  const original = await context.newPage(); const errors: string[] = [];
  try {
    for (const [current, path] of [[page, '/avatar-probe'], [original, 'http://127.0.0.1:5175/avatar-probe']] as const) {
      current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); await current.goto(path); await expect(current.locator('#render-avatar-image')).toBeVisible();
      await current.getByRole('button', { name: 'Change rendered Avatar source', exact: true }).click(); await expect(current.locator('#render-avatar-fallback')).toBeVisible();
      // This witnesses observable DOM commit order, not an internal batched context setter.
      await expect.poll(async () => JSON.parse(await current.getByTestId('avatar-callback-trace').innerText()).slice(-2)).toEqual([{ status: 'loading', rootDOMStatus: 'loaded' }, { status: 'error', rootDOMStatus: 'loading' }]);
    }
    const measure = (current: typeof page) => current.locator('[data-avatar-mixed] [data-slot]').evaluateAll(nodes => nodes.map(node => {
      const css = getComputedStyle(node); const after = getComputedStyle(node, '::after');
      return { tag: node.tagName, slot: node.getAttribute('data-slot'), size: node.getAttribute('data-size'), class: node.className, width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height, font: css.fontSize, radius: css.borderRadius, after: { position: after.position, border: after.borderTopWidth, radius: after.borderRadius, blend: after.mixBlendMode } };
    }));
    for (const style of avatarStyles) for (const dark of [false, true]) {
      for (const current of [page, original]) await current.evaluate(({ style, dark }) => { document.documentElement.className = `style-${style}${dark ? ' dark' : ''}`; }, { style, dark });
      expect(await measure(page)).toEqual(await measure(original));
      expect(await page.locator('[data-avatar-mixed] [data-slot="avatar-group-count"]').evaluate(node => node.getBoundingClientRect().width)).toBe(24);
      const caller = page.locator('[data-avatar-mixed] > [data-slot="avatar"]'); await expect(caller).toHaveAttribute('data-size', 'lg'); expect(await caller.evaluate(node => node.getBoundingClientRect().width)).toBe(40);
      expect(await caller.evaluate(node => getComputedStyle(node, '::after').mixBlendMode)).toBe(dark ? 'lighten' : 'darken');
    }
    expect(errors).toEqual([]);
  } finally { await original.close(); }
});
