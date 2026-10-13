import { expect, test, type Page } from '@playwright/test';

async function open(page: Page) {
  await page.goto('/command');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
}

const inline = (page: Page) => page.locator('#inline');
const active = (page: Page) => inline(page).locator('[cmdk-item][data-selected=true]');

/** Visible option names, top to bottom as painted. */
async function painted(page: Page) {
  const options = await inline(page).getByRole('option').evaluateAll((nodes) =>
    nodes
      .filter((node) => (node as HTMLElement).offsetParent !== null)
      .map((node) => ({ name: node.getAttribute('data-value'), top: node.getBoundingClientRect().top }))
  );
  return options.sort((a, b) => a.top - b.top).map((option) => option.name);
}

test('the first item is selected and arrow keys walk the list in painted order, skipping disabled items', async ({ page }) => {
  await open(page);
  const input = page.getByRole('combobox');
  await expect(active(page)).toHaveText('Calendar');
  await expect(page.getByTestId('value')).toHaveText('Calendar');
  await input.focus();
  const seen = [];
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('ArrowDown');
    seen.push(await active(page).getAttribute('data-value'));
    await expect(input).toHaveAttribute('aria-activedescendant', (await active(page).getAttribute('id'))!);
  }
  expect(seen).toEqual(['Search Emoji', 'Profile', 'Billing', 'Settings', 'Calendar']);
  await page.keyboard.press('End');
  await expect(active(page)).toHaveAttribute('data-value', 'Settings');
  await page.keyboard.press('Home');
  await expect(active(page)).toHaveAttribute('data-value', 'Calendar');
});

test('typing filters and ranks results, and the keyboard follows the ranked order on screen', async ({ page }) => {
  await open(page);
  const input = page.getByRole('combobox');
  await input.fill('re');
  await expect(page.getByTestId('search')).toHaveText('re');
  expect(await painted(page)).toEqual(['Settings', 'Profile', 'Search Emoji']);
  await expect(active(page)).toHaveAttribute('data-value', 'Settings');
  await page.keyboard.press('ArrowDown');
  await expect(active(page)).toHaveAttribute('data-value', 'Profile');
  await page.keyboard.press('ArrowDown');
  await expect(active(page)).toHaveAttribute('data-value', 'Search Emoji');
  await expect(inline(page).locator('[cmdk-separator]')).toHaveCount(0);
  await input.fill('preferences');
  expect(await painted(page)).toEqual(['Settings']);
  await input.fill('zzz');
  await expect(inline(page).getByText('No results found.')).toBeVisible();
  expect(await painted(page)).toEqual([]);
  await input.fill('');
  expect(await painted(page)).toEqual(['Calendar', 'Search Emoji', 'Calculator', 'Profile', 'Billing', 'Settings']);
});

test('Enter and click run the selected command, and pointer movement selects', async ({ page }) => {
  await open(page);
  const input = page.getByRole('combobox');
  await input.fill('bil');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('picked')).toHaveText('Billing');
  await input.fill('');
  await inline(page).getByRole('option', { name: 'Profile' }).hover();
  await expect(active(page)).toHaveAttribute('data-value', 'Profile');
  await inline(page).getByRole('option', { name: 'Search Emoji' }).click();
  await expect(page.getByTestId('picked')).toHaveText('Billing,Search Emoji');
  await inline(page).getByRole('option', { name: 'Calculator' }).click({ force: true });
  await expect(page.getByTestId('picked')).toHaveText('Billing,Search Emoji');
});

test('the list publishes its content height for animation', async ({ page }) => {
  await open(page);
  const list = inline(page).getByRole('listbox');
  const height = async () => parseFloat(await list.evaluate((node) => getComputedStyle(node).getPropertyValue('--cmdk-list-height')));
  await expect.poll(height).toBeGreaterThan(150);
  const full = await height();
  await page.getByRole('combobox').fill('cal');
  await expect.poll(height).toBeLessThan(full);
});

test('the command dialog opens on the UI dialog, labels itself and closes from a command', async ({ page }) => {
  await open(page);
  await page.getByTestId('open').click();
  const dialog = page.getByRole('dialog', { name: 'Command Palette' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleDescription('Search for a command to run...');
  await expect(dialog.getByRole('button', { name: 'Close' })).toHaveCount(0);
  const input = dialog.getByRole('combobox');
  await input.focus();
  await input.fill('in');
  await page.keyboard.press('Enter');
  await expect(dialog).toHaveCount(0);
  await page.getByTestId('open').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
