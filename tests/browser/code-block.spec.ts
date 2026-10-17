import { expect, test, type Locator } from '@playwright/test';

const selectionOf = (content: Locator) =>
  content.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    return selection.toString();
  });

test.beforeEach(async ({ page }) => {
  await page.goto('/code-block');
  await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true', { timeout: 15_000 });
});

test('a copied selection keeps blank lines and leaves out line numbers and diff markers', async ({ page }) => {
  const plain = page.getByTestId('plain').locator('[data-slot=code-block-content]');
  await expect(plain.locator('[data-slot=code-block-line]')).toHaveCount(3);
  expect(await selectionOf(plain)).toBe('const a = 1;\n\nconst b = 2;');

  const diff = page.getByTestId('diff').locator('[data-slot=code-block-content]');
  expect(await diff.locator('[data-slot=code-block-line]').evaluateAll((lines) => lines.map((line) => line.getAttribute('data-variant')))).toEqual(['default', 'removed', 'added', 'default', 'added']);
  expect(await selectionOf(diff)).toBe('keep\nold\nnew\n\nlast');

  const kept = page.getByTestId('kept').locator('[data-slot=code-block-content]');
  expect(await selectionOf(kept)).toBe('a\n\nb');
});

test('highlighted code renders colored tokens, keeps markup in the code as text, and streams new lines', async ({ page }) => {
  const content = page.getByTestId('highlighted').locator('[data-slot=code-block-content]');
  const firstToken = content.locator('[data-slot=code-block-line-content] > span').first();
  await expect(firstToken).toHaveAttribute('style', /--shiki-light:#/);
  expect(await selectionOf(content)).toBe('<script>window.injected = true</script>\n<p class="note">Hi</p>');
  expect(await page.evaluate(() => 'injected' in window)).toBe(false);
  await expect(content.locator('script, p')).toHaveCount(0);

  await content.locator('[data-slot=code-block-line]').first().evaluate((line) => ((line as HTMLElement & { marked?: true }).marked = true));
  await page.getByRole('button', { name: 'Append' }).click();
  await expect(content.locator('[data-slot=code-block-line]')).toHaveCount(3);
  await expect(content.locator('[data-slot=code-block-line]').nth(2)).toHaveText('<b>more</b>');
  await expect(content.locator('[data-slot=code-block-line]').nth(2).locator('[data-slot=code-block-line-content] > span').first()).toHaveAttribute('style', /--shiki-light:#/);
  expect(await content.locator('[data-slot=code-block-line]').first().evaluate((line) => (line as HTMLElement & { marked?: true }).marked)).toBe(true);
});

test('floating actions show on hover, and the copy button copies its value and announces it', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Clipboard permissions are Chromium only');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const block = page.getByTestId('plain');
  const actions = block.locator('[data-slot=code-block-actions]');
  await expect(actions).toHaveCSS('opacity', '0');
  await block.hover();
  await expect(actions).toHaveCSS('opacity', '1');

  await block.getByRole('button', { name: 'Copy' }).click();
  await expect(block.getByRole('button', { name: 'Copied' })).toHaveAttribute('data-copied', 'true');
  await expect(block.locator('[aria-live=polite]')).toHaveText('Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('const a = 1;\n\nconst b = 2;');
  await expect(block.getByRole('button', { name: 'Copy' })).toBeVisible({ timeout: 3000 });
});
