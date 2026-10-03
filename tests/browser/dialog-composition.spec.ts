// Source-derived supplemental comparisons against genuine pinned wrappers/helpers.
import { expect, test } from '@playwright/test';

test('canonical Content Button and selected X geometry match the genuine pinned React composition', async ({ page }) => {
  const results = [];
  for (const route of ['/dialog', '/reference']) {
    await page.goto(route); await expect(page.locator('[data-hydrated=true]')).toBeVisible();
    await page.getByTestId('trigger').click();
    const popup = page.getByRole('dialog', { name: 'Edit profile' }); await expect(popup).toBeVisible();
    const close = popup.getByRole('button', { name: 'Close', exact: true });
    await expect(close).toHaveAttribute('data-slot', 'dialog-close'); await expect(close).toHaveAttribute('tabindex', '0');
    await expect(close).toHaveClass(/cn-button-variant-ghost.*cn-button-size-icon-sm.*cn-dialog-close/);
    await expect(close.locator('svg')).toHaveClass(/lucide-x/);
    await expect(close.locator('svg')).not.toHaveAttribute('aria-hidden');
    await expect(close.locator('.sr-only')).toHaveText('Close');
    results.push(await close.evaluate(button => {
      const svg = button.querySelector('svg')!;
      const css = getComputedStyle(button);
      // Compare every real SVG element/attribute; framework comment markers are
      // scheduling details, not icon geometry or original public attributes.
      function shape(element: Element): unknown { return { tag: element.tagName, attributes: Object.fromEntries(Array.from(element.attributes, attr => [attr.name, attr.value])), children: Array.from(element.children, shape) }; }
      return { tag: button.tagName, class: button.className, slot: button.getAttribute('data-slot'), tabindex: button.getAttribute('tabindex'), type: button.getAttribute('type'), nestedButtons: button.querySelectorAll('button').length, geometry: shape(svg), width: css.width, height: css.height, position: css.position };
    }));
    await close.click(); await expect(popup).toHaveCount(0); await expect(page.getByTestId('trigger')).toBeFocused();
  }
  expect(results[0]).toEqual(results[1]); expect(results[0].nestedButtons).toBe(0);
});

test('canonical Footer outline Button retains native keyboard activation and canceled-close semantics', async ({ page }) => {
  await page.goto('/dialog?scenario=footer'); await expect(page.locator('[data-hydrated=true]')).toBeVisible();
  const trigger = page.getByTestId('trigger'); await trigger.click();
  const popup = page.getByRole('dialog'); const close = popup.locator('[data-slot=dialog-footer]').getByRole('button', { name: 'Close', exact: true });
  await expect(close).toHaveAttribute('data-slot', 'button'); await expect(close).toHaveAttribute('tabindex', '0');
  await expect(close).toHaveClass(/cn-button-variant-outline.*cn-button-size-default/);
  await expect(popup.locator('button button')).toHaveCount(0);
  await page.getByTestId('cancel-next').evaluate((node: HTMLButtonElement) => node.click());
  await close.focus(); await page.keyboard.press('Space'); await expect(popup).toBeVisible();
  await page.keyboard.press('Enter'); await expect(popup).toHaveCount(0); await expect(trigger).toBeFocused();
  const state = JSON.parse(await page.getByTestId('state').textContent() ?? '{}');
  expect(state.log.filter((entry: { reason: string }) => entry.reason === 'close-press')).toHaveLength(2);
});
