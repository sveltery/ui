import { expect, test, type Page } from '@playwright/test';
export const expectedTableTags = { table: 'TABLE', header: 'THEAD', body: 'TBODY', footer: 'TFOOT', row: 'TR', head: 'TH', cell: 'TD', caption: 'CAPTION' };
export async function tableState(page: Page) { return JSON.parse(await page.getByTestId('probe-state').innerText()); }
export function tableLifecycleCases(route = '/table-probe') {
  test('native Table SSR nodes survive hydration and initially undefined refs attach and clean up', async ({ page, request }) => {
    const html = await (await request.get(route)).text();
    expect(html).toContain('data-hydrated="false"'); expect(html).toContain('Quarterly ledger');
    expect(html).toContain('undefined');
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    // Finish development dependency discovery before capturing a fresh SSR document.
    await page.goto(route); await expect(page.locator('[data-table-probe]')).toHaveAttribute('data-hydrated', 'true');
    let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*', async requestRoute => { if (requestRoute.request().resourceType() === 'script') await gate; await requestRoute.continue(); });
    try {
      await page.goto(route, { waitUntil: 'commit' });
      await expect(page.locator('[data-table-probe]')).toHaveAttribute('data-hydrated', 'false');
      const hosts = await page.locator('table, thead, tbody, tfoot, tr, th, td, caption').elementHandles();
      expect(hosts.length).toBeGreaterThan(8);
      expect((await tableState(page)).tags).toEqual(Object.fromEntries(Object.keys(expectedTableTags).map(part => [part, 'undefined'])));
      release(); await expect(page.locator('[data-table-probe]')).toHaveAttribute('data-hydrated', 'true');
      for (const host of hosts) expect(await host.evaluate(node => node.isConnected)).toBe(true);
      await expect.poll(async () => (await tableState(page)).tags).toEqual(expectedTableTags);
      expect((await tableState(page)).attachments).toEqual(Object.fromEntries(Object.keys(expectedTableTags).map(part => [part, 1])));
      expect(await page.locator('[data-probed]').evaluateAll(nodes => nodes.map(node => node.tagName))).toEqual(['TABLE', 'CAPTION', 'THEAD', 'TH', 'TBODY', 'TR', 'TD', 'TFOOT']);
      await page.getByRole('button', { name: 'Swap attachments', exact: true }).click();
      await expect.poll(async () => (await tableState(page)).attachments).toEqual(Object.fromEntries(Object.keys(expectedTableTags).map(part => [part, 2])));
      expect((await tableState(page)).cleanups).toEqual(Object.fromEntries(Object.keys(expectedTableTags).map(part => [part, 1])));
      for (const host of hosts) expect(await host.evaluate(node => node.isConnected)).toBe(true);
      await page.getByRole('button', { name: 'Remove table', exact: true }).click();
      await expect(page.locator('table')).toHaveCount(0);
      await expect.poll(async () => (await tableState(page)).tags).toEqual(Object.fromEntries(Object.keys(expectedTableTags).map(part => [part, null])));
      expect((await tableState(page)).cleanups).toEqual((await tableState(page)).attachments);
      for (const host of hosts) expect(await host.evaluate(node => node.isConnected)).toBe(false);
      await page.getByRole('button', { name: 'Restore table', exact: true }).click();
      await expect.poll(async () => (await tableState(page)).tags).toEqual(expectedTableTags);
      expect((await tableState(page)).attachments).toEqual(Object.fromEntries(Object.keys(expectedTableTags).map(part => [part, 3])));
      expect(errors).toEqual([]);
    } finally { release(); }
  });
}
