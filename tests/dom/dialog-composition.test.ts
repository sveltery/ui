// Source-derived integration assertions, not copied ordinary upstream tests.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HugeiconsIcon } from '@hugeicons/react';
import Fixture from './DialogCompositionFixture.svelte';
import { iconLibraries } from '../../apps/docs/registry/bases/base/ui/icons/index.js';
import { loadIcon } from '../../apps/docs/registry/bases/base/ui/icons/data.js';
import { loadLibrary } from '../reference/icons/load-library';
const mounted: ReturnType<typeof mount>[] = [];
const names = { lucide: 'XIcon', tabler: 'IconX', hugeicons: 'Cancel01Icon', phosphor: 'XIcon', remixicon: 'RiCloseLine' };
async function settle() { await tick(); await new Promise(resolve => setTimeout(resolve, 70)); await tick(); }
function setup(props: Parameters<typeof Fixture>[1] = {}) {
  const host = document.createElement('div'); document.body.append(host);
  const fixture = mount(Fixture, { target: host, props }); mounted.push(fixture); return fixture;
}
afterEach(async () => { for (const fixture of mounted.splice(0)) await unmount(fixture); document.body.replaceChildren(); });
function geometry(element: Element): unknown { return { tag: element.localName, namespace: element.namespaceURI, attributes: Object.fromEntries(Array.from(element.attributes, attr => [attr.name, attr.value])), text: element.children.length ? undefined : element.textContent, children: Array.from(element.children, geometry) }; }
it('both built-in closes use one canonical native Button with original slots, variants and children', async () => {
  const fixture = setup(); await settle();
  const popup = fixture.observed().popup!;
  const contentClose = popup.querySelector<HTMLButtonElement>('.cn-dialog-close')!;
  const footerClose = popup.querySelector<HTMLButtonElement>('[data-slot=dialog-footer] button')!;
  expect(popup.querySelectorAll('button')).toHaveLength(2);
  expect(popup.querySelector('button button')).toBeNull();
  for (const button of [contentClose, footerClose]) {
    expect(button.tagName).toBe('BUTTON'); expect(button.type).toBe('button'); expect(button.tabIndex).toBe(0);
    expect(button.classList.contains('cn-button')).toBe(true);
  }
  expect(contentClose.dataset.slot).toBe('dialog-close');
  expect(contentClose.classList.contains('cn-button-variant-ghost')).toBe(true);
  expect(contentClose.classList.contains('cn-button-size-icon-sm')).toBe(true);
  expect(contentClose.querySelector('.sr-only')!.textContent).toBe('Close');
  expect(contentClose.querySelector('svg')!.hasAttribute('aria-hidden')).toBe(false);
  expect(footerClose.dataset.slot).toBe('button');
  expect(footerClose.getAttribute('tabindex')).toBe('0');
  expect(footerClose.classList.contains('cn-button-variant-outline')).toBe(true);
  expect(footerClose.classList.contains('cn-button-size-default')).toBe(true);
  expect(footerClose.textContent?.trim()).toBe('Close');
  expect(popup.querySelector('[data-testid=owner-child]')!.textContent).toBe('Owner content');
});
for (const library of iconLibraries) it(`Content selects the original ${library} name and matches its genuine React icon geometry`, async () => {
  const fixture = setup(); await settle();
  fixture.setLibrary(library);
  const [, reference] = await Promise.all([loadIcon(library, names[library]), loadLibrary(library)]); await settle();
  const svg = fixture.observed().popup!.querySelector('.cn-dialog-close svg')!;
  expect(svg).not.toBeNull(); expect(svg.getAttribute(library)).toBe(names[library]);
  expect(svg.querySelector('path, line, rect, circle, polyline, polygon, ellipse, g')).not.toBeNull();
  expect(svg.hasAttribute('aria-hidden')).toBe(false);
  expect(svg.classList.contains('lucide-square')).toBe(false);
  const icon = reference[names[library] as keyof typeof reference];
  const expected = document.createElement('div');
  expected.innerHTML = renderToStaticMarkup(createElement(library === 'hugeicons' ? HugeiconsIcon : icon, { ...names, ...(library === 'hugeicons' ? { icon, strokeWidth: 2 } : {}) } as never));
  expect(geometry(svg), library).toEqual(geometry(expected.querySelector('svg')!));
});
it('changing between all five original icon libraries preserves the actual composed Close Button host', async () => {
  const fixture = setup(); await settle();
  const close = fixture.observed().popup!.querySelector('.cn-dialog-close')!;
  for (const library of iconLibraries) {
    fixture.setLibrary(library); await loadIcon(library, names[library]); await settle();
    expect(fixture.observed().popup!.querySelector('.cn-dialog-close')).toBe(close);
    expect(close.querySelector('svg')!.getAttribute(library)).toBe(names[library]);
  }
});
for (const custom of [false, true]) for (const close of ['content', 'footer']) it(`rendered ${close} Button preserves cancellation, one close request, supplied children and attachment cleanup (custom=${custom})`, async () => {
  const fixture = setup({ custom }); await settle();
  const popup = fixture.observed().popup!;
  if (custom) expect(popup.hasAttribute('data-replacement')).toBe(true);
  expect(popup.querySelector('[data-testid=owner-child]')).not.toBeNull();
  expect(fixture.observed().attachments).toBe(2);
  const button = popup.querySelector<HTMLButtonElement>(close === 'content' ? '.cn-dialog-close' : '[data-slot=dialog-footer] button')!;
  fixture.setCancel(true); await tick(); button.click(); await settle();
  expect(fixture.observed().changes).toEqual(['close-press']); expect(fixture.observed().popup).toBe(popup);
  expect(fixture.observed().cleanups).toBe(0);
  fixture.setCancel(false); await tick(); button.click(); await settle();
  expect(fixture.observed().changes).toEqual(['close-press', 'close-press']); expect(fixture.observed().open).toBe(false);
  expect(fixture.observed().popup).toBeNull(); expect(fixture.observed().footer).toBeNull();
  expect(fixture.observed().cleanups).toBe(2); expect(document.querySelector('[data-base-ui-portal]')).toBeNull();
});
for (const contentClose of [false, true]) for (const footerClose of [false, true]) it(`original close branches omit whole compositions (Content=${contentClose}; Footer=${footerClose})`, async () => {
  const fixture = setup({ contentClose, footerClose }); await settle();
  const popup = fixture.observed().popup!;
  expect(popup.querySelectorAll('button')).toHaveLength(Number(contentClose) + Number(footerClose));
  expect(!!popup.querySelector('.cn-dialog-close')).toBe(contentClose);
  expect(!!popup.querySelector('[data-slot=dialog-footer] button')).toBe(footerClose);
  fixture.remove(); await settle(); expect(fixture.observed().popup).toBeNull(); expect(fixture.observed().cleanups).toBe(2);
});
