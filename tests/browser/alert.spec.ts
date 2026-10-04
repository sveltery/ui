// Supplemental source-derived comparisons executing actual immutable wrappers, not an upstream test-port inventory.
import { expect, test, type Page } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { alertLifecycleCases, alertNativeAssertions } from './alert-cases';
import { alertGallery, alertHTMLHosts, alertLibraries, alertStyles, alertWidths, alertTheme, settledAlert, alertGalleryTree, alertGalleryMeasurements, alertInlineTypographyDiagnostics, alertLongTextMeasurements, alertLinkPointerMeasurements, alertSelectionMeasurements/* alert-observation:start */, alertSelectionWitness/* alert-observation:end */, assertAlertGallery, assertAlertNativeLinks } from './alert-gallery-cases';
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
const basicExample = '[data-alert-gallery] > [data-slot="example"]:first-child';
const galleryHosts = `[data-alert-gallery], ${basicExample}, ${basicExample} *`;
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
      await expect(current.locator(`${basicExample} [role="alert"]`)).toHaveCount(3);
      await expect(current.locator(`${basicExample} [data-slot="alert-title"]`)).toHaveCount(2);
      await expect(current.locator(`${basicExample} [data-slot="alert-description"]`)).toHaveCount(2);
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

test('all three genuine Alert bodies preserve the 50 native SSR hosts while canonical glyphs settle through hydration', async ({ page, context }) => {
  const reference = await context.newPage(); const pairs = [[page, '/alert'], [reference, '/alert-reference']] as const;
  const errors: string[] = []; const gatedScripts = { native: [] as string[], reference: [] as string[] };
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  for (const [current] of pairs) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
  try {
    for (const [current, route] of pairs) { await current.goto(route); await settledAlert(current); await current.waitForLoadState('networkidle'); }
    for (const [index, [current]] of pairs.entries()) await current.route('**/*', async route => {
      if (route.request().resourceType() === 'script') { gatedScripts[index === 0 ? 'native' : 'reference'].push(route.request().url()); await gate; }
      await route.continue();
    });
    const captured = [];
    for (const [current, route] of pairs) {
      await current.goto(route, { waitUntil: 'commit' }); await expect(current.locator(alertGallery)).toHaveAttribute('data-hydrated', 'false');
      const hosts = await current.locator(alertHTMLHosts).elementHandles(); expect(hosts).toHaveLength(50);
      await expect(current.locator(`${alertGallery} svg`)).toHaveCount(8);
      await expect(current.locator(`${alertGallery} svg.lucide-square`)).toHaveCount(0);
      captured.push({ current, hosts });
    }
    const before = await alertGalleryTree(page); expect(before).toEqual(await alertGalleryTree(reference));
    await expect.poll(() => gatedScripts.native.length).toBeGreaterThan(0); await expect.poll(() => gatedScripts.reference.length).toBeGreaterThan(0);
    release();
    for (const { current, hosts } of captured) {
      await settledAlert(current);
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: alertHTMLHosts, index })).toBe(true);
      expect(await alertGalleryTree(current)).toEqual(JSON.parse(JSON.stringify(before).replace('"data-hydrated":"false"', '"data-hydrated":"true"')));
    }
    expect(errors).toEqual([]);
  } finally { release(); await reference.close(); }
});

for (const library of alertLibraries) test(`three original Alert bodies and canonical ${library} glyphs match full original CSS in all eight styles and modes`, async ({ page, context }, testInfo) => {
  test.setTimeout(180_000); // All 96 style/mode/breakpoint combinations use actual source and real library modules.
  const original = await context.newPage(); const errors: string[] = [];
  for (const current of [page, original]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
  try {
    await page.goto(`/alert?library=${library}`); await original.goto(`http://127.0.0.1:5175/alert?library=${library}`);
    await settledAlert(page); await settledAlert(original);
    expect(await alertGalleryTree(page)).toEqual(await alertGalleryTree(original));
    for (const style of alertStyles) for (const dark of [false, true]) for (const width of alertWidths) await test.step(`${style} ${dark ? 'dark' : 'light'} ${width}px`, async () => {
      for (const current of [page, original]) { await current.setViewportSize({ width, height: 1800 }); await alertTheme(current, style, dark); await assertAlertGallery(current, width, style, library); }
      expect(await alertGalleryTree(page)).toEqual(await alertGalleryTree(original));
      const nativeMeasurements = await alertGalleryMeasurements(page);
      const originalMeasurements = await alertGalleryMeasurements(original);
      try { expect(nativeMeasurements).toEqual(originalMeasurements); }
      catch (assertionError) {
        try {
          const trace = { library, style, dark, width, differingMeasurements: nativeMeasurements.flatMap((native, index) => JSON.stringify(native) === JSON.stringify(originalMeasurements[index]) ? [] : [{ index, native, original: originalMeasurements[index] }]), native: await alertInlineTypographyDiagnostics(page), original: await alertInlineTypographyDiagnostics(original) };
          const body = JSON.stringify(trace, null, 2);
          console.log(`Authored Alert strict geometry failure observations: ${body}`);
          const path = testInfo.outputPath('alert-strict-geometry-failure-observations.json');
          await writeFile(path, body);
          await testInfo.attach('alert-strict-geometry-failure-observations', { path, contentType: 'application/json' });
        } catch (diagnosticError) { console.log(`Authored Alert diagnostic capture failed: ${String(diagnosticError)}`); }
        throw assertionError;
      }
      expect(await alertLongTextMeasurements(page)).toEqual(await alertLongTextMeasurements(original));
    });
    for (const current of [page, original]) await assertAlertNativeLinks(current);
    expect(errors).toEqual([]);
  } finally { await original.close(); }
});

test('all four original Alert anchors preserve paired held and released pointer opacity below, at and above md', async ({ page, context }) => {
  const original = await context.newPage();
  try {
    await page.goto('/alert'); await original.goto('http://127.0.0.1:5175/alert');
    await settledAlert(page); await settledAlert(original);
    for (const width of [390, 767, 768, 1280]) await test.step(`${width}px actual native and original pointers`, async () => {
      for (const current of [page, original]) { await current.setViewportSize({ width, height: 1800 }); await alertTheme(current, 'nova', false); }
      expect(await alertLinkPointerMeasurements(page, width)).toEqual(await alertLinkPointerMeasurements(original, width));
    });
  } finally { await original.close(); }
});


test('actual Alert text selection and document overscroll preserve original light/dark globals', async ({ page, context }/* alert-observation:start */, testInfo/* alert-observation:end */) => {
/* alert-observation:start */  const witness = alertSelectionWitness(testInfo, 'main');
  const observePage = (current: Page) => (stage: string, completed: boolean, raw?: unknown) => witness.observe(`${current === page ? 'native' : 'original'}:${stage}`, completed, raw);
  try {
  witness.observe('original-page-creation', false);
/* alert-observation:end */  const original = await context.newPage();
/* alert-observation:start */  witness.observe('original-page-creation', true);
/* alert-observation:end */  try {
/* alert-observation:start */    witness.observe('native:navigation', false);
/* alert-observation:end */    await page.goto('/alert'); /* alert-observation:start */witness.observe('native:navigation', true); witness.observe('original:navigation', false); /* alert-observation:end */await original.goto('http://127.0.0.1:5175/alert');/* alert-observation:start */
    witness.observe('original:navigation', true);/* alert-observation:end */
    await settledAlert(page/* alert-observation:start */, observePage(page)/* alert-observation:end */); await settledAlert(original/* alert-observation:start */, observePage(original)/* alert-observation:end */);
    for (const style of alertStyles) for (const dark of [false, true]) for (const width of [390, 1280]) await test.step(`${style} ${dark ? 'dark' : 'light'} ${width}px actual selection and root`, async () => {
/* alert-observation:start */      witness.scene(style, dark, width);
/* alert-observation:end */      for (const current of [page, original]) { /* alert-observation:start */observePage(current)('viewport', false); /* alert-observation:end */await current.setViewportSize({ width, height: 900 }); /* alert-observation:start */observePage(current)('viewport', true); /* alert-observation:end */await alertTheme(current, style, dark/* alert-observation:start */, observePage(current)/* alert-observation:end */); }
      expect(await alertSelectionMeasurements(page, dark/* alert-observation:start */, observePage(page)/* alert-observation:end */)).toEqual(await alertSelectionMeasurements(original, dark/* alert-observation:start */, observePage(original)/* alert-observation:end */));/* alert-observation:start */
      witness.completedPair();/* alert-observation:end */
    });
  } finally { /* alert-observation:start */witness.observe('original-page-close', false); /* alert-observation:end */await original.close(); /* alert-observation:start */witness.observe('original-page-close', true); /* alert-observation:end */}/* alert-observation:start */
  } catch (error) { await witness.capture(error); throw error; }/* alert-observation:end */
});

for (const library of alertLibraries) test(`both genuine Alert galleries show eight original Square glyphs while actual ${library} modules are held`, async ({ page, context }, testInfo) => {
  const reference = await context.newPage(); const errors: string[] = [];
  const intercepted = { native: [] as string[], reference: [] as string[] };
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  for (const current of [page, reference]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); }
  await page.route(`**/icons/generated/${library}.js*`, async route => { intercepted.native.push(route.request().url()); await gate; await route.continue(); });
  await reference.route(`**/reference/icons/__${library}__.ts*`, async route => { intercepted.reference.push(route.request().url()); await gate; await route.continue(); });
  try {
    // The ordinary React route deliberately serves settled all-ready SSR. The
    // independent client document exposes the original Suspense loading branch.
    await page.goto(`/alert?library=${library}`, { waitUntil: 'domcontentloaded' }); await reference.goto(`http://127.0.0.1:5175/alert?library=${library}`, { waitUntil: 'domcontentloaded' });
    for (const current of [page, reference]) await expect(current.locator(alertGallery)).toHaveAttribute('data-hydrated', 'true');
    await expect.poll(() => intercepted.native.length).toBeGreaterThan(0); await expect.poll(() => intercepted.reference.length).toBeGreaterThan(0);
    for (const current of [page, reference]) {
      await alertTheme(current, 'nova', false);
      await expect(current.locator(`${alertGallery} svg`)).toHaveCount(8);
      await expect(current.locator(`${alertGallery} [data-slot=alert] > svg.lucide-square`)).toHaveCount(8);
      expect(await current.locator(`${alertGallery} svg.lucide-square rect`).evaluateAll(nodes => nodes.map(node => ({ width: node.getAttribute('width'), height: node.getAttribute('height'), x: node.getAttribute('x'), y: node.getAttribute('y'), rx: node.getAttribute('rx') })))).toEqual(Array(8).fill({ width: '18', height: '18', x: '3', y: '3', rx: '2' }));
    }
    expect(await alertGalleryTree(page)).toEqual(await alertGalleryTree(reference));
    expect(await alertGalleryMeasurements(page)).toEqual(await alertGalleryMeasurements(reference));
    const moduleURLs = { native: [...new Set(intercepted.native)], reference: [...new Set(intercepted.reference)] };
    expect(moduleURLs.native).toHaveLength(1); expect(moduleURLs.reference).toHaveLength(1);
    expect(moduleURLs.native[0]).toContain(`/icons/generated/${library}.js`); expect(moduleURLs.reference[0]).toContain(`/reference/icons/__${library}__.ts`);
    const delayedRequests = structuredClone(intercepted);
    release(); await settledAlert(page); await settledAlert(reference);
    for (const current of [page, reference]) await assertAlertGallery(current, 1280, 'nova', library);
    expect(await alertGalleryTree(page)).toEqual(await alertGalleryTree(reference));
    expect(await alertGalleryMeasurements(page)).toEqual(await alertGalleryMeasurements(reference)); expect(errors).toEqual([]);
    const diagnostics = { library, delayedRequests, allRequests: intercepted, moduleURLs, requestCountCacheTimingEquivalence: false };
    console.info(`Alert delayed-module diagnostics: ${JSON.stringify(diagnostics)}`);
    await testInfo.attach('delayed-genuine-alert-icon-modules', { body: JSON.stringify(diagnostics), contentType: 'application/json' });
  } finally { release(); await reference.close(); }
});
