import { expect, test } from '@playwright/test';
import { kbdConsumerCases } from '../browser/kbd-cases';
kbdConsumerCases();
test('fresh Kbd archive/source copy preserves Nova and native inert key examples', async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto('/kbd');
    await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    const key = page.locator('[data-gallery] [data-slot=kbd]').first();
    expect(await key.evaluate(node => ({ tag: node.tagName, height: node.getBoundingClientRect().height, display: getComputedStyle(node).display, pointer: getComputedStyle(node).pointerEvents, select: getComputedStyle(node).userSelect, size: getComputedStyle(node).fontSize, font: getComputedStyle(node).fontWeight }))).toEqual({ tag: 'KBD', height: 20, display: 'inline-flex', pointer: 'none', select: 'none', size: '12px', font: '500' });
    expect(await page.locator('[data-gallery] [data-slot=kbd-group]').evaluateAll(nodes => nodes.every(node => node.tagName === 'KBD'))).toBe(true);
    await page.getByRole('button', { name: 'Before keys' }).focus(); await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After keys' })).toBeFocused();
    await page.keyboard.press('k'); await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('button', { name: 'After keys' })).toBeFocused();
  }
});
