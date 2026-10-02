// Source-derived comparisons execute the immutable upstream scaffold; no upstream test inventory claim.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Example as Reference, ExampleWrapper as ReferenceWrapper } from '../reference/example-scaffold';
import { ExampleProbe as ReferenceProbe } from '../reference/ExampleProbe';
import { Example, ExampleWrapper } from '../../apps/docs/registry/bases/base/ui/example/index.js';
import Probe from '../../apps/docs/examples/base/ExampleProbe.svelte';
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); document.body.replaceChildren(); });
function target() { const node = document.createElement('section'); document.body.append(node); return node; }
function tree(node: Element): unknown {
  const attrs = Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.name === 'style' ? (node as HTMLElement).style.cssText : attr.value]));
  return { tag: node.tagName, attrs, text: node.children.length ? null : node.textContent, children: [...node.children].map(tree) };
}
for (const title of [undefined, '', 'Title & <draft>']) it(`Example native tree/title/class-container/prop precedence match pinned source: ${JSON.stringify(title)}`, async () => {
  const node = target();
  mounted.push(mount(Example, { target: node, props: { title, class: 'gap-2 p-4', containerClassName: 'max-w-md', id: 'outer', 'data-slot': 'custom-example', style: 'color: rgb(1, 2, 3)' } })); await tick();
  const reference = document.createElement('section'); reference.innerHTML = renderToStaticMarkup(createElement(Reference, { title, className: 'gap-2 p-4', containerClassName: 'max-w-md', id: 'outer', 'data-slot': 'custom-example', style: { color: 'rgb(1, 2, 3)' } }));
  expect(tree(node.firstElementChild!)).toEqual(tree(reference.firstElementChild!));
  const outer = node.firstElementChild!;
  expect(outer.hasAttribute('title')).toBe(false); expect(outer.hasAttribute('containerClassName')).toBe(false);
  expect(outer.classList.contains('max-w-md')).toBe(true); expect(outer.classList.contains('p-4')).toBe(false);
  expect(outer.querySelector('[data-slot=example-content]')!.classList.contains('p-4')).toBe(true);
  expect(outer.children).toHaveLength(title ? 2 : 1); expect(outer.querySelectorAll('h1,h2,h3,section')).toHaveLength(0);
});
it('ExampleWrapper keeps fixed shell and applies merged classes/attributes to inner div', async () => {
  const node = target(); mounted.push(mount(ExampleWrapper, { target: node, props: { class: ['p-8', { 'gap-4': true }], title: 'Native title', id: 'inner', 'data-slot': 'custom-wrapper' } })); await tick();
  const expected = document.createElement('section'); expected.innerHTML = renderToStaticMarkup(createElement(ReferenceWrapper, { className: 'p-8 gap-4', title: 'Native title', id: 'inner', 'data-slot': 'custom-wrapper' }));
  expect(tree(node.firstElementChild!)).toEqual(tree(expected.firstElementChild!));
  expect(node.firstElementChild!.className).toBe('w-full bg-muted dark:bg-background');
  expect(node.firstElementChild!.getAttributeNames()).toEqual(['class']);
  expect(node.querySelector('#inner')!.classList.contains('p-4')).toBe(false);
});
it('actual snippet composition, undefined/null refs, reactive title/classes, attachments replacement and cleanup', async () => {
  const node = target(); const component = mount(Probe, { target: node }); mounted.push(component); await tick();
  const wrapper = node.querySelector('#probe-wrapper')!; const example = node.querySelector('#probe-example')!;
  const expected = document.createElement('section'); expected.innerHTML = renderToStaticMarkup(createElement(ReferenceProbe));
  expect(tree(wrapper.parentElement!)).toEqual(tree(expected.firstElementChild!));
  const click = async (text: string) => { (Array.from(node.querySelectorAll('button')).find(button => button.textContent === text)!).click(); await tick(); };
  await click('Inspect example'); expect(node.querySelector('output')!.textContent).toBe('{"wrapper":"probe-wrapper","example":"probe-example","attached":2,"cleaned":0,"clicks":0}');
  example.dispatchEvent(new MouseEvent('click', { bubbles: true })); await tick();
  await click('Update example'); expect(node.querySelector('#probe-wrapper')).toBe(wrapper); expect(node.querySelector('#probe-example')).toBe(example);
  expect(example.children).toHaveLength(1); expect(example.classList.contains('max-w-none')).toBe(true);
  expect(example.querySelector('[data-slot=example-content]')!.classList.contains('p-8')).toBe(true);
  await click('Replace attachments'); await click('Inspect example'); expect(node.querySelector('output')!.textContent).toBe('{"wrapper":"probe-wrapper","example":"probe-example","attached":4,"cleaned":2,"clicks":1}');
  expect(node.querySelector('#probe-example')).toBe(example);
  await click('Toggle example'); await click('Inspect example'); expect(node.querySelector('output')!.textContent).toBe('{"wrapper":null,"example":null,"attached":4,"cleaned":4,"clicks":1}');
  await click('Toggle example'); await click('Inspect example'); expect(node.querySelector('output')!.textContent).toBe('{"wrapper":"probe-wrapper","example":"probe-example","attached":6,"cleaned":4,"clicks":1}');
  expect(node.querySelector('#probe-example')).not.toBe(example);
});
