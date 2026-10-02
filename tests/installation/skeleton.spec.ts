import { expect, test } from '@playwright/test';
// Source-derived local composition probe, shared by the archive and source-copy installations.
test('fresh SkeletonCard archive/source copy preserves pinned composition, SSR identity, geometry and pulse', async ({ page, request }) => {
  const html = await (await request.get('/skeleton')).text();
  const expected = [
    { tag: 'DIV', slot: 'card', class: 'cn-card group/card flex flex-col w-full' },
    { tag: 'DIV', slot: 'card-header', class: 'cn-card-header group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]' },
    { tag: 'DIV', slot: 'skeleton', class: 'cn-skeleton animate-pulse h-4 w-2/3' },
    { tag: 'DIV', slot: 'skeleton', class: 'cn-skeleton animate-pulse h-4 w-1/2' },
    { tag: 'DIV', slot: 'card-content', class: 'cn-card-content' },
    { tag: 'DIV', slot: 'skeleton', class: 'cn-skeleton animate-pulse aspect-square w-full' },
  ];
  expect(await page.evaluate(source => {
    const card = new DOMParser().parseFromString(source, 'text/html').querySelector('[data-testid=skeleton-card]')!;
    return [card, ...card.querySelectorAll('*')].map(node => ({ tag: node.tagName, slot: node.getAttribute('data-slot'), class: node.getAttribute('class') }));
  }, html)).toEqual(expected);
  expect(html).toContain('data-hydrated="false"');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  // Finish dependency discovery before retaining the fresh SSR composition hosts.
  await page.goto('/skeleton'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
  try {
    await page.goto('/skeleton', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    await page.getByTestId('skeleton-card').evaluate(card => { (window as Window & { skeletonCardHosts?: Element[] }).skeletonCardHosts = [card, ...card.querySelectorAll('*')]; });
    release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    expect(await page.getByTestId('skeleton-card').evaluate(card => [card, ...card.querySelectorAll('*')].every((host, index) => host === (window as Window & { skeletonCardHosts?: Element[] }).skeletonCardHosts?.[index]))).toBe(true);
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 1400 });
      const card = page.getByTestId('skeleton-card');
      await expect(card).toHaveAttribute('data-size', 'default');
      expect(await card.evaluate(node => [node, ...node.querySelectorAll('*')].map(host => ({ tag: host.tagName, slot: host.getAttribute('data-slot'), class: host.getAttribute('class') })))).toEqual(expected);
      expect(await card.evaluate(node => [...node.children].map(child => child.getAttribute('data-slot')))).toEqual(['card-header', 'card-content']);
      const measure = () => card.evaluate(node => {
        const header = node.querySelector('[data-slot=card-header]')!; const content = node.querySelector('[data-slot=card-content]')!;
        const innerWidth = (host: Element) => { const css = getComputedStyle(host); return host.getBoundingClientRect().width - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight); };
        const css = getComputedStyle(node);
        return { width: node.getBoundingClientRect().width, parentWidth: innerWidth(node.parentElement!), headerWidth: innerWidth(header), contentWidth: innerWidth(content), display: css.display, background: css.backgroundColor, gap: css.gap, radius: css.borderRadius,
          skeletons: [...node.querySelectorAll('[data-slot=skeleton]')].map(host => { const style = getComputedStyle(host); const rect = host.getBoundingClientRect(); return { width: rect.width, height: rect.height, animation: style.animationName, duration: style.animationDuration, count: style.animationIterationCount, background: style.backgroundColor }; }) };
      });
      const geometry = await measure();
      expect(geometry.width).toBe(geometry.parentWidth); expect(geometry.display).toBe('flex'); expect(geometry.gap).toBe('16px'); expect(geometry.radius).toBe('12px'); expect(geometry.background).toBe('oklch(1 0 0)');
      expect(geometry.skeletons[0].width).toBeCloseTo(geometry.headerWidth * 2 / 3, 1); expect(geometry.skeletons[0].height).toBe(16);
      expect(geometry.skeletons[1].width).toBeCloseTo(geometry.headerWidth / 2, 1); expect(geometry.skeletons[1].height).toBe(16);
      expect(geometry.skeletons[2].width).toBe(geometry.contentWidth); expect(geometry.skeletons[2].height).toBe(geometry.contentWidth);
      expect(geometry.skeletons.every(host => host.animation === 'pulse' && host.duration === '2s' && host.count === 'infinite' && host.background === 'oklch(0.97 0 0)')).toBe(true);
      expect(await card.locator('input, button, table, [role], [aria-busy], [tabindex], [ref]').count()).toBe(0);
      await page.emulateMedia({ reducedMotion: 'reduce' }); expect(await measure()).toEqual(geometry);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    }
    expect(errors).toEqual([]);
  } finally { release(); }
});
test('fresh native Skeleton archive/source copy: SSR, styles, reactivity and ref/attachment cleanup', async ({ page, request }) => {
  const html = await (await request.get('/skeleton')).text();
  expect(html).toContain('data-slot="skeleton"'); expect(html).toContain('data-hydrated="false"'); expect(html).toContain('Initial');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto('/skeleton');
    await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    const skeleton = page.getByTestId('skeleton');
    await expect(skeleton).toHaveText('Initial'); await expect(skeleton).toHaveAttribute('data-attached', 'true');
    await expect(page.getByTestId('skeleton-state')).toHaveText('{"ref":"DIV","attached":1,"cleaned":0}');
    expect(await skeleton.evaluate(node => ({ tag: node.tagName, width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height, animation: getComputedStyle(node).animationName, radius: getComputedStyle(node).borderRadius, background: getComputedStyle(node).backgroundColor }))).toEqual({ tag: 'DIV', width: 128, height: 16, animation: 'pulse', radius: '8px', background: 'oklch(0.97 0 0)' });
    const original = await skeleton.elementHandle();
    await page.getByRole('button', { name: 'Update skeleton' }).click(); await expect(skeleton).toHaveText('Updated');
    expect(await original!.evaluate(node => node === document.querySelector('[data-testid=skeleton]'))).toBe(true);
    expect(await skeleton.evaluate(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height, animation: getComputedStyle(node).animationName, radius: getComputedStyle(node).borderRadius }))).toEqual({ width: 256, height: 32, animation: 'none', radius: '0px' });
    await page.getByRole('button', { name: 'Remove skeleton' }).click(); await expect(skeleton).toHaveCount(0);
    await expect(page.getByTestId('skeleton-state')).toHaveText('{"ref":null,"attached":1,"cleaned":1}');
  }
  expect(errors).toEqual([]);
});
