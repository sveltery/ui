import { expect, test } from '@playwright/test';

type Page = import('@playwright/test').Page;

const toasts = (page: Page) => page.locator('[data-slot=toast]');

// The clock is paused, so a closing toast leaves the DOM only while the test advances time.
async function removed(page: Page, toast: ReturnType<typeof toasts>, remaining = 0) {
  await expect.poll(async () => { await page.clock.runFor(100); return toast.count(); }).toBe(remaining);
}

// The exit animation can finish before the next check, so a closed toast is either ending or already gone.
async function closed(toast: ReturnType<typeof toasts>) {
  await expect.poll(async () => (await toast.count()) === 0 || (await toast.getAttribute('data-ending-style')) === '').toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/sonner');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  await page.clock.pauseAt(new Date('2026-01-01T00:01:00Z'));
});

test('toast() shows the message with no icon and closes after 4 seconds', async ({ page }) => {
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  const toast = toasts(page);
  await expect(toast).toHaveCount(1);
  await expect(toast.locator('[data-slot=toast-title]')).toHaveText('Event has been created');
  await expect(toast.locator('[data-slot=toast-description]')).toHaveCount(0);
  await expect(toast.locator('[data-slot=toast-icon]')).toHaveCount(0);
  await expect(toast).toHaveClass(/\bcn-toast\b/);
  await expect(toast).toHaveCSS('border-radius', '16px');

  await page.clock.runFor(3900);
  await expect(toast).not.toHaveAttribute('data-ending-style');
  await page.clock.runFor(200);
  await closed(toast);
  await removed(page, toast);
});

test('description renders under the title', async ({ page }) => {
  await page.getByRole('button', { name: 'With description' }).click();
  const toast = toasts(page);
  await expect(toast.locator('[data-slot=toast-title]')).toHaveText('Event has been created');
  await expect(toast.locator('[data-slot=toast-description]')).toHaveText('Monday, January 3rd at 6:00pm');
});

const variants = [
  ['Success', 'success', 'Event has been created', 'lucide-circle-check'],
  ['Info', 'info', 'Be at the area 10 minutes before the event time', 'lucide-info'],
  ['Warning', 'warning', 'Event start time cannot be earlier than 8am', 'lucide-triangle-alert'],
  ['Error', 'error', 'Event has not been created', 'lucide-octagon-x'],
  ['Loading', 'loading', 'Loading data', 'lucide-loader-2']
] as const;

for (const [button, type, message, iconClass] of variants) {
  test(`toast.${type}() shows its type and icon`, async ({ page }) => {
    await page.getByRole('button', { name: button, exact: true }).click();
    const toast = toasts(page);
    await expect(toast).toHaveAttribute('data-type', type);
    await expect(toast.locator('[data-slot=toast-title]')).toHaveText(message);
    const icon = toast.locator('[data-slot=toast-icon]');
    await expect(icon).toHaveClass(new RegExp(`\\b${iconClass}\\b`));
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(icon).toHaveCSS('width', '16px');
    await expect(icon).toHaveClass(type === 'loading' ? /\banimate-spin\b/ : /^(?!.*animate-spin)/);
  });
}

test('a loading toast stays open until it is dismissed', async ({ page }) => {
  await page.getByRole('button', { name: 'Loading', exact: true }).click();
  await page.clock.runFor(60_000);
  await expect(toasts(page)).toHaveCount(1);
  await expect(toasts(page)).not.toHaveAttribute('data-ending-style');
  await page.getByRole('button', { name: 'Dismiss all' }).click();
  await removed(page, toasts(page));
});

test('duration sets when the toast closes, and Infinity keeps it open', async ({ page }) => {
  await page.getByRole('button', { name: 'Quick' }).click();
  await page.getByRole('button', { name: 'Pinned' }).click();
  await expect(toasts(page)).toHaveCount(2);
  await page.clock.runFor(1100);
  await removed(page, toasts(page), 1);
  await expect(toasts(page).locator('[data-slot=toast-title]')).toHaveText('Pinned');
  await page.clock.runFor(60_000);
  await expect(toasts(page)).toHaveCount(1);
  await expect(toasts(page)).not.toHaveAttribute('data-ending-style');
});

test('the action button runs onClick and closes the toast', async ({ page }) => {
  await page.getByRole('button', { name: 'Action', exact: true }).click();
  const action = page.locator('[data-slot=toast-action]');
  await expect(action).toHaveText('Undo');
  await action.click();
  await expect(page.getByTestId('log')).toHaveText('undo');
  await removed(page, toasts(page));
});

test('preventDefault in the action handler keeps the toast open', async ({ page }) => {
  await page.getByRole('button', { name: 'Action keep' }).click();
  await page.locator('[data-slot=toast-action]').click();
  await expect(page.getByTestId('log')).toHaveText('keep');
  await page.clock.runFor(1000);
  await expect(toasts(page)).toHaveCount(1);
  await expect(toasts(page)).not.toHaveAttribute('data-ending-style');
});

test('toast.promise() shows loading, then the success message and description', async ({ page }) => {
  await page.getByRole('button', { name: 'Promise', exact: true }).click();
  const toast = toasts(page);
  await expect(toast).toHaveAttribute('data-type', 'loading');
  await expect(toast.locator('[data-slot=toast-title]')).toHaveText('Saving event');

  await page.getByRole('button', { name: 'Resolve' }).click();
  await expect(toast).toHaveAttribute('data-type', 'success');
  await expect(toast.locator('[data-slot=toast-title]')).toHaveText('Launch party has been saved');
  await expect(toast.locator('[data-slot=toast-description]')).toHaveText('Saved to your calendar');
  await page.clock.runFor(4100);
  await closed(toast);
  await removed(page, toast);
});

test('toast.promise() shows the error message and raises no unhandled rejection', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.getByRole('button', { name: 'Promise', exact: true }).click();
  await page.getByRole('button', { name: 'Reject' }).click();
  const toast = toasts(page);
  await expect(toast).toHaveAttribute('data-type', 'error');
  await expect(toast.locator('[data-slot=toast-title]')).toHaveText('Failed: Offline');
  await page.clock.runFor(100);
  expect(errors).toEqual([]);
});

test('unwrap() settles like the promise passed in', async ({ page }) => {
  await page.getByRole('button', { name: 'Promise unwrap' }).click();
  await page.getByRole('button', { name: 'Reject' }).click();
  await expect(page.getByTestId('log')).toHaveText('rejected Offline');
});

test('an id updates the toast in place, and dismiss(id) closes only that toast', async ({ page }) => {
  await page.getByRole('button', { name: 'Pinned' }).click();
  await page.getByRole('button', { name: 'Start upload' }).click();
  await expect(toasts(page)).toHaveCount(2);
  await page.getByRole('button', { name: 'Finish upload' }).click();
  await expect(toasts(page)).toHaveCount(2);
  const upload = toasts(page).filter({ hasText: 'Uploaded' });
  await expect(upload).toHaveAttribute('data-type', 'success');

  await page.getByRole('button', { name: 'Dismiss upload' }).click();
  await removed(page, toasts(page), 1);
  await expect(toasts(page).locator('[data-slot=toast-title]')).toHaveText('Pinned');
});

test('only three toasts show at once', async ({ page }) => {
  await page.getByRole('button', { name: 'Four' }).click();
  await expect(toasts(page)).toHaveCount(4);
  await expect(page.locator('[data-slot=toast]:not([data-limited])')).toHaveCount(3);
  await expect(page.locator('[data-slot=toast][data-limited]')).toHaveText('Toast 1');
});

test('the viewport is a labelled region at the bottom right', async ({ page }) => {
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  const viewport = page.getByRole('region', { name: 'Notifications' });
  await expect(viewport).toHaveClass(/\btoaster group\b/);
  const box = (await viewport.boundingBox())!;
  expect(Math.round(box.x + box.width)).toBe(1264);
  expect(Math.round(box.width)).toBe(384);
});
