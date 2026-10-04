// Authored genuine-source gallery witnesses; zero copied ordinary upstream suite credit.
import { expect, type Page } from '@playwright/test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HugeiconsIcon } from '@hugeicons/react';
import { JSDOM } from 'jsdom';
import { loadLibrary } from '../reference/icons/load-library';
import { aspectTheme } from './aspect-ratio-gallery-cases';
/* alert-observation:start */import type { GalleryAwaitObserver } from './aspect-ratio-gallery-cases';
/* alert-observation:end */export const kbdWrapper = '[data-slot="example-wrapper"]';
export const kbdHTMLHosts = `div:has(> ${kbdWrapper}), ${kbdWrapper}, ${kbdWrapper} *:not(svg):not(svg *)`;
export const kbdTitles = ['Basic', 'Modifier Keys', 'KbdGroup', 'Arrow Keys', 'With Icons', 'With Icons and Text', 'With samp'];
export const kbdStyles = ['nova', 'vega', 'maia', 'lyra', 'mira', 'sera', 'luma', 'rhea'];
export const kbdLibraries = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
export async function kbdTheme(page: Page, style: string, dark: boolean/* alert-observation:start */, observe?: GalleryAwaitObserver/* alert-observation:end */) {
  await aspectTheme(page, style, dark/* alert-observation:start */, observe/* alert-observation:end */);
  // The complete original globals consume a caller-supplied font variable.
  // Use the same explicit Tailwind consumer font as the existing theme witness.
/* alert-observation:start */  observe?.('theme-font-evaluation', false);
/* alert-observation:end */  await page.evaluate(() => {
    document.documentElement.style.setProperty('--font-sans', 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"');
    document.documentElement.style.setProperty('--font-heading', 'inherit');
  });
/* alert-observation:start */  observe?.('theme-font-evaluation', true);
/* alert-observation:end */}
const names = {
  lucide: ['CircleDashedIcon', 'ArrowLeftIcon', 'ArrowRightIcon'], tabler: ['IconCircleDashed', 'IconArrowLeft', 'IconArrowRight'], hugeicons: ['DashedLineCircleIcon', 'ArrowLeft01Icon', 'ArrowRight01Icon'], phosphor: ['CircleDashedIcon', 'ArrowLeftIcon', 'ArrowRightIcon'], remixicon: ['RiLoaderLine', 'RiArrowLeftLine', 'RiArrowRightLine'],
};
const expectedGlyphs = new Map<string, Promise<unknown[]>>();
async function originalGlyphTrees(library: typeof kbdLibraries[number]) {
  let promise = expectedGlyphs.get(library);
  if (!promise) {
    promise = loadLibrary(library).then(exports => {
      const tree = (node: Element): unknown => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent!).filter(text => /\S/u.test(text)), children: [...node.children].map(tree) });
      return [0, 1, 2, 1, 0].map(index => {
        const props = Object.fromEntries(kbdLibraries.map(key => [key, names[key][index]]));
        const icon = exports[names[library][index] as keyof typeof exports];
        const html = renderToStaticMarkup(createElement(library === 'hugeicons' ? HugeiconsIcon : icon, library === 'hugeicons' ? { ...props, icon, strokeWidth: 2 } : props));
        return tree(new JSDOM(html).window.document.querySelector('svg')!);
      });
    });
    expectedGlyphs.set(library, promise);
  }
  return promise;
}
export async function settledKbd(page: Page) {
  await expect(page.locator(`${kbdWrapper} svg`)).toHaveCount(5);
  await expect(page.locator(`${kbdWrapper} svg.lucide-square`)).toHaveCount(0);
}
export async function kbdTree(page: Page, glyphs = true) {
  return page.locator(kbdWrapper).evaluate((wrapper, glyphs) => {
    const snapshot = (node: Element): unknown => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent!).filter(text => /\S/u.test(text)), children: [...node.children].filter(child => glyphs || child.namespaceURI === 'http://www.w3.org/1999/xhtml').map(snapshot) });
    return snapshot(wrapper.parentElement!);
  }, glyphs);
}
export async function kbdMeasurements(page: Page) {
  return page.locator(`${kbdHTMLHosts}, ${kbdWrapper} svg`).evaluateAll(nodes => nodes.map(node => {
    const s = getComputedStyle(node); const r = node.getBoundingClientRect();
    return { tag: node.localName, slot: node.getAttribute('data-slot'), text: node.localName === 'kbd' ? node.textContent : null, class: node.getAttribute('class'), width: r.width, height: r.height, display: s.display, minWidth: s.minWidth, maxWidth: s.maxWidth, minHeight: s.minHeight, columns: s.gridTemplateColumns, gap: s.gap, padding: s.padding, margin: s.margin, radius: s.borderRadius, fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily, lineHeight: s.lineHeight, background: s.backgroundColor, color: s.color, align: s.alignItems, justify: s.justifyContent, pointer: s.pointerEvents, select: s.userSelect, fill: s.fill, stroke: s.stroke, tab: (node as HTMLElement).tabIndex, role: node.getAttribute('role') };
  }));
}
export async function assertKbdGallery(page: Page, width: number, style: string, library: typeof kbdLibraries[number] = 'lucide') {
  const wrapper = page.locator(kbdWrapper);
  await settledKbd(page);
  expect(await page.locator(kbdHTMLHosts).count()).toBe(48);
  expect(await wrapper.evaluate(node => ({ tag: node.tagName, attrs: node.getAttributeNames().sort(), shell: node.parentElement!.tagName, shellAttrs: node.parentElement!.getAttributeNames().sort(), shellClass: node.parentElement!.className, children: node.children.length, width: node.getBoundingClientRect().width, maxWidth: getComputedStyle(node).maxWidth, columns: getComputedStyle(node).gridTemplateColumns.split(' ').length, gap: getComputedStyle(node).gap, padding: getComputedStyle(node).padding }))).toEqual({ tag: 'DIV', attrs: ['class', 'data-slot'], shell: 'DIV', shellAttrs: ['class'], shellClass: 'w-full bg-muted dark:bg-background', children: 7, width: Math.min(width - 64, width >= 1536 ? 1152 : 1024), maxWidth: width >= 1536 ? '1152px' : '1024px', columns: width >= 768 ? 2 : 1, gap: width >= 640 && width < 768 ? '48px' : '32px', padding: width >= 1024 ? '48px' : width >= 640 ? '24px' : '8px 16px 16px' });
  const examples = wrapper.locator(':scope > [data-slot=example]'); await expect(examples).toHaveCount(7);
  expect(await examples.evaluateAll(nodes => nodes.map(node => node.firstElementChild!.textContent))).toEqual(kbdTitles);
  expect(await wrapper.locator('kbd').count()).toBe(21); expect(await wrapper.locator('kbd[data-slot=kbd]').count()).toBe(18); expect(await wrapper.locator('kbd[data-slot=kbd-group]').count()).toBe(3);
  expect(await wrapper.locator('samp').allTextContents()).toEqual(['File']);
  expect(await wrapper.locator('kbd').allTextContents()).toEqual(['Ctrl', '⌘K', 'Ctrl + B', '⌘', 'C', 'CtrlShiftP', 'Ctrl', 'Shift', 'P', '↑', '↓', '←', '→', '', '', '', '', 'LeftVoice Enabled', 'Left', 'Voice Enabled', 'File']);
  const keys = await wrapper.locator('kbd[data-slot=kbd]').evaluateAll(nodes => nodes.map(node => { const s = getComputedStyle(node); return { tag: node.tagName, height: node.getBoundingClientRect().height, minWidth: s.minWidth, padding: s.padding, size: s.fontSize, weight: s.fontWeight, radius: s.borderRadius, gap: s.gap, pointer: s.pointerEvents, select: s.userSelect, tab: (node as HTMLElement).tabIndex, role: node.getAttribute('role') }; }));
  const taller = ['sera', 'luma'].includes(style); const radius = ['lyra', 'sera'].includes(style) ? '0px' : style === 'mira' ? '2px' : ['luma', 'rhea'].includes(style) ? '10px' : '6px';
  expect(keys).toEqual(Array(18).fill({ tag: 'KBD', height: taller ? 22 : 20, minWidth: taller ? '22px' : '20px', padding: taller ? '0px 6px' : '0px 4px', size: style === 'mira' ? '10px' : '12px', weight: '500', radius, gap: '4px', pointer: 'none', select: 'none', tab: -1, role: null }));
  expect(await wrapper.locator('[data-slot=kbd-group]').evaluateAll(nodes => nodes.map(node => ({ tag: node.tagName, gap: getComputedStyle(node).gap, tab: (node as HTMLElement).tabIndex, role: node.getAttribute('role') })))).toEqual(Array(3).fill({ tag: 'KBD', gap: '4px', tab: -1, role: null }));
  const svg = await wrapper.locator('svg').evaluateAll((nodes, library) => nodes.map(node => ({ selected: node.getAttribute(library), width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height, class: node.getAttribute('class'), viewBox: node.getAttribute('viewBox'), children: node.children.length, precedingText: [...node.parentElement!.childNodes].slice(0, [...node.parentElement!.childNodes].indexOf(node)).some(child => child.nodeType === 3 && child.textContent!.trim()), text: node.parentElement!.textContent! })), library);
  const actualTrees = await wrapper.locator('svg').evaluateAll(nodes => {
    const tree = (node: Element): unknown => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent!).filter(text => /\S/u.test(text)), children: [...node.children].map(tree) });
    return nodes.map(tree);
  });
  expect(actualTrees).toEqual(await originalGlyphTrees(library));
  expect(svg.map(icon => icon.selected)).toEqual([names[library][0], names[library][1], names[library][2], names[library][1], names[library][0]]);
  for (const icon of svg) { expect(icon.width).toBe(12); expect(icon.height).toBe(12); expect(icon.children).toBeGreaterThan(0); expect(icon.precedingText).toBe(false); expect(icon.class ?? '').not.toContain('size-'); }
  expect(svg.map(icon => icon.text)).toEqual(['', '', '', 'Left', 'Voice Enabled']);
  expect(await wrapper.locator('section, h2, [data-gallery], [data-testid]').count()).toBe(0);
}
