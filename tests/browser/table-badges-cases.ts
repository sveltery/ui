import { expect, type Page } from '@playwright/test';

// Source-derived witnesses for the actual pinned TableWithBadges function, not a Badge component or upstream test port.
const tones = ['green', 'blue', 'yellow', 'gray', 'gray', 'gray'];
const texts = ['Completed', 'High', 'In Progress', 'Medium', 'Pending', 'Low'];
export const tableBadgeSelector = '[data-gallery] > section:nth-child(4) table';
export const tableBadgeHosts = `${tableBadgeSelector}, ${tableBadgeSelector} *`;
export function tableGalleryHydrated(page: Page) {
  return page.locator('main[data-hydrated], main > div > div[data-hydrated]');
}
export async function tableBadgeSnapshot(page: Page) {
  return page.locator(tableBadgeSelector).evaluate(table => {
    const snapshot = (node: Element): unknown => ({ tag: node.tagName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent!.trim()).filter(Boolean), children: [...node.children].map(snapshot) });
    return snapshot(table);
  });
}
export async function tableBadgeMeasurements(page: Page) {
  return page.locator(tableBadgeHosts).evaluateAll(nodes => nodes.map(node => {
    const css = getComputedStyle(node); const rect = node.getBoundingClientRect();
    return { tag: node.tagName, width: rect.width, height: rect.height, display: css.display, alignItems: css.alignItems, padding: css.padding, radius: css.borderRadius, background: css.backgroundColor, color: css.color, fontSize: css.fontSize, fontWeight: css.fontWeight, lineHeight: css.lineHeight, textAlign: css.textAlign, borderWidth: css.borderWidth, whiteSpace: css.whiteSpace };
  }));
}
export async function assertTableBadges(page: Page, dark = false) {
  const table = page.locator(tableBadgeSelector);
  await expect(page.locator('[data-gallery] table')).toHaveCount(4);
  expect(await table.locator('th').allTextContents()).toEqual(['Task', 'Status', 'Priority']);
  expect(await table.locator('tbody tr').evaluateAll(rows => rows.map(row => [...row.querySelectorAll('td')].map(cell => cell.textContent!.trim())))).toEqual([
    ['Design homepage', 'Completed', 'High'], ['Implement API', 'In Progress', 'Medium'], ['Write tests', 'Pending', 'Low'],
  ]);
  await expect(table.locator('caption, tfoot, [data-slot="badge"], [role], [tabindex], button, input, select')).toHaveCount(0);
  const spans = table.locator('span'); await expect(spans).toHaveCount(6);
  expect(await spans.allTextContents()).toEqual(texts);
  for (const [index, tone] of tones.entries()) {
    const span = spans.nth(index);
    await expect(span).toHaveAttribute('class', `inline-flex items-center rounded-full bg-${tone}-500/10 px-2 py-1 text-xs font-medium text-${tone}-700 dark:text-${tone}-400`);
    const measured = await span.evaluate((node, args) => {
      const css = getComputedStyle(node); const rect = node.getBoundingClientRect();
      // Resolve the exercised Tailwind palette through native CSS, independently of the span's class application.
      const witness = document.createElement('span'); witness.style.color = `var(--color-${args.tone}-${args.dark ? 400 : 700})`; witness.style.backgroundColor = `color-mix(in oklab, var(--color-${args.tone}-500) 10%, transparent)`; document.body.append(witness);
      const expected = getComputedStyle(witness); const expectedColor = expected.color; const expectedBackground = expected.backgroundColor; witness.remove();
      return { display: css.display, align: css.alignItems, padding: css.padding, font: css.fontSize, weight: css.fontWeight, lineHeight: css.lineHeight, radius: parseFloat(css.borderRadius), height: rect.height, color: css.color, expectedColor, background: css.backgroundColor, expectedBackground };
    }, { tone, dark });
    expect(measured.display).toBe('inline-flex'); expect(measured.align).toBe('center'); expect(measured.padding).toBe('4px 8px');
    expect(measured.font).toBe('12px'); expect(measured.weight).toBe('500'); expect(measured.lineHeight).toBe('16px'); expect(measured.height).toBe(24); expect(measured.radius).toBeGreaterThan(1000);
    expect(measured.color).toBe(measured.expectedColor); expect(measured.background).toBe(measured.expectedBackground); expect(measured.background).not.toBe('rgba(0, 0, 0, 0)');
  }
  expect(await table.locator('tbody td:nth-child(3)').evaluateAll(cells => cells.map(cell => getComputedStyle(cell).textAlign))).toEqual(['right', 'right', 'right']);
}
export async function setTableBadgeTheme(page: Page, dark: boolean) {
  // Retain the media witness and activate the pinned globals.css class-based dark variant.
  await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light' });
  await page.evaluate(enabled => { document.documentElement.classList.toggle('dark', enabled); }, dark);
}
