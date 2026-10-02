import { expect, test } from '@playwright/test';
import { ratioAssertions } from '../browser/aspect-ratio-cases';
test('fresh archive/source-copy AspectRatio: actual SSR, responsive styles, caller precedence, refs and cleanup', async ({ page, request }) => {
  const html = await (await request.get('/aspect-ratio-probe')).text(); expect(html).toContain('data-slot="aspect-ratio"'); expect(html).toContain('data-hydrated="false"'); expect(html).toContain('--ratio:');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto('/aspect-ratio-probe'); await expect(page.locator('[data-aspect-ratio-probe]')).toHaveAttribute('data-hydrated', 'true');
    await ratioAssertions(page, width);
    const state = () => page.getByTestId('ratio-state').textContent().then(text => JSON.parse(text!));
    expect(await state()).toMatchObject({ ref: 'DIV', attached: 2, cleaned: 1 });
    await page.getByRole('button', { name: 'Swap ratio attachments' }).click(); expect(await state()).toMatchObject({ ref: 'DIV', attached: 3, cleaned: 2 });
    await page.getByRole('button', { name: 'Remove ratio' }).click(); expect(await state()).toMatchObject({ ref: null, attached: 3, cleaned: 3 });
  }
  expect(errors).toEqual([]);
});
