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

/** Each ChartContainer keeps the height class of its upstream card, so none may collapse to zero. */
const chartHeights: Record<string, string[]> = {
  preview: ['Desktop and mobile traffic by month 180', 'Browser share 190', 'Sleep stages by hour 128', 'Visitors by month 133', 'Visitors by month 192'],
  'preview-02': [
    'Contributions by month 200',
    'Vanguard VIG quarterly dividends 32',
    'S&P 500 VOO quarterly dividends 32',
    'Apple AAPL quarterly dividends 32',
    'Realty Income quarterly dividends 32',
    'Savings progress 220',
    'Yearly activity by month 80',
    'Power usage by hour 140',
    'Price by month 200'
  ]
};

for (const [name, expected] of Object.entries(chartHeights)) {
  test(`${name} charts render at their upstream heights`, async ({ page }) => {
    await visit(page, `/view/${name}`);
    const heights = page.locator('[data-slot=chart]');
    await expect(heights).toHaveCount(expected.length);
    await expect
      .poll(() => heights.evaluateAll((charts) => charts.map((chart) => `${chart.getAttribute('aria-label')} ${Math.round(chart.getBoundingClientRect().height)}`)))
      .toEqual(expected);
  });
}
