import { expect, test, type Frame, type Page } from '@playwright/test';
import { DEFAULT_PRESETS, encodePreset, type PresetConfig } from '../../packages/cli/src/preset/index';
import { previewSrc } from '../../apps/docs/src/lib/create/preview/message';

test.use({ baseURL: 'http://127.0.0.1:5175' });

/** Embeds the preview the way the Create page does: one iframe on a page of the same origin. */
async function embed(page: Page, config: PresetConfig): Promise<Frame> {
  await page.goto('/llms.txt');
  await page.evaluate((src) => {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style.cssText = 'width: 1280px; height: 900px; border: 0';
    document.body.replaceChildren(iframe);
  }, previewSrc('preview-02', config));
  const frame = page.frames()[1]!;
  await expect(frame.locator('[data-slot=card]').first()).toBeVisible({ timeout: 30_000 });
  return frame;
}

async function post(page: Page, config: PresetConfig) {
  await page.evaluate((preset) => {
    document.querySelector('iframe')!.contentWindow!.postMessage({ type: 'design-system-params', preset }, location.origin);
  }, encodePreset(config));
}

function computed(frame: Frame) {
  return frame.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const title = document.querySelector('.cn-card-title')!;
    return {
      style: [...document.body.classList].filter((name) => name.startsWith('style-')),
      primary: root.getPropertyValue('--primary'),
      radius: root.getPropertyValue('--radius'),
      body: getComputedStyle(document.body).fontFamily,
      heading: getComputedStyle(title).fontFamily,
      sameDocument: (window as { marked?: boolean }).marked === true,
    };
  });
}

async function menuClasses(frame: Frame) {
  const ticker = frame.getByRole('combobox', { name: 'Ticker' });
  await ticker.click();
  const menu = frame.locator('.cn-combobox-content');
  await expect(menu).toBeVisible();
  const classes = await menu.evaluate((element) => [...element.classList].filter((name) => name === 'dark' || name === 'cn-menu-translucent'));
  await ticker.press('Escape');
  await expect(menu).toBeHidden();
  return classes;
}

test('the preview applies each posted config without a reload', async ({ page }) => {
  const frame = await embed(page, DEFAULT_PRESETS.nova);
  await frame.evaluate(() => ((window as { marked?: boolean }).marked = true));

  expect(await computed(frame)).toEqual({
    style: ['style-nova'],
    primary: 'oklch(0.205 0 0)',
    radius: '0.625rem',
    body: '"Geist Variable", sans-serif',
    heading: '"Geist Variable", sans-serif',
    sameDocument: true,
  });
  expect(await menuClasses(frame)).toEqual([]);

  await post(page, { ...DEFAULT_PRESETS.sera, menuColor: 'inverted' });
  await expect.poll(() => computed(frame)).toEqual({
    style: ['style-sera'],
    primary: 'oklch(0.214 0.009 43.1)',
    radius: '0',
    body: '"Noto Sans Variable", sans-serif',
    heading: '"Playfair Display Variable", serif',
    sameDocument: true,
  });
  expect(await menuClasses(frame)).toEqual(['dark']);
  expect(await frame.evaluate(() => document.fonts.check('1em "Playfair Display Variable"'))).toBe(true);

  await post(page, { ...DEFAULT_PRESETS.maia, baseColor: 'zinc', theme: 'zinc', chartColor: 'zinc', radius: 'large', menuColor: 'default-translucent' });
  await expect.poll(() => computed(frame)).toEqual({
    style: ['style-maia'],
    primary: 'oklch(0.21 0.006 285.885)',
    radius: '0.875rem',
    body: '"Figtree Variable", sans-serif',
    heading: '"Figtree Variable", sans-serif',
    sameDocument: true,
  });
  expect(await menuClasses(frame)).toEqual(['cn-menu-translucent']);
  expect(await frame.evaluate(() => document.fonts.check('1em "Figtree Variable"'))).toBe(true);
});

test('the preview follows the color mode of the page around it', async ({ page }) => {
  const frame = await embed(page, DEFAULT_PRESETS.nova);
  const background = () => frame.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--background'));
  await expect.poll(background).toBe('oklch(1 0 0)');

  await page.evaluate(() => localStorage.setItem('theme', 'dark'));
  await expect(frame.locator('html')).toHaveClass(/\bdark\b/);
  await expect.poll(background).toBe('oklch(0.145 0 0)');
});
