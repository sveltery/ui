// Supplemental source-derived comparisons executing actual immutable wrappers, not an upstream test-port inventory.
import { expect, test, type Page } from '@playwright/test';
import { alertLifecycleCases, alertNativeAssertions } from './alert-cases';
alertLifecycleCases();
const selector = '[data-testid="composition"] *, [data-testid="selectors"] *';
async function snapshot(page: Page) {
  return page.locator(selector).evaluateAll(nodes => nodes.map(node => ({
    tag: node.tagName, attrs: Object.fromEntries([...node.attributes].filter(attr => attr.name !== 'data-probed').map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))),
    text: node.textContent?.replace(/\s+/g, ' ').trim(),
  })));
}
async function measurements(page: Page) {
  return page.locator(selector).evaluateAll(nodes => nodes.map(node => {
    const css = getComputedStyle(node); const rect = node.getBoundingClientRect();
    return { width: rect.width, height: rect.height, display: css.display, position: css.position, gridTemplateColumns: css.gridTemplateColumns, gridColumnStart: css.gridColumnStart, gridRow: css.gridRow, gap: css.gap, padding: css.padding, margin: css.margin, fontSize: css.fontSize, fontWeight: css.fontWeight, color: css.color, backgroundColor: css.backgroundColor, border: css.border, borderRadius: css.borderRadius, textWrap: css.textWrap, transform: css.transform, top: css.top, right: css.right, textDecoration: css.textDecoration };
  }));
}
test('paired pinned React/Svelte four native parts retain SSR host identity through hydration', async ({ page, context }) => {
  const reference = await context.newPage(); const pairs = [[page, '/alert-probe'], [reference, '/alert-probe-reference']] as const;
  const errors: string[] = [];
  for (const [current] of pairs) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
  await Promise.all(pairs.map(async ([current, route]) => { await current.goto(route); await expect(current.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'true'); }));
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  for (const [current] of pairs) await current.route('**/*', async requestRoute => { if (requestRoute.request().resourceType() === 'script') await gate; await requestRoute.continue(); });
  try {
    const captured = [];
    for (const [current, route] of pairs) {
      await current.goto(route, { waitUntil: 'commit' }); await expect(current.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'false');
      const hosts = await current.locator(selector).elementHandles(); expect(hosts.length).toBeGreaterThan(30); captured.push({ current, hosts });
    }
    const before = await snapshot(page); expect(before).toEqual(await snapshot(reference)); release();
    for (const { current, hosts } of captured) {
      await expect(current.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'true');
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector, index })).toBe(true);
      expect(await snapshot(current)).toEqual(before);
    }
    expect(errors).toEqual([]);
  } finally { release(); await reference.close(); }
});
for (const width of [1280, 390]) for (const theme of ['light', 'dark']) test(`paired Alert native behavior and Nova selector/style witnesses at ${width}px ${theme}`, async ({ page, context }, testInfo) => {
  const reference = await context.newPage(); const errors: string[] = [];
  for (const current of [page, reference]) {
    current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await current.setViewportSize({ width, height: 1400 });
  }
  await page.goto('/alert-probe'); await reference.goto('/alert-probe-reference');
  for (const current of [page, reference]) {
    await expect(current.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'true');
    if (theme === 'dark') await current.evaluate(() => document.documentElement.classList.add('dark'));
  }
  expect(await snapshot(page)).toEqual(await snapshot(reference)); expect(await measurements(page)).toEqual(await measurements(reference));
  await alertNativeAssertions(page); await alertNativeAssertions(reference);
  expect(await snapshot(page)).toEqual(await snapshot(reference)); expect(await measurements(page)).toEqual(await measurements(reference)); expect(errors).toEqual([]);
  await testInfo.attach(`svelte-alert-${width}-${theme}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await testInfo.attach(`pinned-react-alert-${width}-${theme}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' });
  await reference.close();
});
const galleryHosts = '[data-alert-gallery], [data-alert-gallery] *';
async function galleryTree(page: Page) {
  return page.locator(galleryHosts).evaluateAll(nodes => nodes.map(node => ({
    tag: node.tagName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))),
    text: [...node.childNodes].filter(child => child.nodeType === Node.TEXT_NODE).map(child => child.textContent?.trim()).filter(Boolean).join(' '),
  })));
}
async function galleryLayout(page: Page) {
  return page.locator('[data-alert-gallery]').evaluate(node => {
    const css = getComputedStyle(node); const shell = node.parentElement!; const example = node.firstElementChild!;
    const title = example.firstElementChild!; const content = example.lastElementChild!; const body = content.firstElementChild!;
    const contentCss = getComputedStyle(content); const bodyCss = getComputedStyle(body);
    return { tag: node.tagName, class: node.className, shellTag: shell.tagName, shellClass: shell.className, shellBackground: getComputedStyle(shell).backgroundColor,
      width: node.getBoundingClientRect().width, maxWidth: css.maxWidth, columns: css.gridTemplateColumns, gap: css.gap, padding: css.padding,
      exampleTag: example.tagName, exampleClass: example.className, titleTag: title.tagName, title: title.textContent, titleClass: title.className,
      contentTag: content.tagName, contentClass: content.className, contentPadding: contentCss.padding, contentRadius: contentCss.borderRadius,
      contentWidth: content.getBoundingClientRect().width - parseFloat(contentCss.paddingLeft) - parseFloat(contentCss.paddingRight),
      bodyTag: body.tagName, bodyClass: body.className, bodyWidth: body.getBoundingClientRect().width, bodyMaxWidth: bodyCss.maxWidth,
      parts: [...body.querySelectorAll('[role="alert"], [data-slot="alert-title"], [data-slot="alert-description"]')].map(part => { const rect = part.getBoundingClientRect(); const style = getComputedStyle(part); return { tag: part.tagName, text: part.textContent?.replace(/\s+/g, ' ').trim(), class: part.className, role: part.getAttribute('role'), slot: part.getAttribute('data-slot'), width: rect.width, height: rect.height, color: style.color, fontSize: style.fontSize }; }),
    };
  });
}
test('bounded Basic preserves the genuine native scaffold hosts through SSR hydration', async ({ page, context }) => {
  const reference = await context.newPage();
  const pairs = [[page, '/alert'], [reference, '/alert-reference']] as const; const errors: string[] = [];
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  for (const [current] of pairs) {
    current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await current.route('**/*', async requestRoute => { if (requestRoute.request().resourceType() === 'script') await gate; await requestRoute.continue(); });
  }
  try {
    const captured = [];
    for (const [current, route] of pairs) {
      await current.goto(route, { waitUntil: 'commit' }); await expect(current.locator('[data-alert-gallery]')).toHaveAttribute('data-hydrated', 'false');
      const hosts = await current.locator(galleryHosts).elementHandles(); expect(hosts).toHaveLength(12);
      const shell = await current.locator('[data-alert-gallery]').evaluateHandle(node => node.parentElement!); captured.push({ current, hosts, shell });
    }
    const before = await galleryTree(page); expect(before).toEqual(await galleryTree(reference)); release();
    for (const { current, hosts, shell } of captured) {
      await expect(current.locator('[data-alert-gallery]')).toHaveAttribute('data-hydrated', 'true');
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: galleryHosts, index })).toBe(true);
      expect(await shell.evaluate(node => node.isConnected && node === document.querySelector('[data-alert-gallery]')?.parentElement)).toBe(true);
      expect(await galleryTree(current)).toEqual(before.map(node => ({ ...node, attrs: { ...node.attrs, ...(node.attrs['data-hydrated'] === 'false' ? { 'data-hydrated': 'true' } : {}) } })));
      await expect(current.locator('[data-alert-gallery] section, [data-alert-gallery] h2')).toHaveCount(0);
    }
    expect(errors).toEqual([]);
  } finally { release(); await reference.close(); }
});
test('bounded Basic preserves genuine paired responsive layout, text, roles and source dark/Lyra/Sera variants', async ({ page, context }) => {
  const reference = await context.newPage(); const errors: string[] = [];
  for (const current of [page, reference]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
  for (const width of [390, 640, 768, 1024, 1280, 1536]) {
    for (const current of [page, reference]) await current.setViewportSize({ width, height: 1000 });
    await page.goto('/alert'); await reference.goto('/alert-reference');
    for (const current of [page, reference]) {
      await expect(current.locator('[data-alert-gallery]')).toHaveAttribute('data-hydrated', 'true');
      await expect(current.locator('[data-alert-gallery] [role="alert"]')).toHaveCount(3);
      await expect(current.locator('[data-alert-gallery] [data-slot="alert-title"]')).toHaveCount(2);
      await expect(current.locator('[data-alert-gallery] [data-slot="alert-description"]')).toHaveCount(2);
      await expect(current.locator('[data-alert-gallery] section, [data-alert-gallery] h2')).toHaveCount(0);
    }
    expect(await galleryTree(page)).toEqual(await galleryTree(reference));
    const actual = await galleryLayout(page); expect(actual).toEqual(await galleryLayout(reference));
    expect(actual.tag).toBe('DIV'); expect(actual.shellTag).toBe('DIV'); expect(actual.shellClass).toBe('w-full bg-muted dark:bg-background');
    expect(actual.class.split(' ')).toContain('lg:grid-cols-1'); expect(actual.columns.split(' ')).toHaveLength(width >= 768 && width < 1024 ? 2 : 1);
    expect(actual.maxWidth).toBe(width >= 1536 ? '1152px' : '1024px'); expect(actual.contentPadding).toBe('48px');
    expect(actual.exampleTag).toBe('DIV'); expect(actual.titleTag).toBe('DIV'); expect(actual.title).toBe('Basic'); expect(actual.contentTag).toBe('DIV');
    expect(actual.bodyClass).toBe('mx-auto flex w-full max-w-lg flex-col gap-4'); expect(actual.bodyWidth).toBe(Math.min(actual.contentWidth, parseFloat(actual.bodyMaxWidth)));
    for (const current of [page, reference]) await current.evaluate(() => { document.documentElement.style.setProperty('--muted', 'rgb(10, 20, 30)'); document.documentElement.style.setProperty('--background', 'rgb(40, 50, 60)'); });
    expect((await galleryLayout(page)).shellBackground).toBe('rgb(10, 20, 30)');
    for (const current of [page, reference]) await current.evaluate(() => document.documentElement.classList.add('dark'));
    expect(await galleryLayout(page)).toEqual(await galleryLayout(reference)); expect((await galleryLayout(page)).shellBackground).toBe('rgb(40, 50, 60)');
    for (const style of ['style-lyra', 'style-sera']) {
      for (const current of [page, reference]) await current.evaluate(styleClass => { document.documentElement.classList.remove('style-lyra', 'style-sera'); document.documentElement.classList.add(styleClass); }, style);
      expect(await galleryLayout(page)).toEqual(await galleryLayout(reference)); expect((await galleryLayout(page)).contentRadius).toBe('0px');
    }
  }
  expect(errors).toEqual([]); await reference.close();
});
