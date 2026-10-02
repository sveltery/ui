import { expect, test } from '@playwright/test';
import { alertLifecycleCases, alertNativeAssertions, alertState } from '../browser/alert-cases';
alertLifecycleCases();
test('fresh archive/source-copy Alert parts retain native actions/variants/Nova rules and bounded Basic composition', async ({ page, request }) => {
  const html = await (await request.get('/alert')).text(); expect(html).toContain('cn-alert'); expect(html).toContain('Success! Your changes have been saved.'); expect(html).toContain('Basic');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 1400 }); await page.goto('/alert-probe');
    await expect(page.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'true'); await alertNativeAssertions(page);
    expect((await alertState(page)).refs).toEqual(['probe-alert', 'probe-title', 'probe-description', 'probe-action']);
    await page.goto('/alert'); await expect(page.locator('[data-alert-gallery] [role="alert"]')).toHaveCount(3);
    await expect(page.locator('[data-alert-gallery] [data-slot="alert-title"]')).toHaveCount(2); await expect(page.locator('[data-alert-gallery] [data-slot="alert-description"]')).toHaveCount(2);
  }
  expect(errors).toEqual([]);
});
