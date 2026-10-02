import { expect, test } from '@playwright/test';
// Shared native-Svelte lifecycle gate also runs against both fresh consumer modes.
export function exampleLifecycleCases() {
  test('native Example SSR hosts survive hydration, reactive updates, attachments replacement and ref cleanup', async ({ page, request }) => {
    const html = await (await request.get('/example')).text();
    expect(html).toContain('data-hydrated="false"'); expect(html).toContain('Example &amp; &lt;draft&gt;');
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('/example'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
    try {
      await page.goto('/example', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
      await page.locator('#probe-wrapper').evaluate(node => { (window as Window & { exampleSSRHosts?: Element[] }).exampleSSRHosts = [node.parentElement!, node, ...node.querySelectorAll('*')]; });
      const example = page.locator('#probe-example'); await expect(example).toHaveAttribute('data-slot', 'custom-example'); await expect(example).not.toHaveAttribute('title');
      expect(await page.locator('#empty-title,#absent-title').evaluateAll(nodes => nodes.every(node => node.children.length === 1 && node.firstElementChild?.getAttribute('data-slot') === 'example-content'))).toBe(true);
      release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
      expect(await page.locator('#probe-wrapper').evaluate(node => [node.parentElement!, node, ...node.querySelectorAll('*')].every((host, index) => host === (window as Window & { exampleSSRHosts?: Element[] }).exampleSSRHosts?.[index]))).toBe(true);
      await page.getByRole('button', { name: 'Inspect example' }).click(); await expect(page.getByTestId('example-state')).toHaveText('{"wrapper":"probe-wrapper","example":"probe-example","attached":2,"cleaned":0,"clicks":0}');
      await page.getByTestId('unclassed-child').click();
      await page.getByRole('button', { name: 'Update example' }).click(); expect(await example.evaluate(node => node.children.length)).toBe(1);
      await expect(example).toHaveClass(/max-w-none/); await expect(example.locator('[data-slot=example-content]')).toHaveClass(/p-8/);
      expect(await example.evaluate(node => node === (window as Window & { exampleSSRHosts?: Element[] }).exampleSSRHosts?.[2])).toBe(true);
      await page.getByRole('button', { name: 'Replace attachments' }).click(); await page.getByRole('button', { name: 'Inspect example' }).click(); await expect(page.getByTestId('example-state')).toHaveText('{"wrapper":"probe-wrapper","example":"probe-example","attached":4,"cleaned":2,"clicks":1}');
      expect(await example.evaluate(node => node === (window as Window & { exampleSSRHosts?: Element[] }).exampleSSRHosts?.[2])).toBe(true);
      await page.getByRole('button', { name: 'Toggle example' }).click(); await expect(example).toHaveCount(0); await page.getByRole('button', { name: 'Inspect example' }).click(); await expect(page.getByTestId('example-state')).toHaveText('{"wrapper":null,"example":null,"attached":4,"cleaned":4,"clicks":1}');
      await page.getByRole('button', { name: 'Toggle example' }).click(); await page.getByRole('button', { name: 'Inspect example' }).click(); await expect(page.getByTestId('example-state')).toHaveText('{"wrapper":"probe-wrapper","example":"probe-example","attached":6,"cleaned":4,"clicks":1}');
      expect(await example.evaluate(node => node !== (window as Window & { exampleSSRHosts?: Element[] }).exampleSSRHosts?.[2])).toBe(true);
      expect(errors).toEqual([]);
    } finally { release(); }
  });
}
