// Authored strict genuine-source witnesses; no upstream ordinary-suite credit or image substitution.
import { expect, type Page } from '@playwright/test';
import { kbdTheme } from './kbd-gallery-cases';
export const cardImageWrapper = '[data-slot=example-wrapper]';
export const cardImageHosts = 'div:has(> ' + cardImageWrapper + '), ' + cardImageWrapper + ', ' + cardImageWrapper + ' *';
export const cardImageLibraries = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
export const cardImageStyles = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'];
export const cardImageURL = 'https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
export const cardImageHydrated = 'main[data-hydrated], main > div > div[data-hydrated], main > div[data-hydrated]';
export async function settleCardImages(page: Page) {
  await expect(page.locator(cardImageWrapper + ' svg')).toHaveCount(2);
  await expect(page.locator(cardImageWrapper + ' svg.lucide-square')).toHaveCount(0);
  const images = page.locator(cardImageWrapper + ' img'); await expect(images).toHaveCount(2);
  // Real original URL and original binaries. Decode failures remain gate failures.
  await images.evaluateAll(async nodes => {
    await Promise.all(nodes.map(async node => { const image = node as HTMLImageElement; await image.decode(); if (!image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) throw new Error('Original Card image did not decode'); }));
  });
}
export async function cardImageTheme(page: Page, style: string, dark: boolean) {
  await kbdTheme(page, style, dark);
  await page.locator(cardImageWrapper + ' button').evaluateAll(async nodes => {
    for (const node of nodes) void getComputedStyle(node).color;
    await Promise.all(nodes.flatMap(node => node.getAnimations()).filter(animation => animation instanceof CSSTransition).map(animation => animation.finished));
  });
}
export async function cardImageTree(page: Page) {
  return page.locator(cardImageWrapper).evaluate(wrapper => {
    const text = (node: Element) => {
      let slot = 0; const records: [number, string | null][] = [];
      for (const child of node.childNodes) {
        if (child.nodeType === 1) slot++;
        else if (child.nodeType === 3 && (/\S/u.test(child.nodeValue!) || node.localName === 'button')) records.push([slot, child.nodeValue]);
      }
      return records;
    };
    const tree = (node: Element): unknown => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), text: text(node), children: [...node.children].map(tree) });
    return tree(wrapper.parentElement!);
  });
}
export async function cardImageTextBounds(page: Page) {
  return page.locator(cardImageWrapper + ' button').evaluateAll(nodes => nodes.map(node => {
    let slot = 0; const text = [];
    const rect = (box: DOMRect) => ({ x: box.x - node.getBoundingClientRect().x, y: box.y - node.getBoundingClientRect().y, width: box.width, height: box.height });
    for (const child of node.childNodes) {
      if (child.nodeType === 1) slot++;
      else if (child.nodeType === 3) { const range = document.createRange(); range.selectNodeContents(child); text.push({ slot, bytes: child.nodeValue, bounds: rect(range.getBoundingClientRect()), rects: [...range.getClientRects()].map(rect) }); range.detach(); }
    }
    return text;
  }));
}
export async function assertCardImages(page: Page) {
  await settleCardImages(page);
  const wrapper = page.locator(cardImageWrapper); await expect(wrapper).toBeVisible();
  await expect(wrapper.locator(':scope > [data-slot=example]')).toHaveCount(2);
  expect(await wrapper.locator(':scope > [data-slot=example]').evaluateAll(nodes => nodes.map(n => n.firstElementChild!.textContent))).toEqual(['With Image', 'With Image (Small)']);
  const cards = wrapper.locator('[data-slot=card]'); await expect(cards).toHaveCount(2);
  expect(await cards.evaluateAll(nodes => nodes.map(n => n.getAttribute('data-size')))).toEqual(['default', 'sm']);
  for (const [index, size] of ['default', 'sm'].entries()) {
    const card = cards.nth(index); await expect(card).toHaveClass('cn-card group/card flex flex-col relative mx-auto w-full max-w-sm pt-0');
    expect(await card.evaluate(node => [...node.children].map(n => n.localName))).toEqual(['div', 'img', 'div', 'div']);
    const image = card.locator(':scope > img'); await expect(image).toHaveAttribute('src', cardImageURL);
    await expect(image).toHaveAttribute('alt', 'Photo by mymind on Unsplash'); await expect(image).toHaveAttribute('title', 'Photo by mymind on Unsplash');
    await expect(image).toHaveClass('relative z-20 aspect-video w-full object-cover brightness-60 grayscale');
    expect(await image.evaluate(node => node.matches(':first-child,:last-child'))).toBe(false);
    expect(await image.evaluate(node => ['loading', 'width', 'height', 'sizes', 'srcset'].filter(name => node.hasAttribute(name)))).toEqual([]);
    expect(await card.locator(':scope > div').first().getAttribute('class')).toBe('absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color');
    await expect(card.locator('[data-slot=card-title]')).toHaveText('Beautiful Landscape');
    await expect(card.locator('[data-slot=card-description]')).toHaveText('A stunning view that captures the essence of natural beauty.');
    const button = card.locator('button'); await expect(button).toHaveAttribute('type', 'button'); await expect(button).toHaveAttribute('tabindex', '0');
    await expect(button).toHaveAttribute('data-slot', 'button'); expect(await button.evaluate((node, value) => node.classList.contains('cn-button-size-' + value), size)).toBe(true);
    expect(await button.evaluate(node => (node as HTMLButtonElement).disabled)).toBe(false);
    expect(await button.evaluate(node => { let slot = 0; const values: [number, string | null][] = []; for (const child of node.childNodes) { if (child.nodeType === 1) slot++; else if (child.nodeType === 3) values.push([slot, child.nodeValue]); } return values; })).toEqual([[1, 'Button']]);
    await expect(button.locator('svg')).toHaveAttribute('data-icon', 'inline-start');
  }
  await expect(wrapper.locator('section,h2,[data-supplemental],[data-testid]')).toHaveCount(0);
}
export async function cardImageMeasurements(page: Page) {
  return page.locator(cardImageWrapper).evaluate(wrapper => {
    const origin = wrapper.getBoundingClientRect(); const rect = (box: DOMRect) => ({ x: box.x - origin.x, y: box.y - origin.y, width: box.width, height: box.height });
    const properties = ['display', 'position', 'z-index', 'aspect-ratio', 'width', 'height', 'max-width', 'min-height', 'gap', 'grid-template-columns', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-top-color', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius', 'overflow-x', 'overflow-y', 'background-color', 'color', 'font-family', 'font-size', 'font-weight', 'font-stretch', 'line-height', 'letter-spacing', 'text-transform', 'text-align', 'object-fit', 'object-position', 'filter', 'opacity', 'mix-blend-mode', 'box-shadow'];
    const nodes = [wrapper.parentElement!, wrapper, ...wrapper.querySelectorAll('*')];
    return nodes.map(node => {
      const style = getComputedStyle(node);
      const image = node.localName === 'img' ? node as HTMLImageElement : null;
      return { tag: node.localName, class: node.getAttribute('class'), bounds: rect(node.getBoundingClientRect()), css: Object.fromEntries(properties.map(property => [property, style.getPropertyValue(property)])), image: image ? { complete: image.complete, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, src: image.getAttribute('src'), currentSrc: image.currentSrc } : null };
    });
  });
}
export async function assertCardImageGeometry(page: Page) {
  const cards = page.locator(cardImageWrapper + ' [data-slot=card]');
  const spacing: Record<string, [string, string]> = { vega: ['24px', '16px'], nova: ['16px', '12px'], maia: ['24px', '16px'], lyra: ['16px', '12px'], mira: ['16px', '12px'], luma: ['24px', '16px'], sera: ['32px', '20px'], rhea: ['20px', '16px'] };
  const style = await page.evaluate(() => [...document.documentElement.classList].find(name => /^style-/u.test(name))!.slice(6));
  for (const [index, card] of (await cards.all()).entries()) {
    const measured = await card.evaluate(node => {
      const css = getComputedStyle(node); const image = node.children[1]; const overlay = node.children[0];
      const i = image.getBoundingClientRect(); const o = overlay.getBoundingClientRect();
      return { card: { overflow: css.overflow, paddingTop: css.paddingTop, gap: css.gap }, image: { width: i.width, height: i.height, position: getComputedStyle(image).position, z: getComputedStyle(image).zIndex, fit: getComputedStyle(image).objectFit, filter: getComputedStyle(image).filter }, overlay: { width: o.width, height: o.height, position: getComputedStyle(overlay).position, z: getComputedStyle(overlay).zIndex, opacity: getComputedStyle(overlay).opacity, blend: getComputedStyle(overlay).mixBlendMode, aspect: getComputedStyle(overlay).aspectRatio } };
    });
    expect(measured.card).toEqual({ overflow: 'hidden', paddingTop: '0px', gap: spacing[style][index] });
    expect(measured.image.width).toBeGreaterThan(0); expect(measured.image.height).toBeGreaterThan(0);
    expect(measured.image.position).toBe('relative'); expect(measured.image.z).toBe('20'); expect(measured.image.fit).toBe('cover'); expect(measured.image.filter).toBe('brightness(0.6) grayscale(1)');
    expect(measured.overlay.width).toBeGreaterThan(0); expect(measured.overlay.height).toBeGreaterThan(0);
    expect({ ...measured.overlay, width: undefined, height: undefined }).toEqual({ width: undefined, height: undefined, position: 'absolute', z: '30', opacity: '0.5', blend: 'color', aspect: '16 / 9' });
    // Overlay dimensions follow actual original layout, not an invented inset/aspect solution; the complete paired measurement retains both dimensions.
    // Literal CSS ratio is asserted; exact renderer dimensions compare independently to original.
    expect(await card.locator('img').evaluate(node => getComputedStyle(node).aspectRatio)).toBe('16 / 9');
  }
}
