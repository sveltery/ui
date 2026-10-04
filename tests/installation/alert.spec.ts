import { expect, test/* alert-observation:start */, type Page/* alert-observation:end */ } from '@playwright/test';/* alert-observation:start */
import { writeFileSync } from 'node:fs';/* alert-observation:end */
import { alertLifecycleCases, alertNativeAssertions, alertState } from '../browser/alert-cases';
import { alertGallery, alertHTMLHosts, alertLibraries, alertStyles, alertWidths, alertTheme, settledAlert, alertGalleryTree, alertLinkPointerMeasurements, alertSelectionMeasurements/* alert-observation:start */, alertSelectionWitness/* alert-observation:end */, assertAlertGallery, assertAlertNativeLinks } from '../browser/alert-gallery-cases';
alertLifecycleCases();
const basicExample = '[data-alert-gallery] > [data-slot="example"]:first-child';
test('fresh archive/source-copy Alert parts retain native actions/variants/Nova rules and bounded Basic composition', async ({ page, request }, testInfo) => {
  const html = await (await request.get('/alert')).text(); expect(html).toContain('cn-alert'); expect(html).toContain('Success! Your changes have been saved.'); expect(html).toContain('Basic');
  const errors: string[] = []; const diagnostics: Array<Promise<unknown>> = []; const failedScripts: Array<unknown> = []; const stages: Array<unknown> = [];
  const started = performance.now(); let stage = 'initial'; let failed = false;
  const path = (url: string) => url ? new URL(url, 'http://127.0.0.1').pathname : '';
  const stamp = () => ({ elapsedMs: performance.now() - started, path: path(page.url()), stage });
  const markStage = (next: string) => { stage = next; stages.push(stamp()); };
  page.on('framenavigated', frame => { if (frame === page.mainFrame()) stages.push({ ...stamp(), event: 'navigation-commit' }); });
  page.on('pageerror', error => { errors.push(error.message); diagnostics.push(Promise.resolve({ ...stamp(), name: error.name, message: error.message, stack: error.stack })); });
  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
      const event = stamp();
      const location = { ...message.location(), url: path(message.location().url) };
      diagnostics.push(Promise.all(message.args().map(argument => argument.evaluate(value => value instanceof Error ? { name: value.name, message: value.message, stack: value.stack } : { type: typeof value })))
        .then(args => ({ ...event, text: message.text(), location, args })).catch(error => ({ ...event, diagnosticFailure: String(error) })));
    }
  });
  page.on('requestfailed', request => { if (request.resourceType() === 'script') failedScripts.push({ ...stamp(), script: path(request.url()), error: request.failure()?.errorText }); });
  try {
    for (const width of [1280, 390]) {
      markStage(`native-probe-${width}`);
      await page.setViewportSize({ width, height: 1400 }); await page.goto('/alert-probe');
      await expect(page.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'true'); await alertNativeAssertions(page);
      expect((await alertState(page)).refs).toEqual(['probe-alert', 'probe-title', 'probe-description', 'probe-action']);
      markStage(`gallery-${width}-navigation`);
      await page.goto('/alert'); await expect(page.locator('[data-alert-gallery]')).toHaveAttribute('data-hydrated', 'true'); markStage(`gallery-${width}-hydration-complete`);
      await expect(page.locator(`${basicExample} [role="alert"]`)).toHaveCount(3);
      await expect(page.locator(`${basicExample} [data-slot="alert-title"]`)).toHaveCount(2); await expect(page.locator(`${basicExample} [data-slot="alert-description"]`)).toHaveCount(2);
    }
    // Authored source-derived composition witnesses run against each actual fresh consumer mode.
    expect(html).toContain('data-slot="example-wrapper"'); expect(html).toContain('data-slot="example-content"'); expect(html).toContain('lg:grid-cols-1');
    const hostsSelector = `[data-alert-gallery], ${basicExample}, ${basicExample} *`;
    let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*', async requestRoute => { if (requestRoute.request().resourceType() === 'script') await gate; await requestRoute.continue(); });
    try {
      markStage('gated-SSR-navigation');
      await page.goto('/alert', { waitUntil: 'commit' }); await expect(page.locator('[data-alert-gallery]')).toHaveAttribute('data-hydrated', 'false');
      markStage('gated-SSR-confirmed');
      const hosts = await page.locator(hostsSelector).elementHandles(); expect(hosts).toHaveLength(12);
      const shell = await page.locator('[data-alert-gallery]').evaluateHandle(node => node.parentElement!);
      markStage('released-hydration'); release(); await expect(page.locator('[data-alert-gallery]')).toHaveAttribute('data-hydrated', 'true'); markStage('gated-gallery-hydration-complete');
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: hostsSelector, index })).toBe(true);
      expect(await shell.evaluate(node => node.isConnected && node === document.querySelector('[data-alert-gallery]')?.parentElement)).toBe(true);
    } finally { release(); await page.unroute('**/*'); }
    for (const width of [390, 640, 768, 1024, 1536]) {
      markStage(`layout-${width}-navigation`);
      await page.setViewportSize({ width, height: 1400 }); await page.goto('/alert'); await expect(page.locator('[data-alert-gallery]')).toHaveAttribute('data-hydrated', 'true'); markStage(`layout-${width}-hydration-complete`);
      await expect(page.locator(`${basicExample} [role="alert"]`)).toHaveCount(3);
      await expect(page.locator(`${basicExample} [data-slot="alert-title"]`)).toHaveCount(2); await expect(page.locator(`${basicExample} [data-slot="alert-description"]`)).toHaveCount(2);
      await expect(page.locator('[data-alert-gallery] section, [data-alert-gallery] h2')).toHaveCount(0);
      const geometry = () => page.locator('[data-alert-gallery]').evaluate(node => {
        const shell = node.parentElement!; const css = getComputedStyle(node); const example = node.firstElementChild!;
        const title = example.firstElementChild!; const content = example.lastElementChild!; const body = content.firstElementChild!; const contentCss = getComputedStyle(content);
        return { tag: node.tagName, class: node.className, shellTag: shell.tagName, shellClass: shell.className, shellBackground: getComputedStyle(shell).backgroundColor,
          columns: css.gridTemplateColumns.split(' ').length, maxWidth: css.maxWidth, exampleTag: example.tagName, titleTag: title.tagName, title: title.textContent,
          contentTag: content.tagName, contentPadding: contentCss.padding, radius: contentCss.borderRadius,
          contentWidth: content.getBoundingClientRect().width - parseFloat(contentCss.paddingLeft) - parseFloat(contentCss.paddingRight), bodyClass: body.className, bodyWidth: body.getBoundingClientRect().width, bodyMaxWidth: getComputedStyle(body).maxWidth };
      });
      const actual = await geometry(); expect(actual.tag).toBe('DIV'); expect(actual.shellTag).toBe('DIV'); expect(actual.shellClass).toBe('w-full bg-muted dark:bg-background');
      expect(actual.class.split(' ')).toContain('lg:grid-cols-1'); expect(actual.columns).toBe(width >= 768 && width < 1024 ? 2 : 1); expect(actual.maxWidth).toBe(width >= 1536 ? '1152px' : '1024px');
      expect(actual.exampleTag).toBe('DIV'); expect(actual.titleTag).toBe('DIV'); expect(actual.title).toBe('Basic'); expect(actual.contentTag).toBe('DIV'); expect(actual.contentPadding).toBe('48px');
      expect(actual.bodyClass).toBe('mx-auto flex w-full max-w-lg flex-col gap-4'); expect(actual.bodyWidth).toBe(Math.min(actual.contentWidth, parseFloat(actual.bodyMaxWidth)));
      for (const title of await page.locator(`${basicExample} [data-slot="alert-title"]`).all()) await expect(title).toHaveText('Success! Your changes have been saved.');
      await expect(page.locator(`${basicExample} [data-slot="alert-description"]`).nth(0)).toHaveText('This is an alert with title and description.');
      await expect(page.locator(`${basicExample} [data-slot="alert-description"]`).nth(1)).toHaveText('This one has a description only. No title. No icon.');
      await page.evaluate(() => { document.documentElement.style.setProperty('--muted', 'rgb(10, 20, 30)'); document.documentElement.style.setProperty('--background', 'rgb(40, 50, 60)'); });
      expect((await geometry()).shellBackground).toBe('rgb(10, 20, 30)'); await page.evaluate(() => document.documentElement.classList.add('dark')); expect((await geometry()).shellBackground).toBe('rgb(40, 50, 60)');
      for (const style of ['style-lyra', 'style-sera']) {
        await page.evaluate(styleClass => { document.documentElement.classList.remove('style-lyra', 'style-sera'); document.documentElement.classList.add(styleClass); }, style);
        expect((await geometry()).radius).toBe('0px');
      }
    }
    expect(errors).toEqual([]);
  } catch (error) {
    failed = true; throw error;
  } finally {
    if (failed || errors.length || failedScripts.length) await testInfo.attach('alert-console-and-script-failures', { body: JSON.stringify({ errors, diagnostics: await Promise.all(diagnostics), failedScripts, stages }, null, 2), contentType: 'application/json' });
  }
});

test('fresh archive/source-copy three-body Alert gallery retains all 50 settled SSR HTML hosts while eight canonical glyphs settle', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/alert'); await settledAlert(page); await page.waitForLoadState('networkidle');
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; }); const gatedScripts: string[] = [];
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') { gatedScripts.push(route.request().url()); await gate; } await route.continue(); });
  try {
    await page.goto('/alert', { waitUntil: 'commit' }); await expect(page.locator(alertGallery)).toHaveAttribute('data-hydrated', 'false');
    const hosts = await page.locator(alertHTMLHosts).elementHandles(); expect(hosts).toHaveLength(50);
    await expect(page.locator(`${alertGallery} svg`)).toHaveCount(8);
    await expect(page.locator(`${alertGallery} svg.lucide-square`)).toHaveCount(0);
    const before = await alertGalleryTree(page); await expect.poll(() => gatedScripts.length).toBeGreaterThan(0);
    release(); await settledAlert(page);
    for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: alertHTMLHosts, index })).toBe(true);
    expect(await alertGalleryTree(page)).toEqual(JSON.parse(JSON.stringify(before).replace('"data-hydrated":"false"', '"data-hydrated":"true"')));
    expect(errors).toEqual([]);
  } finally { release(); }
});

for (const library of alertLibraries) test(`fresh archive/source-copy original Alert2/3 delivers canonical ${library} glyphs in every scoped style and mode`, async ({ page }) => {
  test.setTimeout(120_000); // Each real library exercises all 96 source style/mode/breakpoint combinations.
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`/alert?library=${library}`); await settledAlert(page);
  for (const style of alertStyles) for (const dark of [false, true]) for (const width of alertWidths) await test.step(`${style} ${dark ? 'dark' : 'light'} ${width}px`, async () => {
    await page.setViewportSize({ width, height: 1800 }); await alertTheme(page, style, dark); await assertAlertGallery(page, width, style, library);
  });
  await assertAlertNativeLinks(page); expect(errors).toEqual([]);
});

test('fresh archive/source-copy all four Alert anchors retain paired original held and released pointer opacity at md', async ({ page, context }) => {
  const original = await context.newPage();
  try {
    await page.goto('/alert'); await original.goto('http://127.0.0.1:5175/alert');
    await settledAlert(page); await settledAlert(original);
    for (const width of [390, 767, 768, 1280]) await test.step(`${width}px actual fresh consumer and original pointers`, async () => {
      for (const current of [page, original]) { await current.setViewportSize({ width, height: 1800 }); await alertTheme(current, 'nova', false); }
      expect(await alertLinkPointerMeasurements(page, width)).toEqual(await alertLinkPointerMeasurements(original, width));
    });
  } finally { await original.close(); }
});


test('fresh archive/source-copy actual Alert selection and root overscroll retain original light/dark globals', async ({ page, context }/* alert-observation:start */, testInfo/* alert-observation:end */) => {
/* alert-observation:start */  const witness = alertSelectionWitness(testInfo, 'fresh-consumer');
  let viewportFailure: unknown = null;
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
    for (const style of alertStyles) for (const dark of [false, true]) for (const width of [390, 1280]) await test.step(`${style} ${dark ? 'dark' : 'light'} ${width}px actual fresh selection and root`, async () => {
/* alert-observation:start */      witness.scene(style, dark, width);
/* alert-observation:end */      const viewportResults = await Promise.allSettled([page, original].map(async current => { /* alert-observation:start */observePage(current)('viewport', false); /* alert-observation:end */await current.setViewportSize({ width, height: 900 }); /* alert-observation:start */observePage(current)('viewport', true); /* alert-observation:end */ }));
      const firstViewportFailure = viewportResults.find(result => result.status === 'rejected');
      if (firstViewportFailure) {/* alert-observation:start */
        try {
          viewportFailure = { style, dark, width, outcomes: viewportResults.map((result, index) => ({ page: index === 0 ? 'native' : 'original', status: result.status, ...(result.status === 'rejected' ? { reason: result.reason instanceof Error ? { name: result.reason.name, message: result.reason.message, stack: result.reason.stack } : { type: typeof result.reason, message: String(result.reason) } } : { valueWasUndefined: result.value === undefined }) })) };
        } catch (captureError) { console.error('Viewport settled failure observation unavailable', captureError); }
/* alert-observation:end */        throw firstViewportFailure.reason;
      }
      for (const current of [page, original]) { await alertTheme(current, style, dark/* alert-observation:start */, observePage(current)/* alert-observation:end */); }
      expect(await alertSelectionMeasurements(page, dark/* alert-observation:start */, observePage(page)/* alert-observation:end */)).toEqual(await alertSelectionMeasurements(original, dark/* alert-observation:start */, observePage(original)/* alert-observation:end */));/* alert-observation:start */
      witness.completedPair();/* alert-observation:end */
    });
  } finally { /* alert-observation:start */witness.observe('original-page-close', false); /* alert-observation:end */await original.close(); /* alert-observation:start */witness.observe('original-page-close', true); /* alert-observation:end */}/* alert-observation:start */
  } catch (error) {
    await witness.capture(error);
    if (viewportFailure) {
      try {
        const path = testInfo.outputPath('alert-viewport-settled-failures.json');
        writeFileSync(path, JSON.stringify({ classification: 'authored-failure-only-both-settled-viewport-outcomes', phase: 'fresh-consumer', project: testInfo.project.name, title: testInfo.title, viewportFailure, limits: 'Both actual Page promises settled before cleanup; rejected viewport is not completed. Actual first rejected reason is rethrown in native/original order. No raw Selection or acceptance data.' }, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
        await testInfo.attach('alert-viewport-settled-failures', { path, contentType: 'application/json' });
      } catch (captureError) { console.error('Viewport settled failure physical capture unavailable', captureError); }
    }
    throw error;
  }/* alert-observation:end */
});

for (const library of alertLibraries) test(`fresh public Alert ESM displays eight genuine Square fallbacks until its ${library} module resolves`, async ({ page }, testInfo) => {
  const errors: string[] = []; const intercepted: string[] = [];
  page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  // Archive builds use hashed public chunks; source-copy retains the original
  // module basename. Both patterns hold real selected-library data imports.
  await page.route(new RegExp(`/${library}(?:-[^/?]+)?\\.js(?:\\?.*)?$`), async route => { intercepted.push(route.request().url()); await gate; await route.continue(); });
  try {
    await page.goto(`/alert?library=${library}`, { waitUntil: 'domcontentloaded' }); await expect(page.locator(alertGallery)).toHaveAttribute('data-hydrated', 'true');
    await expect.poll(() => intercepted.length).toBeGreaterThan(0);
    await expect(page.locator(`${alertGallery} [data-slot=alert] > svg.lucide-square`)).toHaveCount(8);
    await expect(page.locator(`${alertGallery} svg`)).toHaveCount(8);
    expect(await page.locator(`${alertGallery} svg.lucide-square rect`).evaluateAll(nodes => nodes.map(node => ({ width: node.getAttribute('width'), height: node.getAttribute('height'), x: node.getAttribute('x'), y: node.getAttribute('y'), rx: node.getAttribute('rx') })))).toEqual(Array(8).fill({ width: '18', height: '18', x: '3', y: '3', rx: '2' }));
    const delayedRequests = structuredClone(intercepted); release(); await settledAlert(page);
    await alertTheme(page, 'nova', false); await assertAlertGallery(page, 1280, 'nova', library);
    expect(errors).toEqual([]);
    const diagnostics = { library, delayedRequests, allRequests: intercepted, moduleURLs: [...new Set(intercepted)] };
    expect(diagnostics.moduleURLs).toHaveLength(1);
    console.info(`Fresh Alert delayed-module diagnostics: ${JSON.stringify(diagnostics)}`);
    await testInfo.attach('delayed-genuine-fresh-alert-icon-modules', { body: JSON.stringify(diagnostics), contentType: 'application/json' });
  } finally { release(); }
});
