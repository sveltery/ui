import { expect, test, type Page } from '@playwright/test';
import { ratioAssertions, ratioMeasurements } from './aspect-ratio-cases';
import { aspectGallery, aspectGalleryHosts, aspectImages, aspectGallerySnapshot, aspectGalleryMeasurements, assertAspectGallery, aspectTheme, aspectStyles } from './aspect-ratio-gallery-cases';
// Supplemental source-derived tests, not a copied upstream assertion inventory.
for (const width of [1280, 390]) test(`paired pinned React/Svelte ratios, responsive classes and caller style replacement at ${width}px`, async ({ page, context }) => {
  const reference = await context.newPage(); const errors: string[] = [];
  for (const current of [page, reference]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); await current.setViewportSize({ width, height: 1000 }); }
  await page.goto('/aspect-ratio-probe'); await reference.goto('/aspect-ratio-probe-reference');
  for (const current of [page, reference]) await expect(current.locator('[data-aspect-ratio-probe]')).toHaveAttribute('data-hydrated', 'true');
  expect(await ratioMeasurements(page)).toEqual(await ratioMeasurements(reference));
  await ratioAssertions(page, width); await ratioAssertions(reference, width);
  expect(await ratioMeasurements(page)).toEqual(await ratioMeasurements(reference)); expect(errors).toEqual([]); await reference.close();
});
test('Svelte undefined native ref and attachment replacement/removal cleanup in a real browser', async ({ page }) => {
  await page.goto('/aspect-ratio-probe'); await expect(page.locator('[data-aspect-ratio-probe]')).toHaveAttribute('data-hydrated', 'true');
  const state = () => page.getByTestId('ratio-state').textContent().then(text => JSON.parse(text!));
  expect(await state()).toMatchObject({ ref: 'DIV', attached: 1, cleaned: 0 });
  await page.getByRole('button', { name: 'Swap ratio attachments' }).click(); expect(await state()).toMatchObject({ ref: 'DIV', attached: 2, cleaned: 1 });
  await page.getByRole('button', { name: 'Remove ratio' }).click(); expect(await state()).toMatchObject({ ref: null, attached: 2, cleaned: 2 });
  await page.getByRole('button', { name: 'Restore ratio' }).click(); expect(await state()).toMatchObject({ ref: 'DIV', attached: 3, cleaned: 2 });
});
test('paired actual SSR hosts retain identity and ratio styles through hydration', async ({ page, context }) => {
  const reference = await context.newPage(); const pairs = [[page, '/aspect-ratio-probe'], [reference, '/aspect-ratio-probe-reference']] as const;
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; }); const errors: string[] = [];
  for (const [current] of pairs) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); await current.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); }); }
  try {
    const captured = [];
    for (const [current, route] of pairs) { await current.goto(route, { waitUntil: 'commit' }); await expect(current.locator('[data-aspect-ratio-probe]')).toHaveAttribute('data-hydrated', 'false'); const hosts = await current.locator('[data-aspect-ratio-probe] section > div').elementHandles(); expect(hosts).toHaveLength(13); captured.push({ current, hosts }); }
    expect(await ratioMeasurements(page)).toEqual(await ratioMeasurements(reference)); release();
    for (const { current, hosts } of captured) { await expect(current.locator('[data-aspect-ratio-probe]')).toHaveAttribute('data-hydrated', 'true'); for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, index) => node.isConnected && node === document.querySelectorAll('[data-aspect-ratio-probe] section > div')[index], index)).toBe(true); }
    expect(await ratioMeasurements(page)).toEqual(await ratioMeasurements(reference)); expect(errors).toEqual([]);
  } finally { release(); await reference.close(); }
});
for (const width of [1280, 390]) test(`four bounded actual example bodies retain ratios, image fill and classes at ${width}px`, async ({ page, context }) => {
  const reference = await context.newPage(); const errors: string[] = [];
  for (const current of [page, reference]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); await current.setViewportSize({ width, height: 1000 }); await current.route('https://avatar.vercel.sh/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="gray"/></svg>' })); }
  await page.goto('/aspect-ratio'); await reference.goto('/aspect-ratio-reference');
  const snapshot = (current: Page) => current.locator('[data-slot="example-wrapper"] > [data-slot="example"]').evaluateAll(nodes => nodes.map(node => { const ratio = node.querySelector<HTMLElement>('[data-slot="aspect-ratio"]')!; const img = node.querySelector('img')!; const box = ratio.getBoundingClientRect(); const image = img.getBoundingClientRect(); return { title: node.firstElementChild!.textContent, class: ratio.className, custom: ratio.style.getPropertyValue('--ratio'), ratio: getComputedStyle(ratio).aspectRatio, alt: img.alt, src: img.getAttribute('src'), imgClass: img.className, position: getComputedStyle(img).position, objectFit: getComputedStyle(img).objectFit, width: box.width, height: box.height, imageWidth: image.width, imageHeight: image.height }; }));
  await expect(reference.locator('[data-slot="example-wrapper"] img')).toHaveCount(4);
  const actual = await snapshot(page); expect(actual).toEqual(await snapshot(reference)); expect(actual.map(item => item.title)).toEqual(['16:9', '21:9', '1:1', '9:16']);
  for (const [index, ratio] of [16 / 9, 21 / 9, 1, 9 / 16].entries()) { expect(actual[index].width / actual[index].height).toBeCloseTo(ratio, 2); expect(actual[index].imageWidth).toBe(actual[index].width); expect(actual[index].imageHeight).toBe(actual[index].height); expect(actual[index].position).toBe('absolute'); expect(actual[index].objectFit).toBe('cover'); }
  expect(errors).toEqual([]); await reference.close();
});

test('complete original AspectRatio gallery retains all 22 actual SSR HTML hosts through hydration', async ({ page, context }) => {
  const reference = await context.newPage(); const errors: string[] = [];
  for (const current of [page, reference]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); await aspectImages(current); }
  try {
    await page.goto('/aspect-ratio'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await reference.goto('/aspect-ratio-reference'); await expect(reference.locator(aspectGalleryHosts)).toHaveCount(22);
    const original = await aspectGallerySnapshot(reference);
    let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.fallback(); });
    try {
      await page.goto('/aspect-ratio', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
      const hosts = await page.locator(aspectGalleryHosts).elementHandles(); expect(hosts).toHaveLength(22);
      const before = await aspectGallerySnapshot(page); expect(before).toEqual(original);
      release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
      for (const [index, host] of hosts.entries()) expect(await host.evaluate((node, args) => node.isConnected && node === document.querySelectorAll(args.selector)[args.index], { selector: aspectGalleryHosts, index })).toBe(true);
      expect(await aspectGallerySnapshot(page)).toEqual(before); expect(errors).toEqual([]);
    } finally { release(); }
  } finally { await reference.close(); }
});
test('four original AspectRatio galleries preserve responsive scaffolds, decoded cover layers and all eight source styles against complete original CSS', async ({ page, context }) => {
  // The paired 160-document-state witness takes twice the finite 80-state
  // fresh witness (64.8–64.9s in actual WebKit f948). Keep all assertions.
  test.setTimeout(180_000);
  const reference = await context.newPage(); const errors: string[] = [];
  for (const current of [page, reference]) { current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); await aspectImages(current); }
  try {
    await page.goto('/aspect-ratio'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await reference.goto('http://127.0.0.1:5175/aspect-ratio'); await expect(reference.locator(aspectGalleryHosts)).toHaveCount(22);
    expect(await aspectGallerySnapshot(page)).toEqual(await aspectGallerySnapshot(reference));
    for (const style of aspectStyles) for (const dark of [false, true]) {
      for (const current of [page, reference]) await aspectTheme(current, style, dark);
      for (const width of [390, 640, 768, 1024, 1536]) {
        await test.step(`${style} ${dark ? 'dark' : 'light'} ${width}px: both complete four-body galleries`, async () => {
          for (const current of [page, reference]) await current.setViewportSize({ width, height: 1600 });
          await assertAspectGallery(page, width, 1600, style); await assertAspectGallery(reference, width, 1600, style);
          const actual = await aspectGalleryMeasurements(page); const original = await aspectGalleryMeasurements(reference);
          // All explicit scoped styles retain genuine radius factors; historical
          // unscoped Nova geometry is a separate unchanged environment.
          expect(actual).toEqual(original);
          expect(actual.filter(node => node.tag === 'IMG').map(node => node.filter)).toEqual(Array(4).fill(dark ? 'brightness(0.2) grayscale(1)' : 'grayscale(1)'));
        });
      }
    }
    expect(await page.locator(`${aspectGallery} img`).count()).toBe(4); expect(errors).toEqual([]);
  } finally { await reference.close(); }
});
