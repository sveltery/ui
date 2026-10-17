import { expect, test } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:5175' });

test.beforeEach(async ({ page }) => {
  await page.goto('/docs/components/code-block');
  await expect(page.locator('html')).toHaveAttribute('data-ready', { timeout: 30_000 });
});

test('the Typeset example puts a numbered, highlighted code block between paragraphs', async ({ page }) => {
  const typeset = page.locator('[data-name="base/CodeBlockTypesetExample"] .typeset');
  await expect(typeset.getByRole('heading', { name: 'Stream a response' })).toBeVisible();
  const block = typeset.locator('[data-slot=code-block]');
  await expect(block.locator('[data-slot=code-block-title]')).toHaveText('app/api/chat/route.ts');
  await expect(block.locator('[data-slot=code-block-line]')).toHaveCount(8);
  await expect(block.locator('[data-slot=code-block-line-content] > span').first()).toHaveAttribute('style', /--shiki-light:#/);
  await expect(block.locator('xpath=following-sibling::p')).toContainText('The useChat hook reads the stream');
});

test('the Markdown example streams fenced code into a code block, keeps inline code inline, and enables copy when the fence closes', async ({ page }) => {
  const preview = page.locator('[data-name="base/CodeBlockMarkdownExample"]');
  await expect(preview.getByText('How do I debounce a search input in React?')).toBeVisible();
  const block = preview.locator('[data-slot=code-block]');
  await expect(block.locator('[data-slot=code-block-title]')).toHaveText('tsx');
  await expect(block.locator('[data-slot=code-block-line]')).toHaveCount(10);
  await expect(preview.locator('code', { hasText: 'useDebounce' }).first()).toHaveClass(/bg-muted/);
  await expect(block.getByRole('button', { name: /copy/i })).toBeEnabled();

  await preview.getByRole('button', { name: 'Replay' }).click();
  const copy = preview.locator('[data-slot=code-block]').getByRole('button', { name: /copy/i });
  await expect(copy).toBeDisabled({ timeout: 15_000 });
  const button = await copy.elementHandle();
  // Records whether the last sentence had arrived when the button turned enabled.
  const enabledEarly = button!.evaluate(
    (element) =>
      new Promise<boolean>((resolve) => {
        new MutationObserver(() => {
          if (!element.hasAttribute('disabled')) resolve(!element.closest('[data-slot=message-content]')!.textContent!.includes('instead of the raw input.'));
        }).observe(element, { attributes: true, attributeFilter: ['disabled'] });
      }),
  );
  expect(await enabledEarly, 'copy enables once the fence closes, while the answer still streams').toBe(true);

  await expect(preview.getByText('Pass the debounced value to your fetch instead of the raw input.')).toBeVisible({ timeout: 30_000 });
  await expect(preview.getByRole('button', { name: 'Replay' })).toBeVisible();
  expect(await button!.evaluate((element) => element.isConnected), 'the block is not rebuilt when the stream ends').toBe(true);
  await expect(copy).toBeEnabled();
});
