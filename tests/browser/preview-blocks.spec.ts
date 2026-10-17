import { expect, test, type Page } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

async function visit(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 30_000 });
}

test('clearing the stock-performance combobox keeps the last ticker data', async ({ page }) => {
  await visit(page, '/view/preview-02');
  const card = page.locator('[data-slot=card]', { hasText: 'Stock Performance' });
  const ticker = card.getByRole('combobox', { name: 'Ticker' });
  await expect(ticker).toHaveValue('VOO');

  await ticker.click();
  await page.getByRole('option', { name: 'AAPL', exact: true }).click();
  await expect(ticker).toHaveValue('AAPL');

  const chart = card.locator('[data-slot=chart]');
  await chart.scrollIntoViewIfNeeded();
  const box = (await chart.boundingBox())!;
  const hoverLastPoint = () => page.mouse.move(box.x + box.width - 2, box.y + box.height / 2);
  const price = chart.locator('.tabular-nums');

  await hoverLastPoint();
  await expect(price).toHaveText('215');

  await ticker.press('Control+a');
  await ticker.press('Backspace');
  await expect(ticker).toHaveValue('');
  await hoverLastPoint();
  await expect(price).toHaveText('215');
});

/** Each ChartContainer, named by the first title or description of its card (savings-progress has none), keeps the height class of its upstream card, so none may collapse to zero. */
const chartHeights: Record<string, string[]> = {
  preview: ['Traffic channels 180', 'Browser Share 190', 'Sleep Report 128', 'Analytics 133', 'Visitors 192'],
  'preview-02': [
    'Contribution History 200',
    'Q2 Dividend Income 32',
    'Q2 Dividend Income 32',
    'Q2 Dividend Income 32',
    'Q2 Dividend Income 32',
    'Untitled 220',
    'Yearly Activity 80',
    'Power Usage 140',
    'Stock Performance 200'
  ]
};

for (const [name, expected] of Object.entries(chartHeights)) {
  test(`${name} charts render at their upstream heights`, async ({ page }) => {
    await visit(page, `/view/${name}`);
    const heights = page.locator('[data-slot=chart]');
    await expect(heights).toHaveCount(expected.length);
    await expect
      .poll(() =>
        heights.evaluateAll((charts) =>
          charts.map((chart) => `${chart.closest('[data-slot=card]')?.querySelector('[data-slot=card-title], [data-slot=card-description]')?.textContent?.trim() ?? 'Untitled'} ${Math.round(chart.getBoundingClientRect().height)}`)
        )
      )
      .toEqual(expected);
  });
}
