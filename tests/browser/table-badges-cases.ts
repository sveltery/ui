import { expect, type Page } from '@playwright/test';

// Source-derived witnesses for the actual pinned TableWithBadges function, not a Badge component or upstream test port.
const tones = ['green', 'blue', 'yellow', 'gray', 'gray', 'gray'];
const texts = ['Completed', 'High', 'In Progress', 'Medium', 'Pending', 'Low'];
// Authored locator fidelity repair: actual Example -> content -> fixed Table container.
export const tableGallerySelector = '[data-slot="example-wrapper"]';
export const tableBadgeSelector = `${tableGallerySelector} > [data-slot="example"]:nth-child(4) > [data-slot="example-content"] > [data-slot="table-container"] > table[data-slot="table"]`;
export const tableBadgeHosts = `${tableBadgeSelector}, ${tableBadgeSelector} *`;
export const tableGalleryHosts = `div:has(> ${tableGallerySelector}), ${tableGallerySelector}, ${tableGallerySelector} *`;
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
  // Real class-based palette changes animate inherited row colors; compare settled source outputs.
  await page.evaluate(async () => { await Promise.all(document.getAnimations().filter(animation => Number.isFinite(animation.effect?.getComputedTiming().endTime)).map(animation => animation.finished.catch(() => {}))); });
  return page.locator(tableBadgeHosts).evaluateAll(nodes => nodes.map(node => {
    const css = getComputedStyle(node); const rect = node.getBoundingClientRect();
    return { tag: node.tagName, width: rect.width, height: rect.height, display: css.display, alignItems: css.alignItems, padding: css.padding, radius: css.borderRadius, background: css.backgroundColor, color: css.color, fontSize: css.fontSize, fontWeight: css.fontWeight, lineHeight: css.lineHeight, textAlign: css.textAlign, borderWidth: css.borderWidth, whiteSpace: css.whiteSpace };
  }));
}
export async function assertTableBadges(page: Page, dark = false) {
  const table = page.locator(tableBadgeSelector);
  await expect(page.locator(`${tableGallerySelector} table`)).toHaveCount(4);
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

// Authored source-derived supplements for the four selected genuine scaffold compositions.
const wrapperClass = 'mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:p-12 2xl:max-w-6xl';
const exampleClass = 'mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none';
const titleClass = 'px-1.5 py-2 text-xs font-medium text-muted-foreground';
const contentClass = "flex min-w-0 flex-1 flex-col items-start gap-6 rounded-xl bg-card p-12 text-foreground style-lyra:rounded-none style-sera:rounded-none *:[div:not([class*='w-'])]:w-full";
export async function tableGallerySnapshot(page: Page) {
  return page.locator(tableGallerySelector).evaluate(wrapper => {
    const snapshot = (node: Element): unknown => ({ tag: node.tagName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent!.trim()).filter(Boolean), children: [...node.children].map(snapshot) });
    return snapshot(wrapper.parentElement!);
  });
}
export async function tableGalleryMeasurements(page: Page) {
  return page.locator(tableGallerySelector).evaluate(wrapper => {
    const css = getComputedStyle(wrapper); const shell = wrapper.parentElement!;
    const parent = shell.parentElement!; const parentCss = getComputedStyle(parent);
    const box = wrapper.getBoundingClientRect();
    return {
      shellTag: shell.tagName, shellClass: shell.className, shellAttributes: shell.getAttributeNames().sort(), shellWidth: shell.getBoundingClientRect().width, shellBackground: getComputedStyle(shell).backgroundColor,
      availableWidth: parent.clientWidth - parseFloat(parentCss.paddingLeft) - parseFloat(parentCss.paddingRight),
      tag: wrapper.tagName, attributes: wrapper.getAttributeNames().sort(), class: wrapper.className, width: box.width, minHeight: css.minHeight, maxWidth: css.maxWidth, columns: css.gridTemplateColumns, gap: css.gap, padding: css.padding,
      examples: [...wrapper.children].map(example => {
        const title = example.firstElementChild!; const content = example.lastElementChild!;
        const contentCss = getComputedStyle(content); const contentBox = content.getBoundingClientRect();
        const container = content.firstElementChild!; const table = container.firstElementChild!;
        return { tag: example.tagName, attributes: example.getAttributeNames().sort(), slot: example.getAttribute('data-slot'), class: example.className, childCount: example.children.length, width: example.getBoundingClientRect().width,
          titleTag: title.tagName, title: title.textContent, titleClass: title.className, titleAttributes: title.getAttributeNames().sort(), titleFont: getComputedStyle(title).fontSize,
          contentTag: content.tagName, contentSlot: content.getAttribute('data-slot'), contentClass: content.className, contentChildCount: content.children.length, contentAttributes: content.getAttributeNames().sort(), contentWidth: contentBox.width, contentPadding: contentCss.padding, contentGap: contentCss.gap, radius: contentCss.borderRadius, background: contentCss.backgroundColor, color: contentCss.color,
          innerWidth: contentBox.width - parseFloat(contentCss.paddingLeft) - parseFloat(contentCss.paddingRight),
          containerTag: container.tagName, containerSlot: container.getAttribute('data-slot'), containerClass: container.className, containerWidth: container.getBoundingClientRect().width, containerScrollWidth: container.scrollWidth, containerClientWidth: container.clientWidth, overflowX: getComputedStyle(container).overflowX, position: getComputedStyle(container).position, tableTag: table.tagName, tableWidth: table.getBoundingClientRect().width,
        };
      }),
    };
  });
}
export async function assertTableGalleryScaffold(page: Page, width: number, height: number) {
  const measured = await tableGalleryMeasurements(page);
  expect(measured.shellTag).toBe('DIV'); expect(measured.shellClass).toBe('w-full bg-muted dark:bg-background'); expect(measured.shellAttributes).toEqual(['class']);
  expect(measured.shellWidth).toBeCloseTo(measured.availableWidth, 4);
  expect(measured.tag).toBe('DIV'); expect(measured.attributes).toEqual(['class', 'data-slot']); expect(measured.class).toBe(wrapperClass);
  expect(measured.width).toBeCloseTo(Math.min(measured.availableWidth, width >= 1536 ? 1152 : 1024), 4);
  expect(measured.maxWidth).toBe(width >= 1536 ? '1152px' : '1024px'); expect(measured.minHeight).toBe(`${height}px`);
  expect(measured.columns.split(' ')).toHaveLength(width >= 768 ? 2 : 1);
  expect(measured.gap).toBe(width >= 640 && width < 768 ? '48px' : '32px'); expect(measured.padding).toBe(width >= 1024 ? '48px' : width >= 640 ? '24px' : '8px 16px 16px');
  expect(measured.examples).toHaveLength(4);
  for (const [index, example] of measured.examples.entries()) {
    expect(example.tag).toBe('DIV'); expect(example.slot).toBe('example'); expect(example.attributes).toEqual(['class', 'data-slot']); expect(example.class).toBe(exampleClass); expect(example.childCount).toBe(2);
    expect(example.titleTag).toBe('DIV'); expect(example.title).toBe(['Basic', 'With Footer', 'Simple', 'With Badges'][index]); expect(example.titleClass).toBe(titleClass); expect(example.titleAttributes).toEqual(['class']); expect(example.titleFont).toBe('12px');
    expect(example.contentTag).toBe('DIV'); expect(example.contentSlot).toBe('example-content'); expect(example.contentAttributes).toEqual(['class', 'data-slot']); expect(example.contentClass).toBe(contentClass); expect(example.contentChildCount).toBe(1);
    expect(example.contentWidth).toBeCloseTo(example.width, 4); expect(example.contentPadding).toBe('48px'); expect(example.contentGap).toBe('24px');
    expect(example.containerTag).toBe('DIV'); expect(example.containerSlot).toBe('table-container'); expect(example.containerClass).toBe('cn-table-container'); expect(example.containerWidth).toBeCloseTo(example.innerWidth, 4);
    expect(example.overflowX).toBe('auto'); expect(example.position).toBe('relative'); expect(example.tableTag).toBe('TABLE'); expect(example.tableWidth).toBeGreaterThanOrEqual(example.containerWidth); expect(example.containerScrollWidth).toBeGreaterThanOrEqual(example.containerClientWidth);
  }
  expect(await page.locator(`${tableGallerySelector} section, ${tableGallerySelector} h2`).count()).toBe(0);
  expect(await page.locator(tableGalleryHosts).count()).toBe(114);
  if (width === 390) expect(measured.examples[0].containerScrollWidth).toBeGreaterThan(measured.examples[0].containerClientWidth);
  return measured;
}
export async function assertTableGalleryVariants(page: Page) {
  // Exact source selector witness; changing two tokens does not claim a complete upstream palette.
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark', 'style-lyra', 'style-sera');
    document.documentElement.style.setProperty('--muted', 'rgb(10, 20, 30)'); document.documentElement.style.setProperty('--background', 'rgb(40, 50, 60)');
  });
  expect((await tableGalleryMeasurements(page)).shellBackground).toBe('rgb(10, 20, 30)');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  expect((await tableGalleryMeasurements(page)).shellBackground).toBe('rgb(40, 50, 60)');
  for (const style of ['style-lyra', 'style-sera']) {
    await page.evaluate(styleClass => { document.documentElement.classList.remove('style-lyra', 'style-sera'); document.documentElement.classList.add(styleClass); }, style);
    expect((await tableGalleryMeasurements(page)).examples.map(example => example.radius)).toEqual(['0px', '0px', '0px', '0px']);
  }
}
