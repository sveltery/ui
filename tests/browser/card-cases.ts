// Reusable framework probes for the checkout and fresh consumers; source-derived, not upstream test copies.
import { expect, test } from '@playwright/test';
const slots = ['card', 'card-header', 'card-title', 'card-description', 'card-action', 'card-content', 'card-footer'];
const ids = slots.map(slot => `lifecycle-${slot}`);
export function cardConsumerCases() {
  test('Card SSR/hydration retains all seven native hosts, refs, attachments and reactive children', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    // Complete development dependency discovery before capturing a fresh SSR document.
    await page.goto('/card'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
    const hosts = page.locator('[data-lifecycle] [data-slot]');
    const state = page.getByTestId('card-state');
    try {
      await page.goto('/card', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
      await expect(hosts).toHaveCount(7);
      expect(await hosts.evaluateAll(nodes => nodes.map(node => ({ id: node.id, slot: node.getAttribute('data-slot'), tag: node.tagName, title: node.getAttribute('title'), attached: node.hasAttribute('data-attached') })))).toEqual(slots.map(slot => ({ id: `lifecycle-${slot}`, slot, tag: 'DIV', title: 'Initial card part', attached: false })));
      await expect(page.locator('#lifecycle-card')).toHaveAttribute('data-size', 'default');
      await hosts.evaluateAll(nodes => { (window as Window & { cardSSRHosts?: Element[] }).cardSSRHosts = nodes; });
      release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
      const sameSSRHosts = () => hosts.evaluateAll(nodes => nodes.every((node, index) => node === (window as Window & { cardSSRHosts?: Element[] }).cardSSRHosts?.[index]));
      expect(await sameSSRHosts()).toBe(true);
      await expect(state).toHaveText(JSON.stringify({ refs: ids, attached: 7, detached: 0 }));
      for (const id of ids) await expect(page.locator(`#${id}`)).toHaveAttribute('data-attached', 'true');
      await page.getByRole('button', { name: 'Update card parts', exact: true }).click();
      for (const id of ids) {
        await expect(page.locator(`#${id}`)).toHaveAttribute('title', 'Updated card part');
        await expect(page.locator(`#${id}`)).toHaveClass(/px-6/);
        await expect(page.locator(`#${id}`)).not.toHaveClass(/px-3/);
      }
      for (const part of ['title', 'description', 'action', 'content', 'footer']) await expect(page.locator(`#lifecycle-card-${part}`)).toHaveText(`Updated ${part}`);
      await expect(page.locator('#lifecycle-card')).toHaveAttribute('data-size', 'sm');
      expect(await sameSSRHosts()).toBe(true);
      await expect(state).toHaveText(JSON.stringify({ refs: ids, attached: 7, detached: 0 }));
      await page.getByRole('button', { name: 'Toggle card parts', exact: true }).click();
      await expect(hosts).toHaveCount(0); await expect(state).toHaveText(JSON.stringify({ refs: Array(7).fill(null), attached: 7, detached: 7 }));
      await page.getByRole('button', { name: 'Toggle card parts', exact: true }).click();
      await expect(hosts).toHaveCount(7); await expect(state).toHaveText(JSON.stringify({ refs: ids, attached: 14, detached: 7 }));
      expect(await hosts.evaluateAll(nodes => nodes.every((node, index) => node !== (window as Window & { cardSSRHosts?: Element[] }).cardSSRHosts?.[index]))).toBe(true);
      await expect(page.locator('#lifecycle-card-title')).toHaveText('Updated title');
      expect(errors).toEqual([]);
    } finally { release(); }
  });
}
