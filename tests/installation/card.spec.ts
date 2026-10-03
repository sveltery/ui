import { expect, test } from '@playwright/test';
import { cardGallerySelector, cardGalleryHosts, cardGalleryHydrated, cardGallerySnapshot, assertCardGalleryScaffold, assertCardGalleryVariants } from '../browser/card-cases';
const ids = ['consumer-card', 'consumer-card-header', 'consumer-card-title', 'consumer-card-description', 'consumer-card-action', 'consumer-card-content', 'consumer-card-footer'];
test('fresh seven-part Card archive/source copy preserves SSR hosts, hydration identity and lifecycle', async ({ page, request }) => {
  const html = await (await request.get('/card')).text();
  expect(html).toContain('data-hydrated="false"'); expect(html).toContain('Initial &amp; &lt;Card>');
  expect(await page.evaluate(source => new DOMParser().parseFromString(source, 'text/html').querySelector('#consumer-card-title')?.textContent, html)).toBe('Initial & <Card> title');
  for (const id of ids) expect(html).toContain(`id="${id}"`);
  expect(html).not.toContain('data-attached="true"');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  // Complete dependency discovery before withholding hydration scripts.
  await page.goto('/card'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
  try {
    await page.goto('/card', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    await page.locator('#consumer-card').evaluate((_node, hostIds) => { (window as Window & { cardHosts?: Element[] }).cardHosts = hostIds.map(id => document.getElementById(id)!); }, ids);
    release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    expect(await page.evaluate(hostIds => hostIds.every((id, index) => document.getElementById(id) === (window as Window & { cardHosts?: Element[] }).cardHosts?.[index]), ids)).toBe(true);
    await expect(page.getByTestId('card-state')).toHaveText(JSON.stringify({ refs: ids, attached: 7, cleaned: 0 }));
    for (const id of ids) { await expect(page.locator(`#${id}`)).toHaveAttribute('data-attached', 'true'); expect(await page.locator(`#${id}`).evaluate(node => node.tagName)).toBe('DIV'); }
    await page.getByRole('button', { name: 'Update card', exact: true }).click();
    await expect(page.locator('#consumer-card-title')).toHaveText('Updated & <Card> title'); await expect(page.locator('#consumer-card')).toHaveAttribute('title', 'Updated & <Card>'); await expect(page.locator('#consumer-card')).toHaveAttribute('data-size', 'sm');
    expect(await page.evaluate(hostIds => hostIds.every((id, index) => document.getElementById(id) === (window as Window & { cardHosts?: Element[] }).cardHosts?.[index]), ids)).toBe(true);
    await expect(page.getByTestId('card-state')).toHaveText(JSON.stringify({ refs: ids, attached: 7, cleaned: 0 }));
    await page.getByRole('button', { name: 'Toggle card', exact: true }).click(); await expect(page.locator('#consumer-card')).toHaveCount(0);
    await expect(page.getByTestId('card-state')).toHaveText(JSON.stringify({ refs: Array(7).fill(null), attached: 7, cleaned: 7 }));
    await page.getByRole('button', { name: 'Toggle card', exact: true }).click();
    await expect(page.getByTestId('card-state')).toHaveText(JSON.stringify({ refs: ids, attached: 14, cleaned: 7 }));
    expect(await page.evaluate(hostIds => hostIds.every((id, index) => document.getElementById(id) !== (window as Window & { cardHosts?: Element[] }).cardHosts?.[index]), ids)).toBe(true);
    expect(errors).toEqual([]);
  } finally { release(); }
});
test('fresh Card Nova styles, small size, class override and native inert semantics', async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto('/card'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    const card = page.locator('#consumer-card');
    expect(await card.evaluate(node => { const css = getComputedStyle(node); return { display: css.display, gap: css.gap, top: css.paddingTop, bottom: css.paddingBottom, radius: css.borderRadius, overflow: css.overflow, background: css.backgroundColor }; })).toEqual({ display: 'flex', gap: '16px', top: '16px', bottom: '0px', radius: '12px', overflow: 'hidden', background: 'oklch(1 0 0)' });
    expect(await page.locator('#consumer-card-title').evaluate(node => { const css = getComputedStyle(node); return { size: css.fontSize, weight: css.fontWeight }; })).toEqual({ size: '16px', weight: '500' });
    expect(await page.locator('#consumer-card-header').evaluate(node => { const css = getComputedStyle(node); return { display: css.display, columns: css.gridTemplateColumns.split(' ').length, rows: css.gridTemplateRows.split(' ').length, padding: css.paddingLeft }; })).toEqual({ display: 'grid', columns: 2, rows: 2, padding: '16px' });
    expect(await page.locator('#consumer-card-action').evaluate(node => { const css = getComputedStyle(node); return { column: css.gridColumnStart, row: css.gridRowStart, span: css.gridRowEnd }; })).toEqual({ column: '2', row: '1', span: 'span 2' });
    await page.getByRole('button', { name: 'Before card', exact: true }).focus(); await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'After card', exact: true })).toBeFocused();
    await page.locator('#consumer-card-action').click(); await expect(page.getByTestId('card-clicks')).toHaveText('["action","card"]');
    expect(await page.locator('#consumer-card [role], #consumer-card[role], #consumer-card [tabindex], #consumer-card[tabindex]').count()).toBe(0);
    await page.getByRole('button', { name: 'Update card', exact: true }).click();
    expect(await card.evaluate(node => { const css = getComputedStyle(node); return { gap: css.gap, top: css.paddingTop, bottom: css.paddingBottom, radius: css.borderRadius }; })).toEqual({ gap: '12px', top: '12px', bottom: '0px', radius: '0px' });
    expect(await page.locator('#consumer-card-title').evaluate(node => getComputedStyle(node).fontSize)).toBe('14px');
    expect(await page.locator('#consumer-card-header').evaluate(node => getComputedStyle(node).paddingLeft)).toBe('12px');
    expect(await page.locator('#consumer-card-content').evaluate(node => getComputedStyle(node).paddingLeft)).toBe('24px');
    expect(await page.locator('#consumer-card-footer').evaluate(node => { const css = getComputedStyle(node); return { padding: css.paddingLeft, border: css.borderTopWidth, display: css.display }; })).toEqual({ padding: '12px', border: '1px', display: 'flex' });
  }
});

// Actual CardExample delivery, separate from the preserved seven-part lifecycle consumer.
test('fresh seven-Card gallery delivers genuine scaffolds, source variants and all original SSR hosts', async ({ page, request }) => {
  const html = await (await request.get('/card-gallery')).text(); expect(html).toContain('data-hydrated="false"');
  for (const slot of ['example-wrapper', 'example', 'example-content']) expect(html).toContain(`data-slot="${slot}"`);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/card-gallery'); await expect(cardGalleryHydrated(page)).toHaveAttribute('data-hydrated', 'true');
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
  try {
    await page.goto('/card-gallery', { waitUntil: 'commit' }); await expect(cardGalleryHydrated(page)).toHaveAttribute('data-hydrated', 'false');
    const hosts = await page.locator(cardGalleryHosts).elementHandles(); expect(hosts).toHaveLength(74);
    const before = await cardGallerySnapshot(page); release(); await expect(cardGalleryHydrated(page)).toHaveAttribute('data-hydrated', 'true');
    expect(await page.locator(cardGalleryHosts).count()).toBe(hosts.length);
    for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: cardGalleryHosts, index })).toBe(true);
    expect(await cardGallerySnapshot(page)).toEqual(before);
    for (const width of [390, 640, 768, 1024, 1536]) {
      await page.setViewportSize({ width, height: 1600 }); await assertCardGalleryScaffold(page, width, 1600);
    }
    const examples = page.locator(`${cardGallerySelector} > [data-slot="example"]`); await expect(examples).toHaveCount(7);
    const edge = examples.nth(2).locator('[data-slot="example-content"] [data-slot="card-content"]'); await expect(edge).toHaveCount(1);
    expect(await edge.evaluate(node => getComputedStyle(node).paddingLeft)).toBe('0px'); expect(await edge.evaluate(node => getComputedStyle(node).marginBottom)).toBe('-16px');
    // Keep Nova geometry before the source-selector witness switches to Sera's 32px spacing.
    await assertCardGalleryVariants(page);
    expect(errors).toEqual([]);
  } finally { release(); }
});
