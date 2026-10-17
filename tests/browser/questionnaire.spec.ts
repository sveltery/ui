import { expect, test, type Locator, type Page } from '@playwright/test';

async function open(page: Page, scenario: string) {
  await page.goto(`/questionnaire?case=${scenario}`);
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
}

const choiceInput = (page: Page, testId: string) => page.locator(`[data-testid="${testId}"] input`);
const formValues = (page: Page, name: string) =>
  page.getByTestId('root').evaluate((form, field) => new FormData(form as HTMLFormElement).getAll(field), name);
const submitted = (page: Page) => page.getByTestId('submitted');

test('selects a composed choice through its label row', async ({ page }) => {
  await open(page, 'label');
  await page.getByTestId('answer').click();
  await expect(choiceInput(page, 'answer')).toBeChecked();
  expect(await formValues(page, 'answer')).toEqual(['answer']);
});

test('preserves native radio and checkbox keyboard behavior', async ({ page }) => {
  await open(page, 'native-keys');
  const alpha = choiceInput(page, 'alpha');
  const beta = choiceInput(page, 'beta');
  const other = page.getByTestId('other');

  await alpha.focus();
  await page.keyboard.press('ArrowRight');
  await expect(beta).toBeChecked();
  await expect(alpha).not.toBeChecked();
  expect(await formValues(page, 'single')).toEqual(['beta']);
  await expect(page.locator('[data-active]')).toContainText('Choose one');

  await page.keyboard.press('ArrowDown');
  await expect(other).toBeFocused();
  await expect(beta).toBeChecked();
  await page.keyboard.press('ArrowUp');
  await expect(beta).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(alpha).toBeFocused();
  await expect(alpha).toBeChecked();

  await expect(other).not.toHaveAttribute('name');
  await other.pressSequentially('Draft');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowDown');
  await expect(other).toBeFocused();
  await expect(other).toHaveAttribute('name', 'single');

  await page.getByTestId('next').click();
  const gamma = choiceInput(page, 'gamma');
  const delta = choiceInput(page, 'delta');
  await gamma.focus();
  await page.keyboard.press('Space');
  await expect(gamma).toBeChecked();
  expect(await formValues(page, 'multiple')).toEqual(['gamma']);
  await page.keyboard.press('ArrowDown');
  await expect(delta).toBeFocused();
  await expect(delta).not.toBeChecked();
  await page.keyboard.press('Space');
  expect(await formValues(page, 'multiple')).toEqual(['gamma', 'delta']);
});

test('moves between items with contextual horizontal arrows', async ({ page }) => {
  await open(page, 'arrows');
  const first = page.getByTestId('first');
  const second = page.getByTestId('second');
  const secondAnswer = page.getByTestId('second-answer');

  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(first).toHaveAttribute('data-active', '');

  await choiceInput(page, 'first-answer').click();
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(second).toHaveAttribute('data-active', '');
  await expect(second).toBeFocused();
  await expect(first).toBeHidden();

  await page.keyboard.press('ArrowDown');
  await expect(secondAnswer).toBeFocused();
  await secondAnswer.pressSequentially('Draft');
  await page.keyboard.press('ArrowLeft');
  await expect(second).toHaveAttribute('data-active', '');

  await second.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(first).toHaveAttribute('data-active', '');
  await expect(first).toBeFocused();
});

test('keeps native arrow behavior for number inputs', async ({ page }) => {
  await open(page, 'number');
  const rounds = page.getByTestId('round-count');
  await rounds.click();
  await page.keyboard.press('ArrowUp');
  await expect(rounds).toBeFocused();
  await expect(rounds).toHaveValue('1');
});

test('selects answers with scoped shortcuts and confirms with Enter', async ({ page }) => {
  await open(page, 'shortcuts');
  const shortcut = page.locator('[data-testid="beta"] span[data-shortcut="B"]');
  await expect(shortcut).toHaveText('B');
  await expect(shortcut).toHaveAttribute('aria-hidden', 'true');

  await choiceInput(page, 'alpha').focus();
  await page.keyboard.press('b');
  await expect(choiceInput(page, 'beta')).toBeChecked();
  await expect(choiceInput(page, 'beta')).toBeFocused();

  await page.keyboard.press('Enter');
  const detail = page.getByTestId('detail-input');
  await expect(detail).toBeVisible();
  await expect(detail).not.toHaveAttribute('data-shortcut');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(detail).toBeFocused();
  await expect(detail).toHaveValue('');

  await detail.pressSequentially('Custom detail');
  await page.keyboard.press('Enter');
  await expect(submitted(page)).toHaveText('single=beta&detail=Custom detail');
});

test('uses definition order for shortcuts and document order for arrows, and warns once about the difference', async ({ page }) => {
  const warnings: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'warning') warnings.push(message.text());
  });
  await open(page, 'order');
  await expect(page.getByTestId('first')).toHaveAttribute('data-shortcut', 'B');
  await expect(page.getByTestId('second')).toHaveAttribute('data-shortcut', 'A');

  await page.getByTestId('answer').focus();
  await page.keyboard.press('a');
  await expect(choiceInput(page, 'second')).toBeChecked();
  await expect(choiceInput(page, 'first')).not.toBeChecked();

  await choiceInput(page, 'first').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByTestId('other')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(choiceInput(page, 'second')).toBeFocused();
  expect(warnings).toEqual([
    '[Questionnaire] Choice order for item "answer" differs between Root.items and the rendered Questionnaire.Choice elements.'
  ]);
});

test('validates, advances, and submits with Command or Control plus Enter', async ({ page }) => {
  await open(page, 'confirm');
  await page.getByTestId('first-input').focus();
  await page.keyboard.press('Meta+Enter');
  await expect(page.getByTestId('first-error')).toBeVisible();
  await expect(choiceInput(page, 'first-answer')).toBeFocused();

  await choiceInput(page, 'first-answer').click();
  await page.getByTestId('first-input').focus();
  await page.keyboard.press('Meta+Enter');
  await expect(page.getByTestId('second')).toBeVisible();
  await expect(page.getByTestId('second')).toBeFocused();

  await choiceInput(page, 'second-answer').click();
  await page.keyboard.press('Control+Enter');
  await expect(submitted(page)).toHaveText('first=first-answer&second=second-answer');
});

test('toggles multiple answers with scoped shortcuts', async ({ page }) => {
  await open(page, 'multiple-shortcuts');
  await choiceInput(page, 'alpha').focus();
  await page.keyboard.press('2');
  await expect(choiceInput(page, 'beta')).toBeFocused();
  expect(await formValues(page, 'answers')).toEqual(['beta']);
  await page.keyboard.press('2');
  expect(await formValues(page, 'answers')).toEqual([]);
  await page.keyboard.press('1');
  await expect(choiceInput(page, 'alpha')).toBeFocused();
  expect(await formValues(page, 'answers')).toEqual(['alpha']);
});

test('does not implicitly submit from an unselected answer', async ({ page }) => {
  await open(page, 'implicit');
  const alpha = choiceInput(page, 'alpha');
  const other = page.getByTestId('other');
  await alpha.click();
  await choiceInput(page, 'beta').focus();
  await page.keyboard.press('Enter');

  await other.pressSequentially('Preserved draft');
  await alpha.click();
  await other.focus();
  await page.keyboard.press('Enter');
  await expect(other).toHaveValue('Preserved draft');
  await expect(submitted(page)).toHaveText('');

  await alpha.focus();
  await page.keyboard.press('Enter');
  await expect(submitted(page)).toHaveText('answer=alpha');
});

test('a skipped item leaves the native form data', async ({ page }) => {
  await open(page, 'skip');
  await expect(choiceInput(page, 'kept')).toBeChecked();
  await page.getByTestId('skip').click();
  await expect(choiceInput(page, 'kept')).not.toBeChecked();
  await expect(choiceInput(page, 'kept')).not.toHaveAttribute('name');
  await expect(page.getByTestId('skip-item')).toHaveAttribute('data-status', 'skipped');
  await expect(submitted(page)).toHaveText('(empty)');
});

test('allows a freeform answer with native validation enabled', async ({ page }) => {
  await open(page, 'native-freeform');
  await expect(choiceInput(page, 'fixed')).not.toHaveAttribute('required');
  await page.getByTestId('other').pressSequentially('Freeform');
  await page.getByTestId('submit').click();
  await expect(submitted(page)).toHaveText('answer=Freeform');
});

test('validates selected native controls without validating unselected drafts', async ({ page }) => {
  await open(page, 'native-email');
  const contact = page.getByTestId('contact');
  const email = page.getByTestId('contact-input');
  expect(await email.evaluate((input) => (input as HTMLInputElement).form)).toBeNull();

  await email.pressSequentially('not-an-email');
  await page.getByTestId('next').click();
  await expect(contact).toHaveAttribute('data-active', '');
  expect(await email.evaluate((input) => (input as HTMLInputElement).validity.valid)).toBe(false);
  await expect(email).toBeFocused();

  await choiceInput(page, 'fixed-contact').click();
  await expect(email).toHaveValue('not-an-email');
  await expect(email).not.toHaveAttribute('name');
  expect(await email.evaluate((input) => (input as HTMLInputElement).form)).toBeNull();

  await page.getByTestId('next').click();
  await expect(page.getByTestId('confirmation')).toHaveAttribute('data-active', '');
  await choiceInput(page, 'confirm').click();
  await page.getByTestId('submit').click();
  await expect(submitted(page)).toHaveText('contact=fixed&confirmation=confirmed');
});

test('does not confirm a freeform answer while an IME composition is active', async ({ page }) => {
  await open(page, 'ime');
  const detail = page.getByTestId('detail-input');
  await detail.pressSequentially('入力');
  await detail.dispatchEvent('keydown', { bubbles: true, cancelable: true, isComposing: true, key: 'Enter' });
  await expect(detail).toHaveValue('入力');
  await expect(submitted(page)).toHaveText('');
  await page.keyboard.press('Enter');
  await expect(submitted(page)).toHaveText('detail=入力');
});

test('moves focus on validation and navigation', async ({ page }) => {
  await open(page, 'focus');
  await page.getByTestId('next').click();
  await expect(choiceInput(page, 'first-answer')).toBeFocused();
  await expect(page.getByRole('alert')).toHaveText('Choose an answer to continue.');

  await choiceInput(page, 'first-answer').click();
  await page.getByTestId('next').click();
  await expect(page.getByTestId('second')).toHaveAttribute('data-active', '');
  await expect(page.getByTestId('second')).toBeFocused();

  await page.getByTestId('submit').click();
  await expect(choiceInput(page, 'second-answer')).toBeFocused();
  await expect(submitted(page)).toHaveText('');
});

test('submits an intentional final skip through the native form', async ({ page }) => {
  await open(page, 'final-skip');
  await page.getByTestId('skip').click();
  await expect(submitted(page)).toHaveText('(empty) skipped');
});

test('preserves inactive answers and restores native defaults on reset', async ({ page }) => {
  await open(page, 'reset');
  await page.getByTestId('next').click();
  await page.getByTestId('detail-input').fill('Custom detail');
  await page.getByTestId('previous').click();
  expect(await formValues(page, 'channel')).toEqual(['email']);
  expect(await formValues(page, 'detail')).toEqual(['Custom detail', 'Fixed detail']);

  await page.getByTestId('reset').click();
  await expect(page.getByTestId('channel')).toBeVisible();
  await expect(page.getByTestId('detail')).toBeHidden();
  await expect(choiceInput(page, 'email')).toBeChecked();
  await expect(page.getByTestId('detail-input')).toHaveValue('Default detail');
  await expect(page.getByTestId('fixed-detail-input')).toHaveValue('Fixed detail');
  expect(await formValues(page, 'detail')).toEqual(['Default detail', 'Fixed detail']);
});

test('hydrates server-rendered collection markup without warnings and navigates from it', async ({ page }) => {
  const warnings: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'warning' || message.type() === 'error') warnings.push(message.text());
  });
  const response = await page.request.get('/questionnaire?case=collection');
  const html = await response.text();
  expect(html).toMatch(/role="progressbar"[^>]*>(<!---->)?Question 1 of 2/);
  expect(html).toMatch(/data-shortcut="A"[^>]*data-testid="delegation"/);

  await open(page, 'collection');
  await expect(page.getByTestId('progress')).toHaveText('Question 1 of 2');
  await expect(page.getByTestId('skip')).toBeHidden();
  await expect(page.getByTestId('questions')).toHaveAttribute('data-shortcut', 'B');
  await page.getByTestId('scope').focus();
  await page.keyboard.press('b');
  await expect(choiceInput(page, 'questions')).toBeChecked();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('progress')).toHaveText('Question 2 of 2');
  await expect(page.getByTestId('detail')).toBeFocused();
  await expect(page.getByTestId('skip')).toBeVisible();
  await page.getByTestId('skip').click();
  await expect(submitted(page)).toHaveText('scope=questions');
  expect(warnings).toEqual([]);
});

test.describe('registry Questionnaire example on the docs page', () => {
  test.use({ baseURL: 'http://127.0.0.1:5175' });
  test.describe.configure({ timeout: 120_000 });

  async function example(page: Page, title: string) {
    const section = page.locator('[data-slot=example]').filter({ has: page.getByText(title, { exact: true }) });
    await section.scrollIntoViewIfNeeded();
    return section;
  }

  async function openExample(page: Page, title: string) {
    await page.goto('/docs/components/questionnaire');
    await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 90_000 });
    return example(page, title);
  }

  const radio = (section: Locator, name: string) => section.getByRole('radio', { name });

  test('Standalone advances after a letter shortcut and Enter and shows the choice description, Card selects with a number shortcut and advances, and Dialog opens and shows the questionnaire', async ({ page }) => {
    let section = await openExample(page, 'Standalone');
    await expect(section.getByRole('progressbar')).toHaveText('Question 1 of 3');
    await expect(section.getByText('Show when work is delegated and what comes back.')).toBeVisible();
    await expect(section.getByRole('button', { name: 'Skip' })).toBeHidden();

    await radio(section, /Sub-agent delegation/).focus();
    await page.keyboard.press('a');
    await expect(radio(section, /Sub-agent delegation/)).toBeChecked();
    await expect(section.getByRole('progressbar')).toHaveText('Question 1 of 3');
    await page.keyboard.press('Enter');
    await expect(section.getByRole('progressbar')).toHaveText('Question 2 of 3');
    await expect(section.getByText('What should every progress update include?')).toBeVisible();

    section = await example(page, 'Card');
    await expect(section.getByRole('progressbar')).toHaveText('Question 1 of 3');
    await expect(section.getByText('Explore one unified interaction pattern.')).toBeVisible();

    await radio(section, /Sub-agent delegation/).focus();
    await page.keyboard.press('2');
    await expect(radio(section, /Question prompts/)).toBeChecked();
    await page.keyboard.press('Enter');
    await expect(section.getByRole('progressbar')).toHaveText('Question 2 of 3');
    await expect(section.getByText('What should every progress update include?')).toBeVisible();

    section = await example(page, 'Dialog');
    await section.getByRole('button', { name: 'Open questionnaire' }).click();
    const dialog = page.getByRole('dialog', { name: 'Plan an agent interface' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('progressbar')).toHaveText('Question 1 of 3');
    await expect(dialog.getByText('What should we prototype next?')).toBeVisible();
    await expect(dialog.getByRole('radio')).toHaveCount(3);
  });

  test('Standalone skips the optional second question', async ({ page }) => {
    const section = await openExample(page, 'Standalone');
    await radio(section, /Question prompts/).focus();
    await page.keyboard.press('b');
    await page.keyboard.press('Enter');
    await expect(section.getByRole('progressbar')).toHaveText('Question 2 of 3');

    await section.getByRole('button', { name: 'Skip' }).click();
    await expect(section.getByRole('progressbar')).toHaveText('Question 3 of 3');
    await expect(section.getByText('When should this be revisited?')).toBeVisible();
    await expect(section.getByRole('button', { name: 'Save answers' })).toBeVisible();
  });
});
