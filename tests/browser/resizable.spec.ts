import { expect, test, type Page } from '@playwright/test';

type Axis = 'width' | 'height';

const measure = (page: Page, id: string, axis: Axis = 'width') =>
  page.locator(`#${id}`).evaluate((element, side) => element.getBoundingClientRect()[side as Axis], axis);

async function expectSize(page: Page, id: string, expected: number, axis: Axis = 'width') {
  await expect.poll(async () => Math.abs((await measure(page, id, axis)) - expected), { message: `${id} ${axis} near ${expected}` }).toBeLessThanOrEqual(1);
}

// `along` is where to grab the handle, as a fraction of its length. A nested handle crosses the outer one at the middle.
async function drag(page: Page, id: string, dx: number, dy = 0, along = 0.5) {
  const handle = page.locator(`#${id}`);
  await handle.scrollIntoViewIfNeeded();
  const box = (await handle.boundingBox())!;
  const vertical = box.height > box.width;
  const x = box.x + box.width * (vertical ? 0.5 : along);
  const y = box.y + box.height * (vertical ? along : 0.5);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 8 });
  await page.mouse.up();
}

async function open(page: Page) {
  await page.goto('/resizable');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  await expect(page.locator('#horizontal-handle')).toHaveAttribute('aria-valuemax', /\d+/);
}

test('dragging a horizontal separator moves both panels by the dragged distance', async ({ page }) => {
  await open(page);
  const [a, b] = [await measure(page, 'a'), await measure(page, 'b')];
  expect(a + b).toBeCloseTo(799, 0);
  await drag(page, 'horizontal-handle', 100);
  await expectSize(page, 'a', a + 100);
  await expectSize(page, 'b', b - 100);
  await expect(page.locator('#horizontal-handle')).toHaveAttribute('aria-valuenow', '63');
  await expect(page.getByTestId('bound')).toHaveText('63');
  await drag(page, 'horizontal-handle', -250);
  await expectSize(page, 'a', a - 150);
  await expectSize(page, 'b', b + 150);
});

test('a drag settles once, as a user change', async ({ page }) => {
  await open(page);
  await expect(page.getByTestId('changes')).toHaveText('50 false');
  await drag(page, 'horizontal-handle', 100);
  await expect(page.getByTestId('changes')).toHaveText('50 false,63 true');
});

test('dragging a vertical separator moves the panels by the dragged distance', async ({ page }) => {
  await open(page);
  const [top, bottom] = [await measure(page, 'top', 'height'), await measure(page, 'bottom', 'height')];
  expect(top + bottom).toBeCloseTo(399, 0);
  await drag(page, 'vertical-handle', 0, 60);
  await expectSize(page, 'top', top + 60, 'height');
  await expectSize(page, 'bottom', bottom - 60, 'height');
  await expect(page.locator('#vertical-handle')).toHaveAttribute('aria-orientation', 'horizontal');
  await expect(page.locator('#vertical-handle')).toHaveAttribute('aria-valuenow', '65');
});

test('a drag past a minimum size stops at the minimum', async ({ page }) => {
  await open(page);
  await drag(page, 'horizontal-handle', -700);
  await expectSize(page, 'a', 799 * 0.2);
  await expectSize(page, 'b', 799 * 0.8);
  await drag(page, 'horizontal-handle', 1200);
  await expectSize(page, 'b', 100);
  await expectSize(page, 'a', 699);
});

test('dragging a collapsible panel below half its minimum collapses it', async ({ page }) => {
  await open(page);
  const side = 799 * 0.3;
  const min = 799 * 0.2;
  await expectSize(page, 'side', side);
  await drag(page, 'collapsible-handle', -(side - min) - 20);
  await expectSize(page, 'side', min);
  await expect(page.locator('#side')).not.toHaveAttribute('data-collapsed', '');
  await drag(page, 'collapsible-handle', -(min / 2) - 20);
  await expectSize(page, 'side', 0);
  await expectSize(page, 'main', 799);
  await expect(page.locator('#side')).toHaveAttribute('data-collapsed', '');
  await drag(page, 'collapsible-handle', 40);
  await expectSize(page, 'side', 0);
  await drag(page, 'collapsible-handle', 100);
  await expectSize(page, 'side', min);
  await expect(page.locator('#side')).not.toHaveAttribute('data-collapsed', '');
});

test('the arrow keys, Home and End move a separator by percent', async ({ page }) => {
  await open(page);
  const handle = page.locator('#horizontal-handle');
  await handle.focus();
  await expect(handle).toHaveAttribute('aria-valuemin', '20');
  await expect(handle).toHaveAttribute('aria-valuemax', '87');
  await page.keyboard.press('ArrowRight');
  await expect(handle).toHaveAttribute('aria-valuenow', '55');
  await expectSize(page, 'a', 799 * 0.55);
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(handle).toHaveAttribute('aria-valuenow', '45');
  await expectSize(page, 'a', 799 * 0.45);
  await page.keyboard.press('Home');
  await expect(handle).toHaveAttribute('aria-valuenow', '20');
  await expectSize(page, 'a', 799 * 0.2);
  await page.keyboard.press('End');
  await expect(handle).toHaveAttribute('aria-valuenow', '87');
  await expectSize(page, 'b', 100);
  const vertical = page.locator('#vertical-handle');
  await vertical.focus();
  await page.keyboard.press('ArrowDown');
  await expect(vertical).toHaveAttribute('aria-valuenow', '55');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(vertical).toHaveAttribute('aria-valuenow', '45');
});

test('Enter collapses a collapsible panel and restores its size', async ({ page }) => {
  await open(page);
  const handle = page.locator('#collapsible-handle');
  await handle.focus();
  await page.keyboard.press('Enter');
  await expectSize(page, 'side', 0);
  await expect(page.locator('#side')).toHaveAttribute('data-collapsed', '');
  await page.keyboard.press('Enter');
  await expectSize(page, 'side', 799 * 0.3);
  await expect(page.locator('#side')).not.toHaveAttribute('data-collapsed', '');
});

test('nested groups resize independently', async ({ page }) => {
  await open(page);
  const [left, top] = [await measure(page, 'outer-left'), await measure(page, 'inner-top', 'height')];
  await drag(page, 'outer-handle', 100, 0, 0.2);
  await expectSize(page, 'outer-left', left + 100);
  await expectSize(page, 'inner-top', top, 'height');
  await drag(page, 'inner-handle', 0, 30);
  await expectSize(page, 'inner-top', top + 30, 'height');
  await expectSize(page, 'outer-left', left + 100);
});

test('in a right-to-left group a drag toward the end grows the second panel', async ({ page }) => {
  await open(page);
  const [first, second] = [await measure(page, 'first'), await measure(page, 'second')];
  const firstBox = (await page.locator('#first').boundingBox())!;
  const secondBox = (await page.locator('#second').boundingBox())!;
  expect(firstBox.x).toBeGreaterThan(secondBox.x);
  await drag(page, 'rtl-handle', 100);
  await expectSize(page, 'first', first - 100);
  await expectSize(page, 'second', second + 100);
  await drag(page, 'rtl-handle', -150);
  await expectSize(page, 'first', first + 50);
  const handle = page.locator('#rtl-handle');
  await handle.focus();
  await expect(handle).toHaveAttribute('aria-valuenow', '56');
  await page.keyboard.press('ArrowRight');
  await expect(handle).toHaveAttribute('aria-valuenow', '51');
});

test('a saved layout survives a reload', async ({ page }) => {
  await open(page);
  await expectSize(page, 'left', 399.5);
  await drag(page, 'persisted-handle', 100);
  await expectSize(page, 'left', 499.5);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sveltery-resizable:resizable-fixture'))).toMatch(/"left":62\.5\d*/);
  await page.reload();
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  await expectSize(page, 'left', 499.5);
  await expectSize(page, 'right', 299.5);
  await expect(page.locator('#persisted-handle')).toHaveAttribute('aria-valuenow', '63');
});
