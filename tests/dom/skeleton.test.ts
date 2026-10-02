// Source-derived local tests against actual pinned sources; no upstream test suite was identified.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { Skeleton as Reference } from '../reference/skeleton';
import { Skeleton } from '../../apps/docs/registry/bases/base/ui/skeleton/index.js';
import Fixture from './SkeletonFixture.svelte';
import Example from '../../apps/docs/examples/base/SkeletonExample.svelte';
import { SkeletonGallery } from '../reference/SkeletonGallery';
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); document.body.replaceChildren(); });
function target() { const node = document.createElement('section'); document.body.append(node); return node; }
it('immutable Skeleton sources, unchanged selected example bodies and scoped Nova retain provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/skeleton-sources.json', 'utf8'));
  expect(pin.commit).toBe('d75a96ab781f3d659be1ad287347d5887ce9f2fc');
  for (const file of [...pin.files, pin.license]) expect(createHash('sha256').update(readFileSync(file.local)).digest('hex')).toBe(file.sha256);
  const full = readFileSync('tests/reference/skeleton-example.tsx', 'utf8');
  const selected = readFileSync('tests/reference/skeleton-selected-examples.tsx', 'utf8');
  for (const name of ['Avatar', 'Card', 'Text', 'Form', 'Table']) {
    const start = full.indexOf(`function Skeleton${name}()`); const end = full.indexOf('\nfunction ', start + 1);
    expect(selected).toContain(full.slice(start, end < 0 ? undefined : end).trimEnd());
  }
  expect(readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8')).toContain(readFileSync('tests/reference/skeleton-nova.css', 'utf8').trimEnd());
});
for (const attrs of [{}, { class: 'h-8 w-32 rounded-none animate-none', 'data-slot': 'custom', id: 'placeholder', title: 'Loading', role: 'status', 'aria-busy': 'true' as const, 'aria-label': 'Progress', tabIndex: 0, dir: 'rtl' as const, hidden: true, style: 'width: 77px;' }]) it(`native div and class/prop precedence match pinned wrapper: ${JSON.stringify(attrs)}`, async () => {
  const node = target(); mounted.push(mount(Skeleton, { target: node, props: attrs })); await tick();
  const reference = document.createElement('section'); const { class: className, style, ...props } = attrs;
  reference.innerHTML = renderToStaticMarkup(createElement(Reference, { ...props, className, style: style ? { width: '77px' } : undefined }));
  const actual = node.querySelector('div')!; const expected = reference.querySelector('div')!;
  expect(actual.tagName).toBe(expected.tagName); expect(actual.textContent).toBe(expected.textContent); expect(actual.getAttributeNames().sort()).toEqual(expected.getAttributeNames().sort());
  for (const name of expected.getAttributeNames()) expect(name === 'style' ? actual.style.cssText : actual.getAttribute(name), name).toBe(name === 'style' ? expected.style.cssText : expected.getAttribute(name));
});
it('Svelte class arrays/objects keep pinned cn conflicts', async () => {
  const node = target(); mounted.push(mount(Skeleton, { target: node, props: { class: ['w-40', { 'w-32': true, 'w-64': false }, 'animate-none'] } })); await tick();
  expect(node.querySelector('div')!.className).toBe('cn-skeleton w-32 animate-none');
});
it('undefined ref, symbol attachment, children, native events and reactive declaration cleanup', async () => {
  const component = mount(Fixture, { target: target() }); mounted.push(component); await tick();
  const host = document.getElementById('bound-skeleton')!;
  expect(component.snapshot().ref).toBe(host); expect(component.snapshot().attached).toBe(1);
  expect(host.title).toBe('Initial placeholder');
  const reference = document.createElement('section'); reference.innerHTML = renderToStaticMarkup(createElement(Reference, { children: 'Initial' }));
  expect(host.textContent).toBe(reference.querySelector('div')!.textContent);
  host.click(); expect(component.snapshot().calls).toEqual(['attach:bound-skeleton', 'click']);
  component.update(); await tick();
  expect(component.snapshot().ref).toBe(host); expect(host.title).toBe('Updated placeholder'); expect(host.textContent).toBe('Updated');
  expect(host.className).toBe('cn-skeleton h-8 w-32 rounded-none animate-none'); expect(component.snapshot().attached).toBe(1);
  component.remove(); await tick(); expect(component.snapshot().ref).toBeNull(); expect(component.snapshot().detached).toBe(1);
  component.show(); await tick(); expect(component.snapshot().ref).not.toBe(host); expect(component.snapshot().attached).toBe(2);
  await unmount(component); mounted.pop(); expect(component.snapshot().ref).toBeNull(); expect(component.snapshot().detached).toBe(2);
});
it('bounded examples preserve actual pinned avatar/card/text/form/table native structure and classes', async () => {
  const node = target(); mounted.push(mount(Example, { target: node })); await tick();
  const reference = document.createElement('section'); reference.innerHTML = renderToStaticMarkup(createElement(SkeletonGallery));
  function tree(root: Element) { return [...root.children].map(section => ({ title: section.querySelector('h2')?.textContent, descendants: [...section.querySelectorAll('*')].map(child => ({ tag: child.tagName, class: child.getAttribute('class'), slot: child.getAttribute('data-slot'), text: child.tagName === 'H2' ? child.textContent : null })) })); }
  expect(tree(node.querySelector('[data-gallery]')!)).toEqual(tree(reference.querySelector('[data-gallery]')!));
  expect(node.querySelectorAll('[data-slot=skeleton]')).toHaveLength(24);
  expect(node.querySelectorAll('[data-slot]')).toHaveLength(43);
  const card = node.querySelector('[data-slot=card]')!;
  expect(card.tagName).toBe('DIV'); expect(card.className).toBe('cn-card group/card flex flex-col w-full'); expect(card.getAttribute('data-size')).toBe('default');
  expect([...card.children].map(child => child.getAttribute('data-slot'))).toEqual(['card-header', 'card-content']);
  expect([...card.querySelectorAll('[data-slot=skeleton]')].map(child => ({ tag: child.tagName, class: child.className, text: child.textContent }))).toEqual([
    { tag: 'DIV', class: 'cn-skeleton animate-pulse h-4 w-2/3', text: '' },
    { tag: 'DIV', class: 'cn-skeleton animate-pulse h-4 w-1/2', text: '' },
    { tag: 'DIV', class: 'cn-skeleton animate-pulse aspect-square w-full', text: '' },
  ]);
  expect(node.querySelectorAll('input, button, table, [role]')).toHaveLength(0);
});
