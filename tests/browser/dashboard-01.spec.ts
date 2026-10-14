import { expect, test, type Locator, type Page } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

/** Errors the page logged; every test ends by expecting none. */
let errors: string[] = [];
test.afterEach(() => {
  expect(errors).toEqual([]);
});

async function visit(page: Page) {
  errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto('/view/dashboard-01');
  await expect(page.locator('html')).toHaveAttribute('data-ready');
}

const headers = (page: Page) => page.locator('tbody tr td:nth-child(3)');
/** Each element's text with its whitespace collapsed, as a reader sees it. */
const texts = (locator: Locator) => locator.evaluateAll((elements) => elements.map((element) => element.textContent!.replace(/\s+/g, ' ').trim()));
const footer = (page: Page) => page.getByText(/row\(s\) selected\./);
const pageLabel = (page: Page) => page.getByText(/^Page \d+ of \d+$/);

const tooltip = (page: Page) => texts(page.locator('[data-slot=chart] .lc-tooltip-root'));

/** The tooltip of the first or last day the chart shows, read by hovering the edge of the plot. */
async function day(page: Page, edge: 'first' | 'last') {
  const area = page.locator('[data-slot=chart] path.lc-area-path').first();
  await area.scrollIntoViewIfNeeded();
  const plot = (await area.boundingBox())!;
  await page.mouse.move(edge === 'first' ? plot.x + 1 : plot.x + plot.width - 1, plot.y + plot.height / 2);
  return tooltip(page);
}

test('renders the sidebar, the cards, the chart and the first page of the table', async ({ page }) => {
  await visit(page);
  const sidebar = page.locator('[data-slot=sidebar]');
  await expect(sidebar.getByRole('link', { name: 'Acme Inc.' })).toBeVisible();
  await expect.poll(() => texts(sidebar.locator('[data-slot=sidebar-menu-button]'))).toEqual([
    'Acme Inc.', 'Quick Create', 'Dashboard', 'Lifecycle', 'Analytics', 'Projects', 'Team', 'Data Library', 'Reports', 'Word Assistant', 'More', 'Settings', 'Get Help', 'Search',
  ]);
  await expect(page.locator('[data-slot=card-title]')).toHaveText(['$1,250.00', '1,234', '45,678', '4.5%', 'Total Visitors']);
  await expect(page.locator('[data-slot=chart] path.lc-area-path')).toHaveCount(2);
  await expect(page.locator('thead th')).toHaveText(['', '', 'Header', 'Section Type', 'Status', 'Target', 'Limit', 'Reviewer', '']);
  await expect(headers(page)).toHaveCount(10);
  await expect(headers(page).first()).toHaveText('Cover page');
  await expect(headers(page).last()).toHaveText('Advanced Algorithms and Machine Learning');
  await expect.poll(() => texts(page.locator('tbody tr').first().locator('td'))).toEqual(['Drag to reorder', '', 'Cover page', 'Cover page', 'In Process', 'Target', 'Limit', 'Eddie Lake', 'Open menu']);
  await expect(page.getByRole('textbox', { name: 'Target' }).first()).toHaveValue('18');
  await expect(footer(page)).toHaveText('0 of 68 row(s) selected.');
  await expect(pageLabel(page)).toHaveText('Page 1 of 7');
});

test('the document and user menus open', async ({ page }) => {
  await visit(page);
  const document = page.locator('[data-slot=sidebar-menu-item]', { hasText: 'Reports' });
  await document.hover();
  await document.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('menuitem')).toHaveText(['Open', 'Share', 'Delete']);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menuitem')).toHaveCount(0);

  await page.getByRole('button', { name: 'shadcn m@example.com' }).click();
  await expect(page.getByRole('menuitem')).toHaveText(['Account', 'Billing', 'Notifications', 'Log out']);
});

test('the time range toggle group changes the days the chart shows', async ({ page }) => {
  await visit(page);
  const ranges = page.locator('[data-slot=toggle-group-item]');
  await expect(ranges).toHaveText(['Last 3 months', 'Last 30 days', 'Last 7 days']);
  await expect(ranges.first()).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => day(page, 'first')).toEqual(['Apr 1 Desktop 222 Mobile 150']);

  await page.getByRole('button', { name: 'Last 7 days' }).click();
  await expect(ranges.last()).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => day(page, 'first')).toEqual(['Jun 23 Desktop 480 Mobile 530']);
  await expect.poll(() => day(page, 'last')).toEqual(['Jun 30 Desktop 446 Mobile 400']);

  await page.getByRole('button', { name: 'Last 30 days' }).click();
  await expect.poll(() => day(page, 'first')).toEqual(['May 31 Desktop 178 Mobile 230']);
});

test('on a phone the chart starts on the last 7 days and the select changes the range', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page);
  await expect(page.locator('[data-slot=toggle-group]')).toBeHidden();
  const select = page.getByRole('combobox', { name: 'Select a value' });
  await expect(select).toHaveText('Last 7 days');
  await expect.poll(() => day(page, 'first')).toEqual(['Jun 23 Desktop 480 Mobile 530']);

  await select.click();
  await page.getByRole('option', { name: 'Last 30 days' }).click();
  await expect(select).toHaveText('Last 30 days');
  await expect.poll(() => day(page, 'first')).toEqual(['May 31 Desktop 178 Mobile 230']);
});

test('the pager moves through the pages and the page size keeps the first row in view', async ({ page }) => {
  await visit(page);
  await page.getByRole('button', { name: 'Go to next page' }).click();
  await expect(pageLabel(page)).toHaveText('Page 2 of 7');
  await expect(headers(page).first()).toHaveText('Adaptive Communication Protocols');
  await expect(page.getByRole('button', { name: 'Go to previous page' })).toBeEnabled();

  await page.getByRole('button', { name: 'Go to last page' }).click();
  await expect(pageLabel(page)).toHaveText('Page 7 of 7');
  await expect(headers(page)).toHaveCount(8);
  await expect(page.getByRole('button', { name: 'Go to next page' })).toBeDisabled();

  const size = page.getByRole('combobox', { name: 'Rows per page' });
  await expect(size).toHaveText('10');
  await size.click();
  await expect(page.getByRole('option')).toHaveText(['10', '20', '30', '40', '50']);
  await page.getByRole('option', { name: '20' }).click();
  await expect(size).toHaveText('20');
  // Row 61 was on top of page 7; with 20 rows a page it is on page 4.
  await expect(pageLabel(page)).toHaveText('Page 4 of 4');
  await expect(headers(page)).toHaveCount(8);

  await page.getByRole('button', { name: 'Go to first page' }).click();
  await expect(pageLabel(page)).toHaveText('Page 1 of 4');
  await expect(headers(page)).toHaveCount(20);
  await expect(page.getByRole('button', { name: 'Go to first page' })).toBeDisabled();
});

test('the checkboxes select rows and the header checkbox selects the page', async ({ page }) => {
  await visit(page);
  const all = page.getByRole('checkbox', { name: 'Select all' });
  const rows = page.getByRole('checkbox', { name: 'Select row' });
  await rows.nth(1).click();
  await expect(rows.nth(1)).toBeChecked();
  await expect(page.locator('tbody tr').nth(1)).toHaveAttribute('data-state', 'selected');
  await expect(page.locator('tbody tr').nth(0)).not.toHaveAttribute('data-state');
  await expect(all).toHaveAttribute('aria-checked', 'mixed');
  await expect(footer(page)).toHaveText('1 of 68 row(s) selected.');

  await all.click();
  await expect(all).toBeChecked();
  await expect(footer(page)).toHaveText('10 of 68 row(s) selected.');

  await page.getByRole('button', { name: 'Go to next page' }).click();
  await expect(all).not.toBeChecked();
  await all.click();
  await expect(footer(page)).toHaveText('20 of 68 row(s) selected.');
  await all.click();
  await expect(footer(page)).toHaveText('10 of 68 row(s) selected.');
});

test('the columns menu hides and shows a column', async ({ page }) => {
  await visit(page);
  await page.getByRole('button', { name: 'Columns' }).click();
  const items = page.getByRole('menuitemcheckbox');
  await expect(items).toHaveText(['type', 'status', 'target', 'limit', 'reviewer']);
  await expect(items.nth(1)).toBeChecked();
  await items.nth(1).click();
  await expect(items.nth(1)).not.toBeChecked();
  await expect(page.locator('thead th')).toHaveText(['', '', 'Header', 'Section Type', 'Target', 'Limit', 'Reviewer', '']);
  await expect(page.locator('tbody')).not.toContainText('In Process');

  await items.nth(1).click();
  await expect(page.locator('thead th')).toHaveText(['', '', 'Header', 'Section Type', 'Status', 'Target', 'Limit', 'Reviewer', '']);
  await expect(page.locator('tbody tr').first()).toContainText('In Process');
});

test('dragging a row by its handle moves it', async ({ page }) => {
  await visit(page);
  const handles = page.getByRole('button', { name: 'Drag to reorder' });
  await handles.nth(3).scrollIntoViewIfNeeded();
  const from = (await handles.nth(0).boundingBox())!;
  const to = (await handles.nth(2).boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2, to.y + to.height / 2 + 10, { steps: 8 });
  await expect(page.locator('tbody tr').first()).toHaveAttribute('data-dragging', 'true');
  await page.mouse.up();
  await expect(headers(page).nth(0)).toHaveText('Table of contents');
  await expect(headers(page).nth(1)).toHaveText('Executive summary');
  await expect(headers(page).nth(2)).toHaveText('Cover page');
  await expect(page.locator('tbody tr[data-dragging=true]')).toHaveCount(0);
});

test('the arrow keys move a row from its focused handle', async ({ page }) => {
  await visit(page);
  const handle = page.getByRole('button', { name: 'Drag to reorder' }).first();
  await handle.focus();
  await page.keyboard.press('ArrowDown');
  await expect(headers(page).nth(0)).toHaveText('Table of contents');
  await expect(headers(page).nth(1)).toHaveText('Cover page');
  await expect(page.getByRole('status')).toHaveText('Cover page moved to row 2 of 10.');
  await page.keyboard.press('ArrowDown');
  await expect(headers(page).nth(2)).toHaveText('Cover page');
  await page.keyboard.press('ArrowUp');
  await expect(headers(page).nth(1)).toHaveText('Cover page');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(headers(page).nth(0)).toHaveText('Cover page');
  await expect(headers(page).nth(1)).toHaveText('Table of contents');
});

test('a row header opens its drawer with the row in the form', async ({ page }) => {
  await visit(page);
  await page.getByRole('button', { name: 'Technical approach' }).click();
  const drawer = page.getByRole('dialog', { name: 'Technical approach' });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText('Trending up by 5.2% this month')).toBeVisible();
  await expect(drawer.getByRole('textbox', { name: 'Header' })).toHaveValue('Technical approach');
  await expect(drawer.getByRole('textbox', { name: 'Target' })).toHaveValue('27');
  await expect(drawer.getByRole('textbox', { name: 'Limit' })).toHaveValue('23');
  await expect(drawer.getByRole('combobox', { name: 'Reviewer' })).toHaveText('Jamik Tashpulatov');
  await drawer.getByRole('button', { name: 'Done' }).click();
  await expect(drawer).toBeHidden();
});

test('submitting a target shows a saving toast', async ({ page }) => {
  await visit(page);
  await page.getByRole('textbox', { name: 'Target' }).first().press('Enter');
  const toasts = page.getByRole('region', { name: 'Notifications' });
  await expect(toasts.getByText('Saving Cover page')).toBeVisible();
  await expect(toasts.getByText('Done', { exact: true })).toBeVisible();
});
