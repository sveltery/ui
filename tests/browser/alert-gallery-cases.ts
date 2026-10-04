// Authored immutable-source composition witnesses; zero copied ordinary upstream Alert test credit.
import { expect, type Page } from '@playwright/test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HugeiconsIcon } from '@hugeicons/react';
import { JSDOM } from 'jsdom';
import { cn } from 'cn';
import { loadLibrary } from '../reference/icons/load-library';
import { kbdTheme } from './kbd-gallery-cases';

export const alertGallery = '[data-alert-gallery]';
export const alertHTMLHosts = `div:has(> ${alertGallery}), ${alertGallery}, ${alertGallery} *:not(svg):not(svg *)`;
export const alertLibraries = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
export const alertStyles = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'];
export const alertWidths = [390, 640, 768, 1024, 1280, 1536];
export const alertTheme = kbdTheme;
const names = { lucide: 'CircleAlertIcon', tabler: 'IconExclamationCircle', hugeicons: 'AlertCircleIcon', phosphor: 'WarningCircleIcon', remixicon: 'RiErrorWarningLine' };
const wrapperClass = cn('mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:p-12 2xl:max-w-6xl', 'lg:grid-cols-1');
const exampleClass = 'mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none';
const titleClass = 'px-1.5 py-2 text-xs font-medium text-muted-foreground';
const contentClass = "flex min-w-0 flex-1 flex-col items-start gap-6 rounded-xl bg-card p-12 text-foreground style-lyra:rounded-none style-sera:rounded-none *:[div:not([class*='w-'])]:w-full";
const bodyClass = 'mx-auto flex w-full max-w-lg flex-col gap-4';
const partClasses = {
  'alert-title': 'cn-alert-title [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground',
  'alert-description': 'cn-alert-description [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground',
};
const titleTexts = [
  'Success! Your changes have been saved.', 'Success! Your changes have been saved.',
  "Let's try one with icon, title and a link.", 'Success! Your changes have been saved',
  'This is a very long alert title that demonstrates how the component handles extended text content and potentially wraps across multiple lines',
  'This is an extremely long alert title that spans multiple lines to demonstrate how the component handles very lengthy headings while maintaining readability and proper text wrapping behavior',
  'Something went wrong!', 'Unable to process your payment.',
];
const descriptionTexts = [
  'This is an alert with title and description.', 'This one has a description only. No title. No icon.',
  'This one has an icon and a description only. No title. But it has a link and a second link.',
  'This is an alert with icon, title and description.',
  'This is a very long alert description that demonstrates how the component handles extended text content and potentially wraps across multiple lines',
  'This is an equally long description that contains detailed information about the alert. It shows how the component can accommodate extensive content while preserving proper spacing, alignment, and readability across different screen sizes and viewport widths. This helps ensure the user experience remains consistent regardless of the content length.',
  'Your session has expired. Please log in again.',
  'Please verify your billing information and try again.Check your card detailsEnsure sufficient fundsVerify billing address',
];
const expectedChildren = [
  ['alert-title'], ['alert-title', 'alert-description'], ['alert-description'],
  ['svg', 'alert-title'], ['svg', 'alert-description'], ['svg', 'alert-title', 'alert-description'],
  ['svg', 'alert-title'], ['svg', 'alert-description'], ['svg', 'alert-title', 'alert-description'],
  ['svg', 'alert-title', 'alert-description'], ['svg', 'alert-title', 'alert-description'],
];
const expectedGlyphs = new Map<string, Promise<unknown>>();
async function originalGlyphTree(library: typeof alertLibraries[number]) {
  let promise = expectedGlyphs.get(library);
  if (!promise) {
    promise = loadLibrary(library).then(exports => {
      const props = { ...names };
      const icon = exports[names[library] as keyof typeof exports];
      const html = renderToStaticMarkup(createElement(library === 'hugeicons' ? HugeiconsIcon : icon, library === 'hugeicons' ? { ...props, icon, strokeWidth: 2 } : props));
      const tree = (node: Element): unknown => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [], children: [...node.children].map(tree) });
      return tree(new JSDOM(html).window.document.querySelector('svg')!);
    });
    expectedGlyphs.set(library, promise);
  }
  return promise;
}
export async function settledAlert(page: Page) {
  await expect(page.locator(alertGallery)).toHaveAttribute('data-hydrated', 'true');
  await expect(page.locator(`${alertGallery} [data-slot=alert] > svg`)).toHaveCount(8);
  await expect(page.locator(`${alertGallery} svg.lucide-square`)).toHaveCount(0);
}
export async function alertGalleryTree(page: Page, glyphs = true) {
  return page.locator(alertGallery).evaluate((wrapper, glyphs) => {
    const tree = (node: Element): unknown => {
      // Adjacent text spans may be separated by React serialization comments.
      // Preserve every byte of meaningful runs, including the original JSX
      // explicit space, while excluding only whole formatting-only runs.
      const text: string[] = []; let run = '';
      for (const child of node.childNodes) {
        if (child.nodeType === 3) run += child.textContent;
        if (child.nodeType === 1) { if (/\S/u.test(run)) text.push(run); run = ''; }
      }
      if (/\S/u.test(run)) text.push(run);
      return { tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text, children: [...node.children].filter(child => glyphs || child.namespaceURI === 'http://www.w3.org/1999/xhtml').map(tree) };
    };
    return tree(wrapper.parentElement!);
  }, glyphs);
}
export async function alertGalleryMeasurements(page: Page) {
  return page.locator(`${alertHTMLHosts}, ${alertGallery} svg, ${alertGallery} svg *`).evaluateAll(nodes => {
    const shell = document.querySelector('[data-alert-gallery]')!.parentElement!.getBoundingClientRect();
    return nodes.map(node => {
      const s = getComputedStyle(node); const r = node.getBoundingClientRect();
      const after = node.getAttribute('data-slot') === 'alert' ? getComputedStyle(node, '::after') : null;
      return { tag: node.localName, slot: node.getAttribute('data-slot'), class: node.getAttribute('class'), x: r.x - shell.x, y: r.y - shell.y, width: r.width, height: r.height, display: s.display, position: s.position, minWidth: s.minWidth, maxWidth: s.maxWidth, minHeight: s.minHeight, columns: s.gridTemplateColumns, rows: s.gridTemplateRows, gridColumn: s.gridColumn, gridRow: s.gridRow, gap: s.gap, padding: s.padding, margin: s.margin, border: s.border, radius: s.borderRadius, fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily, fontSynthesisWeight: s.getPropertyValue('font-synthesis-weight'), textRendering: s.textRendering, fontKerning: s.fontKerning, fontFeatureSettings: s.fontFeatureSettings, fontVariationSettings: s.fontVariationSettings, letterSpacing: s.letterSpacing, wordSpacing: s.wordSpacing, lineHeight: s.lineHeight, background: s.backgroundColor, color: s.color, align: s.alignItems, justify: s.justifyContent, textAlign: s.textAlign, textWrap: s.textWrap, overflow: s.overflow, transform: s.transform, translate: s.translate, fill: s.fill, stroke: s.stroke, strokeWidth: s.strokeWidth, decoration: s.textDecoration, underlineOffset: s.textUnderlineOffset, listType: s.listStyleType, listPosition: s.listStylePosition, after: after ? { content: after.content, width: after.width, position: after.position, background: after.backgroundColor, top: after.top, right: after.right, bottom: after.bottom, left: after.left } : null, tab: (node as HTMLElement).tabIndex, role: node.getAttribute('role') };
    });
  });
}
// Authored failure-only observations. Reads actual DOM/style/ranges without changing them.
export async function alertInlineTypographyDiagnostics(page: Page) {
  return page.locator(alertGallery).evaluate(wrapper => {
    const fields = ['position', 'font-family', 'font-size', 'font-weight', 'font-style', 'font-stretch', 'font-kerning', 'font-feature-settings', 'font-variation-settings', 'font-synthesis', 'font-synthesis-weight', 'font-optical-sizing', 'font-variant-ligatures', 'letter-spacing', 'word-spacing', 'line-height', 'text-rendering', 'text-wrap', 'text-wrap-mode', 'text-wrap-style', 'white-space', 'direction', 'writing-mode'];
    const rect = (value: DOMRect) => ({ x: value.x, y: value.y, width: value.width, height: value.height, top: value.top, right: value.right, bottom: value.bottom, left: value.left });
    const styles = (node: Element) => { const css = getComputedStyle(node); return Object.fromEntries(fields.map(name => [name, css.getPropertyValue(name)])); };
    const record = (node: Element) => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value])), text: node.textContent, rect: rect(node.getBoundingClientRect()), clientRects: [...node.getClientRects()].map(rect), css: styles(node) });
    const rangeRects = (node: Node) => { const range = document.createRange(); range.selectNodeContents(node); return [...range.getClientRects()].map(rect); };
    const description = wrapper.querySelectorAll('[data-slot=alert-description]')[2]!;
    const ancestors: ReturnType<typeof record>[] = [];
    for (let node: Element | null = description.parentElement; node; node = node.parentElement) ancestors.push(record(node));
    return {
      url: location.href, monotonicTime: performance.now(), fontStatus: document.fonts.status,
      body: record(document.body), description: { ...record(description), rawHTML: description.innerHTML, rangeRects: rangeRects(description) },
      childNodes: [...description.childNodes].map(node => ({ type: node.nodeType, name: node.nodeName, value: node.nodeValue, text: node.textContent, rangeRects: rangeRects(node), element: node instanceof Element ? record(node) : null })),
      links: [...wrapper.querySelectorAll('a')].map(node => ({ ...record(node), rangeRects: rangeRects(node), childNodes: [...node.childNodes].map(child => ({ type: child.nodeType, name: child.nodeName, value: child.nodeValue, rangeRects: rangeRects(child) })) })),
      ancestors,
    };
  });
}
export async function alertLongTextMeasurements(page: Page) {
  return page.locator(`${alertGallery} > [data-slot=example]:nth-child(2) [data-slot=alert]`).evaluateAll(alerts => [
    alerts[3].querySelector('[data-slot=alert-title]')!, alerts[4].querySelector('[data-slot=alert-description]')!,
    alerts[5].querySelector('[data-slot=alert-title]')!, alerts[5].querySelector('[data-slot=alert-description]')!,
  ].map(node => {
    const box = node.getBoundingClientRect(); const range = document.createRange(); range.selectNodeContents(node);
    return { text: node.textContent, width: box.width, height: box.height, lineHeight: getComputedStyle(node).lineHeight, lines: [...range.getClientRects()].map(line => ({ x: line.x - box.x, y: line.y - box.y, width: line.width, height: line.height })) };
  }));
}
export async function assertAlertGallery(page: Page, width: number, style = 'nova', library: typeof alertLibraries[number] = 'lucide') {
  await settledAlert(page);
  expect(await page.locator(alertHTMLHosts).count()).toBe(50);
  const actual = await page.locator(alertGallery).evaluate(wrapper => {
    const record = (node: Element) => ({ tag: node.tagName, attrs: node.getAttributeNames().sort(), class: node.getAttribute('class') });
    const css = getComputedStyle(wrapper); const examples = [...wrapper.children];
    const alerts = [...wrapper.querySelectorAll('[data-slot=alert]')];
    return {
      wrapper: { ...record(wrapper), width: wrapper.getBoundingClientRect().width, maxWidth: css.maxWidth, columns: css.gridTemplateColumns.split(' ').length, gap: css.gap, padding: css.padding, shell: record(wrapper.parentElement!) },
      examples: examples.map(example => { const title = example.firstElementChild!; const content = example.lastElementChild!; const body = content.firstElementChild!; const s = getComputedStyle(content); return { ...record(example), children: example.children.length, title: { ...record(title), text: title.textContent }, content: { ...record(content), children: content.children.length, padding: s.padding, radius: s.borderRadius }, body: { ...record(body), children: body.children.length, width: body.getBoundingClientRect().width, maxWidth: getComputedStyle(body).maxWidth, available: content.getBoundingClientRect().width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight) } }; }),
      alerts: alerts.map(alert => ({ ...record(alert), role: alert.getAttribute('role'), children: [...alert.children].map(child => child.localName === 'svg' ? 'svg' : child.getAttribute('data-slot')), tab: (alert as HTMLElement).tabIndex })),
      rules: alerts.map(alert => { const s = getComputedStyle(alert); return { display: s.display, padding: s.padding, rowGap: s.rowGap, columnGap: s.columnGap, fontSize: s.fontSize, borderWidth: s.borderWidth, columns: s.gridTemplateColumns.split(' ').length }; }),
      titles: [...wrapper.querySelectorAll('[data-slot=alert-title]')].map(node => ({ ...record(node), text: node.textContent, tab: (node as HTMLElement).tabIndex })),
      descriptions: [...wrapper.querySelectorAll('[data-slot=alert-description]')].map(node => ({ ...record(node), text: node.textContent, tab: (node as HTMLElement).tabIndex })),
      links: [...wrapper.querySelectorAll('a')].map(node => ({ ...record(node), href: node.getAttribute('href'), text: node.textContent, tab: node.tabIndex, role: node.getAttribute('role'), decoration: getComputedStyle(node).textDecorationLine, offset: getComputedStyle(node).textUnderlineOffset })),
      payment: [...alerts.at(-1)!.querySelector('[data-slot=alert-description]')!.children].map(node => ({ ...record(node), text: node.localName === 'p' ? node.textContent : null, children: [...node.children].map(record) })),
      list: [...wrapper.querySelectorAll('li')].map(node => ({ ...record(node), text: node.textContent, display: getComputedStyle(node).display })),
      svg: [...wrapper.querySelectorAll('svg')].map(node => ({ direct: node.parentElement!.getAttribute('data-slot'), first: node === node.parentElement!.firstElementChild, width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height, row: getComputedStyle(node).gridRow, gridRowStart: getComputedStyle(node).gridRowStart, gridRowEnd: getComputedStyle(node).gridRowEnd, children: node.children.length })),
      selectors: { title: [...wrapper.querySelectorAll('[data-slot=alert-title]')].map(node => ({ weight: getComputedStyle(node).fontWeight, column: getComputedStyle(node).gridColumnStart })), paragraphMargin: getComputedStyle(wrapper.querySelector('p')!).marginBottom, listType: getComputedStyle(wrapper.querySelector('ul')!).listStyleType, listPosition: getComputedStyle(wrapper.querySelector('ul')!).listStylePosition },
    };
  });
  expect(actual.wrapper).toEqual({ tag: 'DIV', attrs: ['class', 'data-alert-gallery', 'data-hydrated', 'data-slot'], class: wrapperClass, width: Math.min(width - 64, width >= 1536 ? 1152 : 1024), maxWidth: width >= 1536 ? '1152px' : '1024px', columns: width >= 768 && width < 1024 ? 2 : 1, gap: width >= 640 && width < 768 ? '48px' : '32px', padding: width >= 1024 ? '48px' : width >= 640 ? '24px' : '8px 16px 16px', shell: { tag: 'DIV', attrs: ['class'], class: 'w-full bg-muted dark:bg-background' } });
  expect(actual.examples).toHaveLength(3);
  for (const [index, example] of actual.examples.entries()) {
    expect(example).toEqual({ tag: 'DIV', attrs: ['class', 'data-slot'], class: exampleClass, children: 2, title: { tag: 'DIV', attrs: ['class'], class: titleClass, text: ['Basic', 'With Icons', 'Destructive'][index] }, content: { tag: 'DIV', attrs: ['class', 'data-slot'], class: contentClass, children: 1, padding: '48px', radius: ['lyra', 'sera'].includes(style) ? '0px' : '14px' }, body: { tag: 'DIV', attrs: ['class'], class: bodyClass, children: [3, 6, 2][index], width: Math.min(example.body.available, parseFloat(example.body.maxWidth)), maxWidth: '512px', available: example.body.available } });
  }
  expect(actual.alerts).toEqual(expectedChildren.map((children, index) => ({ tag: 'DIV', attrs: ['class', 'data-slot', 'role'], class: `cn-alert group/alert relative w-full cn-alert-variant-${index >= 9 ? 'destructive' : 'default'}`, role: 'alert', children, tab: -1 })));
  const rowGap = style === 'sera' ? '4px' : '2px';
  const padding = style === 'mira' ? '6px 8px' : ['nova', 'lyra'].includes(style) ? '8px 10px' : '12px 16px';
  expect(actual.rules).toEqual(expectedChildren.map((children, index) => ({ display: 'grid', padding, rowGap, columnGap: index < 3 ? rowGap : style === 'mira' ? '6px' : ['nova', 'lyra'].includes(style) ? '8px' : '10px', fontSize: ['lyra', 'mira'].includes(style) ? '12px' : '14px', borderWidth: '1px', columns: children[0] === 'svg' ? 2 : 1 })));
  expect(actual.selectors).toEqual({ title: titleTexts.map((_, index) => ({ weight: style === 'sera' ? '600' : '500', column: index < 2 ? 'auto' : '2' })), paragraphMargin: style === 'lyra' ? '8px' : '16px', listType: 'disc', listPosition: 'inside' });
  expect(actual.titles).toEqual(titleTexts.map(text => ({ tag: 'DIV', attrs: ['class', 'data-slot'], class: partClasses['alert-title'], text, tab: -1 })));
  expect(actual.descriptions).toEqual(descriptionTexts.map(text => ({ tag: 'DIV', attrs: ['class', 'data-slot'], class: partClasses['alert-description'], text, tab: -1 })));
  expect(actual.links).toEqual(['link', 'But it has a link', 'second link', 'billing information'].map(text => ({ tag: 'A', attrs: ['href'], class: null, href: '#', text, tab: 0, role: null, decoration: 'underline', offset: '3px' })));
  expect(actual.payment).toEqual([{ tag: 'P', attrs: [], class: null, text: 'Please verify your billing information and try again.', children: [{ tag: 'A', attrs: ['href'], class: null }] }, { tag: 'UL', attrs: ['class'], class: 'list-inside list-disc', text: null, children: Array(3).fill({ tag: 'LI', attrs: [], class: null }) }]);
  expect(actual.list).toEqual(['Check your card details', 'Ensure sufficient funds', 'Verify billing address'].map(text => ({ tag: 'LI', attrs: [], class: null, text, display: 'list-item' })));
  const iconSize = style === 'mira' ? 14 : 16; // Immutable Mira size-3.5; all seven other Alert scopes use size-4.
  for (const svg of actual.svg) { expect(svg).toMatchObject({ direct: 'alert', first: true, width: iconSize, height: iconSize, gridRowStart: 'span 2', gridRowEnd: 'span 2' }); expect(svg.children).toBeGreaterThan(0); }
  const glyphs = await page.locator(`${alertGallery} svg`).evaluateAll(nodes => {
    const tree = (node: Element): unknown => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [], children: [...node.children].map(tree) });
    return nodes.map(tree);
  });
  expect(glyphs).toEqual(Array(8).fill(await originalGlyphTree(library)));
  for (const part of await alertLongTextMeasurements(page)) {
    expect(part.lines.length).toBeGreaterThan(1);
    expect(part.height).toBeGreaterThan(parseFloat(part.lineHeight));
    for (const line of part.lines) { expect(line.width).toBeLessThanOrEqual(part.width); expect(line.x).toBeGreaterThanOrEqual(0); }
  }
  await expect(page.locator(`${alertGallery} section, ${alertGallery} h2, ${alertGallery} button, ${alertGallery} [data-slot=alert-action]`)).toHaveCount(0);
}
export async function assertAlertNativeLinks(page: Page) {
  const links = page.locator(`${alertGallery} a`);
  await expect(links).toHaveCount(4);
  await links.first().focus(); await expect(links.first()).toBeFocused();
  for (const index of [1, 2, 3]) { await page.keyboard.press('Tab'); await expect(links.nth(index)).toBeFocused(); }
  await page.keyboard.press('Shift+Tab'); await expect(links.nth(2)).toBeFocused();
  for (const link of await links.all()) {
    await link.focus(); await page.keyboard.press('Enter');
    expect(await page.evaluate(() => location.hash)).toBe('');
    expect(page.url()).toMatch(/#$/);
    await expect(link).toBeFocused();
  }
  await links.last().blur();
}

// Source-derived actual pointer states from globals.css:220–223, separate from width parity.
export async function alertLinkPointerMeasurements(page: Page, width: number) {
  const links = page.locator(`${alertGallery} a`);
  await expect(links).toHaveCount(4);
  const records = [];
  for (const [index, link] of (await links.all()).entries()) {
    await link.hover();
    const read = () => link.evaluate(node => ({ active: node.matches(':active'), opacity: getComputedStyle(node).opacity }));
    await expect.poll(read).toEqual({ active: false, opacity: '1' });
    const initial = await read();
    let held: Awaited<ReturnType<typeof read>>;
    try {
      await page.mouse.down();
      await expect.poll(read).toEqual({ active: true, opacity: width < 768 ? '0.6' : '1' });
      held = await read();
    } finally { await page.mouse.up(); }
    await expect.poll(read).toEqual({ active: false, opacity: '1' });
    records.push({ index, text: await link.textContent(), href: await link.getAttribute('href'), initial, held, released: await read() });
  }
  return records;
}
