// Source-derived styled wrapper tests; genuine Base test ports are separate.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Separator as Reference } from '../reference/separator';
import { Separator } from '../../apps/docs/registry/bases/base/ui/separator/index.js';
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const instance of mounted.splice(0)) await unmount(instance); document.body.replaceChildren(); });
function propsSnapshot(element: Element) { return { tag: element.tagName, attrs: Object.fromEntries([...element.attributes].map(attr => [attr.name, attr.value]).sort()), text: element.textContent }; }
for (const orientation of [undefined, 'horizontal', 'vertical'] as const) it(`styled native Separator matches pinned wrapper ${orientation ?? 'default'}`, async () => {
  const target = document.createElement('section'); document.body.append(target);
  mounted.push(mount(Separator, { target, props: { orientation } })); await tick();
  const expected = document.createElement('section'); expected.innerHTML = renderToStaticMarkup(createElement(Reference, { orientation }));
  expect(propsSnapshot(target.firstElementChild!)).toEqual(propsSnapshot(expected.firstElementChild!));
  expect(target.firstElementChild!.hasAttribute('data-horizontal')).toBe(false);
  expect(target.firstElementChild!.hasAttribute('data-vertical')).toBe(false);
});
it('caller prop precedence and cn class merge match actual source', async () => {
 const target = document.createElement('section'); document.body.append(target);
 const attrs = { orientation: 'vertical' as const, class: ['bg-red-500', { 'w-6': true }], 'data-slot': 'caller-slot', 'data-vertical': '', 'aria-orientation': 'horizontal' as const, role: 'presentation', style: 'color: red' };
 mounted.push(mount(Separator, { target, props: attrs })); await tick();
 const expected = document.createElement('section'); expected.innerHTML = renderToStaticMarkup(createElement(Reference, { ...attrs, className: ['bg-red-500', { 'w-6': true }] as unknown as string, style: { color: 'red' } }));
 expected.firstElementChild!.removeAttribute('class'); // React does not receive the native Svelte class spelling.
 const { class: _class, ...referenceAttrs } = attrs; void _class;
 expected.innerHTML = renderToStaticMarkup(createElement(Reference, { ...referenceAttrs, className: 'bg-red-500 w-6', style: { color: 'red' } }));
 const actual = target.firstElementChild! as HTMLElement; const reference = expected.firstElementChild! as HTMLElement;
 expect(actual.style.cssText).toBe(reference.style.cssText); actual.setAttribute('style', reference.getAttribute('style')!);
 expect(propsSnapshot(actual)).toEqual(propsSnapshot(reference));
});
it('the wrapper preserves cn ignoring source-advertised function classes', async () => {
 const target = document.createElement('section'); document.body.append(target); let calls = 0;
 mounted.push(mount(Separator, { target, props: { class: () => { calls++; return 'source-callback'; } } })); await tick();
 const expected = document.createElement('section'); expected.innerHTML = renderToStaticMarkup(createElement(Reference, { className: () => 'source-callback' }));
 expect(propsSnapshot(target.firstElementChild!)).toEqual(propsSnapshot(expected.firstElementChild!));
 expect(calls).toBe(0); expect(target.querySelector('.source-callback')).toBeNull();
});
