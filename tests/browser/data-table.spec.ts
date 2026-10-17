import { expect, test, type Locator, type Page } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

async function open(page: Page, example: string) {
  await page.goto('/docs/components/data-table');
  await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 15000 });
  const preview = page.locator(`[data-name="base/${example}"]`);
  await preview.scrollIntoViewIfNeeded();
  return preview;
}

const emails = (table: Locator) => table.locator('tbody td:nth-child(3)');
const amounts = (table: Locator) => table.locator('tbody td:nth-child(4)');

test.describe('demo table', () => {
  test('filtering by email narrows the rows', async ({ page }) => {
    const table = await open(page, 'DataTableDemoExample');
    await expect(emails(table)).toHaveText(['ken99@example.com', 'Abe45@example.com', 'Monserrat44@example.com', 'Silas22@example.com', 'carmella@example.com']);
    await table.getByPlaceholder('Filter emails...').fill('ABE');
    await expect(emails(table)).toHaveText(['Abe45@example.com']);
    await expect(table.getByText('0 of 1 row(s) selected.')).toBeVisible();
    await table.getByPlaceholder('Filter emails...').fill('example.com');
    await expect(emails(table)).toHaveCount(5);
    await table.getByPlaceholder('Filter emails...').fill('nobody');
    await expect(table.getByRole('cell', { name: 'No results.' })).toBeVisible();
    await expect(table.getByText('0 of 0 row(s) selected.')).toBeVisible();
  });

  test('the Email header sorts ascending then descending', async ({ page }) => {
    const table = await open(page, 'DataTableDemoExample');
    await table.getByRole('button', { name: 'Email' }).click();
    await expect(emails(table)).toHaveText(['Abe45@example.com', 'carmella@example.com', 'ken99@example.com', 'Monserrat44@example.com', 'Silas22@example.com']);
    await table.getByRole('button', { name: 'Email' }).click();
    await expect(emails(table)).toHaveText(['Silas22@example.com', 'Monserrat44@example.com', 'ken99@example.com', 'carmella@example.com', 'Abe45@example.com']);
  });

  test('the Columns menu hides and shows a column', async ({ page }) => {
    const table = await open(page, 'DataTableDemoExample');
    await expect(table.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await table.getByRole('button', { name: 'Columns' }).click();
    await expect(page.getByRole('menuitemcheckbox')).toHaveText([/status/, /email/, /amount/]);
    await page.getByRole('menuitemcheckbox', { name: 'Status' }).click();
    await page.keyboard.press('Escape');
    await expect(table.getByRole('columnheader', { name: 'Status' })).toHaveCount(0);
    await expect(table.getByRole('cell', { name: 'Processing' })).toHaveCount(0);
    await expect(table.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await table.getByRole('button', { name: 'Columns' }).click();
    await page.getByRole('menuitemcheckbox', { name: 'Status' }).click();
    await page.keyboard.press('Escape');
    await expect(table.getByRole('cell', { name: 'Processing' })).toBeVisible();
  });

  test('select all selects every row and the count follows the selection and the filter', async ({ page }) => {
    const table = await open(page, 'DataTableDemoExample');
    const selectAll = table.getByRole('checkbox', { name: 'Select all' });
    const rows = table.getByRole('checkbox', { name: 'Select row' });
    await expect(table.getByText('0 of 5 row(s) selected.')).toBeVisible();
    await selectAll.click();
    await expect(table.getByText('5 of 5 row(s) selected.')).toBeVisible();
    await expect(rows).toHaveCount(5);
    for (const row of await rows.all()) await expect(row).toBeChecked();
    await rows.first().click();
    await expect(table.getByText('4 of 5 row(s) selected.')).toBeVisible();
    await expect(selectAll).toHaveAttribute('aria-checked', 'mixed');
    await table.getByPlaceholder('Filter emails...').fill('abe');
    await expect(table.getByText('1 of 1 row(s) selected.')).toBeVisible();
    await selectAll.click();
    await expect(table.getByText('0 of 1 row(s) selected.')).toBeVisible();
  });

  test('the row menu lists the payment actions', async ({ page }) => {
    const table = await open(page, 'DataTableDemoExample');
    await table.getByRole('button', { name: 'Open menu' }).first().click();
    await expect(page.getByRole('menuitem')).toHaveText(['Copy payment ID', 'View customer', 'View payment details']);
  });
});

test.describe('reusable components', () => {
  test('Next and Previous move between pages of ten', async ({ page }) => {
    const table = await open(page, 'DataTableReusableExample');
    const previous = table.getByRole('button', { name: 'Go to previous page' });
    const next = table.getByRole('button', { name: 'Go to next page' });
    await expect(table.getByText('Page 1 of 3')).toBeVisible();
    await expect(emails(table)).toHaveText(Array.from({ length: 10 }, (_, i) => `user${i + 1}@example.com`));
    await expect(previous).toBeDisabled();
    await next.click();
    await expect(table.getByText('Page 2 of 3')).toBeVisible();
    await expect(emails(table)).toHaveText(Array.from({ length: 10 }, (_, i) => `user${i + 11}@example.com`));
    await next.click();
    await expect(table.getByText('Page 3 of 3')).toBeVisible();
    await expect(emails(table)).toHaveText(Array.from({ length: 5 }, (_, i) => `user${i + 21}@example.com`));
    await expect(next).toBeDisabled();
    await previous.click();
    await expect(table.getByText('Page 2 of 3')).toBeVisible();
    await expect(emails(table).first()).toHaveText('user11@example.com');
  });

  test('select all selects only the rows of the current page', async ({ page }) => {
    const table = await open(page, 'DataTableReusableExample');
    await table.getByRole('checkbox', { name: 'Select all' }).click();
    await expect(table.getByText('10 of 25 row(s) selected.')).toBeVisible();
    await table.getByRole('button', { name: 'Go to next page' }).click();
    await expect(table.getByRole('checkbox', { name: 'Select row' }).first()).not.toBeChecked();
    await table.getByRole('checkbox', { name: 'Select all' }).click();
    await expect(table.getByText('20 of 25 row(s) selected.')).toBeVisible();
  });

  test('rows per page changes the page size', async ({ page }) => {
    const table = await open(page, 'DataTableReusableExample');
    await table.getByRole('combobox').click();
    await page.getByRole('option', { name: '20' }).click();
    await expect(table.getByText('Page 1 of 2')).toBeVisible();
    await expect(emails(table)).toHaveCount(20);
  });

  test('the column header menu sorts and hides', async ({ page }) => {
    const table = await open(page, 'DataTableReusableExample');
    await table.getByRole('button', { name: 'Amount' }).click();
    await page.getByRole('menuitem', { name: 'Desc' }).click();
    await expect(amounts(table)).toHaveText(['250', '240', '230', '220', '210', '200', '190', '180', '170', '160']);
    await table.getByRole('button', { name: 'Amount' }).click();
    await page.getByRole('menuitem', { name: 'Asc' }).click();
    await expect(amounts(table)).toHaveText(['10', '20', '30', '40', '50', '60', '70', '80', '90', '100']);
    await table.getByRole('button', { name: 'Status' }).click();
    await page.getByRole('menuitem', { name: 'Hide' }).click();
    await expect(table.getByRole('columnheader', { name: 'Status' })).toHaveCount(0);
  });

  test('the View menu toggles columns', async ({ page }) => {
    const table = await open(page, 'DataTableReusableExample');
    await table.getByRole('button', { name: 'View' }).click();
    await expect(page.getByRole('menuitemcheckbox')).toHaveText([/status/, /email/, /amount/]);
    await page.getByRole('menuitemcheckbox', { name: 'Amount' }).click();
    await page.keyboard.press('Escape');
    await expect(table.getByRole('columnheader', { name: 'Amount' })).toHaveCount(0);
  });
});

test('the RTL example switches language and direction', async ({ page }) => {
  const table = await open(page, 'DataTableRtlExample');
  const container = table.locator('div[dir]').first();
  await expect(container).toHaveAttribute('dir', 'rtl');
  await expect(table.getByPlaceholder('تصفية البريد الإلكتروني...')).toBeVisible();
  await expect(table.getByRole('columnheader', { name: 'الحالة' })).toBeVisible();
  await expect(table.getByText('0 من 5 صف(وف) محدد.')).toBeVisible();
  await table.getByRole('button', { name: 'en', exact: true }).click();
  await expect(container).toHaveAttribute('dir', 'ltr');
  await expect(table.getByPlaceholder('Filter emails...')).toBeVisible();
  await expect(table.getByRole('columnheader', { name: 'Status' })).toBeVisible();
  await expect(table.getByText('0 of 5 row(s) selected.')).toBeVisible();
  await table.getByRole('button', { name: 'he', exact: true }).click();
  await expect(container).toHaveAttribute('dir', 'rtl');
  await expect(table.getByText('0 מתוך 5 שורות נבחרו.')).toBeVisible();
});
