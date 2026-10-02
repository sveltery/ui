import { expect, test } from '@playwright/test';
test('fresh native Skeleton archive/source copy: SSR, styles, reactivity and ref/attachment cleanup', async ({ page, request }) => {
  const html = await (await request.get('/skeleton')).text();
  expect(html).toContain('data-slot="skeleton"'); expect(html).toContain('data-hydrated="false"'); expect(html).toContain('Initial');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto('/skeleton');
    await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    const skeleton = page.getByTestId('skeleton');
    await expect(skeleton).toHaveText('Initial'); await expect(skeleton).toHaveAttribute('data-attached', 'true');
    await expect(page.getByTestId('skeleton-state')).toHaveText('{"ref":"DIV","attached":1,"cleaned":0}');
    expect(await skeleton.evaluate(node => ({ tag: node.tagName, width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height, animation: getComputedStyle(node).animationName, radius: getComputedStyle(node).borderRadius, background: getComputedStyle(node).backgroundColor }))).toEqual({ tag: 'DIV', width: 128, height: 16, animation: 'pulse', radius: '8px', background: 'oklch(0.97 0 0)' });
    const original = await skeleton.elementHandle();
    await page.getByRole('button', { name: 'Update skeleton' }).click(); await expect(skeleton).toHaveText('Updated');
    expect(await original!.evaluate(node => node === document.querySelector('[data-testid=skeleton]'))).toBe(true);
    expect(await skeleton.evaluate(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height, animation: getComputedStyle(node).animationName, radius: getComputedStyle(node).borderRadius }))).toEqual({ width: 256, height: 32, animation: 'none', radius: '0px' });
    await page.getByRole('button', { name: 'Remove skeleton' }).click(); await expect(skeleton).toHaveCount(0);
    await expect(page.getByTestId('skeleton-state')).toHaveText('{"ref":null,"attached":1,"cleaned":1}');
  }
  expect(errors).toEqual([]);
});
