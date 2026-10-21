import { expect, test, type Locator } from '@playwright/test';

// Base renders these controls as a painted box: a radio is the box itself, and a checkbox or switch is a box around its real input.
// A disabled one dims its box through data-disabled.

const opacity = (locator: Locator) => locator.evaluate((el) => getComputedStyle(el).opacity);

test.beforeEach(async ({ page }) => {
  await page.goto('/disabled-controls');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
});

for (const [role, enabled, disabled] of [
  ['radio', 'Email', 'Phone'],
  ['checkbox', 'Enabled checkbox', 'Disabled checkbox'],
  ['switch', 'Enabled switch', 'Disabled switch'],
] as const) {
  test(`a disabled ${role} is dimmed and shows a not-allowed cursor`, async ({ page }) => {
    const box = (locator: Locator) => (role === 'radio' ? locator : locator.locator('xpath=..'));
    const on = box(page.getByRole(role, { name: enabled }));
    const off = box(page.getByRole(role, { name: disabled }));
    await expect(off).toHaveAttribute('data-disabled', '');
    expect(await opacity(on)).toBe('1');
    expect(await opacity(off)).toBe('0.5');
    expect(await off.evaluate((el) => getComputedStyle(el).cursor)).toBe('not-allowed');
  });
}

test('a disabled slider dims its control', async ({ page }) => {
  const control = (testId: string) => page.getByTestId(testId).locator('.cn-slider');
  await expect(control('disabled-slider')).toHaveAttribute('data-disabled', '');
  expect(await opacity(control('enabled-slider'))).toBe('1');
  expect(await opacity(control('disabled-slider'))).toBe('0.5');
});
