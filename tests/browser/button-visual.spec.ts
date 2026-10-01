import { expect, test, type Page } from '@playwright/test';
// Supplemental computed-style assertions against byte-exact shadcn Button/Nova pins.
async function measurements(page: Page) {
  return page.locator('[data-gallery] [data-testid]').evaluateAll(nodes => Object.fromEntries(nodes.map(node => {
    const read = (element: Element) => { const s = getComputedStyle(element); const r = element.getBoundingClientRect(); return { width: r.width, height: r.height, padding: s.padding, gap: s.gap, radius: s.borderRadius, fontSize: s.fontSize, fontWeight: s.fontWeight, background: s.backgroundColor, color: s.color, border: s.borderColor, opacity: s.opacity, pointerEvents: s.pointerEvents, shadow: s.boxShadow, decoration: s.textDecorationLine, transform: s.transform }; };
    return [node.getAttribute('data-testid'), { host: read(node), svg: node.querySelector('svg') ? read(node.querySelector('svg')!) : null }];
  })));
}
for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) test(`Nova Button matrix and interactive styles match pinned React at ${viewport.width}px`, async ({ page, context }, testInfo) => {
  await page.setViewportSize(viewport); await page.goto('/button'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  const reference = await context.newPage(); await reference.setViewportSize(viewport); await reference.goto('/button-reference'); await expect(reference.locator('[data-gallery]')).toHaveAttribute('data-hydrated', 'true');
  // Avoid incidental hover differences from initial pointer location.
  await page.mouse.move(0, 0); await reference.mouse.move(0, 0);
  expect(await measurements(page)).toEqual(await measurements(reference));
  for (const state of ['hover', 'focus', 'active'] as const) {
    const target = page.getByTestId('outline-default'); const expected = reference.getByTestId('outline-default');
    if (state === 'focus') { await target.focus(); await expected.focus(); await page.keyboard.press('Shift+Tab'); await reference.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await reference.keyboard.press('Tab'); }
    else { await target.hover(); await expected.hover(); if (state === 'active') { await page.mouse.down(); await reference.mouse.down(); } }
    await page.waitForTimeout(220); await reference.waitForTimeout(220);
    expect((await measurements(page))['outline-default']).toEqual((await measurements(reference))['outline-default']);
    if (state === 'focus') expect(await target.evaluate(node => getComputedStyle(node).boxShadow)).not.toBe('none');
    if (state === 'active') { await page.mouse.up(); await reference.mouse.up(); }
  }
  await testInfo.attach(`svelte-button-${viewport.width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await testInfo.attach(`pinned-react-button-${viewport.width}`, { body: await reference.screenshot({ fullPage: true }), contentType: 'image/png' });
  await reference.close();
});
