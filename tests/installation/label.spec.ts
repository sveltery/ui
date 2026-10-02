import { expect, test } from '@playwright/test';
import { labelLifecycleCases, labelNativeAssertions, labelState } from '../browser/label-cases';
labelLifecycleCases('/label-probe');
test('fresh Label archive/source copy preserves native association, reactive props, exact Nova selectors and bounded Textarea composition', async ({ page, request }) => {
  const html = await (await request.get('/label')).text();
  expect(html).toContain('cn-label'); expect(html).toContain('label-demo-message'); expect(html).toContain('With Textarea');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 1100 }); await page.goto('/label-probe');
    await expect(page.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'true');
    await labelNativeAssertions(page);
    expect((await labelState(page)).tag).toBe('LABEL');
  }
  await page.goto('/label'); await page.locator('label[for="label-demo-message"]').click();
  await expect(page.getByRole('textbox', { name: 'Message', exact: true })).toBeFocused();
  expect(errors).toEqual([]);
});
