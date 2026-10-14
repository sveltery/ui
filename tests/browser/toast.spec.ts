import { expect, test } from '@playwright/test';

type Page = import('@playwright/test').Page;
type Locator = import('@playwright/test').Locator;

const mainViewport = (page: Page) => page.locator('[data-slot=toast-viewport]:not([data-testid])').first();
const defaultToasts = (page: Page) => page.locator('[data-slot=toast-viewport]:not([data-testid])').locator('[data-slot=toast]');

// The clock is paused, so a closing toast leaves the DOM only while the test advances time.
async function removed(page: Page, toast: Locator, remaining = 0) {
  await expect.poll(async () => { await page.clock.runFor(100); return toast.count(); }).toBe(remaining);
}

// The exit animation can finish before the next check, so a closed toast is either ending or already gone.
async function closed(toast: Locator) {
  await expect.poll(async () => (await toast.count()) === 0 || (await toast.getAttribute('data-ending-style')) === '').toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/toast');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  await page.clock.pauseAt(new Date('2026-01-01T00:01:00Z'));
});

test('add() shows the title and description with no icon, and closes after 5 seconds', async ({ page }) => {
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  const toast = defaultToasts(page);
  await expect(toast).toHaveCount(1);
  await expect(toast.locator('[data-slot=toast-title]')).toHaveText('Event created');
  await expect(toast.locator('[data-slot=toast-description]')).toHaveText('Sunday, December 3 at 9:00 AM');
  await expect(toast.locator('[data-slot=toast-icon]')).toHaveCount(0);
  await expect(toast.locator('[data-slot=toast-action]')).toHaveCount(0);
  await expect(toast).toHaveClass(/\bcn-toast\b/);
  await expect(toast).toHaveCSS('border-radius', '16px');

  await page.clock.runFor(4900);
  await expect(toast).not.toHaveAttribute('data-ending-style');
  await page.clock.runFor(200);
  await closed(toast);
  await removed(page, toast);
});

test('the parts render in the toast with their data-slot values', async ({ page }) => {
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  const viewport = mainViewport(page);
  await expect(page.locator('[data-slot=toast-portal]')).toHaveCount(3);
  await expect(viewport).toHaveAttribute('aria-label', 'Notifications');
  await expect(viewport.locator('[data-slot=toast] > [data-slot=toast-content] [data-slot=toast-title]')).toHaveText('Event created');
  const box = (await viewport.boundingBox())!;
  expect(Math.round(box.x + box.width)).toBe(1264);
  expect(Math.round(box.width)).toBe(384);
  expect(Math.round(box.y + box.height)).toBe(884);
});

test('the action button runs its handler, closes the toast and shows the next one', async ({ page }) => {
  await page.getByRole('button', { name: 'Action', exact: true }).click();
  const toast = defaultToasts(page);
  await expect(toast.locator('[data-slot=toast-title]')).toHaveText('Event created');
  await expect(toast.locator('[data-slot=toast-description]')).toHaveText('You can undo this action.');
  const action = toast.locator('[data-slot=toast-action]');
  await expect(action).toHaveText('Undo');
  await expect(action).toHaveClass(/\bcn-button\b/);
  await action.click();
  await expect(page.getByTestId('log')).toHaveText('undo');
  await removed(page, toast.filter({ hasText: 'You can undo this action.' }));
  await expect(toast).toHaveCount(1);
  await expect(toast.locator('[data-slot=toast-description]')).toHaveText('Event creation undone.');
  await expect(toast.locator('[data-slot=toast-title]')).toHaveCount(0);
  await expect(toast.locator('[data-slot=toast-action]')).toHaveCount(0);
});

test('promise() shows loading, then the success message', async ({ page }) => {
  await page.getByRole('button', { name: 'Promise', exact: true }).click();
  const toast = defaultToasts(page);
  await expect(toast).toHaveAttribute('data-type', 'loading');
  await expect(toast.locator('[data-slot=toast-description]')).toHaveText('Creating event…');
  await expect(toast.locator('[data-slot=toast-icon] svg')).toHaveClass(/\banimate-spin\b/);

  await page.getByRole('button', { name: 'Resolve' }).click();
  await expect(toast).toHaveAttribute('data-type', 'success');
  await expect(toast.locator('[data-slot=toast-description]')).toHaveText('Event created.');
  await expect(toast.locator('[data-slot=toast-title]')).toHaveCount(0);
  await page.clock.runFor(5100);
  await closed(toast);
  await removed(page, toast);
});

test('promise() shows the error message', async ({ page }) => {
  await page.getByRole('button', { name: 'Promise', exact: true }).click();
  await page.getByRole('button', { name: 'Reject' }).click();
  const toast = defaultToasts(page);
  await expect(toast).toHaveAttribute('data-type', 'error');
  await expect(toast.locator('[data-slot=toast-description]')).toHaveText('Could not create event.');
});

const types = [
  ['success', 'lucide-circle-check'],
  ['info', 'lucide-info'],
  ['warning', 'lucide-triangle-alert'],
  ['error', 'lucide-octagon-x'],
  ['loading', 'lucide-loader-2']
] as const;

for (const [type, iconClass] of types) {
  test(`type ${type} shows its icon`, async ({ page }) => {
    await page.getByRole('button', { name: `Type ${type}` }).click();
    const toast = defaultToasts(page);
    await expect(toast).toHaveAttribute('data-type', type);
    await expect(toast.locator('[data-slot=toast-title]')).toHaveText(`A ${type} toast`);
    const wrapper = toast.locator('[data-slot=toast-icon]');
    const icon = wrapper.locator('svg');
    await expect(icon).toHaveClass(new RegExp(`\\b${iconClass}\\b`));
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(icon).toHaveCSS('width', '16px');
    await expect(icon).toHaveClass(type === 'loading' ? /\banimate-spin\b/ : /^(?!.*animate-spin)/);
    await expect(icon).toHaveClass(type === 'error' ? /\btext-destructive\b/ : /^(?!.*text-destructive)/);
  });
}

test('the close button closes its toast', async ({ page }) => {
  await page.getByRole('button', { name: 'Pinned' }).click();
  await page.getByRole('button', { name: 'Start upload' }).click();
  await expect(defaultToasts(page)).toHaveCount(2);
  const toast = defaultToasts(page).filter({ hasText: 'Pinned' });
  await defaultToasts(page).filter({ hasText: 'Uploading' }).hover();
  const close = toast.locator('[data-slot=toast-close]');
  await expect(close).toHaveAttribute('aria-label', 'Close toast');
  await expect(close).toHaveAttribute('aria-hidden', 'false');
  await expect(close).toHaveClass(/\btext-muted-foreground\b/);
  await expect(close).toHaveCSS('width', '28px');
  await expect(close.locator('svg')).toHaveClass(/\blucide-x\b/);
  await close.click();
  await closed(toast);
  await removed(page, toast);
  await page.clock.runFor(1000);
  await expect(defaultToasts(page)).toHaveCount(1);
  await expect(defaultToasts(page)).not.toHaveAttribute('data-ending-style');
  await expect(defaultToasts(page).locator('[data-slot=toast-title]')).toHaveText('Uploading');
});

test('timeout sets when a toast closes, and 0 keeps it open', async ({ page }) => {
  await page.getByRole('button', { name: 'Quick' }).click();
  await page.getByRole('button', { name: 'Pinned' }).click();
  await expect(defaultToasts(page)).toHaveCount(2);
  await page.clock.runFor(1100);
  await removed(page, defaultToasts(page), 1);
  await expect(defaultToasts(page).locator('[data-slot=toast-title]')).toHaveText('Pinned');
  await page.clock.runFor(60_000);
  await expect(defaultToasts(page)).toHaveCount(1);
  await expect(defaultToasts(page)).not.toHaveAttribute('data-ending-style');
});

test('update() changes a toast in place and close(id) closes only that toast', async ({ page }) => {
  await page.getByRole('button', { name: 'Pinned' }).click();
  await page.getByRole('button', { name: 'Start upload' }).click();
  await expect(defaultToasts(page)).toHaveCount(2);
  await page.getByRole('button', { name: 'Finish upload' }).click();
  await expect(defaultToasts(page)).toHaveCount(2);
  const upload = defaultToasts(page).filter({ hasText: 'Uploaded' });
  await expect(upload).toHaveAttribute('data-type', 'success');

  await page.getByRole('button', { name: 'Close upload' }).click();
  await closed(upload);
  await removed(page, upload);
  await page.clock.runFor(1000);
  await expect(defaultToasts(page)).toHaveCount(1);
  await expect(defaultToasts(page).locator('[data-slot=toast-title]')).toHaveText('Pinned');
  await expect(defaultToasts(page)).not.toHaveAttribute('data-ending-style');
});

test('close() without an id closes every toast', async ({ page }) => {
  await page.getByRole('button', { name: 'Four' }).click();
  await expect(defaultToasts(page)).toHaveCount(4);
  await page.getByRole('button', { name: 'Close all' }).click();
  await removed(page, defaultToasts(page));
});

test('only three toasts show at once', async ({ page }) => {
  await page.getByRole('button', { name: 'Four' }).click();
  await expect(defaultToasts(page)).toHaveCount(4);
  await expect(page.locator('[data-slot=toast]:not([data-limited])')).toHaveCount(3);
  await expect(page.locator('[data-slot=toast][data-limited]')).toHaveText(/Toast 1/);
});

test('a separate manager and composed parts render in their own viewport', async ({ page }) => {
  await page.getByRole('button', { name: 'Custom' }).click();
  const viewport = page.getByTestId('custom-viewport');
  await expect(viewport).toHaveAttribute('aria-label', 'Custom notifications');
  await expect(viewport.locator('[data-slot=toast-title]')).toHaveText('Custom toast');
  await expect(viewport.locator('[data-slot=toast-description]')).toHaveText('Own manager');
  await expect(viewport.locator('[data-slot=toast-icon]')).toHaveCount(0);
  await expect(defaultToasts(page)).toHaveCount(0);
  const box = (await viewport.boundingBox())!;
  expect(Math.round(box.x)).toBe(16);
  expect(Math.round(box.y)).toBe(16);
  expect(Math.round(box.width)).toBe(320);

  await page.clock.runFor(60_000);
  await expect(viewport.locator('[data-slot=toast]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  await expect(defaultToasts(page)).toHaveCount(1);
  await expect(viewport.locator('[data-slot=toast]')).toHaveCount(1);
});

test('toasts stack behind the newest and spread out when the pointer is over them', async ({ page }) => {
  await page.getByRole('button', { name: 'Four' }).click();
  const toasts = defaultToasts(page);
  await expect(toasts).toHaveCount(4);
  const tops = () => toasts.evaluateAll(els => els.map(el => Math.round(el.getBoundingClientRect().top)));
  await expect.poll(tops).toEqual([822, 810, 798, 786]);
  await expect(toasts.first()).not.toHaveAttribute('data-expanded');
  await expect(toasts.nth(1)).toHaveCSS('opacity', '1');
  await expect(toasts.last()).toHaveAttribute('data-limited', '');
  await expect(toasts.last()).toHaveCSS('opacity', '0');

  await toasts.first().hover();
  await expect(toasts.first()).toHaveAttribute('data-expanded', '');
  await expect.poll(tops).toEqual([822, 748, 674, 600]);

  await page.mouse.move(10, 10);
  await expect.poll(tops).toEqual([822, 810, 798, 786]);
});

test('the toast lays out its content, title, description, action and close button', async ({ page }) => {
  await page.getByRole('button', { name: 'Action', exact: true }).click();
  const toast = defaultToasts(page);
  const style = (slot: string) => (slot === 'toast' ? toast : toast.locator(`[data-slot=${slot}]`)).evaluate(el => {
    const css = getComputedStyle(el);
    const box = el.getBoundingClientRect();
    return { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height), weight: css.fontWeight, size: css.fontSize, color: css.color, padding: css.padding, gap: css.gap };
  });
  await expect.poll(() => style('toast').then(s => [s.x, s.y, s.width, s.height])).toEqual([880, 806, 384, 78]);
  await expect(toast).toHaveCSS('background-color', 'oklch(1 0 0)');
  await expect(toast).toHaveCSS('border-top-width', '1px');
  expect(await style('toast-content')).toMatchObject({ width: 382, height: 76, padding: '16px', gap: '12px' });
  expect(await style('toast-title')).toMatchObject({ weight: '500', size: '14px', color: 'oklch(0.145 0 0)', height: 20 });
  expect(await style('toast-description')).toMatchObject({ weight: '400', size: '14px', color: 'oklch(0.556 0 0)', height: 20, y: 847 });
  expect(await style('toast-action')).toMatchObject({ x: 1154, width: 53, height: 28, size: '12.8px' });
  const action = toast.locator('[data-slot=toast-action]');
  await expect(action).toHaveCSS('border-top-width', '1px');
  await expect(action).toHaveCSS('background-color', 'oklch(1 0 0)');
  expect(await style('toast-close')).toMatchObject({ x: 1219, width: 28, height: 28, color: 'oklch(0.556 0 0)' });
});

test('the viewport spans the screen width with a 16px margin on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  await expect(defaultToasts(page)).toHaveCount(1);
  const box = (await mainViewport(page).boundingBox())!;
  expect([Math.round(box.x), Math.round(box.width), Math.round(box.y + box.height)]).toEqual([16, 343, 684]);
});

test('Toaster passes its props to the provider and renders its children', async ({ page }) => {
  await expect(page.getByTestId('toaster-child')).toHaveText('Toaster child');
  await page.getByRole('button', { name: 'Short' }).click();
  const toast = defaultToasts(page).filter({ hasText: 'Short toast' });
  await expect(toast).toHaveCount(1);
  await page.clock.runFor(1400);
  await expect(toast).not.toHaveAttribute('data-ending-style');
  await page.clock.runFor(200);
  await closed(toast);
  await removed(page, toast);
});
