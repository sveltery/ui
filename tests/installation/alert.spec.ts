import { expect, test } from '@playwright/test';
import { alertLifecycleCases, alertNativeAssertions, alertState } from '../browser/alert-cases';
alertLifecycleCases();
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
      await expect(page.locator('[data-alert-gallery] [role="alert"]')).toHaveCount(3);
      await expect(page.locator('[data-alert-gallery] [data-slot="alert-title"]')).toHaveCount(2); await expect(page.locator('[data-alert-gallery] [data-slot="alert-description"]')).toHaveCount(2);
    }
    // Authored source-derived composition witnesses run against each actual fresh consumer mode.
    expect(html).toContain('data-slot="example-wrapper"'); expect(html).toContain('data-slot="example-content"'); expect(html).toContain('lg:grid-cols-1');
    const hostsSelector = '[data-alert-gallery], [data-alert-gallery] *';
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
      await expect(page.locator('[data-alert-gallery] [role="alert"]')).toHaveCount(3);
      await expect(page.locator('[data-alert-gallery] [data-slot="alert-title"]')).toHaveCount(2); await expect(page.locator('[data-alert-gallery] [data-slot="alert-description"]')).toHaveCount(2);
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
      for (const title of await page.locator('[data-alert-gallery] [data-slot="alert-title"]').all()) await expect(title).toHaveText('Success! Your changes have been saved.');
      await expect(page.locator('[data-alert-gallery] [data-slot="alert-description"]').nth(0)).toHaveText('This is an alert with title and description.');
      await expect(page.locator('[data-alert-gallery] [data-slot="alert-description"]').nth(1)).toHaveText('This one has a description only. No title. No icon.');
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
