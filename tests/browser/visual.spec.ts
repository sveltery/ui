import { expect, test, type Page } from '@playwright/test';
async function measurements(page: Page) {
  return page.locator('[data-slot=dialog-content]').evaluate(node => {
    const styles = (element: Element) => { const style = getComputedStyle(element); const rect = element.getBoundingClientRect(); return { width: rect.width, height: rect.height, x: rect.x, y: rect.y, padding: style.padding, gap: style.gap, radius: style.borderRadius, fontSize: style.fontSize, fontWeight: style.fontWeight, background: style.backgroundColor, color: style.color, display: style.display, position: style.position }; };
    return { popup: styles(node), header: styles(node.querySelector('[data-slot=dialog-header]')!), title: styles(node.querySelector('[data-slot=dialog-title]')!), description: styles(node.querySelector('[data-slot=dialog-description]')!), footer: styles(node.querySelector('[data-slot=dialog-footer]')!), close: styles(node.querySelector('button.cn-dialog-close')!), overlay: styles(document.querySelector('[data-slot=dialog-overlay]')!) };
  });
}
test('fixed-environment Nova geometry and computed styles match the pinned official wrapper', async ({ page, context }, testInfo) => {
  await page.goto('/dialog'); await expect(page.locator('[data-hydrated=true]')).toBeVisible(); await page.getByTestId('trigger').click(); await expect(page.getByRole('dialog')).toBeVisible(); await page.waitForTimeout(180);
  const reference = await context.newPage(); await reference.goto('/reference'); await expect(reference.locator('[data-hydrated=true]')).toBeVisible(); await reference.getByTestId('trigger').click(); await expect(reference.getByRole('dialog')).toBeVisible(); await reference.waitForTimeout(180);
  expect(await measurements(page)).toEqual(await measurements(reference));
  await page.getByRole('textbox', { name: 'Name' }).blur(); await reference.getByRole('textbox', { name: 'Name' }).blur();
  await testInfo.attach('svelte-nova', { body: await page.screenshot(), contentType: 'image/png' });
  await testInfo.attach('official-react-nova', { body: await reference.screenshot(), contentType: 'image/png' });
  await reference.close();
});
