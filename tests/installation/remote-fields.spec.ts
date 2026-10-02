import { expect, test, type Page } from '@playwright/test';

const submitters = [
  { id: 'native-submit', field: 'action', value: 'native' },
  { id: 'base-submit', field: 'baseAction', value: 'base' },
  { id: 'ui-submit', field: 'uiAction', value: 'ui' },
] as const;

async function output(page: Page, id: string) {
  return JSON.parse(await page.locator(`#${id}`).innerText());
}

async function open(page: Page) {
  await page.goto('/remote-fields');
  await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
}

async function typeValues(page: Page, nativeText: string, text: string) {
  for (const [id, value] of [['native-text', nativeText], ['ui-text', text]]) {
    await page.locator(`#${id}`).focus();
    await page.keyboard.press('ControlOrMeta+A');
    await page.locator(`#${id}`).pressSequentially(value);
  }
}

async function assertSubmission(page: Page, submitter: typeof submitters[number], nativeText: string, text: string, emptyText = '') {
  await page.locator(`#${submitter.id}`).click();
  await expect.poll(() => output(page, 'result')).toEqual({
    parsed: { nativeText, text, emptyText, [submitter.field]: submitter.value },
  });
  await expect(page.locator('#pending')).toHaveText('0');
}

test('fresh remote fields: hydrated drafts, trusted edits and default successful reset', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await open(page);
  await expect(page.locator('#native-text')).toHaveValue('Draft');
  await expect(page.locator('#ui-text')).toHaveValue('Draft');
  await expect(page.locator('#empty-text')).toHaveValue('');
  await expect.poll(() => output(page, 'values')).toEqual({});
  await typeValues(page, 'Typed native', 'Typed UI');
  await expect.poll(() => output(page, 'values')).toMatchObject({ nativeText: 'Typed native', text: 'Typed UI' });
  await assertSubmission(page, submitters[0], 'Typed native', 'Typed UI');
  await expect.poll(() => output(page, 'form-data')).toEqual([
    ['nativeText', 'Typed native'], ['text', 'Typed UI'], ['emptyText', ''], ['action', 'native'],
  ]);
  await expect(page.locator('#native-text')).toHaveValue('Draft');
  await expect(page.locator('#ui-text')).toHaveValue('Draft');
  await expect(page.locator('#empty-text')).toHaveValue('');
  await expect.poll(() => output(page, 'values')).toMatchObject({ nativeText: 'Draft', text: 'Draft' });
  await assertSubmission(page, submitters[2], 'Draft', 'Draft');
  expect(errors).toEqual([]);
});

for (const submitter of submitters) {
  test(`fresh remote fields: ${submitter.id} contributes the actual parsed submitter and clears previous submitters`, async ({ page }) => {
    await open(page);
    await page.locator('#mode-retain').click();
    await typeValues(page, 'Retained native', 'Retained UI');
    await assertSubmission(page, submitter, 'Retained native', 'Retained UI');
    await expect.poll(() => output(page, 'form-data')).toEqual([
      ['nativeText', 'Retained native'], ['text', 'Retained UI'], ['emptyText', ''], [submitter.field, submitter.value],
    ]);
    await expect(page.locator('#native-text')).toHaveValue('Retained native');
    await expect(page.locator('#ui-text')).toHaveValue('Retained UI');
    await expect.poll(() => output(page, 'values')).toMatchObject({ nativeText: 'Retained native', text: 'Retained UI' });
    const next = submitters[(submitters.indexOf(submitter) + 1) % submitters.length];
    await assertSubmission(page, next, 'Retained native', 'Retained UI');
  });
}

test('fresh remote fields: individual/collection set, native reset and explicit custom enhancement reset', async ({ page }) => {
  await open(page);
  await page.locator('#field-set').click();
  await expect(page.locator('#native-text')).toHaveValue('Individual native');
  await expect(page.locator('#ui-text')).toHaveValue('Individual UI');
  await expect.poll(() => output(page, 'values')).toMatchObject({ nativeText: 'Individual native', text: 'Individual UI' });
  await page.locator('#mode-retain').click();
  await assertSubmission(page, submitters[1], 'Individual native', 'Individual UI');
  await page.locator('#collection-set').click();
  await expect(page.locator('#native-text')).toHaveValue('Collection native');
  await expect(page.locator('#ui-text')).toHaveValue('Collection UI');
  await expect(page.locator('#empty-text')).toHaveValue('Collection empty');
  await expect.poll(() => output(page, 'values')).toMatchObject({ nativeText: 'Collection native', text: 'Collection UI', emptyText: 'Collection empty' });
  await assertSubmission(page, submitters[2], 'Collection native', 'Collection UI', 'Collection empty');
  await page.locator('#reset').click();
  await expect(page.locator('#native-text')).toHaveValue('Draft');
  await expect(page.locator('#ui-text')).toHaveValue('Draft');
  await expect(page.locator('#empty-text')).toHaveValue('');
  await expect.poll(() => output(page, 'values')).toMatchObject({ nativeText: 'Draft', text: 'Draft', emptyText: '' });
  await page.locator('#mode-reset').click();
  expect(await page.locator('#probe').evaluate(form => (form as HTMLFormElement).reset instanceof HTMLButtonElement)).toBe(true);
  await typeValues(page, 'Explicit native', 'Explicit UI');
  await assertSubmission(page, submitters[0], 'Explicit native', 'Explicit UI');
  await expect(page.locator('#native-text')).toHaveValue('Draft');
  await expect(page.locator('#ui-text')).toHaveValue('Draft');
  await assertSubmission(page, submitters[1], 'Draft', 'Draft');
});

test('fresh remote fields: rejected submission preserves invalid UI input and reports field issues', async ({ page }) => {
  await open(page);
  await typeValues(page, 'Valid native', 'x');
  await page.locator('#ui-submit').click();
  await expect(page.locator('#ui-text')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#text-issues')).toContainText('Use at least two characters');
  await expect(page.locator('#issues')).toContainText('Use at least two characters');
  await expect(page.locator('#ui-text')).toHaveValue('x');
  await expect.poll(() => output(page, 'values')).toMatchObject({ text: 'x' });
  await expect(page.locator('#pending')).toHaveText('0');
  await expect(page.locator('#result')).toHaveText('null');
});

test.describe('fresh remote fields without client JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const submitter of submitters) {
    test(`${submitter.id}: UI SSR draft and actual edited successful navigation`, async ({ page }) => {
      await page.goto('/remote-fields');
      await expect(page.locator('#ui-text')).toHaveText('Draft');
      await expect(page.locator('#ui-text')).toHaveValue('Draft');
      await expect(page.locator('#empty-text')).toHaveValue('');
      await page.locator('#native-text').fill('SSR native');
      await page.locator('#ui-text').fill('SSR UI');
      await Promise.all([page.waitForNavigation(), page.locator(`#${submitter.id}`).click()]);
      await expect.poll(() => output(page, 'result')).toEqual({
        parsed: { nativeText: 'SSR native', text: 'SSR UI', emptyText: '', [submitter.field]: submitter.value },
      });
    });
  }

  test('invalid UI text is preserved in returned SSR HTML', async ({ page }) => {
    await page.goto('/remote-fields');
    await page.locator('#native-text').fill('Valid native');
    await page.locator('#ui-text').fill('x');
    await Promise.all([page.waitForNavigation(), page.locator('#ui-submit').click()]);
    await expect(page.locator('#ui-text')).toHaveText('x');
    await expect(page.locator('#ui-text')).toHaveValue('x');
    await expect(page.locator('#ui-text')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#text-issues')).toContainText('Use at least two characters');
    await expect(page.locator('#result')).toHaveText('null');
  });
});
