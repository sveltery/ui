// Authored source-derived gallery witnesses, not copied ordinary shadcn tests.
// The unchanged original URL uses deterministic authored SVG bytes for decode/layout;
// this does not certify original assets, Next optimization, cache or image API.
import { expect, type Page } from '@playwright/test';
import { cn } from 'cn';
import { THEMES } from '../../scripts/theme-assets.mjs';

export const aspectGallery = '[data-slot="example-wrapper"]';
export const aspectGalleryHosts = `div:has(> ${aspectGallery}), ${aspectGallery}, ${aspectGallery} *`;
export const aspectTitles = ['16:9', '21:9', '1:1', '9:16'];
export const aspectRatios = [16 / 9, 21 / 9, 1 / 1, 9 / 16];
export const aspectStyles = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'];
const wrapperClass = cn('mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:p-12 2xl:max-w-6xl', 'max-w-4xl 2xl:max-w-4xl');
const contentClass = "flex min-w-0 flex-1 flex-col items-start gap-6 rounded-xl bg-card p-12 text-foreground style-lyra:rounded-none style-sera:rounded-none *:[div:not([class*='w-'])]:w-full";

export async function aspectImages(page: Page) {
  await page.route('https://avatar.vercel.sh/shadcn1', route => route.fulfill({ contentType: 'image/svg+xml', headers: { 'cache-control': 'no-store' }, body: '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><rect width="100" height="100" fill="red"/><rect x="100" width="100" height="100" fill="blue"/></svg>' }));
}
export async function aspectGallerySnapshot(page: Page) {
  return page.locator(aspectGallery).evaluate(wrapper => {
    const snapshot = (node: Element): unknown => ({ tag: node.tagName, attrs: Object.fromEntries([...node.attributes].filter(attr => attr.name !== 'style').map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), style: (node as HTMLElement).style.cssText, text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent!.trim()).filter(Boolean), children: [...node.children].map(snapshot) });
    return snapshot(wrapper.parentElement!);
  });
}
export async function aspectTheme(page: Page, style: string, dark: boolean) {
  // Direct complete immutable Neutral consumer input, not the production theme builder.
  const tokens = { ...THEMES.find(record => record.name === 'neutral')!.cssVars[dark ? 'dark' : 'light'] };
  await page.evaluate(({ style, dark, tokens }) => {
    document.documentElement.className = `style-${style}${dark ? ' dark' : ''}`;
    for (const [name, value] of Object.entries(tokens)) document.documentElement.style.setProperty(`--${name}`, value as string);
  }, { style, dark, tokens });
}
export async function aspectGalleryMeasurements(page: Page) {
  return page.locator(aspectGalleryHosts).evaluateAll(nodes => nodes.map(node => {
    const css = getComputedStyle(node); const rect = node.getBoundingClientRect();
    return { tag: node.tagName, slot: node.getAttribute('data-slot'), class: node.getAttribute('class'), width: rect.width, height: rect.height, display: css.display, position: css.position, minHeight: css.minHeight, maxWidth: css.maxWidth, gridColumns: css.gridTemplateColumns, gap: css.gap, padding: css.padding, margin: css.margin, align: css.alignItems, justify: css.justifyContent, radius: css.borderRadius, background: css.backgroundColor, color: css.color, font: css.fontSize, weight: css.fontWeight, lineHeight: css.lineHeight, aspect: css.aspectRatio, filter: css.filter, objectFit: css.objectFit, overflow: css.overflow, z: css.zIndex };
  }));
}
export async function assertAspectGallery(page: Page, width: number, height: number, style = 'nova') {
  const wrapper = page.locator(aspectGallery); await expect(wrapper).toHaveCount(1);
  expect(await page.locator(aspectGalleryHosts).count()).toBe(22);
  expect(await wrapper.evaluate(node => ({ tag: node.tagName, names: node.getAttributeNames().sort(), class: node.className, shell: node.parentElement!.tagName, shellClass: node.parentElement!.className, shellNames: node.parentElement!.getAttributeNames().sort(), width: node.getBoundingClientRect().width, maxWidth: getComputedStyle(node).maxWidth, minHeight: getComputedStyle(node).minHeight, columns: getComputedStyle(node).gridTemplateColumns.split(' ').length, gap: getComputedStyle(node).gap, padding: getComputedStyle(node).padding, available: node.parentElement!.parentElement!.clientWidth - parseFloat(getComputedStyle(node.parentElement!.parentElement!).paddingLeft) - parseFloat(getComputedStyle(node.parentElement!.parentElement!).paddingRight) }))).toEqual({ tag: 'DIV', names: ['class', 'data-slot'], class: wrapperClass, shell: 'DIV', shellClass: 'w-full bg-muted dark:bg-background', shellNames: ['class'], width: Math.min(width - 64, 896), maxWidth: '896px', minHeight: `${height}px`, columns: width >= 768 ? 2 : 1, gap: width >= 640 && width < 768 ? '48px' : '32px', padding: width >= 1024 ? '48px' : width >= 640 ? '24px' : '8px 16px 16px', available: width - 64 });
  const examples = wrapper.locator(':scope > [data-slot="example"]'); await expect(examples).toHaveCount(4);
  expect(await examples.evaluateAll(nodes => nodes.map(node => ({ tag: node.tagName, names: node.getAttributeNames().sort(), class: node.className, children: node.children.length, title: node.firstElementChild!.textContent, titleTag: node.firstElementChild!.tagName, titleNames: node.firstElementChild!.getAttributeNames().sort(), titleClass: node.firstElementChild!.className })))).toEqual(aspectTitles.map(title => ({ tag: 'DIV', names: ['class', 'data-slot'], class: 'mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none', children: 2, title, titleTag: 'DIV', titleNames: ['class'], titleClass: 'px-1.5 py-2 text-xs font-medium text-muted-foreground' })));
  for (const [index, example] of (await examples.all()).entries()) {
    const content = example.locator(':scope > [data-slot="example-content"]');
    await expect(content).toHaveClass(cn(contentClass, index === 2 ? 'items-start' : 'items-center justify-center'));
    expect(await content.evaluate(node => ({ tag: node.tagName, names: node.getAttributeNames().sort(), children: node.children.length, padding: getComputedStyle(node).padding, gap: getComputedStyle(node).gap, radius: getComputedStyle(node).borderRadius }))).toEqual({ tag: 'DIV', names: ['class', 'data-slot'], children: 1, padding: '48px', gap: '24px', radius: ['lyra', 'sera'].includes(style) ? '0px' : '14px' });
    const ratio = content.locator(':scope > [data-slot="aspect-ratio"]');
    await expect(ratio).toHaveClass('relative aspect-(--ratio) rounded-lg bg-muted style-luma:rounded-3xl');
    const geometry = await ratio.evaluate(node => { const rect = node.getBoundingClientRect(); const parent = node.parentElement!; return { tag: node.tagName, ratio: (node as HTMLElement).style.getPropertyValue('--ratio'), aspect: getComputedStyle(node).aspectRatio, width: rect.width, height: rect.height, innerWidth: parent.getBoundingClientRect().width - parseFloat(getComputedStyle(parent).paddingLeft) - parseFloat(getComputedStyle(parent).paddingRight), radius: getComputedStyle(node).borderRadius, children: node.children.length }; });
    expect(geometry.tag).toBe('DIV'); expect(Number(geometry.ratio)).toBe(aspectRatios[index]); expect(geometry.width).toBeCloseTo(geometry.innerWidth, 4); expect(geometry.width / geometry.height).toBeCloseTo(aspectRatios[index], 2); expect(geometry.children).toBe(1);
    expect(geometry.radius).toBe(style === 'luma' ? '22px' : '10px');
    const image = ratio.locator(':scope > img'); await expect(image).toHaveAttribute('src', 'https://avatar.vercel.sh/shadcn1'); await expect(image).toHaveAttribute('alt', 'Photo'); await expect(image).toHaveClass('h-full w-full rounded-lg object-cover grayscale dark:brightness-20 style-luma:rounded-3xl');
    const decoded = await image.evaluate(async node => { const img = node as HTMLImageElement; await img.decode(); const box = img.getBoundingClientRect(); const css = getComputedStyle(img); return { width: box.width, height: box.height, complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, position: css.position, fit: css.objectFit, radius: css.borderRadius, filter: css.filter, left: css.left, top: css.top, role: img.getAttribute('role'), tab: img.tabIndex }; });
    expect(decoded).toMatchObject({ width: geometry.width, height: geometry.height, complete: true, naturalWidth: 200, naturalHeight: 100, position: 'absolute', fit: 'cover', radius: geometry.radius, left: '0px', top: '0px', role: null, tab: -1 });
    expect(decoded.filter).toBe(await page.evaluate(() => document.documentElement.classList.contains('dark')) ? 'brightness(0.2) grayscale(1)' : 'grayscale(1)');
    // Real unequal intrinsic/rendered ratios exercise cover cropping, rather than
    // merely checking class strings or an unloaded-image box.
    const coverScale = Math.max(decoded.width / decoded.naturalWidth, decoded.height / decoded.naturalHeight);
    // Division followed by multiplication can round down by one IEEE754 ULP
    // (actual Firefox111.38333129882811 versus111.38333129882812). Bound
    // only this derived arithmetic by two machine epsilons, not visual geometry.
    for (const [intrinsic, dimension] of [[decoded.naturalWidth, decoded.width], [decoded.naturalHeight, decoded.height]]) {
      const scaled = intrinsic * coverScale;
      const roundingBound = 2 * Number.EPSILON * Math.max(Math.abs(scaled), Math.abs(dimension));
      expect(scaled).toBeGreaterThanOrEqual(dimension - roundingBound);
    }
    await image.scrollIntoViewIfNeeded();
    expect(await image.evaluate(node => { const r = node.getBoundingClientRect(); const x = Math.min(innerWidth - 1, Math.max(1, r.x + r.width / 2)); const y = Math.min(innerHeight - 1, Math.max(1, r.y + r.height / 2)); return document.elementFromPoint(x, y) === node; })).toBe(true);
  }
  expect(await wrapper.locator('section, h2, [data-gallery], [data-aspect-ratio-gallery], [data-supplemental]').count()).toBe(0);
}
