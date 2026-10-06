// Authored genuine-source acceptance; no ordinary copied assertion credit.
import { expect, type Page } from '@playwright/test';
import { kbdTheme } from './kbd-gallery-cases';
export const buttonGalleryStyles = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'];
export const buttonGalleryLibraries = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
export const buttonWrapper = '[data-slot=example-wrapper]';
const hosts = 'div:has(> ' + buttonWrapper + '), ' + buttonWrapper + ', ' + buttonWrapper + ' *';
export async function settledButtonGallery(page: Page) {
  await expect(page.locator(buttonWrapper + ' svg')).toHaveCount(74);
  await expect(page.locator(buttonWrapper + ' svg.lucide-square')).toHaveCount(0);
}
export async function settleButtonTransitions(page: Page) {
  await page.locator(buttonWrapper + ' button, ' + buttonWrapper + ' a').evaluateAll(async nodes => {
    for (const node of nodes) void getComputedStyle(node).color;
    await Promise.all(nodes.flatMap(n => n.getAnimations()).filter(a => a instanceof CSSTransition).map(a => a.finished));
  });
}
export async function buttonGalleryTheme(page: Page, style: string, dark: boolean) {
  await kbdTheme(page, style, dark); await settleButtonTransitions(page);
}
export async function buttonGalleryTree(page: Page) {
  return page.locator(buttonWrapper).evaluate(wrapper => {
    const directText = (node: Element) => {
      // Preserve literal bytes and positions across native text-node coalescing; comments are not source children.
      const slots = new Map<number, string>(); let index = 0;
      for (const child of node.childNodes) {
        if (child.nodeType === 1) index++;
        else if (child.nodeType === 3) slots.set(index, (slots.get(index) ?? '') + child.textContent);
      }
      return [...slots].filter(([, text]) => /\S/u.test(text) || node.localName === 'button' || node.localName === 'a');
    };
    const tree = (node: Element): unknown => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), text: directText(node), children: [...node.children].map(tree) });
    return tree(wrapper.parentElement!);
  });
}
export async function assertButtonGallery(page: Page, library: typeof buttonGalleryLibraries[number] = 'lucide') {
  await settledButtonGallery(page);
  const wrapper = page.locator(buttonWrapper);
  await expect(wrapper).toBeVisible();
  expect(await page.locator(hosts).evaluateAll(nodes => nodes.filter(n => n.namespaceURI === 'http://www.w3.org/1999/xhtml').length)).toBe(168);
  await expect(wrapper.locator(':scope > [data-slot=example]')).toHaveCount(6);
  expect(await wrapper.locator(':scope > [data-slot=example]').evaluateAll(nodes => nodes.map(n => n.firstElementChild!.textContent))).toEqual(['Variants & Sizes', 'Icon Right', 'Icon Left', 'Icon Only', 'Invalid States', 'Examples']);
  await expect(wrapper.locator('button')).toHaveCount(124);
  expect(await wrapper.locator('button').evaluateAll(nodes => nodes.map(n => ({ type: n.type, tab: n.tabIndex, slot: n.getAttribute('data-slot'), disabled: n.disabled })))).toEqual(Array(124).fill({ type: 'button', tab: 0, slot: 'button', disabled: false }));
  await expect(wrapper.locator('button[aria-invalid=true]')).toHaveCount(24);
  const examples = wrapper.locator(':scope > [data-slot=example]');
  await expect(examples.nth(3).locator('button[aria-label]')).toHaveCount(0);
  await expect(examples.nth(1).locator('button').nth(6)).toHaveText('Default');
  await expect(examples.nth(1).locator('button').nth(8).locator('svg')).not.toHaveAttribute('data-icon');
  const names = { lucide: ['ArrowRightIcon', 'ArrowLeftCircleIcon'], tabler: ['IconArrowRight', 'IconCircleArrowLeft'], hugeicons: ['ArrowRight02Icon', 'CircleArrowLeft02Icon'], phosphor: ['ArrowRightIcon', 'ArrowCircleLeftIcon'], remixicon: ['RiArrowRightLine', 'RiArrowLeftCircleLine'] };
  expect(await wrapper.locator('svg').evaluateAll((nodes, library) => nodes.map(n => n.getAttribute(library)), library)).toEqual([...Array(24).fill(names[library][0]), ...Array(24).fill(names[library][1]), ...Array(26).fill(names[library][0])]);
  await expect(wrapper.locator('a')).toHaveAttribute('href', '#'); await expect(wrapper.locator('a')).toHaveText('Link');
  await expect(wrapper.locator('a')).not.toHaveAttribute('data-slot');
  await expect(wrapper.locator('section,h2,[data-testid],[data-gallery]')).toHaveCount(0);
}
export async function buttonGalleryMeasurements(page: Page) {
  return page.locator(hosts).evaluateAll(nodes => nodes.map(node => {
    const s = getComputedStyle(node); const r = node.getBoundingClientRect();
    return { tag: node.localName, slot: node.getAttribute('data-slot'), width: r.width, height: r.height, display: s.display, columns: s.gridTemplateColumns, gap: s.gap, padding: s.padding, margin: s.margin, radius: s.borderRadius, font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, line: s.lineHeight, letter: s.letterSpacing, transform: s.textTransform, color: s.color, background: s.backgroundColor, border: s.borderColor, borderWidth: s.borderWidth, shadow: s.boxShadow, outline: s.outline, fill: s.fill, stroke: s.stroke, align: s.alignItems, justify: s.justifyContent, pointer: s.pointerEvents };
  }));
}
export async function buttonGalleryNativeActions(page: Page) {
  await page.evaluate(() => {
    (window as unknown as { buttonActions: unknown[] }).buttonActions = [];
    document.querySelector('[data-slot=example-wrapper]')!.addEventListener('click', event => {
      const host = (event.target as Element).closest('button,a')!;
      (window as unknown as { buttonActions: unknown[] }).buttonActions.push({ tag: host.tagName, text: host.textContent, trusted: event.isTrusted });
    });
  });
  const button = page.locator(buttonWrapper + ' button').first();
  await button.click(); await expect(button).toBeFocused();
  await button.press('Enter'); await button.press('Space'); await expect(button).toBeFocused();
  const anchor = page.locator(buttonWrapper + ' a'); await anchor.click(); await anchor.focus(); await anchor.press('Enter');
  expect(await page.evaluate(() => (window as unknown as { buttonActions: unknown[] }).buttonActions)).toEqual([
    { tag: 'BUTTON', text: 'Default', trusted: true },
    { tag: 'BUTTON', text: 'Default', trusted: true },
    { tag: 'BUTTON', text: 'Default', trusted: true },
    { tag: 'A', text: 'Link', trusted: true },
    { tag: 'A', text: 'Link', trusted: true },
  ]);
}
