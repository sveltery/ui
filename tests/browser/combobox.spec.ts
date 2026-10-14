import { expect, test, type Locator, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/combobox');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached({ timeout: 30_000 });
});

const framework = (page: Page) => page.getByTestId('framework');
const options = (page: Page) => page.getByRole('option');
const option = (page: Page, name: string) => page.getByRole('option', { name, exact: true });
const highlighted = (page: Page) => page.locator('[role=option][data-highlighted]');
const popup = (page: Page) => page.locator('[data-slot=combobox-content]');
const text = (page: Page, name: string) => page.getByTestId(name).textContent();
const rect = (locator: Locator) => locator.evaluate((element) => element.getBoundingClientRect().toJSON());
const style = (locator: Locator, property: string) => locator.evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);
const submit = async (page: Page) => {
  await page.getByRole('button', { name: 'Submit' }).click();
  return text(page, 'submitted');
};

test('a click on the input opens the popup with every item and a click on an item selects it and closes', async ({ page }) => {
  await expect(framework(page)).toHaveValue('');
  await expect(framework(page)).toHaveAttribute('aria-expanded', 'false');
  await framework(page).click();
  await expect(framework(page)).toHaveAttribute('aria-expanded', 'true');
  await expect(options(page)).toHaveText(['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro']);
  await option(page, 'SvelteKit').click();
  await expect(options(page)).toHaveCount(0);
  await expect(framework(page)).toHaveValue('SvelteKit');
  await expect(framework(page)).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('framework-value')).toHaveText('"SvelteKit"');
  await expect(page.getByTestId('query')).toHaveText('"SvelteKit"');
  await expect(page.getByTestId('open')).toHaveText('false');
});

test('typing filters the list case-insensitively and clearing the text brings every item back', async ({ page }) => {
  await framework(page).click();
  await page.keyboard.type('nu');
  await expect(options(page)).toHaveText(['Nuxt.js']);
  await expect(page.getByTestId('query')).toHaveText('"nu"');
  await framework(page).fill('SVELTE');
  await expect(options(page)).toHaveText(['SvelteKit']);
  await framework(page).fill('x');
  await expect(options(page)).toHaveText(['Next.js', 'Nuxt.js', 'Remix']);
  await framework(page).fill('');
  await expect(options(page)).toHaveText(['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro']);
});

test('the arrow keys open the popup, move the highlight and Enter selects the highlighted item', async ({ page }) => {
  await framework(page).focus();
  await page.keyboard.press('ArrowDown');
  await expect(options(page)).toHaveCount(5);
  await expect(highlighted(page)).toHaveText('Next.js');
  await page.keyboard.press('ArrowDown');
  await expect(highlighted(page)).toHaveText('SvelteKit');
  await page.keyboard.press('ArrowDown');
  await expect(highlighted(page)).toHaveText('Nuxt.js');
  await page.keyboard.press('ArrowUp');
  await expect(highlighted(page)).toHaveText('SvelteKit');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(options(page)).toHaveCount(0);
  await expect(framework(page)).toHaveValue('Nuxt.js');
  await expect(page.getByTestId('framework-value')).toHaveText('"Nuxt.js"');
  await expect(framework(page)).toBeFocused();
});

test('typing then ArrowDown and Enter selects the first match', async ({ page }) => {
  await framework(page).click();
  await page.keyboard.type('re');
  await expect(options(page)).toHaveText(['Remix']);
  await page.keyboard.press('ArrowDown');
  await expect(highlighted(page)).toHaveText('Remix');
  await page.keyboard.press('Enter');
  await expect(framework(page)).toHaveValue('Remix');
  await expect(page.getByTestId('framework-value')).toHaveText('"Remix"');
});

test('Escape closes the popup, keeps the value and puts the selected label back in the input', async ({ page }) => {
  await framework(page).click();
  await option(page, 'Astro').click();
  await framework(page).fill('zz');
  await expect(options(page)).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('open')).toHaveText('false');
  await expect(framework(page)).toHaveValue('Astro');
  await expect(page.getByTestId('framework-value')).toHaveText('"Astro"');
});

test('a press outside closes the popup without changing the value', async ({ page }) => {
  await framework(page).click();
  await expect(options(page)).toHaveCount(5);
  await page.mouse.click(900, 700);
  await expect(options(page)).toHaveCount(0);
  await expect(page.getByTestId('framework-value')).toHaveText('null');
});

test('the empty state shows only while nothing matches', async ({ page }) => {
  await framework(page).click();
  const empty = popup(page).locator('[data-slot=combobox-empty]');
  await expect(empty).toHaveText('');
  await expect(empty).toBeHidden();
  await expect(popup(page)).not.toHaveAttribute('data-empty');
  await page.keyboard.type('zzz');
  await expect(options(page)).toHaveCount(0);
  await expect(empty).toHaveText('No items found.');
  await expect(empty).toBeVisible();
  await expect(popup(page).locator('[data-slot=combobox-list]')).toHaveAttribute('data-empty', '');
  await framework(page).fill('nu');
  await expect(options(page)).toHaveText(['Nuxt.js']);
  await expect(empty).toBeHidden();
});

test('the selected item shows a check and is marked selected', async ({ page }) => {
  await framework(page).click();
  await option(page, 'Remix').click();
  await framework(page).click();
  await expect(options(page)).toHaveCount(5);
  await expect(option(page, 'Remix')).toHaveAttribute('aria-selected', 'true');
  await expect(option(page, 'Remix').locator('svg')).toHaveCount(1);
  await expect(option(page, 'Astro')).toHaveAttribute('aria-selected', 'false');
  await expect(option(page, 'Astro').locator('svg')).toHaveCount(0);
});

test('the trigger button opens the popup and carries data-popup-open and data-pressed only while open', async ({ page }) => {
  const group = framework(page).locator('xpath=ancestor::*[@data-slot="input-group"]');
  const trigger = group.locator('[data-slot=input-group-button]').first();
  await expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
  await expect(trigger).not.toHaveAttribute('data-popup-open');
  await expect(trigger).not.toHaveAttribute('data-pressed');
  await trigger.click();
  await expect(options(page)).toHaveCount(5);
  await expect(trigger).toHaveAttribute('data-popup-open', '');
  await expect(trigger).toHaveAttribute('data-pressed', '');
  await expect(trigger).not.toHaveAttribute('data-open');
  await expect(framework(page)).toHaveAttribute('data-popup-open', '');
  await expect(framework(page)).not.toHaveAttribute('data-open');
  await expect(popup(page)).toHaveAttribute('data-open', '');
  await expect(group).not.toHaveAttribute('data-open');
  expect(await style(trigger, 'background-color')).toBe('rgba(0, 0, 0, 0)');
  await page.keyboard.press('Escape');
  await expect(options(page)).toHaveCount(0);
  await expect(trigger).not.toHaveAttribute('data-popup-open');
  await expect(framework(page)).not.toHaveAttribute('data-popup-open');
});

test('the popup sits below the input group and is at least as wide as the input plus the trigger', async ({ page }) => {
  await framework(page).click();
  await expect(options(page)).toHaveCount(5);
  const group = await rect(framework(page).locator('xpath=ancestor::*[@data-slot="input-group"]'));
  const input = await rect(framework(page));
  const positioner = popup(page).locator('..');
  await expect(popup(page)).toHaveAttribute('data-side', 'bottom');
  await expect(popup(page)).toHaveAttribute('data-chips', 'false');
  await expect.poll(async () => (await rect(positioner)).top).toBe(group.bottom + 6);
  await expect.poll(() => popup(page).evaluate((element) => element.offsetWidth)).toBe(Math.round(input.width + 28));
});

test('the clear button empties the value and the input and then hides itself', async ({ page }) => {
  const input = page.getByTestId('clearable');
  const group = input.locator('xpath=ancestor::*[@data-slot="input-group"]');
  const clear = group.locator('[data-slot=combobox-clear]');
  const trigger = group.locator('[data-slot=input-group-button]:not([data-slot=combobox-clear])').first();
  await expect(input).toHaveValue('SvelteKit');
  await expect(clear).toBeVisible();
  await expect(clear.locator('svg')).toHaveCount(1);
  await expect(trigger).toBeHidden();
  await clear.click();
  await expect(input).toHaveValue('');
  await expect(clear).toBeHidden();
  await expect(trigger).toBeVisible();
  await input.click();
  await expect(options(page)).toHaveCount(5);
  await expect(options(page).locator('svg')).toHaveCount(0);
});

test('the clear button also clears the bound value of the form combobox', async ({ page }) => {
  await framework(page).click();
  await option(page, 'Astro').click();
  await expect(page.getByTestId('framework-value')).toHaveText('"Astro"');
  await framework(page).locator('xpath=ancestor::*[@data-slot="input-group"]').locator('[data-slot=combobox-clear]').click();
  await expect(framework(page)).toHaveValue('');
  await expect(page.getByTestId('framework-value')).toHaveText('null');
  await expect(page.getByTestId('query')).toHaveText('""');
});

test('groups render their labels and items, drop the groups with no match and separate the rest', async ({ page }) => {
  await page.getByTestId('groups').click();
  const americas = page.getByRole('group', { name: 'Americas' });
  const europe = page.getByRole('group', { name: 'Europe' });
  await expect(americas.getByRole('option')).toHaveText(['(GMT-5) New York', '(GMT-8) Los Angeles', '(GMT-6) Chicago']);
  await expect(europe.getByRole('option')).toHaveText(['(GMT+0) London', '(GMT+1) Paris', '(GMT+1) Berlin']);
  await expect(page.locator('[data-slot=combobox-label]')).toHaveText(['Americas', 'Europe']);
  await expect(page.locator('[data-slot=combobox-separator]')).toHaveCount(1);
  await page.keyboard.type('par');
  await expect(page.locator('[data-slot=combobox-group]')).toHaveCount(1);
  await expect(europe.getByRole('option')).toHaveText(['(GMT+1) Paris']);
  await expect(page.locator('[data-slot=combobox-label]')).toHaveText(['Europe']);
  await option(page, '(GMT+1) Paris').click();
  await expect(page.getByTestId('groups')).toHaveValue('(GMT+1) Paris');
});

test('a disabled combobox does not open and the toggle enables it', async ({ page }) => {
  const input = page.getByTestId('disabled');
  const trigger = input.locator('xpath=ancestor::*[@data-slot="input-group"]').locator('[data-slot=input-group-button]');
  await expect(input).toBeEnabled();
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(input).toBeDisabled();
  await expect(trigger).toBeDisabled();
  await input.click({ force: true });
  await trigger.click({ force: true });
  await expect(options(page)).toHaveCount(0);
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(input).toBeEnabled();
  await input.click();
  await expect(options(page)).toHaveCount(5);
});

test('a disabled item cannot be selected by click or Enter and is marked disabled', async ({ page }) => {
  const input = page.getByTestId('disabled-items');
  await input.click();
  await expect(option(page, 'Nuxt.js')).toHaveAttribute('aria-disabled', 'true');
  await expect(option(page, 'Remix')).toHaveAttribute('aria-disabled', 'true');
  await expect(option(page, 'Astro')).not.toHaveAttribute('aria-disabled', 'true');
  await option(page, 'Nuxt.js').click({ force: true });
  await expect(options(page)).toHaveCount(5);
  await expect(input).toHaveValue('');
  await page.keyboard.press('ArrowDown');
  await expect(highlighted(page)).toHaveText('Next.js');
  await page.keyboard.press('ArrowDown');
  await expect(highlighted(page)).toHaveText('SvelteKit');
  await page.keyboard.press('ArrowDown');
  await expect(highlighted(page)).toHaveText('Nuxt.js');
  await page.keyboard.press('Enter');
  await expect(options(page)).toHaveCount(5);
  await expect(input).toHaveValue('');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(highlighted(page)).toHaveText('Astro');
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('Astro');
});

test('object items select the object, show its label and submit the string value', async ({ page }) => {
  const input = page.getByTestId('plan');
  await input.click();
  await expect(options(page)).toHaveText(['Starter (1)', 'Team (10)']);
  await option(page, 'Team (10)').click();
  await expect(page.getByTestId('plan-value')).toHaveText('{"name":"Team","seats":10}');
  await expect(input).toHaveValue('Team');
});

test('multiple selection shows chips, keeps the popup open and toggles items', async ({ page }) => {
  const chips = page.getByTestId('chips');
  const input = page.getByTestId('stack');
  await expect(chips.locator('[data-slot=combobox-chip]')).toHaveText(['Next.js']);
  await input.click();
  await expect(options(page)).toHaveCount(5);
  await expect(option(page, 'Next.js')).toHaveAttribute('aria-selected', 'true');
  await option(page, 'Astro').click();
  await expect(options(page)).toHaveCount(5);
  await expect(chips.locator('[data-slot=combobox-chip]')).toHaveText(['Next.js', 'Astro']);
  await expect(page.getByTestId('chips-value')).toHaveText('Next.js,Astro');
  await expect(option(page, 'Astro')).toHaveAttribute('aria-selected', 'true');
  await option(page, 'Next.js').click();
  await expect(chips.locator('[data-slot=combobox-chip]')).toHaveText(['Astro']);
  await expect(page.getByTestId('chips-value')).toHaveText('Astro');
  await expect(option(page, 'Next.js')).toHaveAttribute('aria-selected', 'false');
});

test('typing in the chips input filters and autoHighlight highlights the first match', async ({ page }) => {
  const input = page.getByTestId('stack');
  await input.click();
  await page.keyboard.type('r');
  await expect(options(page)).toHaveText(['Remix', 'Astro']);
  await expect(highlighted(page)).toHaveText('Remix');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('chips-value')).toHaveText('Next.js,Remix');
  await expect(input).toHaveValue('');
});

test('a chip remove button and Backspace in the empty input remove chips', async ({ page }) => {
  const chips = page.getByTestId('chips');
  const input = page.getByTestId('stack');
  await input.click();
  await option(page, 'SvelteKit').click();
  await option(page, 'Astro').click();
  await expect(page.getByTestId('chips-value')).toHaveText('Next.js,SvelteKit,Astro');
  await page.keyboard.press('Escape');
  await page.getByTestId('chip-SvelteKit').locator('[data-slot=combobox-chip-remove]').click();
  await expect(page.getByTestId('chips-value')).toHaveText('Next.js,Astro');
  await expect(chips.locator('[data-slot=combobox-chip]')).toHaveText(['Next.js', 'Astro']);
  await input.focus();
  await page.keyboard.press('Backspace');
  await expect(page.getByTestId('chips-value')).toHaveText('Next.js');
  await page.keyboard.press('Backspace');
  await expect(page.getByTestId('chips-value')).toHaveText('');
  await expect(chips.locator('[data-slot=combobox-chip]')).toHaveCount(0);
});

test('the chips popup is anchored to the chips container and matches its width', async ({ page }) => {
  await page.getByTestId('stack').click();
  await expect(options(page)).toHaveCount(5);
  await expect(popup(page)).toHaveAttribute('data-chips', 'true');
  const chips = await rect(page.getByTestId('chips'));
  await expect.poll(async () => (await rect(popup(page))).width).toBe(chips.width);
  expect((await rect(popup(page))).left).toBe(chips.left);
  await expect.poll(async () => (await rect(popup(page).locator('..'))).top).toBe(chips.bottom + 6);
});

test('the form submits the selected values by name and a reset restores the defaults', async ({ page }) => {
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByTestId('submitted')).toHaveText('');
  expect(await framework(page).evaluate((input: HTMLInputElement) => input.form!.checkValidity())).toBe(false);
  await framework(page).click();
  await option(page, 'SvelteKit').click();
  expect(await submit(page)).toBe('framework=SvelteKit&stack=Next.js');
  await page.getByTestId('stack').click();
  await option(page, 'Remix').click();
  await page.keyboard.press('Escape');
  expect(await submit(page)).toBe('framework=SvelteKit&stack=Next.js&stack=Remix');
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(framework(page)).toHaveValue('');
  await expect(page.getByTestId('framework-value')).toHaveText('null');
  await expect(page.getByTestId('chips').locator('[data-slot=combobox-chip]')).toHaveText(['Next.js']);
  await expect(page.getByTestId('chips-value')).toHaveText('Next.js');
  expect(await framework(page).evaluate((input: HTMLInputElement) => input.form!.checkValidity())).toBe(false);
});

test('a trigger-only combobox opens a popup with the input inside and selecting updates the trigger', async ({ page }) => {
  const trigger = page.getByTestId('popup-trigger');
  await expect(trigger).toHaveText('Astro');
  await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  await trigger.click();
  await expect(options(page)).toHaveCount(5);
  const input = page.getByTestId('popup-input');
  await expect(input).toBeFocused();
  await expect(trigger).toHaveAttribute('data-popup-open', '');
  await expect(trigger).not.toHaveAttribute('data-open');
  await expect(popup(page).getByTestId('popup-input')).toHaveCount(1);
  await page.keyboard.type('rem');
  await expect(options(page)).toHaveText(['Remix']);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(options(page)).toHaveCount(0);
  await expect(trigger).toHaveText('Remix');
  await expect(trigger).not.toHaveAttribute('data-popup-open');
});

test('a combobox in an invalid field marks its input invalid and shows the field error', async ({ page }) => {
  const input = page.getByTestId('invalid');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Please select a framework.')).toBeVisible();
  const group = input.locator('xpath=ancestor::*[@data-slot="input-group"]');
  await expect(group).toHaveCSS('border-top-color', 'oklch(0.577 0.245 27.325)');
  await expect(group.locator('[data-slot=input-group-button]')).toHaveAttribute('aria-invalid', 'false');
  await expect(framework(page).locator('xpath=ancestor::*[@data-slot="input-group"]')).not.toHaveCSS('border-top-color', 'oklch(0.577 0.245 27.325)');
});

test('inside a dialog the popup opens above it, selects, and Escape closes the popup before the dialog', async ({ page }) => {
  await page.getByRole('button', { name: 'Open Dialog' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const input = page.getByTestId('dialog-combobox');
  await input.click();
  await expect(options(page)).toHaveCount(5);
  const box = (await option(page, 'Remix').boundingBox())!;
  const topmost = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.getAttribute('role'), { x: box.x + box.width / 2, y: box.y + box.height / 2 });
  expect(topmost).toBe('option');
  await page.keyboard.type('ast');
  await expect(options(page)).toHaveText(['Astro']);
  await option(page, 'Astro').click();
  await expect(options(page)).toHaveCount(0);
  await expect(input).toHaveValue('Astro');
  await expect(dialog).toBeVisible();
  await input.fill('');
  await input.click();
  await expect(options(page)).toHaveCount(5);
  await page.keyboard.press('Escape');
  await expect(options(page)).toHaveCount(0);
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});
