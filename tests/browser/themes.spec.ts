import { expect, test, type Page } from '@playwright/test';
import { THEMES, baseColors, styles } from '../../scripts/theme-assets.mjs';
// Supplemental responsive source comparisons; the original upstream generator test is separate.
async function measurements(page: Page) {
  await page.evaluate(async () => { await Promise.all(document.getAnimations().filter(animation => Number.isFinite(animation.effect?.getComputedTiming().endTime)).map(animation => animation.finished.catch(() => {}))); });
  return page.locator('[data-theme-gallery] [data-slot], [data-slot=dialog-content], [data-slot=dialog-content] [data-slot]').evaluateAll(nodes => nodes.map(node => {
    const css = getComputedStyle(node); const box = node.getBoundingClientRect();
    return { slot: node.getAttribute('data-slot'), tag: node.tagName, width: box.width, height: box.height,
      background: css.backgroundColor, color: css.color, border: css.borderColor, borderWidth: css.borderWidth, borderStyle: css.borderStyle,
      radius: css.borderRadius, padding: css.padding, margin: css.margin, gap: css.gap, fontSize: css.fontSize, fontWeight: css.fontWeight,
      lineHeight: css.lineHeight, display: css.display, direction: css.flexDirection, align: css.alignItems, shadow: css.boxShadow, opacity: node.getAttribute('data-slot') === 'skeleton' ? null : css.opacity, animation: css.animationName, duration: css.animationDuration,
      gridColumns: css.gridTemplateColumns, gridRows: css.gridTemplateRows, placeholder: node.tagName === 'TEXTAREA' ? getComputedStyle(node, '::placeholder').color : null,
    };
  }));
}
function sourceTokens(baseColor: string, accent: string, dark: boolean): Record<string, string> {
  const mode = dark ? 'dark' : 'light';
  // Direct immutable record merge, independent of the production buildThemeForPreset function.
  const base = THEMES.find(item => item.name === baseColor)!;
  const overlay = THEMES.find(item => item.name === accent)!;
  return { ...base.cssVars[mode], ...overlay.cssVars[mode], radius: base.cssVars.light.radius };
}
async function referenceTheme(page: Page, style: string, base: string, accent: string, dark: boolean) {
  await page.evaluate(({ style, tokens, dark }) => {
    const root = document.documentElement;
    root.className = `style-${style}${dark ? ' dark' : ''}`;
    root.style.setProperty('--font-sans', 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"');
    root.style.setProperty('--font-heading', 'inherit');
    for (const [name, value] of Object.entries(tokens)) root.style.setProperty(`--${name}`, value);
  }, { style, tokens: sourceTokens(base, accent, dark), dark });
}
for (const width of [1280, 390]) test(`all eight canonical component styles match pinned React source in light and dark at ${width}px`, async ({ page, context }) => {
  await page.setViewportSize({ width, height: 1800 });
  await page.goto('/themes'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  const reference = await context.newPage(); await reference.setViewportSize({ width, height: 1800 });
  await reference.goto('http://127.0.0.1:5175'); await expect(reference.locator('[data-hydrated]')).toHaveAttribute('data-hydrated', 'true');
  for (const dark of [false, true]) {
    if (dark) await page.getByRole('button', { name: 'Dark mode', exact: true }).click();
    for (const style of styles) {
      await page.getByLabel('Style', { exact: true }).selectOption(style);
      await referenceTheme(reference, style, 'neutral', 'neutral', dark);
      await expect(page.locator('html')).toHaveClass(new RegExp(`style-${style}`));
      const actual = await measurements(page);
      expect(actual.length).toBeGreaterThan(45);
      expect(actual).toEqual(await measurements(reference));
      // Actual Base portals must inherit the selected palette/style from html.
      for (const current of [page, reference]) {
        await current.getByRole('button', { name: 'Open theme dialog', exact: true }).click();
        await expect(current.getByRole('dialog')).toBeVisible();
        await current.getByRole('dialog').evaluate(async node => { await Promise.all(node.getAnimations().map(animation => animation.finished)); });
      }
      expect(await measurements(page)).toEqual(await measurements(reference));
      for (const current of [page, reference]) { await current.getByRole('button', { name: 'Done', exact: true }).click(); await expect(current.getByRole('dialog')).toHaveCount(0); }
      // Hover and focus exercise source dark opacity/mix and ring selectors.
      for (const index of [0, 1, 2, 3, 4, 5]) {
        for (const current of [page, reference]) await current.locator('[data-theme-gallery] [data-slot=button]').nth(index).hover();
        expect(await measurements(page)).toEqual(await measurements(reference));
      }
      for (const current of [page, reference]) { await current.locator('#theme-notes').focus(); await current.mouse.move(0, 0); }
      expect(await measurements(page)).toEqual(await measurements(reference));
      for (const current of [page, reference]) await current.locator('#theme-notes').blur();
    }
  }
  await reference.close();
});

test('functional base and accent switching preserves every genuine light/dark token and ignores media preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/themes'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  for (const dark of [false, true]) {
    if (dark) await page.getByRole('button', { name: 'Dark mode', exact: true }).click();
    for (const base of baseColors) {
      await page.getByLabel('Base color', { exact: true }).selectOption(base);
      for (const theme of THEMES.filter(item => !baseColors.includes(item.name) || item.name === base)) {
        await page.getByLabel('Accent', { exact: true }).selectOption(theme.name === base ? 'base' : theme.name);
        const expected = sourceTokens(base, theme.name, dark);
        const actual = await page.locator('html').evaluate((node, keys) => Object.fromEntries(keys.map(key => [key, getComputedStyle(node).getPropertyValue(`--${key}`).trim()])), Object.keys(expected));
        expect(actual).toEqual(expected);
      }
    }
  }
  await page.getByRole('button', { name: 'Dark mode', exact: true }).click();
  await page.getByLabel('Base color', { exact: true }).selectOption('neutral');
  await page.getByLabel('Accent', { exact: true }).selectOption('base');
  expect(await page.locator('[data-slot=card]').evaluate(node => getComputedStyle(node).backgroundColor)).toBe('oklch(1 0 0)');
  // Leaving the fixture restores classes; ordinary Nova consumers keep their existing default geometry.
  await page.goto('/'); await expect(page.locator('html')).not.toHaveClass(/style-|theme-|dark/);
});
