// Authored source-derived witnesses; no ordinary pinned styled Avatar runtime suite exists.
import { expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import * as ts from 'typescript';
import { THEMES } from '../../scripts/theme-assets.mjs';
export const avatarGallery = '[data-slot="example-wrapper"]';
export const avatarHosts = `div:has(> ${avatarGallery}), ${avatarGallery}, ${avatarGallery} *:not(svg):not(svg *)`;
export const avatarStyles = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'];
export const avatarTitles = ['Sizes', 'Badge', 'Badge with Icon', 'Group', 'Group with Count', 'Group with Icon Count', 'In Empty'];
export const portraitPNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==', 'base64');
const originalSource = ts.createSourceFile('avatar-example.tsx', readFileSync(new URL('../reference/avatar-example.tsx', import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
export const avatarOriginalImages: { src: string; alt: string }[] = [];
function imageSources(node: ts.Node) {
  if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(originalSource) === 'AvatarImage') {
    const attribute = (name: string) => {
      const attr = node.attributes.properties.find(prop => ts.isJsxAttribute(prop) && prop.name.getText(originalSource) === name);
      if (!attr || !ts.isJsxAttribute(attr) || !attr.initializer || !ts.isStringLiteral(attr.initializer)) throw new Error(`Original Avatar ${name} must be an authenticated literal`);
      return attr.initializer.text;
    };
    avatarOriginalImages.push({ src: attribute('src'), alt: attribute('alt') });
  }
  ts.forEachChild(node, imageSources);
}
imageSources(originalSource);
if (avatarOriginalImages.length !== 39) throw new Error('Complete original seven-function source must contain 39 literal images');
export async function applyAvatarTheme(page: Page, style: string, dark: boolean) {
  // Direct immutable neutral record input, independent of production theme construction.
  // Original globals alone have foreground0; the actual neutral preset selects foreground0.145.
  const source = THEMES.find(record => record.name === 'neutral')!;
  const tokens = { ...source.cssVars[dark ? 'dark' : 'light'] };
  await page.evaluate(({ style, dark, tokens }) => {
    document.documentElement.className = `style-${style}${dark ? ' dark' : ''}`;
    for (const [name, value] of Object.entries(tokens)) document.documentElement.style.setProperty(`--${name}`, value as string);
  }, { style, dark, tokens });
}
export async function assertOriginalAvatarImages(page: Page) {
  expect(await page.locator(`${avatarGallery} [data-slot="avatar-image"]`).evaluateAll(nodes => nodes.map(node => ({ src: node.getAttribute('src'), alt: node.getAttribute('alt') })))).toEqual(avatarOriginalImages);
}
export async function avatarSnapshot(page: Page) {
  return page.locator(avatarGallery).evaluate(wrapper => {
    const snapshot = (node: Element): unknown => ({ tag: node.tagName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent!.replace(/\s+/gu, ' ').trim()).filter(Boolean), children: [...node.children].map(snapshot) });
    return snapshot(wrapper.parentElement!);
  });
}
export async function avatarMeasurements(page: Page) {
  return page.locator(`${avatarGallery} [data-slot="avatar"], ${avatarGallery} [data-slot="avatar-image"], ${avatarGallery} [data-slot="avatar-fallback"], ${avatarGallery} [data-slot="avatar-badge"], ${avatarGallery} [data-slot="avatar-group"], ${avatarGallery} [data-slot="avatar-group-count"]`).evaluateAll(nodes => nodes.map(node => {
    const css = getComputedStyle(node); const bounds = node.getBoundingClientRect();
    return { tag: node.tagName, slot: node.getAttribute('data-slot'), size: node.getAttribute('data-size'), class: node.getAttribute('class'), width: bounds.width, height: bounds.height, display: css.display, radius: css.borderRadius, font: css.fontSize, lineHeight: css.lineHeight, gap: css.gap, marginLeft: css.marginLeft, color: css.color, background: css.backgroundColor, shadow: css.boxShadow, objectFit: css.objectFit, role: node.getAttribute('role'), tabIndex: (node as HTMLElement).tabIndex, children: [...node.children].map(child => ({ tag: child.tagName, width: child.getBoundingClientRect().width, height: child.getBoundingClientRect().height, display: getComputedStyle(child).display })) };
  }));
}
export async function assertAvatarGallery(page: Page, width: number) {
  const wrapper = page.locator(avatarGallery); await expect(wrapper).toHaveCount(1);
  expect(await wrapper.evaluate(node => ({ tag: node.tagName, names: node.getAttributeNames().sort(), shell: node.parentElement!.tagName, shellClass: node.parentElement!.className, columns: getComputedStyle(node).gridTemplateColumns.split(' ').length }))).toEqual({ tag: 'DIV', names: ['class', 'data-slot'], shell: 'DIV', shellClass: 'w-full bg-muted dark:bg-background', columns: width >= 768 ? 2 : 1 });
  const examples = wrapper.locator(':scope > [data-slot="example"]'); await expect(examples).toHaveCount(7);
  expect(await examples.evaluateAll(nodes => nodes.map(node => node.firstElementChild!.textContent))).toEqual(avatarTitles);
  expect(await examples.evaluateAll(nodes => nodes.map(node => ({ tag: node.tagName, children: node.children.length, title: node.firstElementChild!.tagName, content: node.lastElementChild!.getAttribute('data-slot'), bodyChildren: node.lastElementChild!.children.length })))).toEqual([2, 2, 2, 3, 3, 3, 1].map(bodyChildren => ({ tag: 'DIV', children: 2, title: 'DIV', content: 'example-content', bodyChildren })));
  await expect(wrapper.locator('[data-slot="avatar"]')).toHaveCount(48);
  await expect(wrapper.locator('[data-slot="avatar-badge"]')).toHaveCount(12);
  await expect(wrapper.locator('[data-slot="avatar-group"]')).toHaveCount(10);
  await expect(wrapper.locator('[data-slot="avatar-group-count"]')).toHaveCount(7);
  expect(await wrapper.locator('section, h2, [data-gallery], [data-supplemental]').count()).toBe(0);
  const roots = await wrapper.locator('[data-slot="avatar"]').evaluateAll(nodes => nodes.map(node => ({ tag: node.tagName, size: node.getAttribute('data-size'), width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height, role: node.getAttribute('role'), tabIndex: (node as HTMLElement).tabIndex })));
  for (const root of roots) { expect(root.tag).toBe('SPAN'); expect(root.width).toBe({ sm: 24, default: 32, lg: 40 }[root.size!]); expect(root.height).toBe(root.width); expect(root.role).toBeNull(); expect(root.tabIndex).toBe(-1); }
  const badges = await wrapper.locator('[data-slot="avatar-badge"]').evaluateAll(nodes => nodes.map(node => ({ size: node.parentElement!.getAttribute('data-size'), width: node.getBoundingClientRect().width, tag: node.tagName, svg: node.querySelector('svg') ? getComputedStyle(node.querySelector('svg')!).display : null })));
  for (const badge of badges) { expect(badge.tag).toBe('SPAN'); expect(badge.width).toBe({ sm: 8, default: 10, lg: 12 }[badge.size!]); if (badge.size === 'sm' && badge.svg !== null) expect(badge.svg).toBe('none'); }
}
export async function avatarState(page: Page) {
  return JSON.parse(await page.getByTestId('avatar-state').innerText()) as { refs: (string | null)[]; attached: number; cleaned: number; statuses: string[]; clicks: string[] };
}
export async function assertAvatarStaleCompletion(page: Page) {
  // OLD valid completion after NEW invalid completion discriminates a stale-owner bug.
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  let intercepted = 0;
  await page.route('**/avatar-second.png', async route => { intercepted++; await gate; await route.fulfill({ status: 200, contentType: 'image/png', body: portraitPNG }); });
  try {
    await page.goto('/avatar-probe'); await expect(page.locator('#probe-avatar-1')).toBeVisible();
    await page.getByRole('button', { name: 'Replace Avatar source', exact: true }).click();
    await expect.poll(() => intercepted).toBe(1); await expect(page.locator('#probe-avatar-2')).toBeVisible();
    await page.getByRole('button', { name: 'Fail Avatar source', exact: true }).click();
    await expect.poll(async () => (await avatarState(page)).statuses.at(-1)).toBe('error');
    const before = await avatarState(page); const response = page.waitForResponse(value => value.url().endsWith('/avatar-second.png'));
    release(); await (await response).finished();
    // Wait genuine rendering turns after the completed old network response, no timers/controller shim.
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    expect((await avatarState(page)).statuses).toEqual(before.statuses); await expect(page.locator('#probe-avatar-1')).toHaveCount(0);
    await expect(page.locator('#probe-avatar-2')).toHaveText('CN <portrait>');
    expect((await avatarState(page)).refs).toEqual(before.refs);
  } finally { release(); }
}
export async function assertAvatarLifecycle(page: Page) {
  await page.goto('/avatar-probe'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  const image = page.locator('#probe-avatar-1'); await expect(image).toBeVisible(); await expect(page.locator('#probe-avatar-2')).toHaveCount(0);
  expect(await image.evaluate(async node => { const image = node as HTMLImageElement; await image.decode(); return { complete: image.complete, width: image.naturalWidth, alt: image.alt }; })).toEqual({ complete: true, width: 1, alt: 'Actual decoded portrait' });
  const initial = await avatarState(page); expect(initial.refs).toEqual(['probe-avatar-0', 'probe-avatar-1', null, 'probe-avatar-3', 'probe-avatar-4', 'probe-avatar-5']); expect(initial.statuses.at(-1)).toBe('loaded');
  const root = await page.locator('#probe-avatar-0').elementHandle(); expect(root).not.toBeNull();
  await page.locator('#probe-avatar-0').click(); await page.getByRole('button', { name: 'Update Avatar', exact: true }).click();
  await expect(page.locator('#probe-avatar-0')).toHaveAttribute('data-size', 'sm');
  expect(await root!.evaluate(node => node === document.getElementById('probe-avatar-0') && node.isConnected)).toBe(true);
  expect(await page.locator('#probe-avatar-0').evaluate(node => ({ width: node.getBoundingClientRect().width, radius: getComputedStyle(node).borderRadius }))).toEqual({ width: 48, radius: '0px' });
  expect((await avatarState(page)).clicks).toEqual(['probe-avatar-0']);
  await page.getByRole('button', { name: 'Replace Avatar source', exact: true }).click(); await expect(image).toHaveAttribute('src', '/avatar-second.png');
  await image.evaluate(node => (node as HTMLImageElement).decode());
  await page.getByRole('button', { name: 'Fail Avatar source', exact: true }).click(); await expect(page.locator('#probe-avatar-2')).toHaveText('CN <portrait>'); await expect(image).toHaveCount(0);
  const failed = await avatarState(page); expect(failed.statuses.slice(-2)).toEqual(['loading', 'error']); expect(failed.refs[2]).toBe('probe-avatar-2');
  // Real static image cache is warmed by the initial load, without intercepted routes.
  await page.getByRole('button', { name: 'Restore cached Avatar', exact: true }).click(); await expect(image).toHaveAttribute('src', '/avatar-probe.png'); await image.evaluate(node => (node as HTMLImageElement).decode());
  expect((await avatarState(page)).statuses.at(-1)).toBe('loaded');
  await page.getByRole('button', { name: 'Toggle Avatar', exact: true }).click(); await expect(page.locator('#probe-avatar-0')).toHaveCount(0);
  const removed = await avatarState(page); expect(removed.refs).toEqual(Array(6).fill(null)); expect(removed.cleaned).toBe(removed.attached);
  await page.getByRole('button', { name: 'Toggle Avatar', exact: true }).click(); await expect(image).toBeVisible();
  expect(await root!.evaluate(node => !node.isConnected && node !== document.getElementById('probe-avatar-0'))).toBe(true);
  const rebuilt = await avatarState(page); expect(rebuilt.attached).toBeGreaterThan(removed.attached); expect(rebuilt.statuses.at(-1)).toBe('loaded');
  const renderedImage = page.locator('#render-avatar-image'); await expect(renderedImage).toBeVisible();
  expect(await renderedImage.evaluate(async node => { await (node as HTMLImageElement).decode(); return (node as HTMLImageElement).naturalWidth; })).toBe(1);
  const renderState = async () => JSON.parse(await page.getByTestId('avatar-render-state').innerText()) as { refs: (string | null)[]; attached: number; cleaned: number };
  expect((await renderState()).refs).toEqual(['render-avatar-root', 'render-avatar-image', null]);
  await page.getByRole('button', { name: 'Change rendered Avatar source', exact: true }).click();
  await expect(page.locator('#render-avatar-fallback')).toHaveText('Rendered CN'); await expect(renderedImage).toHaveCount(0);
  expect((await renderState()).refs).toEqual(['render-avatar-root', null, 'render-avatar-fallback']);
  await page.getByRole('button', { name: 'Toggle rendered Avatar', exact: true }).click();
  await expect(page.locator('#render-avatar-root')).toHaveCount(0);
  const renderRemoved = await renderState(); expect(renderRemoved.refs).toEqual([null, null, null]); expect(renderRemoved.cleaned).toBe(renderRemoved.attached);
}
