// Supplemental source-derived Nova/presence gate. Both fixtures use the actual pinned styled wrappers.
import { expect, test } from '@playwright/test';
test('paired pinned React and Svelte retain actual exit animations and presence until completion', async ({ page }) => {
  for (const route of ['/reference', '/dialog']) {
    await page.goto(route); await expect(page.locator('[data-hydrated=true]')).toBeVisible();
    await page.getByTestId('trigger').click(); const popup = page.getByRole('dialog'); await expect(popup).toBeVisible();
    await expect.poll(() => popup.evaluate(node => getComputedStyle(node).animationDuration)).toBe('0.1s');
    // Pausing playback makes the real finite animation observable without changing its name or duration.
    const control = await page.addStyleTag({ content: '[data-slot="dialog-content"], [data-slot="dialog-overlay"] { animation-play-state: paused !important; }' });
    try {
      await popup.getByRole('button', { name: 'Close', exact: true }).evaluate((close: HTMLButtonElement) => close.click());
      await expect(popup).toHaveAttribute('data-closed', '');
      await expect(page.locator('[data-slot=dialog-overlay]')).toHaveAttribute('data-closed', '');
      const animations = await popup.evaluate(node => { const style = getComputedStyle(node); return { connected: node.isConnected, name: style.animationName, duration: style.animationDuration, states: node.getAnimations().map(animation => animation.playState) }; });
      expect(animations).toMatchObject({ connected: true, name: 'exit', duration: '0.1s' });
      expect(animations.states.length).toBeGreaterThan(0); expect(animations.states.every(state => state === 'paused')).toBe(true);
      await popup.evaluate(async () => { await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))); });
      await expect(popup).toHaveCount(1); await expect(page.locator('[data-slot=dialog-overlay]')).toHaveCount(1);
    } finally { await control.evaluate(node => node.remove()); }
    await expect(popup).toHaveCount(0); await expect(page.locator('[data-slot=dialog-overlay]')).toHaveCount(0);
  }
});
