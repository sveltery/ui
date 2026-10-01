import { expect, test } from '@playwright/test';
test('fresh Button tarball/source-copy consumer: SSR, hydration, native/custom activation, forms and disabled focus', async ({ page, request }) => {
  const html = await (await request.get('/button')).text();
  expect(html).toContain('cn-button-variant-secondary'); expect(html).toContain('data-hydrated="false"'); expect(html).toContain('aria-disabled="true"');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto('/button'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await expect(page.getByTestId('state')).toContainText('"ref":"custom"');
    await page.keyboard.press('Tab'); await expect(page.locator('#default')).toBeFocused(); await page.keyboard.press('Enter'); await page.keyboard.press('Space');
    await expect(page.getByTestId('state')).toContainText('"clicks":2,"submits":0');
    await page.keyboard.press('Tab'); await expect(page.locator('#submit')).toBeFocused(); await page.keyboard.press('Enter');
    await expect(page.getByTestId('state')).toContainText('"submits":1');
    await page.keyboard.press('Tab'); await expect(page.locator('#focusable')).toBeFocused(); await page.keyboard.press('Enter'); await page.keyboard.press('Space');
    await expect(page.getByTestId('state')).toContainText('"submits":1');
    await page.keyboard.press('Tab'); await expect(page.locator('#custom')).toBeFocused(); await page.keyboard.press('Space'); await page.locator('#custom').click();
    await expect(page.getByTestId('state')).toContainText('"clicks":4');
    await expect(page.locator('#custom')).toHaveClass(/consumer-render/); await expect(page.locator('#custom')).toHaveClass(/cn-button/);
    expect(await page.locator('#custom').evaluate(node => getComputedStyle(node).paddingLeft)).toBe('24px');
    expect(await page.locator('#submit').evaluate(node => node.getBoundingClientRect().height)).toBe(36);
  }
  expect(errors).toEqual([]);
});
