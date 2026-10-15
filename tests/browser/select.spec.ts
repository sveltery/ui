import { expect, test, type Locator, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/select');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached({ timeout: 30_000 });
});

const fruit = (page: Page) => page.getByTestId('fruit');
const options = (page: Page) => page.getByRole('option');
const option = (page: Page, name: string) => page.getByRole('option', { name, exact: true });
const highlighted = (page: Page) => page.locator('[role=option][data-highlighted]');
const value = (page: Page, name: string) => page.getByTestId(name).textContent();
const rect = (locator: Locator) => locator.evaluate((element) => element.getBoundingClientRect().toJSON());
const submit = async (page: Page) => {
  await page.getByRole('button', { name: 'Submit' }).click();
  return value(page, 'submitted');
};

test('a click opens the popup with every option and a click on an option selects it and closes', async ({ page }) => {
  await expect(fruit(page)).toHaveText('Select a fruit');
  await expect(fruit(page)).toHaveAttribute('aria-expanded', 'false');
  await fruit(page).click();
  await expect(fruit(page)).toHaveAttribute('aria-expanded', 'true');
  await expect(options(page)).toHaveText(['Select a fruit', 'Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']);
  await option(page, 'Banana').click();
  await expect(options(page)).toHaveCount(0);
  await expect(fruit(page)).toHaveText('Banana');
  await expect(fruit(page)).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('fruit-value')).toHaveText('"banana"');
  await expect(fruit(page)).toBeFocused();
});

test('the selected option is marked and the placeholder state follows the value', async ({ page }) => {
  await expect(fruit(page)).toHaveAttribute('data-placeholder', '');
  await fruit(page).click();
  await option(page, 'Blueberry').click();
  await expect(fruit(page)).not.toHaveAttribute('data-placeholder');
  await fruit(page).click();
  await expect(option(page, 'Blueberry')).toHaveAttribute('aria-selected', 'true');
  await expect(option(page, 'Blueberry').locator('svg')).toHaveCount(1);
  await expect(option(page, 'Apple').locator('svg')).toHaveCount(0);
  await expect(option(page, 'Apple')).toHaveAttribute('aria-selected', 'false');
  await expect(highlighted(page)).toHaveText('Blueberry');
});

test('Enter and the arrow keys open the popup, move the highlight and select the highlighted option', async ({ page }) => {
  await fruit(page).focus();
  await page.keyboard.press('Enter');
  await expect(options(page)).toHaveCount(6);
  await expect(highlighted(page)).toHaveText('Select a fruit');
  await page.keyboard.press('ArrowDown');
  await expect(highlighted(page)).toHaveText('Apple');
  await page.keyboard.press('ArrowDown');
  await expect(highlighted(page)).toHaveText('Banana');
  await page.keyboard.press('ArrowUp');
  await expect(highlighted(page)).toHaveText('Apple');
  await page.keyboard.press('End');
  await expect(highlighted(page)).toHaveText('Pineapple');
  await page.keyboard.press('Home');
  await expect(highlighted(page)).toHaveText('Select a fruit');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(options(page)).toHaveCount(0);
  await expect(fruit(page)).toHaveText('Banana');
  await expect(page.getByTestId('fruit-value')).toHaveText('"banana"');
});

test('Escape closes the popup, keeps the value and returns focus to the trigger', async ({ page }) => {
  await fruit(page).click();
  await option(page, 'Apple').hover();
  await page.keyboard.press('Escape');
  await expect(options(page)).toHaveCount(0);
  await expect(fruit(page)).toHaveText('Select a fruit');
  await expect(fruit(page)).toBeFocused();
  await expect(page.getByTestId('open')).toHaveText('false');
});

test('a press outside closes the popup without changing the value', async ({ page }) => {
  await fruit(page).click();
  await expect(options(page)).toHaveCount(6);
  await page.mouse.click(900, 700);
  await expect(options(page)).toHaveCount(0);
  await expect(page.getByTestId('fruit-value')).toHaveText('null');
});

test('typing highlights the option that starts with the typed text', async ({ page }) => {
  await fruit(page).click();
  await expect(highlighted(page)).toHaveText('Select a fruit');
  await page.keyboard.type('b');
  await expect(highlighted(page)).toHaveText('Banana');
  await page.keyboard.type('l');
  await expect(highlighted(page)).toHaveText('Blueberry');
  await page.keyboard.press('Enter');
  await expect(fruit(page)).toHaveText('Blueberry');
  await expect(page.getByTestId('fruit-value')).toHaveText('"blueberry"');
});

test('typing on the closed trigger selects the matching option', async ({ page }) => {
  await fruit(page).focus();
  await page.keyboard.type('pi');
  await expect(fruit(page)).toHaveText('Pineapple');
  await expect(page.getByTestId('fruit-value')).toHaveText('"pineapple"');
  await expect(options(page)).toHaveCount(0);
});

test('a disabled option cannot be selected by click or Enter and typeahead skips it', async ({ page }) => {
  await fruit(page).click();
  const grapes = option(page, 'Grapes');
  await expect(grapes).toHaveAttribute('aria-disabled', 'true');
  await grapes.click({ force: true });
  await expect(options(page)).toHaveCount(6);
  await expect(page.getByTestId('fruit-value')).toHaveText('null');
  await option(page, 'Blueberry').hover();
  await expect(highlighted(page)).toHaveText('Blueberry');
  await page.keyboard.press('ArrowDown');
  await expect(highlighted(page)).toHaveText('Grapes');
  await page.keyboard.press('Enter');
  await expect(options(page)).toHaveCount(6);
  await expect(page.getByTestId('fruit-value')).toHaveText('null');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-slot=select-content]')).toBeHidden();
  await page.keyboard.type('gr');
  await expect(fruit(page)).toHaveText('Select a fruit');
  await page.keyboard.type('p');
  await expect(fruit(page)).toHaveText('Pineapple');
});

test('groups render their labels, items and a separator', async ({ page }) => {
  await page.getByTestId('groups').click();
  const fruits = page.getByRole('group', { name: 'Fruits' });
  const vegetables = page.getByRole('group', { name: 'Vegetables' });
  await expect(fruits.getByRole('option')).toHaveText(['Apple', 'Banana', 'Blueberry']);
  await expect(vegetables.getByRole('option')).toHaveText(['Carrot', 'Broccoli']);
  await expect(page.locator('[data-slot=select-separator]')).toHaveCount(1);
  await vegetables.getByRole('option', { name: 'Broccoli' }).click();
  await expect(page.getByTestId('groups')).toHaveText('Broccoli');
});

test('multiple selection keeps the popup open, toggles items and joins the form values', async ({ page }) => {
  const multiple = page.getByTestId('multiple');
  await expect(multiple).toHaveText('Select fruits');
  await multiple.click();
  await option(page, 'Apple').click();
  await expect(options(page)).toHaveCount(3);
  await expect(multiple).toHaveText('Apple');
  await option(page, 'Blueberry').click();
  await expect(multiple).toHaveText('2 fruits selected');
  await expect(page.getByTestId('multiple-value')).toHaveText('apple,blueberry');
  await expect(option(page, 'Apple')).toHaveAttribute('aria-selected', 'true');
  await expect(option(page, 'Banana')).toHaveAttribute('aria-selected', 'false');
  await option(page, 'Apple').click();
  await expect(page.getByTestId('multiple-value')).toHaveText('blueberry');
  await expect(option(page, 'Apple')).toHaveAttribute('aria-selected', 'false');
  await page.keyboard.press('Escape');
  await expect(await submit(page)).toBe('fruit=&fruits=blueberry&plan=Starter');
});

test('the form submits the selected values by name and a reset restores the defaults', async ({ page }) => {
  expect(await submit(page)).toBe('fruit=&plan=Starter');
  await fruit(page).click();
  await option(page, 'Banana').click();
  await page.getByTestId('plan').click();
  await option(page, 'Professional').click();
  await expect(page.getByTestId('plan')).toHaveText('Professional');
  expect(await submit(page)).toBe('fruit=banana&plan=Professional');
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(fruit(page)).toHaveText('Select a fruit');
  await expect(page.getByTestId('plan')).toHaveText('Starter');
  expect(await submit(page)).toBe('fruit=&plan=Starter');
});

test('the trigger carries data-popup-open and the popup data-open only while open', async ({ page }) => {
  await expect(fruit(page)).not.toHaveAttribute('data-popup-open');
  await fruit(page).click();
  await expect(fruit(page)).toHaveAttribute('data-popup-open', '');
  await expect(page.locator('[data-slot=select-content]')).toHaveAttribute('data-open', '');
  await page.keyboard.press('Escape');
  await expect(options(page)).toHaveCount(0);
  await expect(fruit(page)).not.toHaveAttribute('data-popup-open');
});

test('sizes set the trigger height', async ({ page }) => {
  expect((await rect(fruit(page))).height).toBe(32);
  expect((await rect(page.getByTestId('disabled'))).height).toBe(28);
});

test('the popup overlaps the trigger by default and sits below it with alignItemWithTrigger off', async ({ page }) => {
  const trigger = page.getByTestId('below');
  await trigger.click();
  await expect(options(page)).toHaveCount(3);
  const popup = page.locator('[data-slot=select-content]');
  await expect(popup).toHaveAttribute('data-align-trigger', 'false');
  const triggerBox = await rect(trigger);
  await expect.poll(async () => (await rect(popup.locator('..'))).top).toBe(triggerBox.bottom + 4);
  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
  const defaultTrigger = fruit(page);
  await defaultTrigger.click();
  const defaultPopup = page.locator('[data-slot=select-content][data-open]');
  await expect(defaultPopup).toHaveAttribute('data-align-trigger', 'true');
  const defaultTriggerBox = await rect(defaultTrigger);
  await expect.poll(async () => (await rect(defaultPopup.locator('..'))).top < defaultTriggerBox.top).toBe(true);
});

test('a disabled select does not open', async ({ page }) => {
  const trigger = page.getByTestId('disabled');
  await trigger.click();
  await expect(options(page)).toHaveCount(6);
  await page.keyboard.press('Escape');
  await expect(options(page)).toHaveCount(0);
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(trigger).toBeDisabled();
  await trigger.click({ force: true });
  await expect(options(page)).toHaveCount(0);
});

test('an aria-invalid select trigger in a data-invalid field keeps its placeholder and shows the field error', async ({ page }) => {
  const trigger = page.getByTestId('invalid');
  await expect(trigger).toHaveAttribute('aria-invalid', 'true');
  await expect(trigger).toHaveText('Pick one');
  await expect(page.getByText('Please pick a fruit.')).toBeVisible();
});

test('inside a dialog the popup opens above it, selects, and Escape closes the popup before the dialog', async ({ page }) => {
  await page.getByRole('button', { name: 'Open Dialog' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const trigger = page.getByTestId('dialog-select');
  await trigger.click();
  await expect(options(page)).toHaveCount(6);
  await option(page, 'Blueberry').click();
  await expect(options(page)).toHaveCount(0);
  await expect(trigger).toHaveText('Blueberry');
  await expect(dialog).toBeVisible();
  await trigger.click();
  await expect(options(page)).toHaveCount(6);
  await page.keyboard.press('Escape');
  await expect(options(page)).toHaveCount(0);
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});
