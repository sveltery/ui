import { expect, test, type Page } from '@playwright/test';

async function open(page: Page) {
  await page.goto('/chart');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  await expect(page.locator('#bars .lc-bar')).toHaveCount(8);
}

// LayerChart lays a transparent hit area over the marks, so a pointer reaches a mark only by its coordinates.
async function pointAt(page: Page, selector: string) {
  const box = (await page.locator(selector).boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
}

const fill = (page: Page, selector: string) => page.locator(selector).evaluate((element) => getComputedStyle(element).fill);

test('hovering a bar shows the month and each series with its config label and value', async ({ page }) => {
  await open(page);
  await pointAt(page, '#bars .lc-bar >> nth=1');
  const tooltip = page.locator('#bars .lc-tooltip-root');
  await expect(tooltip).toHaveText('February Desktop 305 Mobile 200');
  await expect(tooltip.locator('[style*="--color-border"]').first()).toHaveCSS('border-top-color', 'rgb(37, 99, 235)');
  await page.mouse.move(0, 0);
  await expect(tooltip).toHaveCount(0);
});

test('hovering a pie slice names the row from the config and colors its indicator from the config', async ({ page }) => {
  await open(page);
  await pointAt(page, '#pie path.lc-arc-line >> nth=0');
  const tooltip = page.locator('#pie .lc-tooltip-root');
  await expect(tooltip).toHaveText('Chrome 275');
  await expect(tooltip.locator('[style*="--color-bg"]').first()).toHaveCSS('background-color', 'rgb(34, 197, 94)');
});

test('arrow keys, Home and End step through the data points and Escape or blur hides the tooltip', async ({ page }) => {
  await open(page);
  const chart = page.locator('#bars');
  const tooltip = chart.locator('.lc-tooltip-root');
  await expect(chart).toHaveAttribute('tabindex', '0');
  await chart.focus();
  await expect(tooltip).toHaveCount(0);
  await page.keyboard.press('ArrowRight');
  await expect(tooltip).toHaveText('January Desktop 186 Mobile 80');
  await page.keyboard.press('ArrowDown');
  await expect(tooltip).toHaveText('February Desktop 305 Mobile 200');
  await page.keyboard.press('ArrowLeft');
  await expect(tooltip).toHaveText('January Desktop 186 Mobile 80');
  await page.keyboard.press('ArrowLeft');
  await expect(tooltip).toHaveText('January Desktop 186 Mobile 80');
  await page.keyboard.press('End');
  await expect(tooltip).toHaveText('April Desktop 73 Mobile 190');
  await page.keyboard.press('ArrowUp');
  await expect(tooltip).toHaveText('March Desktop 237 Mobile 120');
  await page.keyboard.press('Home');
  await expect(tooltip).toHaveText('January Desktop 186 Mobile 80');
  await page.keyboard.press('Escape');
  await expect(tooltip).toHaveCount(0);
  await page.keyboard.press('End');
  await expect(tooltip).toHaveText('April Desktop 73 Mobile 190');
  await chart.blur();
  await expect(tooltip).toHaveCount(0);
});

test('the legend lists the config labels in order with their colors, below the plot', async ({ page }) => {
  await open(page);
  const items = page.locator('#bars').getByText('Desktop').locator('..').locator('> div');
  await expect(items).toHaveText(['Desktop', 'Mobile']);
  await expect(items.nth(0).locator('div')).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(items.nth(1).locator('div')).toHaveCSS('background-color', 'rgb(220, 38, 38)');
  const legend = (await items.first().locator('..').boundingBox())!;
  const labels = await page.locator('#bars .lc-axis-tick-label').evaluateAll((nodes) => Math.max(...nodes.map((node) => node.getBoundingClientRect().bottom)));
  expect(legend.y).toBeGreaterThanOrEqual(labels);

  const slices = page.locator('#pie').getByText('Chrome').locator('..').locator('> div');
  await expect(slices).toHaveText(['Chrome', 'Safari', 'Firefox']);
  await expect(slices.nth(2).locator('div')).toHaveCSS('background-color', 'rgb(249, 115, 22)');
});

test('config colors fill the marks and a theme color follows the dark class', async ({ page }) => {
  await open(page);
  expect(await fill(page, '#bars .lc-bar >> nth=0')).toBe('rgb(37, 99, 235)');
  expect(await fill(page, '#bars .lc-bar >> nth=4')).toBe('rgb(220, 38, 38)');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  expect(await fill(page, '#bars .lc-bar >> nth=0')).toBe('rgb(37, 99, 235)');
  expect(await fill(page, '#bars .lc-bar >> nth=4')).toBe('rgb(250, 204, 21)');
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  expect(await fill(page, '#bars .lc-bar >> nth=4')).toBe('rgb(220, 38, 38)');
});

test('the chart follows the width of its container', async ({ page }) => {
  await open(page);
  const width = () => page.locator('#bars svg.lc-layout-svg').first().evaluate((svg) => svg.getBoundingClientRect().width);
  await expect.poll(width).toBe(600);
  await page.locator('#wrapper').evaluate((wrapper) => (wrapper.style.width = '420px'));
  await expect.poll(width).toBe(420);
  await page.locator('#wrapper').evaluate((wrapper) => (wrapper.style.width = '800px'));
  await expect.poll(width).toBe(800);
});
