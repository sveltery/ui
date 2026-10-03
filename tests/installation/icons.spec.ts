// Source-derived public distribution probes, not copied upstream icon tests.
import { expect, test } from '@playwright/test';
const libraries = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
const expected = {
  lucide: { class: 'lucide lucide-arrow-left', viewBox: '0 0 24 24', node: 'path', children: 1 },
  tabler: { class: 'tabler-icon tabler-icon-arrow-left ', viewBox: '0 0 24 24', node: 'path', children: 1 },
  hugeicons: { class: '', viewBox: '0 0 24 24', node: 'path', children: 0 },
  phosphor: { class: null, viewBox: '0 0 256 256', node: 'path', children: 1 },
  remixicon: { class: 'remixicon ', viewBox: '0 0 24 24', node: 'path', children: 0 },
};
test('fresh archive/source-copy icons hydrate and resolve all five libraries with native lifecycle cleanup', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const html = await (await request.get('/icons-consumer')).text();
  expect(html).toContain('lucide lucide-square');
  expect(html).toContain('stroke-width="7"');
  await page.goto('/icons-consumer');
  const host = page.locator('[data-icons-consumer]');
  const icon = page.getByTestId('consumer-icon');
  await expect(host).toHaveAttribute('data-hydrated', 'true');
  for (const library of libraries) {
    await page.getByRole('button', { name: `Select ${library}`, exact: true }).click();
    await expect(icon).not.toHaveClass(/lucide-square/);
    await expect(icon).toHaveAttribute('viewBox', expected[library].viewBox);
    expect(await icon.getAttribute('class')).toBe(expected[library].class);
    await expect(icon.locator(expected[library].node)).not.toHaveCount(0);
    await expect(icon.locator('[data-icon-child]')).toHaveCount(expected[library].children);
    await expect(host).toHaveAttribute('data-ref', 'svg');
    await expect(icon).toHaveAttribute('aria-label', 'Previous');
    await expect(icon).toHaveAttribute('data-attached', 'first');
    expect(await icon.evaluate(svg => svg.namespaceURI)).toBe('http://www.w3.org/2000/svg');
  }
  await icon.click(); await expect(host).toHaveAttribute('data-clicks', '1');
  await page.getByRole('button', { name: 'Swap attachment', exact: true }).click();
  await expect(icon).toHaveAttribute('data-attached', 'second');
  await page.getByRole('button', { name: 'Unknown', exact: true }).click(); await expect(icon).toHaveCount(0);
  await page.getByRole('button', { name: 'Restore', exact: true }).click(); await expect(icon).toHaveCount(1);
  await page.getByRole('button', { name: 'Absent', exact: true }).click(); await expect(icon).toHaveCount(0);
  await expect(host).toHaveAttribute('data-ref', 'none');
  await page.getByRole('button', { name: 'Restore', exact: true }).click(); await expect(icon).toHaveCount(1);
  await page.getByRole('button', { name: 'Remove', exact: true }).click(); await expect(icon).toHaveCount(0);
  await expect(host).toHaveAttribute('data-ref', 'none');
  const attached = Number(await host.getAttribute('data-attached'));
  expect(attached).toBeGreaterThan(1);
  await expect(host).toHaveAttribute('data-detached', String(attached));
  expect(errors).toEqual([]);
});

test('fresh public ESM chunks show real Square during loading and discard stale completion', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  let release: (() => void) | undefined;
  const pending = new Promise<void>(resolve => { release = resolve; });
  const intercepted: string[] = [];
  // Vite may serve the original module or an optimized chunk. Both names identify
  // the real Lucide geometry module; no mocked geometry or fs allowlist is used.
  await page.route(/\/lucide(?:-[^/?]+)?\.js(?:\?.*)?$/, async route => { intercepted.push(route.request().url()); await pending; await route.continue(); });
  // Firefox's load event waits for this intentionally pending dynamic import.
  // Require the real hydrated fallback and intercepted module before releasing it.
  await page.goto('/icons-consumer', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => intercepted.length).toBeGreaterThan(0);
  await testInfo.attach('delayed-real-icon-modules', { body: JSON.stringify(intercepted), contentType: 'application/json' });
  const icon = page.getByTestId('consumer-icon');
  await expect(page.locator('[data-icons-consumer]')).toHaveAttribute('data-hydrated', 'true');
  await expect(icon).toHaveClass(/lucide-square/);
  await expect(icon).toHaveAttribute('stroke-width', '7');
  await expect(icon.locator('rect')).toHaveAttribute('width', '18');
  await page.getByRole('button', { name: 'Absent', exact: true }).click(); await expect(icon).toHaveCount(0);
  release!();
  await page.getByRole('button', { name: 'Select phosphor', exact: true }).click();
  await page.getByRole('button', { name: 'Restore', exact: true }).click();
  await expect(icon).toHaveAttribute('viewBox', '0 0 256 256');
  await expect(icon).not.toHaveClass(/lucide-arrow-left/);
  await page.getByRole('button', { name: 'Select lucide', exact: true }).click();
  await expect(icon).toHaveClass(/lucide-arrow-left/);
  await expect(icon).toHaveAttribute('stroke-width', '2');
  await page.getByRole('button', { name: 'Change name', exact: true }).click();
  await expect(icon).toHaveClass(/lucide-arrow-right/);
  await expect(icon).toHaveCount(1);
  expect(errors).toEqual([]);
});
