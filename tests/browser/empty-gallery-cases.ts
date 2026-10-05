// Authored source-derived selected gallery witnesses; no copied ordinary Empty suite exists.
import { expect, type Page } from '@playwright/test';
import { kbdTheme } from './kbd-gallery-cases';
export const emptyWrapper = '[data-slot="example-wrapper"]';
export const emptyHTMLHosts = `div:has(> ${emptyWrapper}), ${emptyWrapper}, ${emptyWrapper} *:not(svg):not(svg *)`;
export const emptyLibraries = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
export const emptyStyles = ['nova', 'vega', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'];
/* empty-theme-readiness:start */
import { THEMES } from '../../scripts/theme-assets.mjs';
const emptyReadinessObserved = new WeakSet<Page>();
export async function emptyTheme(page: Page, style: string, dark: boolean) {
  await kbdTheme(page, style, dark);
  const tokens = { ...THEMES.find(record => record.name === 'neutral')!.cssVars[dark ? 'dark' : 'light'] };
  const witness = await page.locator(`${emptyHTMLHosts}, ${emptyWrapper} svg`).evaluateAll(async (nodes, input) => {
    if (nodes.length !== 54) throw new Error('Empty theme readiness requires all 48 HTML and six SVG hosts');
    if (typeof CSSTransition !== 'function') throw new Error('CSS transition observation is unavailable');
    const flush = () => { for (const node of nodes) { getComputedStyle(node); node.getBoundingClientRect(); } };
    const active = () => [...new Set(nodes.flatMap(node => node.getAnimations()))].filter(animation => animation instanceof CSSTransition && (animation.pending || !['finished', 'idle'].includes(animation.playState))) as CSSTransition[];
    const sample = () => {
      const wrapper = document.querySelector('[data-slot="example-wrapper"]')!;
      const primary = getComputedStyle(wrapper.querySelector('.cn-button-variant-default')!);
      const outline = getComputedStyle(wrapper.querySelector('.cn-button-variant-outline')!);
      const plus = getComputedStyle(wrapper.querySelector('svg[data-icon="inline-start"]')!);
      return { primaryBackground: primary.backgroundColor, outlineColor: outline.color, plusColor: plus.color, plusFill: plus.fill, plusStroke: plus.stroke };
    };
    let timer: ReturnType<typeof setTimeout> | undefined;
    const fontsBefore = document.fonts.status;
    try {
      return await Promise.race([
        (async () => {
          await document.fonts.ready;
          flush();
          const transitions = active();
          const before = sample();
          const properties = [...new Set(transitions.map(transition => transition.transitionProperty))].sort();
          const durations = transitions.map(transition => transition.effect!.getComputedTiming().endTime);
          const states = [...new Set(transitions.map(transition => transition.playState))].sort();
          await Promise.all(transitions.map(transition => transition.finished));
          flush();
          const remaining = active();
          if (remaining.length) throw new Error(`Empty theme has ${remaining.length} unfinished CSS transitions`);
          const root = document.documentElement;
          return { style: input.style, dark: input.dark, className: root.className, tokens: Object.fromEntries(Object.keys(input.tokens).map(name => [name, root.style.getPropertyValue(`--${name}`)])), fontSans: root.style.getPropertyValue('--font-sans'), fontHeading: root.style.getPropertyValue('--font-heading'), fontsBefore, fontsAfter: document.fonts.status, transitionCount: transitions.length, transitionProperties: properties, transitionStates: states, transitionEndTimes: [...new Set(durations)], remainingTransitions: remaining.length, before, after: sample() };
        })(),
        new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Empty fonts/CSS transitions did not settle within 5000ms')), 5000); }),
      ]);
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
  }, { style, dark, tokens });
  expect(witness.className).toBe(`style-${style}${dark ? ' dark' : ''}`);
  expect(witness.tokens).toEqual(tokens);
  expect(witness.fontSans).toBe('ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"');
  expect(witness.fontHeading).toBe('inherit');
  expect(witness.fontsAfter).toBe('loaded');
  expect(witness.remainingTransitions).toBe(0);
  if (!emptyReadinessObserved.has(page)) {
    const observation = JSON.stringify(witness);
    expect(Buffer.byteLength(observation)).toBeLessThanOrEqual(4096);
    console.log('Empty theme readiness:', observation);
    emptyReadinessObserved.add(page);
  }
}
/* empty-theme-readiness:end */
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
export async function emptyTrustedActions(page: Page, browserName: 'chromium' | 'firefox' | 'webkit') {
  if (!['chromium', 'firefox', 'webkit'].includes(browserName)) throw new Error('Empty trusted actions require an actual chromium/firefox/webkit browserName');
  const anchorDetail = { chromium: 0, firefox: 1, webkit: 0 }[browserName];
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
  /* empty-action-witness:start */
  const witness = JSON.stringify({ url: page.url(), records });
  if (Buffer.byteLength(witness) > 4096) throw new Error('Empty trusted action witness exceeds 4096 bytes');
  console.log('Empty trusted action witness:', witness);
  /* empty-action-witness:end */
  const expectedButtons = ['Import project', 'Try again', 'New Post', 'Import project'].flatMap(text => Array(2).fill({ tag: 'BUTTON', text, trusted: true, key: 0 }));
  const expectedAnchors = ['Create project', 'Learn more ', 'Learn more ', 'creating your first post', 'Create project', 'Learn more '].map(text => ({ tag: 'A', text, trusted: true, key: anchorDetail }));
  expect(records).toHaveLength(14);
  expect(records).toEqual([...expectedButtons, ...expectedAnchors]);
  return records;
}
