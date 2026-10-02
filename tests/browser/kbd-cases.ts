// Reusable main/fresh-consumer probes. Source-derived assertions; see kbd-sources.json.
import { expect, test } from '@playwright/test';
export function kbdConsumerCases() {
  test('Kbd SSR/hydration retains native hosts, undefined refs, attachments and reactive declaration children', async ({ page }) => {
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    // Finish development dependency discovery before capturing the SSR document.
    await page.goto('/kbd'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
    try {
      await page.goto('/kbd', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
      await expect(page.locator('#lifecycle-kbd')).toHaveText('Ctrl');
      await page.locator('#lifecycle-kbd').evaluate(node => { (window as Window & { kbdHost?: Element; groupHost?: Element }).kbdHost = node; (window as Window & { groupHost?: Element }).groupHost = node.parentElement!; });
      release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
      expect(await page.locator('#lifecycle-kbd').evaluate(node => node === (window as Window & { kbdHost?: Element }).kbdHost && node.parentElement === (window as Window & { groupHost?: Element }).groupHost)).toBe(true);
      await expect(page.getByTestId('kbd-state')).toHaveText('{"ref":"lifecycle-kbd","groupRef":"lifecycle-group","attached":2,"detached":0}');
      await page.getByRole('button', { name: 'Update keys' }).click();
      await expect(page.locator('#lifecycle-kbd')).toHaveText('Shift'); await expect(page.locator('#lifecycle-kbd')).toHaveAttribute('title', 'Shift key'); await expect(page.locator('#lifecycle-kbd')).toHaveClass(/px-6/);
      await expect(page.getByTestId('kbd-state')).toHaveText('{"ref":"lifecycle-kbd","groupRef":"lifecycle-group","attached":2,"detached":0}');
      await page.getByRole('button', { name: 'Remove keys' }).click();
      await expect(page.getByTestId('kbd-state')).toHaveText('{"ref":null,"groupRef":null,"attached":2,"detached":2}');
      expect(errors).toEqual([]);
    } finally { release(); }
  });
}
