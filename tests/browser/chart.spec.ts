import { expect, test, type Page } from '@playwright/test';

async function open(page: Page) {
  await page.goto('/chart');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  await expect(bars(page, 'bars')).toHaveCount(8);
}

const chart = (page: Page, id: string) => page.locator(`[data-chart=chart-${id}]`);
const bars = (page: Page, id: string) => chart(page, id).locator('.recharts-bar-rectangle path');
const tooltip = (page: Page, id: string) => chart(page, id).locator('.recharts-tooltip-wrapper');
/** The text a reader sees, one space between blocks: the content has no whitespace between its elements, as upstream. */
const read = (page: Page, id: string) => () => tooltip(page, id).evaluate((element) => (element as HTMLElement).innerText.replace(/\s+/g, ' ').trim());

/** Hovers the middle of a bar, which puts the pointer over its category. */
async function hoverBar(page: Page, id: string, index: number) {
  const bar = bars(page, id).nth(index);
  await bar.scrollIntoViewIfNeeded();
  const box = (await bar.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
}

async function firstTooltip(page: Page, id: string) {
  await open(page);
  await hoverBar(page, id, 0);
  return read(page, id);
}

const fill = (page: Page, id: string, index: number) => bars(page, id).nth(index).evaluate((element) => getComputedStyle(element).fill);

test('hovering a bar shows the month and each series with its config label and value', async ({ page }) => {
  await open(page);
  await hoverBar(page, 'bars', 1);
  await expect.poll(read(page, 'bars')).toBe('February Desktop 305 Mobile 200');
  await expect(tooltip(page, 'bars').locator('[style*="--color-border"]').first()).toHaveCSS('border-top-color', 'rgb(37, 99, 235)');
  await page.mouse.move(0, 0);
  await expect.poll(read(page, 'bars')).toBe('');
});

test('focusing the chart shows the first category, the arrow keys step through the categories and blur hides the tooltip', async ({ page }) => {
  await open(page);
  const surface = chart(page, 'bars').locator('svg.recharts-surface');
  const content = read(page, 'bars');
  await expect(surface).toHaveAttribute('tabindex', '0');
  await expect(surface).toHaveAttribute('role', 'application');
  await surface.focus();
  await expect.poll(content).toBe('January Desktop 186 Mobile 80');
  await page.keyboard.press('ArrowRight');
  await expect.poll(content).toBe('February Desktop 305 Mobile 200');
  await page.keyboard.press('ArrowLeft');
  await expect.poll(content).toBe('January Desktop 186 Mobile 80');
  await surface.blur();
  await expect.poll(content).toBe('');
});

test('the legend lists the config labels in order with their colors, below the plot', async ({ page }) => {
  await open(page);
  const items = chart(page, 'bars').locator('.recharts-legend-wrapper > div > div');
  await expect(items).toHaveText(['Desktop', 'Mobile']);
  await expect(items.nth(0).locator('div')).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(items.nth(1).locator('div')).toHaveCSS('background-color', 'rgb(220, 38, 38)');
  await expect(chart(page, 'bars').locator('.recharts-cartesian-axis-tick-value')).toHaveCount(4);
  const legend = (await items.first().boundingBox())!;
  const labels = await chart(page, 'bars').locator('.recharts-cartesian-axis-tick-value').evaluateAll((nodes) => Math.max(...nodes.map((node) => node.getBoundingClientRect().bottom)));
  expect(legend.y).toBeGreaterThanOrEqual(labels);
});

test('config colors fill the marks and a theme color follows the dark class', async ({ page }) => {
  await open(page);
  expect(await fill(page, 'bars', 0)).toBe('rgb(37, 99, 235)');
  expect(await fill(page, 'bars', 4)).toBe('rgb(220, 38, 38)');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  expect(await fill(page, 'bars', 0)).toBe('rgb(37, 99, 235)');
  expect(await fill(page, 'bars', 4)).toBe('rgb(250, 204, 21)');
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  expect(await fill(page, 'bars', 4)).toBe('rgb(220, 38, 38)');
});

test('the chart follows the width of its container', async ({ page }) => {
  await open(page);
  const width = () => chart(page, 'bars').locator('svg.recharts-surface').evaluate((svg) => svg.getBoundingClientRect().width);
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

test('a series with no value at the hovered category gets no row', async ({ page }) => {
  await expect.poll(await firstTooltip(page, 'gaps')).toBe('January Desktop 186');
});

test('a labelFormatter result is shown even when it is falsy', async ({ page }) => {
  await expect.poll(await firstTooltip(page, 'formatted')).toBe('0 Desktop 186 Mobile 80');
});

test('the formatter snippet replaces the content of each row', async ({ page }) => {
  await expect.poll(await firstTooltip(page, 'valued')).toBe('January desktop=186 mobile=80');
});

test('the legend shows nothing for a series with no config label', async ({ page }) => {
  await open(page);
  await expect(chart(page, 'unlisted').locator('.recharts-legend-wrapper > div > div')).toHaveText(['Desktop', '']);
});

test('the tooltip takes its look from the style', async ({ page }) => {
  await firstTooltip(page, 'bars');
  const content = tooltip(page, 'bars').locator('> div');
  await expect(content).toHaveCSS('border-top-width', '1px');
  // One style per document, as the Create preview switches it on <body>.
  await page.evaluate(() => document.body.classList.replace('style-nova', 'style-luma'));
  await expect(content).toHaveCSS('border-top-width', '0px');
  await expect(content).toHaveCSS('border-top-left-radius', '14px');
});

test.describe('docs blocks', () => {
  test.use({ baseURL: 'http://127.0.0.1:5175' });

  test('x-axis labels sit as far below the bars as upstream tickMargin puts them', async ({ page }) => {
    await page.goto('/view/preview-02');
    await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 30_000 });
    const gap = (title: string) =>
      page.locator('[data-slot=card]', { hasText: title }).locator('[data-slot=chart]').evaluate((chart) => {
        const bottom = Math.max(...[...chart.querySelectorAll('.recharts-bar-rectangle path')].map((bar) => bar.getBoundingClientRect().bottom));
        const top = Math.min(...[...chart.querySelectorAll('.recharts-cartesian-axis-tick-value')].map((label) => label.getBoundingClientRect().top));
        return top - bottom;
      });
    await expect.poll(async () => [Math.round(await gap('Contribution History')), Math.round(await gap('Power Usage'))]).toEqual([11, 9]);
  });
});
