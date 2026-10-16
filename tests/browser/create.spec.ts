import { expect, test, type Frame, type Page } from '@playwright/test';
import cliPackage from '../../packages/cli/package.json' with { type: 'json' };
import { DEFAULT_PRESETS, encodePreset, type PresetConfig } from '../../packages/cli/src/preset/index';

test.use({ baseURL: 'http://127.0.0.1:5175' });

const DEFAULT: Required<PresetConfig> = { style: 'nova', baseColor: 'neutral', theme: 'neutral', chartColor: 'neutral', iconLibrary: 'lucide', font: 'inter', fontHeading: 'inherit', radius: 'default', menuAccent: 'subtle', menuColor: 'default' };

function code(page: Page) {
  return new URL(page.url()).searchParams.get('preset');
}

/** The preview frame, once its block has rendered. Records every config the page posts to it. */
async function preview(page: Page): Promise<Frame> {
  const frame = (await (await page.locator('iframe[title=Preview]').elementHandle())!.contentFrame())!;
  await expect(frame.locator('[data-slot=card]').first()).toBeVisible({ timeout: 60_000 });
  await frame.evaluate(() => {
    const w = window as unknown as { received: string[] };
    w.received = [];
    addEventListener('message', (event) => w.received.push(event.data.preset));
  });
  return frame;
}

/** A customizer picker, found by its label. */
const trigger = (page: Page, label: string) => page.locator('[data-slot=picker-trigger]').filter({ has: page.getByText(label, { exact: true }) });

const received = (frame: Frame) => frame.evaluate(() => (window as unknown as { received?: string[] }).received?.at(-1));

async function pick(page: Page, label: string, option: string) {
  await trigger(page, label).click();
  await page.getByRole('menuitemradio', { name: option, exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
}

const frameStyle = (frame: Frame) =>
  frame.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return {
      style: [...document.body.classList].filter((name) => name.startsWith('style-')),
      primary: root.getPropertyValue('--primary'),
      radius: root.getPropertyValue('--radius'),
      body: getComputedStyle(document.body).fontFamily,
      heading: getComputedStyle(document.querySelector('.cn-card-title')!).fontFamily,
    };
  });

test('every picker updates the URL code and the preview without a reload, and the link reopens the setup', async ({ page }) => {
  await page.goto('/create');
  await expect(page.getByRole('link', { name: 'Create', exact: true })).toHaveAttribute('data-active', 'true');
  const frame = await preview(page);
  await expect.poll(() => code(page)).toBe(encodePreset(DEFAULT));

  const pickAll = async (steps: [label: string, option: string, patch: Partial<PresetConfig>][]) => {
    for (const [label, option, patch] of steps) {
      config = { ...config, ...patch };
      await pick(page, label, option);
      await expect.poll(() => code(page), `${label} writes the URL`).toBe(encodePreset(config));
      await expect.poll(() => received(frame), `${label} reaches the preview`).toBe(encodePreset(config));
    }
  };
  let config = DEFAULT;
  await pickAll([
    ['Style', 'Maia', { style: 'maia' }],
    // Zinc does not allow a neutral theme or chart, so both follow the base color.
    ['Base Color', 'Zinc', { baseColor: 'zinc', theme: 'zinc', chartColor: 'zinc' }],
    ['Heading', 'Playfair Display', { fontHeading: 'playfair-display' }],
    ['Font', 'Figtree', { font: 'figtree' }],
    ['Icon Library', 'Phosphor Icons', { iconLibrary: 'phosphor' }],
    ['Radius', 'Large', { radius: 'large' }],
  ]);
  await expect
    .poll(() => frameStyle(frame))
    .toEqual({ style: ['style-maia'], primary: 'oklch(0.21 0.006 285.885)', radius: '0.875rem', body: '"Figtree Variable", sans-serif', heading: '"Playfair Display Variable", serif' });

  await pickAll([
    ['Theme', 'Blue', { theme: 'blue' }],
    ['Chart Color', 'Rose', { chartColor: 'rose' }],
    ['Menu', 'Inverted', { menuColor: 'inverted' }],
    ['Menu Accent', 'Bold', { menuAccent: 'bold' }],
  ]);
  expect(await frame.evaluate(() => 'received' in window), 'the preview never reloaded').toBe(true);

  const shared = page.url();
  await page.reload();
  expect(page.url()).toBe(shared);
  const reopened = await preview(page);
  for (const [label, display] of [
    ['Style', 'Maia'],
    ['Base Color', 'Zinc'],
    ['Theme', 'Blue'],
    ['Chart Color', 'Rose'],
    ['Heading', 'Playfair Display'],
    ['Font', 'Figtree'],
    ['Icon Library', 'Phosphor Icons'],
    ['Radius', 'Large'],
    ['Menu', 'Inverted / Solid'],
    ['Menu Accent', 'Bold'],
  ]) {
    await expect(trigger(page, label!)).toHaveText(new RegExp(`${label}\\s*${display}`));
  }
  await expect.poll(() => frameStyle(reopened)).toMatchObject({ style: ['style-maia'], body: '"Figtree Variable", sans-serif', heading: '"Playfair Display Variable", serif' });
  await expect(page.getByRole('button', { name: `--preset ${encodePreset(config)}` })).toBeVisible();
});

test('the command box shows the init command for the chosen package manager', async ({ page }) => {
  const preset = encodePreset(DEFAULT_PRESETS.sera);
  await page.goto(`/create?preset=${preset}`);
  await page.getByRole('button', { name: 'Get Code' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('[data-slot=init-command]:visible')).toHaveText([`pnpm dlx ${cliPackage.name} init --preset ${preset}`]);
  await dialog.getByRole('tab', { name: 'npm', exact: true }).click();
  await expect(dialog.locator('[data-slot=init-command]:visible')).toHaveText([`npx ${cliPackage.name} init --preset ${preset}`]);
  await dialog.getByRole('tab', { name: 'bun', exact: true }).click();
  await expect(dialog.locator('[data-slot=init-command]:visible')).toHaveText([`bunx --bun ${cliPackage.name} init --preset ${preset}`]);
});

test('Shuffle keeps locked fields, Reset restores the style preset, and Open loads a pasted code', async ({ page }) => {
  await page.goto(`/create?preset=${encodePreset({ ...DEFAULT, style: 'lyra', font: 'geist-mono' })}`);
  await expect(trigger(page, 'Style')).toHaveText(/Lyra/);

  await page.getByRole('button', { name: 'Lock Style' }).click();
  await page.getByRole('button', { name: 'Lock Font' }).click();
  // A curated preset can match the locked fields, so one shuffle may leave the code as it was.
  const codes = new Set([code(page)]);
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: 'Shuffle' }).click();
    await expect(trigger(page, 'Style')).toHaveText(/Lyra/);
    await expect(trigger(page, 'Font')).toHaveText(/Geist Mono/);
    codes.add(code(page));
  }
  expect(codes.size).toBeGreaterThan(1);

  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('menuitem', { name: /Reset/ }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Reset' }).click();
  await expect.poll(() => code(page)).toBe(encodePreset(DEFAULT_PRESETS.lyra));

  const sera = encodePreset(DEFAULT_PRESETS.sera);
  await page.getByRole('button', { name: 'Open Preset' }).click();
  await page.getByLabel('Preset code').fill(`https://ui.sveltery.dev/create?preset=${sera}`);
  await page.getByRole('dialog').getByRole('button', { name: 'Open', exact: true }).click();
  await expect.poll(() => code(page)).toBe(sera);
  await expect(trigger(page, 'Heading')).toHaveText(/Playfair Display/);
});

test('the preview switcher changes the block and keeps it in the URL', async ({ page }) => {
  await page.goto('/create');
  await preview(page);
  await page.getByRole('button', { name: 'Preview 03' }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get('item')).toBe('preview-03');
  await expect.poll(() => page.locator('iframe[title=Preview]').getAttribute('src')).toMatch(/^\/preview\/preview-03\?preset=/);
});

test('on a phone the pickers scroll in a row and open above the card', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/create');
  await expect(page.getByRole('button', { name: 'Get Code' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open', exact: true })).toBeVisible();
  const style = await trigger(page, 'Style').boundingBox();
  const base = await trigger(page, 'Base Color').boundingBox();
  expect(base!.y).toBe(style!.y);
  await trigger(page, 'Style').click();
  await page.getByRole('menuitemradio', { name: 'Luma' }).click();
  await expect(page.getByRole('menu')).toBeHidden();
  await expect.poll(() => code(page)).toBe(encodePreset({ ...DEFAULT, style: 'luma' }));
});
