// Authored source-derived selected gallery witnesses; no copied ordinary Empty suite exists.
import { expect, type Page } from '@playwright/test';
import { kbdTheme } from './kbd-gallery-cases';
export const emptyWrapper = '[data-slot="example-wrapper"]';
export const emptyHTMLHosts = `div:has(> ${emptyWrapper}), ${emptyWrapper}, ${emptyWrapper} *:not(svg):not(svg *)`;
export const emptyLibraries = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
export const emptyStyles = ['nova', 'vega', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'];
export const emptyTheme = kbdTheme;
export async function settledEmpty(page: Page) {
  await expect(page.locator(`${emptyWrapper} svg`)).toHaveCount(6);
  await expect(page.locator(`${emptyWrapper} svg.lucide-square`)).toHaveCount(0);
}
export async function emptyTree(page: Page, glyphs = true) {
  return page.locator(emptyWrapper).evaluate((wrapper, glyphs) => {
    const tree = (node: Element): unknown => {
      const exactText = node.matches('a, button, [data-slot=empty-title], [data-slot=empty-description]');
      return { tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent!).filter(text => /\S/u.test(text) || text === ' ' || exactText), children: [...node.children].filter(child => glyphs || child.namespaceURI === 'http://www.w3.org/1999/xhtml').map(tree) };
    };
    return tree(wrapper.parentElement!);
  }, glyphs);
}
export async function emptyMeasurements(page: Page) {
  return page.locator(`${emptyHTMLHosts}, ${emptyWrapper} svg`).evaluateAll(nodes => nodes.map(node => {
    const s = getComputedStyle(node); const r = node.getBoundingClientRect();
    return { tag: node.localName, slot: node.getAttribute('data-slot'), class: node.getAttribute('class'), x: r.x, y: r.y, width: r.width, height: r.height, display: s.display, position: s.position, minWidth: s.minWidth, maxWidth: s.maxWidth, minHeight: s.minHeight, columns: s.gridTemplateColumns, gap: s.gap, padding: s.padding, margin: s.margin, border: s.border, radius: s.borderRadius, size: s.fontSize, weight: s.fontWeight, font: s.fontFamily, lineHeight: s.lineHeight, spacing: s.letterSpacing, shaping: s.textRendering, synthesis: s.fontSynthesisWeight, background: s.backgroundColor, color: s.color, align: s.alignItems, justify: s.justifyContent, pointer: s.pointerEvents, select: s.userSelect, fill: s.fill, stroke: s.stroke, decoration: s.textDecorationLine, underline: s.textUnderlineOffset, opacity: s.opacity, tab: (node as HTMLElement).tabIndex, role: node.getAttribute('role') };
  }));
}
const names = {
  lucide: ['ArrowUpRightIcon', 'FolderIcon', 'PlusIcon'], tabler: ['IconArrowUpRight', 'IconFolder', 'IconPlus'], hugeicons: ['ArrowUpRight01Icon', 'Folder01Icon', 'PlusSignIcon'], phosphor: ['ArrowUpRightIcon', 'FolderIcon', 'PlusIcon'], remixicon: ['RiArrowRightUpLine', 'RiFolderLine', 'RiAddLine'],
};
export async function assertEmptyGallery(page: Page, library: typeof emptyLibraries[number] = 'lucide') {
  await settledEmpty(page);
  expect(await page.locator(emptyHTMLHosts).count()).toBe(48);
  const wrapper = page.locator(emptyWrapper);
  expect(await wrapper.evaluate(node => ({ tag: node.tagName, attrs: node.getAttributeNames().sort(), shellTag: node.parentElement!.tagName, shellAttrs: node.parentElement!.getAttributeNames().sort(), shellClass: node.parentElement!.className, children: node.children.length }))).toEqual({ tag: 'DIV', attrs: ['class', 'data-slot'], shellTag: 'DIV', shellAttrs: ['class'], shellClass: 'w-full bg-muted dark:bg-background', children: 4 });
  expect(await wrapper.locator(':scope > [data-slot=example]').evaluateAll(nodes => nodes.map(node => node.firstElementChild!.textContent))).toEqual(['Basic', 'With Muted Background', 'With Icon', 'In Card']);
  expect(await wrapper.locator('[data-slot=empty-title]').allTextContents()).toEqual(['No projects yet', 'No results found', 'Nothing to see here', 'No projects yet']);
  expect(await wrapper.locator('[data-slot=empty-description]').allTextContents()).toEqual(["You haven't created any projects yet. Get started by creating your first project.", 'No results found for your search. Try adjusting your search terms.', 'No posts have been created yet. Get started by creating your first post.', "You haven't created any projects yet. Get started by creating your first project."]);
  await expect(wrapper.locator('[data-slot=empty-icon][data-variant=icon]')).toHaveCount(2);
  await expect(wrapper.locator('a[data-slot=button]')).toHaveCount(5);
  await expect(wrapper.locator('button[data-slot=button]')).toHaveCount(4);
  await expect(wrapper.locator('a[href="#"]')).toHaveCount(6);
  const texts = await wrapper.locator('[data-slot=button]').allTextContents();
  expect(texts).toEqual(['Create project', 'Import project', 'Learn more ', 'Try again', 'Learn more ', 'New Post', 'Create project', 'Import project', 'Learn more ']);
  const links = wrapper.locator('a.cn-button-variant-link');
  expect(await links.evaluateAll(nodes => nodes.map(node => [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent)))).toEqual(Array(3).fill(['Learn more', ' ']));
  const inline = wrapper.locator('[data-slot=empty-description]').nth(2);
  expect(await inline.evaluate(node => [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent))).toEqual(['No posts have been created yet. Get started by', ' ', '.']);
  expect(await wrapper.locator('svg').evaluateAll((nodes, library) => nodes.map(node => node.getAttribute(library)), library)).toEqual([names[library][0], names[library][0], names[library][1], names[library][2], names[library][1], names[library][0]]);
  await expect(wrapper.locator('svg[data-icon="inline-start"]')).toHaveCount(1);
  expect(await wrapper.locator('section, h2, [data-gallery], [data-testid], [data-slot=card], input').count()).toBe(0);
}
export async function emptyTrustedActions(page: Page) {
  await page.evaluate(() => {
    const record: { tag: string; text: string | null; trusted: boolean; key: number }[] = [];
    Object.assign(window, { emptyClicks: record });
    document.querySelector('[data-slot=example-wrapper]')!.addEventListener('click', event => {
      const target = (event.target as Element).closest('a, button');
      if (target) record.push({ tag: target.tagName, text: target.textContent, trusted: event.isTrusted, key: (event as MouseEvent).detail });
    });
  });
  for (const button of await page.locator(`${emptyWrapper} button`).all()) { await button.focus(); await page.keyboard.press('Enter'); await page.keyboard.press('Space'); }
  for (const anchor of await page.locator(`${emptyWrapper} a`).all()) { await anchor.focus(); await page.keyboard.press('Enter'); }
  const records = await page.evaluate(() => (window as unknown as { emptyClicks: unknown[] }).emptyClicks);
  const expectedButtons = ['Import project', 'Try again', 'New Post', 'Import project'].flatMap(text => Array(2).fill({ tag: 'BUTTON', text, trusted: true, key: 0 }));
  const expectedAnchors = ['Create project', 'Learn more ', 'Learn more ', 'creating your first post', 'Create project', 'Learn more '].map(text => ({ tag: 'A', text, trusted: true, key: 0 }));
  expect(records).toHaveLength(14);
  expect(records).toEqual([...expectedButtons, ...expectedAnchors]);
  return records;
}
