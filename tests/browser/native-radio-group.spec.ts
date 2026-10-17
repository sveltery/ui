import { expect, test, type Locator, type Page } from '@playwright/test';
// NativeRadio's rules are derived from Radio Group's in each style, so the two look the same in every state.
const styles = ['luma', 'lyra', 'maia', 'mira', 'nova', 'rhea', 'sera', 'vega'];
const states = ['unchecked', 'checked', 'invalid', 'invalid-checked', 'disabled', 'disabled-checked'];
const properties = ['width', 'height', 'border-top-width', 'border-top-color', 'border-radius', 'background-color', 'box-shadow', 'opacity'];
const computed = (locator: Locator) => locator.evaluate((el, names) => Object.fromEntries(names.map(name => [name, getComputedStyle(el).getPropertyValue(name)])), properties);
async function open(page: Page, style: string, dark: boolean) {
  await page.goto('/native-radio-group');
  await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  await page.evaluate(([style, dark]) => { document.body.className = `style-${style}`; document.documentElement.classList.toggle('dark', dark === 'dark'); }, [style, dark ? 'dark' : 'light']);
}

for (const style of styles) for (const dark of [false, true]) {
  test(`${style} ${dark ? 'dark' : 'light'}: every state matches Radio Group`, async ({ page }) => {
    await open(page, style, dark);
    for (const state of states) {
      const base = page.getByTestId(`base-${state}`);
      const native = page.getByTestId(`native-${state}`);
      // Both carry `disabled:opacity-50`, which matches the native input but not Base's `<span>`.
      const expected = { ...(await computed(base)), ...(state.startsWith('disabled') ? { opacity: '0.5' } : {}) };
      expect(await computed(native), state).toEqual(expected);
      const icon = base.locator('[data-slot=radio-group-indicator] span');
      const dot = await native.evaluate(el => getComputedStyle(el).backgroundImage);
      if (state.endsWith('checked') && !state.endsWith('unchecked')) {
        const color = await icon.evaluate(el => getComputedStyle(el).backgroundColor);
        expect(dot, `${state} dot`).toContain(color);
      } else {
        expect(dot, `${state} has no dot`).toBe('none');
      }
    }
  });
}

test('the keyboard focus ring matches Radio Group', async ({ page }) => {
  await open(page, 'nova', false);
  // Tabbing in from the element before gives each radio `:focus-visible`.
  const ring = async (id: string) => {
    await page.getByTestId(id).focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByTestId(id)).toBeFocused();
    return computed(page.getByTestId(id));
  };
  const native = await ring('native-unchecked');
  expect(native['box-shadow']).not.toBe('none');
  expect(native).toEqual(await ring('base-unchecked'));
});

// NativeRadio carries Radio Group's slots, so style rules keyed on them (sera's Label, every FieldSet's gap) apply to both.
const textProperties = ['text-transform', 'font-size', 'font-weight', 'letter-spacing'];
const text = (locator: Locator) => locator.evaluate((el, names) => Object.fromEntries(names.map(name => [name, getComputedStyle(el).getPropertyValue(name)])), textProperties);
for (const style of styles) {
  test(`${style}: labels and fieldsets next to NativeRadio match Radio Group`, async ({ page }) => {
    await page.goto('/native-radio-group/review');
    await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await page.evaluate(style => { document.body.className = `style-${style}`; }, style);
    expect(await text(page.locator('label[for=native-basic-default]'))).toEqual(await text(page.locator('label[for=base-basic-default]')));
    const fieldset = page.locator('[data-example=fieldset] fieldset');
    const gap = (index: number) => fieldset.nth(index).evaluate(el => getComputedStyle(el).rowGap);
    expect(await gap(1)).toBe(await gap(0));
  });
}
