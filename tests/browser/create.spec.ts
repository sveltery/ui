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

const chevron = (frame: Frame) => frame.locator('[data-slot=select-trigger] svg').first().innerHTML();

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
  // It walks every picker and reloads the preview twice: 16s alone on one worker, and past 30s on a loaded parallel runner.
  test.slow();
  await page.goto('/create');
  await expect(page.getByRole('link', { name: 'Create', exact: true })).toHaveAttribute('data-active', 'true');
  const frame = await preview(page);
  await expect.poll(() => code(page)).toBe(encodePreset(DEFAULT));
  const lucide = await chevron(frame);

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
  await expect.poll(() => chevron(frame), 'the preview icons follow the icon library').not.toBe(lucide);
  const phosphor = await chevron(frame);

  await pickAll([
    ['Theme', 'Blue', { theme: 'blue' }],
    ['Chart Color', 'Rose', { chartColor: 'rose' }],
    ['Menu', 'Inverted', { menuColor: 'inverted' }],
    ['Menu Accent', 'Bold', { menuAccent: 'bold' }],
  ]);
  expect(await frame.evaluate(() => 'received' in window), 'the preview never reloaded').toBe(true);

  const shared = page.url();
  await page.reload();
  const reopened = await preview(page);
  await expect.poll(() => page.url(), 'the reopened page keeps the shared link').toBe(shared);
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
  await expect.poll(() => chevron(reopened)).toBe(phosphor);
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
  const before = code(page);
  await expect
    .poll(async () => {
      await page.getByRole('button', { name: 'Shuffle' }).click();
      await expect(trigger(page, 'Style')).toHaveText(/Lyra/);
      await expect(trigger(page, 'Font')).toHaveText(/Geist Mono/);
      return code(page);
    })
    .not.toBe(before);

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
  await expect.poll(() => page.locator('iframe[title=Preview]').getAttribute('src')).toBe(`/preview/preview-03?preset=${code(page)}`);
});

test('hovering an option previews it without committing, and leaving the menu reverts it', async ({ page }) => {
  await page.goto('/create');
  const frame = await preview(page);
  await trigger(page, 'Style').click();
  await page.getByRole('menuitemradio', { name: 'Lyra', exact: true }).hover();
  await expect.poll(() => received(frame)).toBe(encodePreset({ ...DEFAULT, style: 'lyra' }));
  expect(code(page)).toBe(encodePreset(DEFAULT));
  await page.keyboard.press('Escape');
  await expect.poll(() => received(frame)).toBe(encodePreset(DEFAULT));
});

test('style and menu rules hold the options upstream allows', async ({ page }) => {
  await page.goto(`/create?preset=${encodePreset({ ...DEFAULT, radius: 'large' })}`);
  await pick(page, 'Style', 'Sera');
  await expect(trigger(page, 'Radius')).toBeDisabled();
  await expect(trigger(page, 'Radius')).toHaveText(/None/);
  await pick(page, 'Style', 'Rhea');
  await trigger(page, 'Radius').click();
  await expect(page.getByRole('menuitemradio', { name: 'Large' })).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('Escape');

  await pick(page, 'Menu Accent', 'Bold');
  await pick(page, 'Menu', 'Translucent');
  await expect(trigger(page, 'Menu Accent')).toHaveText(/Subtle/);
  await pick(page, 'Menu', 'Solid');
  await expect(trigger(page, 'Menu Accent')).toHaveText(/Bold/);

  await pick(page, 'Heading', 'Figtree');
  await pick(page, 'Font', 'Figtree');
  await expect(trigger(page, 'Heading')).toHaveText(/Figtree/);
  await expect.poll(() => code(page)).toBe(encodePreset({ ...DEFAULT, style: 'rhea', radius: 'large', menuAccent: 'bold', font: 'figtree' }));
});

test('links and Back to another preset load it into the pickers', async ({ page }) => {
  await page.goto('/create');
  await preview(page);
  await pick(page, 'Style', 'Maia');
  await pick(page, 'Style', 'Lyra');
  await page.goBack();
  await expect(trigger(page, 'Style')).toHaveText(/Maia/);
  await expect.poll(() => code(page)).toBe(encodePreset({ ...DEFAULT, style: 'maia' }));
  await page.getByRole('link', { name: 'Create', exact: true }).click();
  await expect(trigger(page, 'Style')).toHaveText(/Nova/);
  await expect.poll(() => code(page)).toBe(encodePreset(DEFAULT));
});

test('the keyboard shortcuts shuffle, reset and open a preset', async ({ page }) => {
  await page.goto(`/create?preset=${encodePreset({ ...DEFAULT, style: 'maia' })}`);
  await preview(page);
  await page.getByRole('button', { name: 'Lock Style' }).click();
  const before = code(page);
  await page.keyboard.press('r');
  await expect.poll(() => code(page)).not.toBe(before);
  await page.keyboard.press('Shift+R');
  await expect(page.getByRole('alertdialog')).toBeVisible();
  await page.keyboard.press('Shift+R');
  await expect(page.getByRole('alertdialog')).toBeHidden();
  await expect.poll(() => code(page)).toBe(encodePreset(DEFAULT_PRESETS.maia));
  await page.keyboard.press('o');
  await expect(page.getByLabel('Preset code')).toBeVisible();
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
  const popup = await page.getByRole('menu').boundingBox();
  const card = await page.locator('[data-slot=card]').filter({ has: trigger(page, 'Style') }).boundingBox();
  expect(popup!.y + popup!.height).toBeLessThanOrEqual(card!.y);
  await page.getByRole('menuitemradio', { name: 'Luma' }).click();
  await expect(page.getByRole('menu')).toBeHidden();
  await expect.poll(() => code(page)).toBe(encodePreset({ ...DEFAULT, style: 'luma' }));
});
