import { expect, test } from '@playwright/test';
import { THEMES, styles } from '../../scripts/theme-assets.mjs';
// Executes separately in each genuinely isolated archive and source-copy SvelteKit consumer.
test('fresh consumer ships all scoped styles and genuine base/accent light-dark palettes', async ({ page }) => {
  test.setTimeout(120_000); // Both widths, eight styles, two modes and actual portaled Dialogs.
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/themes'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 1200 });
    for (const dark of [false, true]) {
      if (dark) await page.getByRole('button', { name: 'Dark mode', exact: true }).click();
      for (const style of styles) {
        await page.getByLabel('Style', { exact: true }).selectOption(style);
        await expect(page.locator('html')).toHaveClass(new RegExp(`style-${style}`));
        expect(await page.locator('[data-slot=card]').evaluate(node => getComputedStyle(node).backgroundColor)).toBe(dark ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)');
        expect(await page.locator('[data-slot=card]').evaluate(node => getComputedStyle(node).display)).toBe('flex');
        const radius = await page.locator('[data-slot=card]').evaluate(node => getComputedStyle(node).borderRadius);
        expect(radius).toBe(style === 'lyra' || style === 'sera' ? '0px' : style === 'maia' ? '18px' : style === 'luma' ? '26px' : style === 'rhea' ? '24px' : style === 'mira' ? '10px' : '14px');
        await page.getByRole('button', { name: 'Open theme dialog', exact: true }).click();
        await expect(page.getByRole('dialog')).toBeVisible();
        expect(await page.getByRole('dialog').evaluate(node => getComputedStyle(node).backgroundColor)).toBe(dark ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)');
        await page.getByRole('button', { name: 'Done', exact: true }).click(); await expect(page.getByRole('dialog')).toHaveCount(0);
      }
    }
    await page.getByRole('button', { name: 'Dark mode', exact: true }).click();
  }
  await page.getByLabel('Base color', { exact: true }).selectOption('taupe');
  await page.getByLabel('Accent', { exact: true }).selectOption('blue');
  for (const dark of [false, true]) {
    if (dark) await page.getByRole('button', { name: 'Dark mode', exact: true }).click();
    const mode = dark ? 'dark' : 'light';
    const expected = { ...THEMES.find(theme => theme.name === 'taupe')!.cssVars[mode], ...THEMES.find(theme => theme.name === 'blue')!.cssVars[mode] };
    const actual = await page.locator('html').evaluate((node, keys) => Object.fromEntries(keys.map(key => [key, getComputedStyle(node).getPropertyValue(`--${key}`).trim()])), Object.keys(expected));
    expect(actual).toEqual(expected);
  }
  expect(errors).toEqual([]);
});
