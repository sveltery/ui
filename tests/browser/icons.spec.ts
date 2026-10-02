// Source-derived secured browser coverage; original shadcn icon runtime tests are absent at the pin.
import { expect, test } from '@playwright/test';
const libraries = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
test('genuine selected icon SVG, props and null behavior match React for every library', async ({ page, context }) => {
  const reference = await context.newPage(); await Promise.all([page.goto('/icons'), reference.goto('/icons-reference')]);
  await expect(page.locator('[data-icons-hydrated]')).toHaveAttribute('data-icons-hydrated', 'true');
  await expect(reference.locator('[data-icons-hydrated]')).toHaveAttribute('data-icons-hydrated', 'true');
  const snapshot = async (target: typeof page) => target.locator('[data-testid=selected-icon]:visible').evaluate(svg => {
    const tree = (node: Element): unknown => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), nodes: [...node.children].map(tree) });
    return { tree: tree(svg), width: svg.getBoundingClientRect().width, height: svg.getBoundingClientRect().height, stroke: getComputedStyle(svg).stroke, fill: getComputedStyle(svg).fill };
  });
  for (const library of libraries) {
    await Promise.all([page.getByRole('button', { name: library, exact: true }).click(), reference.getByRole('button', { name: library, exact: true }).click()]);
    await expect(page.locator('[data-testid=selected-icon]:visible')).not.toHaveClass(/lucide-square/); await expect(reference.locator('[data-testid=selected-icon]:visible')).not.toHaveClass(/lucide-square/);
    await expect(page.getByTestId('selected-icon')).toHaveCount(1); await expect(reference.getByTestId('selected-icon')).toHaveCount(1);
    await expect.poll(async () => snapshot(page)).toEqual(await snapshot(reference));
  }
  for (const target of [page, reference]) { await target.getByRole('button', { name: 'Unknown', exact: true }).click(); await expect(target.getByTestId('selected-icon')).toHaveCount(0); await target.getByRole('button', { name: 'Restore', exact: true }).click(); await expect(target.getByTestId('selected-icon')).toHaveCount(1); await target.getByRole('button', { name: 'Absent', exact: true }).click(); await expect(target.getByTestId('selected-icon')).toHaveCount(0); }
  await reference.close();
});
for (const path of ['/icons', '/icons-reference']) {
  test(`${path} exposes actual Square while selected module is delayed, cancels stale display and resolves real geometry`, async ({ page }) => {
    // Delay genuine library data/export modules, not mocked glyphs or renderer expectations.
    let release: (() => void) | undefined;
    const pending = new Promise<void>(resolve => { release = resolve; });
    const pattern = path === '/icons' ? '**/icons/generated/lucide.js*' : '**/reference/icons/__lucide__.ts*';
    await page.route(pattern, async route => { await pending; await route.continue(); });
    await page.goto(path); await expect(page.getByTestId('selected-icon')).toHaveClass(/lucide-square/);
    await expect(page.getByTestId('selected-icon')).toHaveAttribute('stroke-width', '7');
    await expect(page.getByTestId('selected-icon').locator('rect')).toHaveAttribute('width', '18');
    await page.getByRole('button', { name: 'Absent', exact: true }).click(); await expect(page.getByTestId('selected-icon')).toHaveCount(0);
    release!(); await page.getByRole('button', { name: 'Restore', exact: true }).click();
    await expect(page.getByTestId('selected-icon')).toHaveClass(/lucide-arrow-left/); await expect(page.getByTestId('selected-icon')).toHaveAttribute('stroke-width', '2');
    await page.getByRole('button', { name: 'Change name', exact: true }).click(); await expect(page.locator('[data-testid=selected-icon]:visible')).toHaveClass(/lucide-arrow-right/); await expect(page.getByTestId('selected-icon')).toHaveCount(1);
  });
}
