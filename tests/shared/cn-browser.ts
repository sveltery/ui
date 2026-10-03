// Supplemental integration regressions; no copied upstream UI assertion credit.
import { expect, type APIRequestContext, type Page } from '@playwright/test';

export async function verifyClassInputs(page: Page, request: APIRequestContext) {
  const initial = ['cn-skeleton animate-pulse p-2\u00a0p-4', 'cn-skeleton animate-pulse p-2\u2028p-4'];
  const selector = '[data-testid^=cn-]';
  const html = await (await request.get('/class-merge')).text();
  expect(await page.evaluate(({ html, selector }) => [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll(selector)].map(node => node.getAttribute('class')), { html, selector })).toEqual(initial);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/class-merge');
  await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
  try {
    await page.goto('/class-merge', { waitUntil: 'commit' });
    await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
    const hosts = page.locator(selector);
    expect(await hosts.evaluateAll(nodes => nodes.map(node => node.getAttribute('class')))).toEqual(initial);
    await hosts.evaluateAll(nodes => { (window as Window & { cnSSRNodes?: Element[] }).cnSSRNodes = nodes; });
    release();
    await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    expect(await hosts.evaluateAll(nodes => nodes.every((node, index) => node === (window as Window & { cnSSRNodes?: Element[] }).cnSSRNodes?.[index]))).toBe(true);
    expect(await hosts.evaluateAll(nodes => nodes.map(node => node.getAttribute('class')))).toEqual(initial);
    await page.getByRole('button', { name: 'Toggle class separators' }).click();
    await expect(hosts.nth(0)).toHaveAttribute('class', 'cn-skeleton animate-pulse p-4');
    await expect(hosts.nth(1)).toHaveAttribute('class', 'cn-skeleton animate-pulse p-4');
    expect(await hosts.evaluateAll(nodes => nodes.every((node, index) => node === (window as Window & { cnSSRNodes?: Element[] }).cnSSRNodes?.[index]))).toBe(true);
    await page.getByRole('button', { name: 'Toggle class separators' }).click();
    await expect(hosts.nth(0)).toHaveAttribute('class', initial[0]);
    await expect(hosts.nth(1)).toHaveAttribute('class', initial[1]);
    expect(errors).toEqual([]);
  } finally {
    release();
  }
}
