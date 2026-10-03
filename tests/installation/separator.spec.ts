import { expect, test } from '@playwright/test';
import { separatorAssertions } from '../browser/separator-cases';
test('fresh archive/source copy Separator preserves source classes, primitive contract, snippets and lifecycle', async ({ page, request }) => {
 const html = await (await request.get('/separator-probe')).text(); expect(html).toContain('data-orientation="horizontal"'); expect(html).toContain('data-horizontal:h-px');
 const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
 await page.goto('/separator-probe'); await expect(page.locator('[data-separator-probe]')).toHaveAttribute('data-hydrated', 'true'); await separatorAssertions(page);
 await expect(page.getByTestId('separator-state')).toContainText('"attaches":2'); await expect(page.getByTestId('separator-state')).toContainText('"detaches":1');
 await page.goto('/separator'); await expect(page.locator('[data-separator-gallery]')).toHaveAttribute('data-hydrated', 'true'); await expect(page.locator('[role=separator]')).toHaveCount(7); expect(errors).toEqual([]);
});
