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
  await expect(viewport).toHaveAttribute('data-position', 'bottom-right');
  await expect(viewport).toHaveCSS('top', '884px');
  expect(Math.round(box.x + box.width)).toBe(1264);
  expect(Math.round(box.width)).toBe(384);
});

const viewport = (page: Page) => page.getByRole('region', { name: 'Notifications' });
const closeButtons = (page: Page) => page.locator('[data-slot=toast-close]');

async function rect(toast: ReturnType<typeof toasts>) {
  const box = (await toast.boundingBox())!;
  return { top: Math.round(box.y), bottom: Math.round(box.y + box.height) };
}

// Hover the toast, once it stops moving, so the viewport expands as it does for a pointer user.
async function expand(toast: ReturnType<typeof toasts>) {
  await toast.hover();
}

const positions = [
  ['top-left', '16px', 16],
  ['top-center', '16px', 448],
  ['top-right', '16px', 880],
  ['bottom-left', '884px', 16],
  ['bottom-center', '884px', 448],
  ['bottom-right', '884px', 880]
] as const;

for (const [position, top, x] of positions) {
  test(`position ${position} places the viewport at top ${top} and x ${x}`, async ({ page }) => {
    await page.getByLabel('Position').selectOption(position);
    await page.getByRole('button', { name: 'Basic', exact: true }).click();
    await expect(toasts(page)).toHaveCount(1);
    await expect(viewport(page)).toHaveAttribute('data-position', position);
    await expect(viewport(page)).toHaveCSS('top', top);
    await expect(viewport(page)).toHaveCSS('width', '384px');
    expect(Math.round((await viewport(page).boundingBox())!.x)).toBe(x);
  });
}

test('position stays centered with a 16px margin below the sm breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 900 });
  await page.getByLabel('Position').selectOption('top-left');
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  await expect(toasts(page)).toHaveCount(1);
  const box = (await viewport(page).boundingBox())!;
  expect([Math.round(box.x), Math.round(box.width)]).toEqual([108, 384]);
});

for (const [position, side] of [['top-right', 'top'], ['bottom-left', 'bottom']] as const) {
  test(`${position} stacks the older toast ${side === 'top' ? 'below' : 'above'} the newest, collapsed and expanded`, async ({ page }) => {
    await page.getByLabel('Position').selectOption(position);
    await page.getByRole('button', { name: 'Two', exact: true }).click();
    const newest = toasts(page).filter({ hasText: 'Second' });
    const older = toasts(page).filter({ hasText: 'First' });
    await expect(toasts(page)).toHaveCount(2);
    await expect(newest).toHaveCSS('transform-origin', side === 'top' ? /^192px 0px$/ : /^192px [1-9]\d*px$/);
    await expect(older).toHaveCSS('transform-origin', side === 'top' ? /^192px 0px$/ : /^192px [1-9]\d*px$/);

    // Collapsed, the older toast peeks out 12px past the newest, on the far side from the screen edge.
    await expect.poll(async () => {
      const [a, b] = [await newest.boundingBox(), await older.boundingBox()];
      return side === 'top' ? Math.round(b!.y + b!.height - (a!.y + a!.height)) : Math.round(a!.y - b!.y);
    }).toBe(12);
    const front = await rect(newest);
    expect(side === 'top' ? front.top : front.bottom).toBe(side === 'top' ? 16 : 884);

    // The hover bridge fills the 12px gap on the side the next toast expands to.
    const [bridgeTop, height] = await newest.evaluate(el => [getComputedStyle(el, '::after').top, el.offsetHeight]);
    expect(bridgeTop).toBe(side === 'top' ? '-13px' : `${height - 2}px`);

    // Expanded, a 12px gap separates the two.
    await expand(newest);
    await expect.poll(async () => {
      const [a, b] = [await rect(newest), await rect(older)];
      return side === 'top' ? b.top - a.bottom : a.top - b.bottom;
    }).toBe(12);
  });
}

for (const [position, direction, axis] of [['top-left', 'up', -1], ['bottom-right', 'down', 1]] as const) {
  test(`${position} dismisses a toast swiped ${direction}, not the opposite way`, async ({ page }) => {
    await page.getByLabel('Position').selectOption(position);
    await page.getByRole('button', { name: 'Basic', exact: true }).click();
    const toast = toasts(page);
    await expect(toast).toHaveCount(1);
    await toast.hover();
    const box = (await toast.boundingBox())!;
    const [x, y] = [box.x + box.width / 2, box.y + box.height / 2];
    await page.mouse.down();
    await page.mouse.move(x, y - axis * 30, { steps: 5 });
    await page.mouse.move(x, y - axis * 90, { steps: 5 });
    await page.mouse.up();
    await expect(toast).toHaveCount(1);
    await expect(toast).not.toHaveAttribute('data-ending-style');

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y + axis * 30, { steps: 5 });
    await page.mouse.move(x, y + axis * 90, { steps: 5 });
    await page.mouse.up();
    await closed(toast);
  });
}

// Transitions run on the real clock, so read where the transform transition of each toast starts and ends.
async function recordTransforms(page: Page) {
  await page.evaluate(() => {
    const runs: { from: number; to: number }[] = [];
    (window as unknown as { __runs: typeof runs }).__runs = runs;
    document.addEventListener('transitionrun', event => {
      const target = event.target as Element;
      if (event.propertyName !== 'transform' || !target.matches('[data-slot=toast]')) return;
      const transition = target.getAnimations().find(animation => (animation as CSSTransition).transitionProperty === 'transform');
      const ty = () => Math.round(new DOMMatrix(getComputedStyle(target).transform).m42);
      const from = ty();
      transition!.finish();
      runs.push({ from, to: ty() });
    }, true);
  });
  return () => page.evaluate(() => (window as unknown as { __runs: { from: number; to: number }[] }).__runs);
}

for (const [position, sign] of [['top-right', -1], ['bottom-right', 1]] as const) {
  test(`${position} slides toasts in from and out to the ${sign < 0 ? 'top' : 'bottom'} edge`, async ({ page }) => {
    await page.getByLabel('Position').selectOption(position);
    const read = await recordTransforms(page);
    await page.getByRole('button', { name: 'Basic', exact: true }).click();
    const toast = toasts(page);
    await expect(toast).toHaveCount(1);
    await expect.poll(async () => (await read()).length).toBeGreaterThanOrEqual(1);
    const [enter] = await read();
    expect(Math.sign(enter.from)).toBe(sign);
    expect(Math.abs(enter.from)).toBeGreaterThan(60);
    expect(enter.to).toBe(0);

    await page.getByRole('button', { name: 'Dismiss all' }).click();
    await expect.poll(async () => (await read()).length).toBeGreaterThanOrEqual(2);
    const exit = (await read()).at(-1)!;
    expect(Math.sign(exit.to)).toBe(sign);
    expect(Math.abs(exit.to)).toBeGreaterThan(60);
  });
}

const rich = [
  ['Success', 'success', 'oklch(0.982 0.018 155.826)', 'oklch(0.527 0.154 150.069)', 'oklch(0.925 0.084 155.995)'],
  ['Info', 'info', 'oklch(0.97 0.014 254.604)', 'oklch(0.488 0.243 264.376)', 'oklch(0.882 0.059 254.128)'],
  ['Warning', 'warning', 'oklch(0.987 0.022 95.277)', 'oklch(0.555 0.163 48.998)', 'oklch(0.924 0.12 95.746)'],
  ['Error', 'error', 'oklab(0.9577 0.0217662 0.0112464)', 'oklch(0.577 0.245 27.325)', 'oklab(0.577 0.217662 0.112464 / 0.3)']
] as const;

for (const [button, type, background, color, border] of rich) {
  test(`richColors tints toast.${type}() with its background, text and border`, async ({ page }) => {
    await page.getByLabel('richColors').check();
    await page.getByRole('button', { name: button, exact: true }).click();
    const toast = toasts(page);
    await expect(toast).toHaveAttribute('data-rich-colors', '');
    await expect(toast).toHaveCSS('background-color', background);
    await expect(toast).toHaveCSS('color', color);
    await expect(toast).toHaveCSS('border-top-color', border);
  });
}

test('richColors dark tokens apply under the dark class', async ({ page }) => {
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.getByLabel('richColors').check();
  await page.getByRole('button', { name: 'Success', exact: true }).click();
  await expect(toasts(page)).toHaveCSS('background-color', 'oklch(0.266 0.065 152.934)');
  await expect(toasts(page)).toHaveCSS('color', 'oklch(0.792 0.209 151.711)');
});

test('richColors leaves untyped and loading toasts on the popover colors', async ({ page }) => {
  await page.getByLabel('richColors').check();
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  await page.getByRole('button', { name: 'Loading', exact: true }).click();
  await expect(toasts(page)).toHaveCount(2);
  for (const toast of await toasts(page).all()) {
    await expect(toast).not.toHaveAttribute('data-rich-colors');
    await expect(toast).toHaveCSS('background-color', 'oklch(1 0 0)');
  }
});

test('without richColors a success toast keeps the popover colors', async ({ page }) => {
  await page.getByRole('button', { name: 'Success', exact: true }).click();
  await expect(toasts(page)).not.toHaveAttribute('data-rich-colors');
  await expect(toasts(page)).toHaveCSS('background-color', 'oklch(1 0 0)');
});

test('a toast richColors option overrides the Toaster in both directions', async ({ page }) => {
  await page.getByRole('button', { name: 'Rich on', exact: true }).click();
  await expect(toasts(page)).toHaveCSS('background-color', 'oklch(0.982 0.018 155.826)');
  await page.getByRole('button', { name: 'Dismiss all' }).click();
  await removed(page, toasts(page));

  await page.getByLabel('richColors').check();
  await page.getByRole('button', { name: 'Rich off', exact: true }).click();
  await expect(toasts(page)).toHaveCSS('background-color', 'oklch(1 0 0)');
});

test('no close button shows unless closeButton is set', async ({ page }) => {
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  await expect(toasts(page)).toHaveCount(1);
  await expect(closeButtons(page)).toHaveCount(0);
});

test('closeButton adds a labelled button that dismisses its toast', async ({ page }) => {
  await page.getByLabel('closeButton', { exact: true }).check();
  await page.getByRole('button', { name: 'Two', exact: true }).click();
  await expect(closeButtons(page)).toHaveCount(2);
  await expect(closeButtons(page).first()).toHaveAttribute('aria-label', 'Close toast');

  const second = toasts(page).filter({ hasText: 'Second' });
  await second.locator('[data-slot=toast-close]').click();
  await closed(second);
  await removed(page, second);
  await expect(toasts(page).filter({ hasText: 'First' })).toHaveCount(1);
});

test('closeButton skips loading toasts, which stay until they settle', async ({ page }) => {
  await page.getByLabel('closeButton', { exact: true }).check();
  await page.getByRole('button', { name: 'Loading', exact: true }).click();
  await page.getByRole('button', { name: 'Success', exact: true }).click();
  await expect(toasts(page)).toHaveCount(2);
  await expect(toasts(page).filter({ hasText: 'Loading data' }).locator('[data-slot=toast-close]')).toHaveCount(0);
  await expect(toasts(page).filter({ hasText: 'Event has been created' }).locator('[data-slot=toast-close]')).toHaveCount(1);
});

test('closeButtonAriaLabel names the close button', async ({ page }) => {
  await page.getByLabel('closeButton', { exact: true }).check();
  await page.getByLabel('closeButtonAriaLabel').check();
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  await expect(closeButtons(page)).toHaveAttribute('aria-label', 'Dismiss notification');
});

test('the close button is hidden until the toast is hovered, then fully opaque', async ({ page }) => {
  await page.getByLabel('closeButton', { exact: true }).check();
  await page.getByRole('button', { name: 'Basic', exact: true }).click();
  await expect(closeButtons(page)).toHaveCSS('opacity', '0');
  await expand(toasts(page));
  await expect(closeButtons(page)).toHaveCSS('opacity', '1');
  await expect(closeButtons(page)).toHaveCSS('width', '20px');
});

test('a toast closeButton option overrides the Toaster in both directions', async ({ page }) => {
  await page.getByRole('button', { name: 'Closable', exact: true }).click();
  await expect(closeButtons(page)).toHaveCount(1);
  await page.getByRole('button', { name: 'Dismiss all' }).click();
  await removed(page, toasts(page));

  await page.getByLabel('closeButton', { exact: true }).check();
  await page.getByRole('button', { name: 'Unclosable', exact: true }).click();
  await expect(toasts(page)).toHaveCount(1);
  await expect(closeButtons(page)).toHaveCount(0);
});

test('className and classNames merge into the toast and its parts', async ({ page }) => {
  await page.getByRole('button', { name: 'Styled', exact: true }).click();
  const toast = toasts(page);
  await expect(toast).toHaveCSS('border-top-style', 'dashed');
  await expect(toast).toHaveCSS('background-color', 'oklch(0.973 0.071 103.193)');
  await expect(toast).toHaveClass(/\bcn-toast\b/);
  await expect(toast.locator('[data-slot=toast-title]')).toHaveCSS('text-transform', 'uppercase');
  await expect(toast.locator('[data-slot=toast-description]')).toHaveCSS('font-style', 'normal');
});

test('Toaster classNames style every toast, alongside the toast classNames', async ({ page }) => {
  await page.getByLabel('classNames', { exact: true }).check();
  await page.getByLabel('closeButton', { exact: true }).check();
  await page.getByRole('button', { name: 'Styled', exact: true }).click();
  const toast = toasts(page);
  await expect(toast.locator('[data-slot=toast-description]')).toHaveCSS('font-style', 'italic');
  await expect(toast.locator('[data-slot=toast-title]')).toHaveCSS('text-transform', 'uppercase');
  await expect(closeButtons(page)).toHaveCSS('background-color', 'oklch(0.945 0.129 101.54)');
});

test('toast.custom() renders the snippet with no default chrome and the toast id', async ({ page }) => {
  await page.getByLabel('closeButton', { exact: true }).check();
  await page.getByRole('button', { name: 'Custom', exact: true }).click();
  const toast = toasts(page);
  const body = page.getByTestId('custom-body');
  await expect(body).toContainText('Custom body ready');
  await expect(body).toHaveCSS('background-color', 'oklch(0.591 0.293 322.896)');
  await expect(toast).not.toHaveClass(/\bcn-toast\b/);
  await expect(toast).toHaveCSS('border-top-width', '0px');
  await expect(toast).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(toast.locator('[data-slot=toast-title], [data-slot=toast-icon], [data-slot=toast-action]')).toHaveCount(0);
  await expect(closeButtons(page)).toHaveCount(0);

  await page.clock.runFor(3900);
  await expect(toast).not.toHaveAttribute('data-ending-style');
  await page.clock.runFor(200);
  await closed(toast);
});

test('a snippet in toast.custom() can dismiss its own toast by id', async ({ page }) => {
  await page.getByRole('button', { name: 'Custom', exact: true }).click();
  await page.getByTestId('custom-dismiss').click();
  await closed(toasts(page));
  await removed(page, toasts(page));
});

test('toast.custom() takes className and duration', async ({ page }) => {
  await page.getByRole('button', { name: 'Short custom' }).click();
  await expect(toasts(page)).toHaveCSS('opacity', '0.9');
  await page.clock.runFor(1100);
  await closed(toasts(page));
  await removed(page, toasts(page));
});
