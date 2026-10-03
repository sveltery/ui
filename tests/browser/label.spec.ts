import { expect, test, type Page } from '@playwright/test';
import { labelLifecycleCases, labelNativeAssertions } from './label-cases';
import { captureLabelFailure } from './label-failure-diagnostics';
// Source-derived probes, not copied upstream assertions; see label-sources.json.
labelLifecycleCases();
async function labelSnapshot(page: Page) {
  return page.locator('[data-label-probe] label, [data-label-probe] input').evaluateAll(nodes => nodes.map(node => ({
    tag: node.tagName,
    attrs: Object.fromEntries([...node.attributes].filter(attr => !['data-probed', 'style'].includes(attr.name)).map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))),
    style: (node as HTMLElement).style.cssText,
    text: node.textContent,
  })));
}
async function measurements(page: Page) {
  return page.locator('[data-label-probe] label').evaluateAll(nodes => nodes.map(node => {
    const css = getComputedStyle(node); const rect = node.getBoundingClientRect();
    return { width: rect.width, height: rect.height, gap: css.gap, display: css.display, fontSize: css.fontSize, fontWeight: css.fontWeight, lineHeight: css.lineHeight, opacity: css.opacity, pointerEvents: css.pointerEvents, cursor: css.cursor, userSelect: css.userSelect, color: css.color };
  }));
}
test('paired pinned React and Svelte SSR labels and associated inputs retain identity through hydration', async ({ page, context }) => {
  const reference = await context.newPage();
  const pairs = [[page, '/label-probe'], [reference, '/label-probe-reference']] as const;
  const errors: string[] = [];
  for (const [current] of pairs) {
    current.on('pageerror', error => errors.push(error.message));
    current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  }
  await Promise.all(pairs.map(async ([current, route]) => { await current.goto(route); await expect(current.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'true'); }));
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  const selector = '[data-label-probe] label, [data-label-probe] input';
  for (const [current] of pairs) await current.route('**/*', async requestRoute => { if (requestRoute.request().resourceType() === 'script') await gate; await requestRoute.continue(); });
  try {
    const captured = [];
    for (const [current, route] of pairs) {
      await current.goto(route, { waitUntil: 'commit' });
      await expect(current.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'false');
      const hosts = await current.locator(selector).elementHandles();
      expect(hosts.length).toBeGreaterThan(20); captured.push({ current, hosts });
      expect(await current.locator('#probe-label').evaluate(node => (node as HTMLLabelElement).control === document.querySelector('#probe-first'))).toBe(true);
    }
    expect(captured[0].hosts.length).toBe(captured[1].hosts.length);
    const before = await labelSnapshot(page); expect(before).toEqual(await labelSnapshot(reference));
    release();
    for (const { current, hosts } of captured) {
      await expect(current.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'true');
      expect(await current.locator(selector).count()).toBe(hosts.length);
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector, index })).toBe(true);
      expect(await labelSnapshot(current)).toEqual(before);
    }
    expect(await labelSnapshot(page)).toEqual(await labelSnapshot(reference)); expect(errors).toEqual([]);
  } finally { release(); await reference.close(); }
});
for (const width of [1280, 390]) for (const theme of ['light', 'dark']) test(`paired native Label association, reactive props and exact Nova selectors at ${width}px ${theme}`, async ({ page, context }, testInfo) => {
  const reference = await context.newPage();
  const errors: string[] = [];
  for (const current of [page, reference]) {
    current.on('pageerror', error => errors.push(error.message));
    current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await current.setViewportSize({ width, height: 1100 });
  }
  await page.goto('/label-probe'); await reference.goto('/label-probe-reference');
  for (const current of [page, reference]) {
    await expect(current.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'true');
    if (theme === 'dark') await current.evaluate(() => document.documentElement.classList.add('dark'));
  }
  expect(await labelSnapshot(page)).toEqual(await labelSnapshot(reference));
  expect(await measurements(page)).toEqual(await measurements(reference));
  const observedPages = [
    { environment: 'svelte-production', page },
    { environment: 'pinned-react-production', page: reference },
  ];
  for (const { environment, page: current } of observedPages) {
    try {
      await labelNativeAssertions(current);
    } catch (failure) {
      try { await captureLabelFailure(testInfo, environment, observedPages, failure, errors); }
      catch (diagnosticFailure) { console.log('LABEL_ASSOCIATION_DIAGNOSTIC_FAILURE', String(diagnosticFailure)); }
      // Diagnostics must preserve the original strict assertion failure.
      throw failure;
    }
  }
  expect(await labelSnapshot(page)).toEqual(await labelSnapshot(reference));
  expect(await measurements(page)).toEqual(await measurements(reference));
  expect(errors).toEqual([]);
  await testInfo.attach(`svelte-label-${width}-${theme}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await testInfo.attach(`pinned-react-label-${width}-${theme}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' });
  await reference.close();
});
test('bounded With Textarea example retains paired content and native label focus association', async ({ page, context }) => {
  await page.goto('/label'); const reference = await context.newPage(); await reference.goto('/label-reference');
  for (const current of [page, reference]) await expect(current.locator('[data-label-gallery]')).toBeVisible();
  const semantic = (current: Page) => current.locator('[data-label-gallery]').evaluate(node => ({
    headings: [...node.querySelectorAll('h2')].map(heading => heading.textContent?.trim()),
    labels: [...node.querySelectorAll('label')].map(label => ({ text: label.textContent, for: label.htmlFor, control: label.control?.id })),
    textareas: [...node.querySelectorAll('textarea')].map(textarea => ({ id: textarea.id, placeholder: textarea.placeholder })),
  }));
  expect(await semantic(page)).toEqual(await semantic(reference));
  expect((await semantic(page)).labels).toHaveLength(1);
  for (const current of [page, reference]) {
    await current.locator('label[for="label-demo-message"]').click();
    await expect(current.getByRole('textbox', { name: 'Message', exact: true })).toBeFocused();
    await expect(current.getByRole('textbox', { name: 'Message', exact: true })).toHaveAttribute('placeholder', 'Message');
  }
  await reference.close();
});
