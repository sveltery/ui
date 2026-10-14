import { expect, test, type Page } from '@playwright/test';

async function open(page: Page) {
  await page.goto('/chart');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  await expect(page.locator('[data-chart=chart-bars] .lc-bar')).toHaveCount(8);
}

const chart = (page: Page, id: string) => page.locator(`[data-chart=chart-${id}]`);

/** Hovers the first bar of a chart and returns the chart's tooltip. */
async function firstTooltip(page: Page, id: string) {
  await open(page);
  await pointAt(page, `[data-chart=chart-${id}] .lc-bar >> nth=0`);
  return chart(page, id).locator('.lc-tooltip-root');
}

// LayerChart lays a transparent hit area over the marks, so a pointer reaches a mark only by its coordinates.
async function pointAt(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  const box = (await page.locator(selector).boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
}

const fill = (page: Page, selector: string) => page.locator(selector).evaluate((element) => getComputedStyle(element).fill);

test('hovering a bar shows the month and each series with its config label and value', async ({ page }) => {
  await open(page);
  await pointAt(page, '[data-chart=chart-bars] .lc-bar >> nth=1');
  const tooltip = page.locator('[data-chart=chart-bars] .lc-tooltip-root');
  await expect(tooltip).toHaveText('February Desktop 305 Mobile 200');
  await expect(tooltip.locator('[style*="--color-border"]').first()).toHaveCSS('border-top-color', 'rgb(37, 99, 235)');
  await page.mouse.move(0, 0);
  await expect(tooltip).toHaveCount(0);
});

test('hovering a pie slice names the row from the config and colors its indicator from the config', async ({ page }) => {
  await open(page);
  await pointAt(page, '[data-chart=chart-pie] path.lc-arc-line >> nth=0');
  const tooltip = page.locator('[data-chart=chart-pie] .lc-tooltip-root');
  await expect(tooltip).toHaveText('Chrome 275');
  await expect(tooltip.locator('[style*="--color-bg"]').first()).toHaveCSS('background-color', 'rgb(34, 197, 94)');
});

test('hovering a radial arc shows only that arc, though every arc is its own series', async ({ page }) => {
  await open(page);
  await pointAt(page, '[data-chart=chart-radial] path.lc-arc-line >> nth=0');
  await expect(page.locator('[data-chart=chart-radial] .lc-tooltip-root')).toHaveText(/^\s*(Chrome 275|Safari 200|Firefox 187)$/);
});

test('the legend lists the config labels in order with their colors, below the plot', async ({ page }) => {
  await open(page);
  const items = page.locator('[data-chart=chart-bars]').getByText('Desktop').locator('..').locator('> div');
  await expect(items).toHaveText(['Desktop', 'Mobile']);
  await expect(items.nth(0).locator('div')).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(items.nth(1).locator('div')).toHaveCSS('background-color', 'rgb(220, 38, 38)');
  const legend = (await items.first().locator('..').boundingBox())!;
  const labels = await page.locator('[data-chart=chart-bars] .lc-axis-tick-label').evaluateAll((nodes) => Math.max(...nodes.map((node) => node.getBoundingClientRect().bottom)));
  expect(legend.y).toBeGreaterThanOrEqual(labels);

  const slices = page.locator('[data-chart=chart-pie]').getByText('Chrome').locator('..').locator('> div');
  await expect(slices).toHaveText(['Chrome', 'Safari', 'Firefox']);
  await expect(slices.nth(2).locator('div')).toHaveCSS('background-color', 'rgb(249, 115, 22)');
});

test('config colors fill the marks and a theme color follows the dark class', async ({ page }) => {
  await open(page);
  expect(await fill(page, '[data-chart=chart-bars] .lc-bar >> nth=0')).toBe('rgb(37, 99, 235)');
  expect(await fill(page, '[data-chart=chart-bars] .lc-bar >> nth=4')).toBe('rgb(220, 38, 38)');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  expect(await fill(page, '[data-chart=chart-bars] .lc-bar >> nth=0')).toBe('rgb(37, 99, 235)');
  expect(await fill(page, '[data-chart=chart-bars] .lc-bar >> nth=4')).toBe('rgb(250, 204, 21)');
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  expect(await fill(page, '[data-chart=chart-bars] .lc-bar >> nth=4')).toBe('rgb(220, 38, 38)');
});

test('the chart follows the width of its container', async ({ page }) => {
  await open(page);
  const width = () => page.locator('[data-chart=chart-bars] svg.lc-layout-svg').first().evaluate((svg) => svg.getBoundingClientRect().width);
  await expect.poll(width).toBe(600);
  await page.locator('#wrapper').evaluate((wrapper) => (wrapper.style.width = '420px'));
  await expect.poll(width).toBe(420);
  await page.locator('#wrapper').evaluate((wrapper) => (wrapper.style.width = '800px'));
  await expect.poll(width).toBe(800);
});

test('the id names the chart and stays off the container', async ({ page }) => {
  await open(page);
  await expect(chart(page, 'bars')).toHaveAttribute('data-slot', 'chart');
  await expect(page.locator('#bars')).toHaveCount(0);
});

test('a config without colors writes no style element', async ({ page }) => {
  await open(page);
  await expect(chart(page, 'bars').locator('> style')).toHaveCount(1);
  await expect(chart(page, 'plain').locator('> style')).toHaveCount(0);
});

// ChartTooltip stands for Recharts' Tooltip, whose filterNull drops these rows before the content renders.
test('a series with no value at the hovered row gets no row', async ({ page }) => {
  await expect(await firstTooltip(page, 'gaps')).toHaveText('January Desktop 186');
});

test('a falsy category gives no header', async ({ page }) => {
  await expect(await firstTooltip(page, 'zero')).toHaveText('Desktop 186 Mobile 80');
});

test.describe('in UTC', () => {
  test.use({ timezoneId: 'UTC' });
  test('a date category is shown as the date itself', async ({ page }) => {
    await expect(await firstTooltip(page, 'dates')).toHaveText('Mon Jan 01 2024 00:00:00 GMT+0000 (Coordinated Universal Time) Desktop 186 Mobile 80');
  });
});

test('a labelFormatter result is shown even when it is falsy', async ({ page }) => {
  await expect(await firstTooltip(page, 'formatted')).toHaveText('0 Desktop 186 Mobile 80');
});

test('the formatter skips a series whose label is empty', async ({ page }) => {
  await expect(await firstTooltip(page, 'unnamed')).toHaveText('January Desktop 186Mobile=80');
});

test('the legend shows nothing for a series with no config or series label', async ({ page }) => {
  await open(page);
  await expect(chart(page, 'unlisted').getByText('Desktop').locator('..').locator('> div')).toHaveText(['Desktop', '']);
});

test('the tooltip takes its look from the style', async ({ page }) => {
  const nova = (await firstTooltip(page, 'bars')).locator('.lc-tooltip-content > div');
  await expect(nova).toHaveCSS('border-top-width', '1px');
  const luma = (await firstTooltip(page, 'luma')).locator('.lc-tooltip-content > div');
  await expect(luma).toHaveCSS('border-top-width', '0px');
  await expect(luma).toHaveCSS('border-top-left-radius', '14px');
});
