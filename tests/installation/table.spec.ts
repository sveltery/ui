import { expect, test } from '@playwright/test';
import { tableLifecycleCases, tableState } from '../browser/table-cases';
tableLifecycleCases('/table-probe');
test('fresh Table archive/source copy preserves native semantics, reactive props, Nova and horizontal overflow', async ({ page, request }) => {
  const html = await (await request.get('/table')).text(); expect(html).toContain('cn-table-container'); expect(html).toContain('A list of your recent invoices.');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 1100 }); await page.goto('/table-probe'); await expect(page.locator('[data-table-probe]')).toHaveAttribute('data-hydrated', 'true');
    await expect(page.getByRole('table', { name: 'Quarterly ledger', exact: true })).toBeVisible();
    await expect(page.locator('#probe-head')).toHaveAttribute('scope', 'col'); await expect(page.locator('#probe-cell')).toHaveAttribute('headers', 'probe-head');
    expect(await page.locator('[data-slot=table-container]').evaluate(node => ({ overflow: getComputedStyle(node).overflowX, relative: getComputedStyle(node).position, overflowing: node.scrollWidth > node.clientWidth }))).toEqual({ overflow: 'auto', relative: 'relative', overflowing: true });
    await page.locator('[data-slot=table-container]').evaluate(node => { node.scrollLeft = 200; }); expect(await page.locator('[data-slot=table-container]').evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
    expect(await page.getByTestId('checkbox-cell').evaluate(node => getComputedStyle(node).paddingRight)).toBe('0px');
    expect(await page.locator('tbody tr:last-child').evaluate(node => getComputedStyle(node).borderBottomWidth)).toBe('0px');
    await page.getByRole('button', { name: 'Update table', exact: true }).click();
    await expect(page.getByRole('table', { name: 'Updated ledger', exact: true })).toHaveAttribute('data-slot', 'table-override');
    await expect(page.locator('#probe-head')).toHaveAttribute('colspan', '2'); await expect(page.locator('#probe-cell')).toHaveAttribute('rowspan', '2');
    await expect(page.locator('#probe-row')).toHaveAttribute('data-state', 'selected');
    expect(await page.locator('#probe-head').evaluate(node => ({ padding: getComputedStyle(node).paddingRight, align: getComputedStyle(node).textAlign }))).toEqual({ padding: '24px', align: 'right' });
    expect((await tableState(page)).tags.table).toBe('TABLE');
  }
  expect(errors).toEqual([]);
});
