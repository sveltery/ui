import { expect, type Page } from '@playwright/test';
import { kbdTheme } from './kbd-gallery-cases';
export const textareaGalleryHostSelector = '[data-slot=example-wrapper]';
export const textareaGalleryHosts = `${textareaGalleryHostSelector}, ${textareaGalleryHostSelector} *, div:has(> ${textareaGalleryHostSelector})`;
export const textareaGalleryStyles = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'];
export async function textareaGalleryTheme(page: Page, style: string, dark: boolean) {
  await kbdTheme(page, style, dark);
  // Genuine transition-colors continues after palette inputs change. Flush the
  // scoped native controls, then await their actual CSS transitions unchanged.
  await page.locator(`${textareaGalleryHostSelector} textarea`).evaluateAll(async nodes => {
    for (const node of nodes) void getComputedStyle(node).color;
    const transitions = nodes.flatMap(node => node.getAnimations()).filter(animation => animation instanceof CSSTransition);
    await Promise.all(transitions.map(transition => transition.finished));
  });
}
export async function textareaGalleryTree(page: Page) {
  return page.locator(textareaGalleryHostSelector).evaluate(wrapper => {
    const tree = (node: Element): unknown => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).filter(t => /\S/u.test(t!)), children: [...node.children].map(tree) });
    return tree(wrapper.parentElement!);
  });
}
export async function assertTextareaGallery(page: Page) {
  const wrapper = page.locator(textareaGalleryHostSelector);
  await expect(wrapper).toBeVisible();
  await expect(page.locator(textareaGalleryHosts)).toHaveCount(10);
  await expect(wrapper.locator(':scope > [data-slot=example]')).toHaveCount(2);
  expect(await wrapper.locator(':scope > [data-slot=example]').evaluateAll(nodes => nodes.map(n => n.firstElementChild!.textContent))).toEqual(['Basic', 'Invalid']);
  expect(await wrapper.locator('textarea').evaluateAll(nodes => nodes.map(n => ({ tag: n.tagName, slot: n.getAttribute('data-slot'), placeholder: n.getAttribute('placeholder'), invalid: n.getAttribute('aria-invalid'), disabled: n.disabled, rows: n.rows })))).toEqual(['Basic', 'Invalid'].map((_, i) => ({ tag: 'TEXTAREA', slot: 'textarea', placeholder: 'Type your message here.', invalid: i ? 'true' : null, disabled: false, rows: 2 })));
  await expect(wrapper.locator('section, h2, label, [data-testid], [data-gallery]')).toHaveCount(0);
}
export async function textareaGalleryMeasurements(page: Page) {
  return page.locator(textareaGalleryHosts).evaluateAll(nodes => nodes.map(node => {
    const s = getComputedStyle(node); const r = node.getBoundingClientRect();
    return { tag: node.tagName, slot: node.getAttribute('data-slot'), width: r.width, height: r.height, display: s.display, grid: s.gridTemplateColumns, gap: s.gap, padding: s.padding, margin: s.margin, radius: s.borderRadius, font: s.fontFamily, size: s.fontSize, line: s.lineHeight, color: s.color, background: s.backgroundColor, border: s.borderColor, shadow: s.boxShadow, minHeight: s.minHeight, resize: s.resize, fieldSizing: s.getPropertyValue('field-sizing') };
  }));
}
