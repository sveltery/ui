import { expect, type Page } from '@playwright/test';
export async function ratioMeasurements(page: Page) {
  return page.locator('[data-aspect-ratio-probe] [data-testid]:not(output)').evaluateAll(nodes => nodes.map(node => {
    const css = getComputedStyle(node); const rect = node.getBoundingClientRect();
    return { id: node.getAttribute('data-testid'), tag: node.tagName, text: node.textContent, slot: node.getAttribute('data-slot'), class: node.getAttribute('class'), ratio: css.aspectRatio, custom: css.getPropertyValue('--ratio'), width: rect.width, height: rect.height, position: css.position, radius: css.borderRadius, background: css.backgroundColor };
  }));
}
export async function ratioAssertions(page: Page, width: number) {
  for (const [id, ratio] of [['16x9', 16 / 9], ['21x9', 21 / 9], ['1x1', 1], ['9x16', 9 / 16], ['custom-style', 3], ['inline-ratio', 4 / 3], ['class-override', 1], ['responsive', width < 640 ? 1 : 16 / 9], ['dynamic-style', 2]] as const) {
    const rect = await page.getByTestId(id).boundingBox(); expect(rect!.width).toBeGreaterThan(0); expect(rect!.width / rect!.height, id).toBeCloseTo(ratio, 2);
  }
  for (const id of ['unrelated-style', 'undefined-style', 'empty-style']) expect(await page.getByTestId(id).evaluate(node => ({ ratio: getComputedStyle(node).aspectRatio, custom: (node as HTMLElement).style.getPropertyValue('--ratio') }))).toEqual({ ratio: 'auto', custom: '' });
  expect(await page.getByTestId('class-override').evaluate(node => getComputedStyle(node).position)).toBe('static');
  await page.getByRole('button', { name: 'Cycle caller style' }).click();
  expect(await page.getByTestId('dynamic-style').evaluate(node => ({ ratio: getComputedStyle(node).aspectRatio, custom: (node as HTMLElement).style.getPropertyValue('--ratio') }))).toEqual({ ratio: 'auto', custom: '' });
  await page.getByRole('button', { name: 'Cycle caller style' }).click();
  expect(await page.getByTestId('dynamic-style').evaluate(node => getComputedStyle(node).aspectRatio)).toBe('3 / 1');
  await page.getByRole('button', { name: 'Cycle caller style' }).click();
  expect(await page.getByTestId('dynamic-style').evaluate(node => getComputedStyle(node).aspectRatio)).toBe('2 / 1');
  const original = await page.getByTestId('lifecycle').elementHandle();
  await page.getByTestId('lifecycle').click(); await page.getByRole('button', { name: 'Update ratio', exact: true }).click();
  await expect(page.getByTestId('lifecycle')).toHaveText('UpdatedChild'); await expect(page.getByTestId('lifecycle')).toHaveAttribute('data-slot', 'consumer-ratio');
  expect(await page.getByTestId('lifecycle').evaluate(node => getComputedStyle(node).aspectRatio)).toBe('1 / 1');
  expect(await original!.evaluate(node => node === document.querySelector('#probe-ratio'))).toBe(true);
  await page.getByRole('button', { name: 'Remove ratio', exact: true }).click(); await expect(page.getByTestId('lifecycle')).toHaveCount(0);
  await page.getByRole('button', { name: 'Restore ratio', exact: true }).click(); await expect(page.getByTestId('lifecycle')).toHaveText('UpdatedChild');
  expect(await original!.evaluate(node => node.isConnected)).toBe(false);
}
