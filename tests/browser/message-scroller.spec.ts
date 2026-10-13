import { expect, test, type Page } from '@playwright/test';

type Row = { id: string; height?: number; scrollAnchor?: boolean };
type Query = { autoScroll?: true; open?: 'start' | 'end' | 'last-anchor'; peek?: number; count?: number; items?: Row[]; jump?: string; visibility?: true };

const rows = (count: number, anchorEvery = 0): Row[] => Array.from({ length: count }, (_, index) => ({ id: `m${index}`, scrollAnchor: anchorEvery > 0 && index % anchorEvery === 0 }));

function url(query: Query) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) search.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  return `/message-scroller?${search}`;
}

// Real frames, so the scroller's rAF work, the observers and native scroll anchoring all settle.
const settle = (page: Page, frames = 4) =>
  page.evaluate((count) => new Promise<void>((resolve) => {
    let remaining = count;
    const tick = () => (remaining-- <= 0 ? resolve() : requestAnimationFrame(tick));
    requestAnimationFrame(tick);
  }), frames);

async function open(page: Page, query: Query = {}) {
  await page.goto(url(query));
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  await settle(page);
}

async function render(page: Page, items: Row[]) {
  await page.evaluate((next) => (window as unknown as { thread: { set(next: Row[]): void } }).thread.set(next), items);
  await settle(page);
}

const viewport = (page: Page) => page.getByRole('region', { name: 'viewport' });
const scrollTop = (page: Page) => viewport(page).evaluate((element) => Math.round(element.scrollTop));
const distanceToBottom = (page: Page) => viewport(page).evaluate((element) => Math.round(element.scrollHeight - element.scrollTop - element.clientHeight));
const offsetOf = (page: Page, id: string) =>
  viewport(page).evaluate((element, messageId) => {
    const item = element.querySelector(`[data-message-id="${messageId}"]`)!;
    return Math.round(item.getBoundingClientRect().top - element.getBoundingClientRect().top);
  }, id);

async function scrollViewport(page: Page, top: number) {
  await viewport(page).evaluate((element, value) => { element.scrollTop = value; }, top);
  await settle(page);
}

const visibility = (page: Page) => page.getByTestId('visibility');

test('renders data-pending-scroll on the server and drops it after hydration without errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type()) && !message.text().startsWith('Failed to load resource')) errors.push(message.text());
  });
  const html = await (await page.request.get(url({}))).text();
  expect(html.match(/data-pending-scroll=""/g)?.length).toBe(2);
  expect(await (await page.request.get(url({ open: 'start' }))).text()).not.toMatch(/data-pending-scroll=""/);
  await open(page);
  await expect(page.getByTestId('scroller')).not.toHaveAttribute('data-pending-scroll');
  await expect(viewport(page)).not.toHaveAttribute('data-pending-scroll');
  expect(await distanceToBottom(page)).toBeLessThanOrEqual(1);
  await expect(viewport(page)).toHaveAttribute('data-scrollable', 'start');
  expect(errors).toEqual([]);
});

test('keeps the visible message in place when older messages are prepended', async ({ page }) => {
  await open(page);
  await scrollViewport(page, 240);
  const before = await offsetOf(page, 'm3');
  expect(before).toBe(0);
  await render(page, [{ id: 'o0' }, { id: 'o1' }, { id: 'o2' }, ...rows(8)]);
  expect(Math.abs((await offsetOf(page, 'm3')) - before)).toBeLessThanOrEqual(1);
  expect(await scrollTop(page)).toBe(480);
});

test('keeps following the end while the last message streams with autoScroll', async ({ page }) => {
  await open(page, { autoScroll: true, count: 6 });
  expect(await distanceToBottom(page)).toBeLessThanOrEqual(1);
  for (const height of [120, 200, 280, 360, 440]) {
    await render(page, [...rows(5), { id: 'm5', height }]);
    expect(await distanceToBottom(page), `pinned at ${height}px`).toBeLessThanOrEqual(1);
  }
  await expect(page.getByRole('button', { name: 'Scroll to end' })).toHaveAttribute('data-active', 'false');
});

test('keeps the end pinned when several anchored turns arrive at once with autoScroll', async ({ page }) => {
  await open(page, { autoScroll: true, count: 6 });
  await render(page, [...rows(6), { id: 'user-1', scrollAnchor: true }, { id: 'reply-1' }, { id: 'user-2', scrollAnchor: true }, { id: 'reply-2' }]);
  expect(await distanceToBottom(page)).toBeLessThanOrEqual(1);
});

test('does not follow appends after the default bottom open without autoScroll', async ({ page }) => {
  await open(page, { count: 6 });
  const top = await scrollTop(page);
  expect(top).toBe(280);
  await render(page, [...rows(6), { id: 'new' }]);
  expect(await scrollTop(page)).toBe(280);
  expect(await distanceToBottom(page)).toBe(80);
});

test('releases follow when the reader scrolls up with the wheel', async ({ page }) => {
  await open(page, { autoScroll: true });
  expect(await distanceToBottom(page)).toBeLessThanOrEqual(1);
  await viewport(page).hover();
  await page.mouse.wheel(0, -1000);
  await expect.poll(() => scrollTop(page)).toBe(0);
  await settle(page);
  await render(page, [...rows(8), { id: 'new' }]);
  expect(await scrollTop(page)).toBe(0);
  expect(await distanceToBottom(page)).toBe(520);
  await expect(page.getByRole('button', { name: 'Scroll to end' })).toHaveAttribute('data-active', 'true');
});

test('anchors a new turn below the previous row peek', async ({ page }) => {
  await open(page);
  await render(page, [...rows(8), { id: 'turn', scrollAnchor: true }]);
  expect(await offsetOf(page, 'turn')).toBe(64);
});

test('holds an anchored turn at the reading line when the content below it collapses', async ({ page }) => {
  const base = [{ id: 'm0', height: 300 }, { id: 'm1', height: 300 }, { id: 'm2', height: 300 }];
  await open(page, { peek: 32, items: base });
  await render(page, [...base, { id: 'turn', scrollAnchor: true }, { id: 'marker', height: 100 }]);
  expect(await offsetOf(page, 'turn')).toBe(32);
  await render(page, [...base, { id: 'turn', scrollAnchor: true }, { id: 'reply', height: 0 }]);
  await settle(page);
  expect(await offsetOf(page, 'turn')).toBe(32);
});

test('the scroll button moves the viewport to the end and then goes inert', async ({ page }) => {
  await open(page, { open: 'start' });
  const button = page.getByRole('button', { name: 'Scroll to end' });
  expect(await scrollTop(page)).toBe(0);
  await expect(button).toHaveAttribute('data-active', 'true');
  await button.click();
  await settle(page);
  expect(await distanceToBottom(page)).toBeLessThanOrEqual(1);
  await expect(button).toHaveAttribute('data-active', 'false');
  await expect(button).toHaveAttribute('inert', '');
  await expect(button).toHaveAttribute('tabindex', '-1');
});

test('opens "last-anchor" at the last turn when it overflows', async ({ page }) => {
  await open(page, { open: 'last-anchor', peek: 0, items: [{ id: 'm0' }, { id: 'm1' }, { id: 'last-user', scrollAnchor: true }, { id: 'last-assistant', height: 360 }] });
  expect(await offsetOf(page, 'last-user')).toBe(0);
  expect(await distanceToBottom(page)).toBe(240);
});

test('opens "last-anchor" at the end when the last turn fits', async ({ page }) => {
  await open(page, { open: 'last-anchor', peek: 0, items: [...rows(5), { id: 'last-user', scrollAnchor: true }, { id: 'last-assistant' }] });
  expect(await distanceToBottom(page)).toBeLessThanOrEqual(1);
});

test('scrolls to a mounted message by id and keeps it in place across a prepend', async ({ page }) => {
  await open(page, { open: 'start', count: 12, jump: 'm5' });
  await page.getByRole('button', { name: 'Jump to message' }).click();
  await settle(page);
  expect(await offsetOf(page, 'm5')).toBe(0);
  await render(page, [{ id: 'o0' }, { id: 'o1' }, { id: 'o2' }, ...rows(12)]);
  expect(Math.abs(await offsetOf(page, 'm5'))).toBeLessThanOrEqual(1);
});

test('tracks the current anchor after it scrolls above the viewport', async ({ page }) => {
  await open(page, { open: 'start', items: rows(30, 10), visibility: true });
  await expect(visibility(page)).toHaveAttribute('data-current-anchor', 'm0');
  await expect(visibility(page)).toHaveAttribute('data-visible', 'm0,m1,m2');
  await scrollViewport(page, 900);
  await expect(visibility(page)).toHaveAttribute('data-current-anchor', 'm10');
  await expect(visibility(page)).toHaveAttribute('data-visible', 'm12,m13');
  await scrollViewport(page, 1700);
  await expect(visibility(page)).toHaveAttribute('data-current-anchor', 'm20');
});

test('keeps the anchor at the reading line current over lower visible anchors', async ({ page }) => {
  await open(page, { open: 'start', items: rows(12, 1), visibility: true });
  await scrollViewport(page, 400);
  await expect(visibility(page)).toHaveAttribute('data-current-anchor', 'm5');
  await expect(visibility(page)).toHaveAttribute('data-visible', 'm5,m6,m7');
});
