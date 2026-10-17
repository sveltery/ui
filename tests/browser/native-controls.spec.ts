import { expect, test, type Locator, type Page } from '@playwright/test';
// NativeCheckbox and NativeSwitch take their rules from Checkbox and Switch in each style, so the two look the same in every state.
const styles = ['luma', 'lyra', 'maia', 'mira', 'nova', 'rhea', 'sera', 'vega'];
const states = ['unchecked', 'checked', 'invalid', 'invalid-checked', 'disabled', 'disabled-checked'];
const properties = ['width', 'height', 'border-top-width', 'border-top-color', 'border-radius', 'background-color', 'box-shadow'];
const computed = (locator: Locator, names = properties) => locator.evaluate((el, names) => Object.fromEntries(names.map(name => [name, getComputedStyle(el).getPropertyValue(name)])), names);
// Base dims its whole root and the native twin dims its wrapper, so compare the opacity the element ends up with.
const opacity = (locator: Locator) => locator.evaluate(el => { let value = 1; for (let node: Element | null = el; node; node = node.parentElement) value *= Number(getComputedStyle(node).opacity); return value; });
// The thumb's offset inside its track, which `translate` moves when the switch is checked.
const thumb = (track: Locator, part: string) => track.evaluate((el, part) => {
  const thumb = part === 'child' ? el.querySelector('[data-slot=switch-thumb]')! : el.nextElementSibling!;
  const outer = el.getBoundingClientRect(); const inner = thumb.getBoundingClientRect();
  return { left: Math.round(inner.left - outer.left), top: Math.round(inner.top - outer.top), width: inner.width, height: inner.height, background: getComputedStyle(thumb).backgroundColor };
}, part);
async function open(page: Page, style: string, dark: boolean) {
  await page.goto('/native-controls');
  await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  // A style switch would otherwise read mid-transition values.
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
  await page.evaluate(([style, dark]) => { document.body.className = `style-${style}`; document.documentElement.classList.toggle('dark', dark === 'dark'); }, [style, dark ? 'dark' : 'light']);
}

for (const style of styles) for (const dark of [false, true]) {
  test(`${style} ${dark ? 'dark' : 'light'}: every state matches Checkbox and Switch`, async ({ page }) => {
    await open(page, style, dark);
    for (const state of states) {
      const base = page.getByTestId(`base-checkbox-${state}`);
      const native = page.getByTestId(`native-checkbox-${state}`);
      expect(await computed(native), `checkbox ${state}`).toEqual(await computed(base));
      expect(await opacity(native), `checkbox ${state} opacity`).toBe(await opacity(base));
      const icon = (locator: Locator) => locator.evaluate(el => {
        const indicator = el.querySelector('[data-slot=checkbox-indicator]') ?? el.nextElementSibling!;
        const svg = indicator.querySelector('svg');
        return svg && getComputedStyle(indicator).visibility === 'visible' ? getComputedStyle(svg).color : 'hidden';
      });
      expect(await icon(native), `checkbox ${state} icon`).toBe(await icon(base));
      for (const size of ['default', 'sm']) {
        const baseSwitch = page.getByTestId(`base-switch-${size}-${state}`);
        const nativeSwitch = page.getByTestId(`native-switch-${size}-${state}`);
        expect(await computed(nativeSwitch), `switch ${size} ${state}`).toEqual(await computed(baseSwitch));
        expect(await opacity(nativeSwitch), `switch ${size} ${state} opacity`).toBe(await opacity(baseSwitch));
        expect(await thumb(nativeSwitch, 'sibling'), `switch ${size} ${state} thumb`).toEqual(await thumb(baseSwitch, 'child'));
      }
    }
  });
}

test('the keyboard focus ring matches Checkbox and Switch', async ({ page }) => {
  await open(page, 'nova', false);
  // Tabbing in from the element before gives each control `:focus-visible`.
  const ring = async (id: string) => {
    await page.getByTestId(id).focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByTestId(id)).toBeFocused();
    return computed(page.getByTestId(id));
  };
  for (const control of ['checkbox', 'switch-default']) {
    const native = await ring(`native-${control}-unchecked`);
    expect(native['box-shadow'], control).not.toBe('none');
    expect(native, control).toEqual(await ring(`base-${control}-unchecked`));
  }
});

test('Space toggles the native checkbox and switch, and the arrow keys move the native slider', async ({ page }) => {
  await open(page, 'nova', false);
  for (const id of ['native-checkbox-unchecked', 'native-switch-default-unchecked']) {
    await page.getByTestId(id).focus();
    await page.keyboard.press('Space');
    await expect(page.getByTestId(id)).toBeChecked();
  }
  const slider = page.getByTestId('native-slider');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveValue('51');
  await page.keyboard.press('End');
  await expect(slider).toHaveValue('100');
  await expect(page.getByTestId('native-slider-disabled')).toHaveCSS('opacity', '0.5');
});

// The wrappers carry Checkbox's and Switch's slots, so style rules keyed on them (sera's Label, every FieldSet's gap) apply to both.
const textProperties = ['text-transform', 'font-size', 'font-weight', 'letter-spacing'];
for (const style of styles) {
  test(`${style}: labels and fieldsets next to the native controls match Checkbox and Switch`, async ({ page }) => {
    await open(page, style, false);
    for (const control of ['checkbox', 'switch']) {
      expect(await computed(page.locator(`label[for=native-${control}]`), textProperties), control).toEqual(await computed(page.locator(`label[for=base-${control}]`), textProperties));
      const gap = (kind: string) => page.getByTestId(`${kind}-${control}-fieldset`).evaluate(el => getComputedStyle(el).rowGap);
      expect(await gap('native'), `${control} fieldset`).toBe(await gap('base'));
    }
  });
}
