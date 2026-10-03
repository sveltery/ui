import { expect, test, type Page } from '@playwright/test';
import { tableLifecycleCases, tableState } from './table-cases';
import { assertTableBadges, setTableBadgeTheme, tableBadgeHosts, tableBadgeMeasurements, tableBadgeSnapshot, tableGalleryHydrated, tableGalleryHosts, tableGallerySnapshot, tableGalleryMeasurements, assertTableGalleryScaffold, assertTableGalleryVariants } from './table-badges-cases';
// Source-derived probes, not copied upstream assertions; see table-sources.json.
tableLifecycleCases();
async function tableSnapshot(page: Page) {
  return page.locator('#probe-table').evaluate(table => {
    const snapshot = (node: Element): unknown => ({ tag: node.tagName, attrs: Object.fromEntries([...node.attributes].filter(attr => attr.name !== 'data-probed').map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent!.trim()).filter(Boolean), children: [...node.children].map(snapshot) });
    return snapshot(table);
  });
}
test('paired pinned React and Svelte SSR table nodes retain identity and semantics through hydration', async ({ page, context }) => {
  const reference = await context.newPage();
  const pairs = [[page, '/table-probe'], [reference, '/table-probe-reference']] as const;
  const errors: string[] = [];
  for (const [current] of pairs) {
    current.on('pageerror', error => errors.push(error.message));
    current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  }
  // Complete dependency discovery for both harnesses before capturing fresh SSR documents.
  await Promise.all(pairs.map(async ([current, route]) => { await current.goto(route); await expect(current.locator('[data-table-probe]')).toHaveAttribute('data-hydrated', 'true'); }));
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  const selector = '#probe-table, #probe-table caption, #probe-table thead, #probe-table tbody, #probe-table tfoot, #probe-table tr, #probe-table th, #probe-table td';
  for (const [current] of pairs) await current.route('**/*', async requestRoute => { if (requestRoute.request().resourceType() === 'script') await gate; await requestRoute.continue(); });
  try {
    const captured = [];
    for (const [current, route] of pairs) {
      await current.goto(route, { waitUntil: 'commit' });
      await expect(current.locator('[data-table-probe]')).toHaveAttribute('data-hydrated', 'false');
      const hosts = await current.locator(selector).elementHandles();
      expect(hosts.length).toBeGreaterThan(8); captured.push({ current, hosts });
    }
    expect(captured[0].hosts.length).toBe(captured[1].hosts.length);
    const before = await tableSnapshot(page); expect(before).toEqual(await tableSnapshot(reference));
    release();
    for (const { current, hosts } of captured) {
      await expect(current.locator('[data-table-probe]')).toHaveAttribute('data-hydrated', 'true');
      expect(await current.locator(selector).count()).toBe(hosts.length);
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector, index })).toBe(true);
      expect(await tableSnapshot(current)).toEqual(before);
    }
    expect(await tableSnapshot(page)).toEqual(await tableSnapshot(reference)); expect(errors).toEqual([]);
  } finally { release(); await reference.close(); }
});
async function measurements(page: Page) {
  return page.locator('[data-table-probe] table, [data-table-probe] caption, [data-table-probe] thead, [data-table-probe] tbody, [data-table-probe] tfoot, [data-table-probe] tr, [data-table-probe] th, [data-table-probe] td, [data-table-probe] [data-slot=table-container]').evaluateAll(nodes => nodes.map(node => {
    const s = getComputedStyle(node); const r = node.getBoundingClientRect();
    return { tag: node.tagName, width: r.width, height: r.height, padding: s.padding, borderWidth: s.borderWidth, borderColor: s.borderColor, background: s.backgroundColor, color: s.color, fontSize: s.fontSize, fontWeight: s.fontWeight, verticalAlign: s.verticalAlign, textAlign: s.textAlign, captionSide: s.captionSide, overflowX: s.overflowX, position: s.position, whiteSpace: s.whiteSpace };
  }));
}
async function darkTheme(page: Page) {
  // Supplemental theme tokens are identical on both harnesses; not a claimed upstream theme port.
  await page.evaluate(async () => {
    document.documentElement.classList.add('dark');
    for (const [key, value] of Object.entries({ background: 'oklch(0.145 0 0)', foreground: 'oklch(0.985 0 0)', muted: 'oklch(0.269 0 0)', 'muted-foreground': 'oklch(0.708 0 0)', border: 'oklch(0.269 0 0)' })) document.documentElement.style.setProperty(`--${key}`, value);
    // Flush the token mutation before collecting the real row color transitions.
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    const table = document.querySelector('#probe-table')!;
    await Promise.all(table.getAnimations({ subtree: true }).map(animation => animation.finished));
  });
}
for (const width of [1280, 390]) for (const theme of ['light', 'dark']) test(`paired native Table semantics, Nova selectors and overflow at ${width}px ${theme}`, async ({ page, context }, testInfo) => {
  await page.setViewportSize({ width, height: 1100 }); await page.goto('/table-probe'); await expect(page.locator('[data-table-probe]')).toHaveAttribute('data-hydrated', 'true');
  const reference = await context.newPage(); await reference.setViewportSize({ width, height: 1100 }); await reference.goto('/table-probe-reference'); await expect(reference.locator('[data-table-probe]')).toHaveAttribute('data-hydrated', 'true');
  if (theme === 'dark') { await darkTheme(page); await darkTheme(reference); }
  await page.mouse.move(0, 0); await reference.mouse.move(0, 0);
  expect(await tableSnapshot(page)).toEqual(await tableSnapshot(reference)); expect(await measurements(page)).toEqual(await measurements(reference));
  for (const current of [page, reference]) {
    await expect(current.getByRole('table', { name: 'Quarterly ledger', exact: true })).toBeVisible();
    await expect(current.getByRole('columnheader', { name: 'Account', exact: true })).toHaveAttribute('scope', 'col');
    await expect(current.locator('#probe-cell')).toHaveAttribute('headers', 'probe-head');
    expect(await current.locator('caption').evaluate(node => getComputedStyle(node).captionSide)).toBe('bottom');
    expect(await current.locator('thead tr').evaluate(node => getComputedStyle(node).borderBottomWidth)).toBe('1px');
    expect(await current.locator('tbody tr:last-child').evaluate(node => getComputedStyle(node).borderBottomWidth)).toBe('0px');
    expect(await current.locator('tfoot tr').evaluate(node => getComputedStyle(node).borderBottomWidth)).toBe('0px');
    expect(await current.getByTestId('checkbox-cell').evaluate(node => getComputedStyle(node).paddingRight)).toBe('0px');
    expect(await current.getByTestId('checkbox-head').evaluate(node => getComputedStyle(node).paddingRight)).toBe('0px');
    expect(await current.getByTestId('expanded-row').evaluate(node => getComputedStyle(node).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
    expect(await current.getByTestId('selected-row').evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
    const overflow = await current.locator('[data-slot=table-container]').evaluate(node => ({ position: getComputedStyle(node).position, overflow: getComputedStyle(node).overflowX, width: node.clientWidth, scroll: node.scrollWidth, parentWidth: node.parentElement!.clientWidth, tableWidth: node.querySelector('table')!.getBoundingClientRect().width }));
    expect(overflow.position).toBe('relative'); expect(overflow.overflow).toBe('auto'); expect(overflow.scroll).toBeGreaterThan(overflow.width); expect(overflow.width).toBe(overflow.parentWidth); expect(overflow.tableWidth).toBeGreaterThanOrEqual(900);
    await current.locator('[data-slot=table-container]').evaluate(node => { node.scrollLeft = 200; });
    expect(await current.locator('[data-slot=table-container]').evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
    await current.locator('[data-slot=table-container]').evaluate(node => { node.scrollLeft = 0; });
  }
  await page.getByTestId('hover-row').hover(); await reference.getByTestId('hover-row').hover();
  await expect.poll(() => page.getByTestId('hover-row').evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  await page.waitForTimeout(180); await reference.waitForTimeout(180);
  expect(await measurements(page)).toEqual(await measurements(reference));
  for (const current of [page, reference]) {
    await current.getByRole('button', { name: 'Update table', exact: true }).click();
    await expect(current.getByRole('table', { name: 'Updated ledger', exact: true })).toHaveAttribute('data-slot', 'table-override');
    await expect(current.locator('#probe-head')).toHaveAttribute('colspan', '2'); await expect(current.locator('#probe-cell')).toHaveAttribute('rowspan', '2');
    await expect(current.locator('#probe-row')).toHaveAttribute('data-state', 'selected'); await expect(current.locator('#probe-row')).toHaveAttribute('data-custom', 'updated');
    await expect(current.getByTestId('expanded-row').getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    await expect.poll(() => current.getByTestId('expanded-row').evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
    expect(await current.locator('#probe-head').evaluate(node => ({ padding: getComputedStyle(node).paddingRight, align: getComputedStyle(node).textAlign }))).toEqual({ padding: '24px', align: 'right' });
    expect(await current.locator('#probe-cell').evaluate(node => getComputedStyle(node).paddingLeft)).toBe('24px');
    await current.mouse.move(0, 0);
  }
  await page.waitForTimeout(180); await reference.waitForTimeout(180);
  expect(await tableSnapshot(page)).toEqual(await tableSnapshot(reference)); expect(await measurements(page)).toEqual(await measurements(reference));
  await page.locator('#probe-row').click(); expect((await tableState(page)).clicks).toBe(1);
  await testInfo.attach(`svelte-table-${width}-${theme}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await testInfo.attach(`pinned-react-table-${width}-${theme}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' });
  await reference.close();
});
test('bounded Basic, Footer, Simple and With Badges example content matches pinned React', async ({ page, context }) => {
  await page.goto('/table'); await expect(page.locator('[data-gallery]')).toBeVisible();
  const reference = await context.newPage(); await reference.goto('/table-reference'); await expect(reference.locator('[data-hydrated=true]')).toBeVisible();
  const semantic = (current: Page) => current.locator('[data-gallery] table').evaluateAll(tables => tables.map(table => ({ caption: table.querySelector('caption')?.textContent?.trim(), headers: [...table.querySelectorAll('th')].map(node => node.textContent?.trim()), rows: [...table.querySelectorAll('tbody tr')].map(row => [...row.querySelectorAll('td')].map(node => node.textContent?.trim())), footers: [...table.querySelectorAll('tfoot td')].map(node => ({ text: node.textContent?.trim(), span: node.getAttribute('colspan') })) })));
  expect(await semantic(page)).toEqual(await semantic(reference)); expect(await semantic(page)).toHaveLength(4);
  await expect(page.locator('tfoot')).toContainText('$2,500.00'); await reference.close();
});

for (const width of [1280, 390]) test(`actual With Badges native spans match pinned React geometry and light/dark colors at ${width}px`, async ({ page, context }, testInfo) => {
  const reference = await context.newPage();
  try {
    for (const [current, route] of [[page, '/table'], [reference, '/table-reference']] as const) {
      await current.setViewportSize({ width, height: 1400 }); await current.goto(route); await expect(tableGalleryHydrated(current)).toHaveAttribute('data-hydrated', 'true');
    }
    for (const dark of [false, true]) {
      for (const current of [page, reference]) { await setTableBadgeTheme(current, dark); await assertTableBadges(current, dark); }
      expect(await tableBadgeSnapshot(page)).toEqual(await tableBadgeSnapshot(reference));
      expect(await tableBadgeMeasurements(page)).toEqual(await tableBadgeMeasurements(reference));
      await testInfo.attach(`svelte-table-badges-${width}-${dark ? 'dark' : 'light'}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
      await testInfo.attach(`pinned-react-table-badges-${width}-${dark ? 'dark' : 'light'}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' });
    }
  } finally { await reference.close(); }
});
test('paired actual With Badges table and six spans preserve SSR identity through hydration', async ({ page, context }) => {
  const reference = await context.newPage(); const pairs = [[page, '/table'], [reference, '/table-reference']] as const;
  const errors: string[] = [];
  for (const [current, route] of pairs) {
    current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await current.goto(route); await expect(tableGalleryHydrated(current)).toHaveAttribute('data-hydrated', 'true');
  }
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  for (const [current] of pairs) await current.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
  try {
    const captured = [];
    for (const [current, route] of pairs) {
      await current.goto(route, { waitUntil: 'commit' }); await expect(tableGalleryHydrated(current)).toHaveAttribute('data-hydrated', 'false');
      const hosts = await current.locator(tableBadgeHosts).elementHandles(); expect(hosts).toHaveLength(25);
      const galleryHosts = await current.locator(tableGalleryHosts).elementHandles(); expect(galleryHosts).toHaveLength(114); captured.push({ current, hosts, galleryHosts });
    }
    const before = await tableBadgeSnapshot(page); expect(before).toEqual(await tableBadgeSnapshot(reference));
    const galleryBefore = await tableGallerySnapshot(page); expect(galleryBefore).toEqual(await tableGallerySnapshot(reference));
    release();
    for (const { current, hosts, galleryHosts } of captured) {
      await expect(tableGalleryHydrated(current)).toHaveAttribute('data-hydrated', 'true');
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: tableBadgeHosts, index })).toBe(true);
      expect(await tableBadgeSnapshot(current)).toEqual(before); await assertTableBadges(current);
      expect(await current.locator(tableGalleryHosts).count()).toBe(114);
      for (const [index, host] of galleryHosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: tableGalleryHosts, index })).toBe(true);
      expect(await tableGallerySnapshot(current)).toEqual(galleryBefore);
    }
    expect(errors).toEqual([]);
  } finally { release(); await reference.close(); }
});

// Source-derived authored helper/layout witnesses, not a copied ordinary shadcn runtime suite.
for (const width of [390, 640, 768, 1024, 1536]) test(`genuine four-Table scaffold tree, responsive layout and source variants at ${width}px`, async ({ page, context }) => {
  const reference = await context.newPage(); const errors: string[] = [];
  try {
    for (const [current, route] of [[page, '/table'], [reference, '/table-reference']] as const) {
      current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await current.setViewportSize({ width, height: 1400 }); await current.goto(route); await expect(tableGalleryHydrated(current)).toHaveAttribute('data-hydrated', 'true');
      await assertTableGalleryScaffold(current, width, 1400);
    }
    expect(await tableGallerySnapshot(page)).toEqual(await tableGallerySnapshot(reference));
    expect(await tableGalleryMeasurements(page)).toEqual(await tableGalleryMeasurements(reference));
    for (const current of [page, reference]) await assertTableGalleryVariants(current);
    expect(await tableGalleryMeasurements(page)).toEqual(await tableGalleryMeasurements(reference));
    expect(errors).toEqual([]);
  } finally { await reference.close(); }
});
