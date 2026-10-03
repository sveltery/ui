import { expect, type Page } from '@playwright/test';
export async function separatorMeasurements(page: Page, selector = '[data-separator-probe] [role=separator]') {
 return page.locator(selector).evaluateAll(nodes => nodes.map(node => { const css = getComputedStyle(node); const rect = node.getBoundingClientRect(); return { width: rect.width, height: rect.height, display: css.display, flexShrink: css.flexShrink, alignSelf: css.alignSelf, backgroundColor: css.backgroundColor, color: css.color, orientation: node.getAttribute('data-orientation'), aria: node.getAttribute('aria-orientation'), horizontal: node.hasAttribute('data-horizontal'), vertical: node.hasAttribute('data-vertical'), slot: node.getAttribute('data-slot'), class: node.className, text: node.textContent }; }));
}
export async function separatorAssertions(page: Page) {
 const horizontal = page.getByTestId('default-horizontal'), vertical = page.getByTestId('default-vertical');
 await expect(horizontal).toHaveAttribute('data-orientation', 'horizontal'); await expect(vertical).toHaveAttribute('data-orientation', 'vertical');
 await expect(horizontal).not.toHaveAttribute('data-horizontal'); await expect(vertical).not.toHaveAttribute('data-vertical');
 // Original support CSS maps these utilities to data-orientation, without alias attributes.
 expect(await horizontal.evaluate(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height }))).toEqual({ width: 240, height: 1 });
 expect(await vertical.evaluate(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height }))).toEqual({ width: 1, height: 48 });
 await expect(horizontal).toHaveCSS('flex-shrink', '0'); await expect(vertical).toHaveCSS('align-self', 'stretch');
 await expect(page.getByTestId('callback')).not.toHaveClass(/ignored-class/);
 expect(await page.getByTestId('explicit-horizontal').evaluate(node => node.getBoundingClientRect().height)).toBe(1);
 expect(await page.getByTestId('explicit-vertical').evaluate(node => node.getBoundingClientRect().width)).toBe(1);
 await expect(page.getByTestId('custom')).toHaveAttribute('data-state-orientation', 'vertical');
 await expect(page.getByTestId('custom')).toHaveText('Replacement & child');
 await page.getByTestId('reactive').click();
 await page.getByRole('button', { name: 'Change orientation' }).click();
 await expect(page.getByTestId('reactive')).toHaveAttribute('aria-orientation', 'vertical');
 await expect(page.getByTestId('reactive')).toHaveAttribute('data-slot', 'caller-slot');
 await expect(page.getByTestId('reactive')).toHaveCSS('color', 'rgb(60, 70, 80)');
 await page.getByRole('button', { name: 'Remove separator' }).click(); await expect(page.getByTestId('reactive')).toHaveCount(0);
 await page.getByRole('button', { name: 'Restore separator' }).click(); await expect(page.getByTestId('reactive')).toHaveAttribute('aria-orientation', 'vertical');
}
