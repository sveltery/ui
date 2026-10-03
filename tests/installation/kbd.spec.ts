import { expect, test } from '@playwright/test';
import { kbdConsumerCases } from '../browser/kbd-cases';
import { assertKbdGallery, settledKbd, kbdLibraries, kbdStyles, kbdTheme } from '../browser/kbd-gallery-cases';
kbdConsumerCases();
test('fresh Kbd archive/source copy preserves Nova and native inert key examples', async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto('/kbd');
    await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    const key = page.locator('[data-gallery] [data-slot=kbd]').first();
    // Basic's native flex-row item is blockified in both pinned React and Svelte.
    await expect(key).toHaveClass(/\binline-flex\b/);
    expect(await key.evaluate(node => ({ tag: node.tagName, height: node.getBoundingClientRect().height, display: getComputedStyle(node).display, pointer: getComputedStyle(node).pointerEvents, select: getComputedStyle(node).userSelect, size: getComputedStyle(node).fontSize, font: getComputedStyle(node).fontWeight }))).toEqual({ tag: 'KBD', height: 20, display: 'flex', pointer: 'none', select: 'none', size: '12px', font: '500' });
    expect(await page.locator('[data-gallery] [data-slot=kbd-group]').evaluateAll(nodes => nodes.every(node => node.tagName === 'KBD'))).toBe(true);
    await page.getByRole('button', { name: 'Before keys' }).focus(); await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After keys' })).toBeFocused();
    await page.keyboard.press('k'); await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('button', { name: 'After keys' })).toBeFocused();
  }
});
test('fresh real Kbd icon galleries deliver five libraries and eight complete scoped styles', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const library of kbdLibraries) {
    await page.goto(`/kbd?library=${library}`); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true'); await settledKbd(page);
    for (const width of [390, 1280]) { await page.setViewportSize({ width, height: 1600 }); await kbdTheme(page, 'nova', false); await assertKbdGallery(page, width, 'nova', library); }
  }
  await page.goto('/kbd');
  for (const style of kbdStyles) for (const dark of [false, true]) for (const width of [390, 640, 768, 1024, 1536]) {
    await test.step(`${style} ${dark ? 'dark' : 'light'} ${width}px: fresh seven-body gallery`, async () => {
      await page.setViewportSize({ width, height: 1600 }); await kbdTheme(page, style, dark); await assertKbdGallery(page, width, style);
    });
  }
  expect(errors).toEqual([]);
});
