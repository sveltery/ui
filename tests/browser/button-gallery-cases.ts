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

// Grounded in pinned parseAsStringLiteral(...).withDefault(DEFAULT_CONFIG.iconLibrary), not the port.
export const buttonGalleryQueryCases = [
  ['', 'lucide'], ['?library=', 'lucide'], ['?library=bogus', 'lucide'],
  ['?library=Lucide', 'lucide'], ['?library=%20lucide%20', 'lucide'],
  ['?library=bogus&library=tabler', 'lucide'], ['?library=tabler&library=bogus', 'tabler'],
] as const;
export async function buttonGalleryQueryDefaults(page: Page, original: Page) {
  for (const [query, library] of buttonGalleryQueryCases) {
    const response = await page.request.get('/button-gallery' + query);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect((html.match(/<button\b/gu) ?? []).length).toBe(124);
    expect((html.match(/<svg\b/gu) ?? []).length).toBe(74);
    await page.goto('/button-gallery' + query);
    await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await original.goto('http://127.0.0.1:5175/button-gallery' + query);
    await assertButtonGallery(page, library); await assertButtonGallery(original, library);
    const selectedReference = await buttonGalleryTree(original);
    // Independently compare to a valid original library URL, never two equally invalid trees.
    await original.goto('http://127.0.0.1:5175/button-gallery?library=' + library);
    await assertButtonGallery(original, library);
    const validReference = await buttonGalleryTree(original);
    expect(selectedReference).toEqual(validReference);
    expect(await buttonGalleryTree(page)).toEqual(validReference);
  }
}

// Diagnostic only: capture genuine browser state/cascade without changing inputs or acceptance.
export async function buttonGalleryFocusReceipt(page: Page) {
  return page.locator(buttonWrapper + ' button').first().evaluate(node => {
    const pseudo = (selector: string) => { try { return node.matches(selector); } catch { return null; } };
    const matched: unknown[] = []; let overflow = 0; let unreadable = 0;
    const walk = (rules: CSSRuleList, context: string[]) => {
      for (const entry of rules) {
        if (entry instanceof CSSMediaRule && !matchMedia(entry.conditionText).matches) continue;
        if (entry instanceof CSSSupportsRule && !CSS.supports(entry.conditionText)) continue;
        const rule = entry as CSSRule & { selectorText?: string; style?: CSSStyleDeclaration; cssRules?: CSSRuleList };
        if (rule.selectorText && rule.style) {
          const outline = [...rule.style].filter(property => property.startsWith('outline')).map(property => [property, rule.style!.getPropertyValue(property), rule.style!.getPropertyPriority(property)]);
          if (outline.length && pseudo(rule.selectorText)) {
            if (matched.length < 32) matched.push({ selector: rule.selectorText, outline, context });
            else overflow++;
          }
        }
        if (rule.cssRules) walk(rule.cssRules, [...context, rule.cssText.slice(0, rule.cssText.indexOf('{')).trim().slice(0, 200)]);
      }
    };
    for (const sheet of document.styleSheets) { try { walk(sheet.cssRules, []); } catch { unreadable++; } }
    const style = getComputedStyle(node);
    return { url: location.pathname + location.search, documentFocus: document.hasFocus(), active: document.activeElement === node, activeTag: document.activeElement?.tagName, focus: pseudo(':focus'), focusVisible: pseudo(':focus-visible'), mozFocusring: pseudo(':-moz-focusring'), class: node.className, attrs: Object.fromEntries([...node.attributes].map(a => [a.name, a.value])), inline: node.getAttribute('style'), outline: { color: style.outlineColor, style: style.outlineStyle, width: style.outlineWidth, offset: style.outlineOffset }, color: style.color, ring: style.getPropertyValue('--ring'), colorRing: style.getPropertyValue('--color-ring'), matched, overflow, unreadable };
  });
}

// Diagnostic only: report selected unchanged native hosts and real text/font/layout state.
export async function buttonGalleryLayoutReceipt(page: Page, indices: number[]) {
  return page.locator(hosts).evaluateAll((nodes, indices) => {
    const rect = (r: DOMRect) => ({ x: r.x, y: r.y, left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height });
    const sourceRules: { selector: string; declarations: string[][]; context: string[] }[] = []; let unreadable = 0;
    const relevant = /^(?:all|font.*|letter-spacing|word-spacing|line-height|text-rendering|text-transform|white-space|(?:min-|max-)?width|padding.*|border.*width|gap|box-sizing|display)$/u;
    const walk = (rules: CSSRuleList, context: string[]) => {
      for (const entry of rules) {
        if (entry instanceof CSSMediaRule && !matchMedia(entry.conditionText).matches) continue;
        if (entry instanceof CSSSupportsRule && !CSS.supports(entry.conditionText)) continue;
        const rule = entry as CSSRule & { selectorText?: string; style?: CSSStyleDeclaration; cssRules?: CSSRuleList };
        if (rule.selectorText && rule.style) {
          const declarations = [...rule.style].filter(property => relevant.test(property)).map(property => [property, rule.style!.getPropertyValue(property), rule.style!.getPropertyPriority(property)]);
          if (declarations.length) sourceRules.push({ selector: rule.selectorText, declarations, context });
        }
        if (rule.cssRules) walk(rule.cssRules, [...context, rule.cssText.slice(0, rule.cssText.indexOf('{')).trim().slice(0, 200)]);
      }
    };
    for (const sheet of document.styleSheets) { try { walk(sheet.cssRules, []); } catch { unreadable++; } }
    const selected = indices.slice(0, 12).map(index => {
      const node = nodes[index] as HTMLElement; const style = getComputedStyle(node);
      const matched = sourceRules.filter(rule => { try { return node.matches(rule.selector); } catch { return false; } });
      const font = style.font || [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(' ');
      let fontCheck: boolean | string;
      try { fontCheck = document.fonts.check(font, node.textContent ?? ''); } catch (error) { fontCheck = String(error); }
      return {
        index, tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(a => [a.name, a.value])), text: node.textContent, lang: node.closest('[lang]')?.getAttribute('lang'), bounds: rect(node.getBoundingClientRect()),
        children: [...node.childNodes].map(child => {
          const range = document.createRange(); range.selectNodeContents(child);
          const result = { type: child.nodeType, text: child.nodeValue, element: child.nodeType === 1 ? (child as Element).outerHTML : null, bounds: rect(range.getBoundingClientRect()), rects: [...range.getClientRects()].map(rect) };
          range.detach(); return result;
        }),
        font, fontCheck, computed: { family: style.fontFamily, size: style.fontSize, weight: style.fontWeight, stretch: style.fontStretch, style: style.fontStyle, variant: style.fontVariant, ligatures: style.fontVariantLigatures, features: style.fontFeatureSettings, variation: style.fontVariationSettings, kerning: style.fontKerning, optical: style.fontOpticalSizing, letter: style.letterSpacing, word: style.wordSpacing, line: style.lineHeight, rendering: style.textRendering, transform: style.textTransform, whiteSpace: style.whiteSpace, display: style.display, gap: style.gap, box: style.boxSizing, paddingLeft: style.paddingLeft, paddingRight: style.paddingRight, borderLeft: style.borderLeftWidth, borderRight: style.borderRightWidth },
        variables: { sans: style.getPropertyValue('--font-sans'), mono: style.getPropertyValue('--font-mono'), heading: style.getPropertyValue('--font-heading') },
        animations: node.getAnimations().map(a => ({ kind: a.constructor.name, state: a.playState, time: a.currentTime })),
        matched: matched.slice(0, 24), matchedOverflow: Math.max(0, matched.length - 24),
      };
    });
    return { url: location.pathname + location.search, documentFocus: document.hasFocus(), activeTag: document.activeElement?.tagName, fontsStatus: document.fonts.status, dpr: devicePixelRatio, viewportScale: visualViewport?.scale, selected, overflow: Math.max(0, indices.length - 12), unreadable };
  }, indices);
}

// Preserve each original direct literal Text node, including standalone JSX spaces.
export async function buttonGalleryTextBoundaries(page: Page) {
  return page.locator(buttonWrapper + ' :is(button, a)').evaluateAll(nodes => nodes.map(node => {
    let slot = 0; const text: [number, string | null][] = [];
    for (const child of node.childNodes) {
      if (child.nodeType === 1) slot++;
      else if (child.nodeType === 3) text.push([slot, child.nodeValue]);
    }
    return { tag: node.localName, text };
  }));
}
