// Temporary source-derived paired timing diagnostic. Existing exit-animation assertions remain unchanged.
import { expect, test } from '@playwright/test';
test('diagnostic paired pinned React and local native close animation timeline', async ({ page, browserName }) => {
  for (const route of ['/reference', '/dialog']) {
    await page.goto(route); await expect(page.locator('[data-hydrated=true]')).toBeVisible();
    await page.getByTestId('trigger').click(); const popup = page.getByRole('dialog'); await expect(popup).toBeVisible();
    const timeline = await popup.getByRole('button', { name: 'Close', exact: true }).evaluate(async (close: HTMLButtonElement) => {
      const host = document.querySelector('[data-slot=dialog-content]')!;
      const start = performance.now();
      const samples: { elapsed: number; connected: boolean; closed: boolean; name: string | null; duration: string | null; before: string[]; after: string[] }[] = [];
      close.click();
      for (let frame = 0; frame < 16; frame++) {
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        const before = host.getAnimations().map(animation => animation.playState);
        const style = host.isConnected ? getComputedStyle(host) : null;
        const name = style?.animationName ?? null; const duration = style?.animationDuration ?? null;
        samples.push({ elapsed: performance.now() - start, connected: host.isConnected, closed: host.hasAttribute('data-closed'), name, duration, before, after: host.getAnimations().map(animation => animation.playState) });
      }
      return samples;
    });
    console.log('DIALOG_PAIRED_TIMELINE_DIAGNOSTIC', JSON.stringify({ browserName, route, timeline }));
    expect(timeline.some(sample => sample.connected && sample.closed)).toBe(true);
    await expect(popup).toHaveCount(0);
  }
});
