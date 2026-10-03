import { expect, test, type Page } from '@playwright/test';
import { stateWitnesses } from '../reference/css-state-witnesses';

async function computed(page: Page) {
  const horizontal = page.getByTestId('css-horizontal');
  const vertical = page.getByTestId('css-vertical');
  await expect(horizontal).toHaveAttribute('data-orientation', 'horizontal');
  await expect(vertical).toHaveAttribute('data-orientation', 'vertical');
  expect(await horizontal.evaluate(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height }))).toEqual({ width: 240, height: 1 });
  expect(await vertical.evaluate(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height }))).toEqual({ width: 1, height: 60 });
  const widths = [];
  for (const witness of stateWitnesses) {
    const width = await page.getByTestId(witness.id).evaluate(node => node.getBoundingClientRect().width);
    expect(width, witness.id).toBe(witness.width);
    widths.push({ id: witness.id, width });
  }
  return widths;
}

export function shadcnCssCases({ reference = false } = {}) {
  test('genuine shadcn CSS maps actual Base orientations and state aliases with false guards', async ({ page, request }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    const response = await request.get('/css-environment');
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain('data-orientation="horizontal"');
    await page.goto('/css-environment');
    await expect(page.locator('[data-css-environment]')).toHaveAttribute('data-hydrated', 'true');
    const native = await computed(page);
    if (reference) {
      await page.goto('/css-environment-reference');
      await expect(page.locator('[data-css-environment]')).toHaveAttribute('data-hydrated', 'true');
      expect(await computed(page)).toEqual(native);
    }
    expect(errors).toEqual([]);
  });
}
