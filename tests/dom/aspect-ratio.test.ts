// Source-derived comparisons executing the immutable React wrapper; no upstream test inventory ported.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AspectRatio as Reference } from '../reference/aspect-ratio';
import { AspectRatio } from '../../apps/docs/registry/bases/base/ui/aspect-ratio/index.js';
import Fixture from './AspectRatioFixture.svelte';
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); document.body.replaceChildren(); });
function target() { const node = document.createElement('section'); document.body.append(node); return node; }
function reference(props: Parameters<typeof Reference>[0]) {
  const node = document.createElement('section'); node.innerHTML = renderToStaticMarkup(createElement(Reference, props)); return node.firstElementChild as HTMLDivElement;
}
function compare(actual: HTMLDivElement, expected: HTMLDivElement) {
  expect(actual.tagName).toBe('DIV'); expect(actual.getAttributeNames().sort()).toEqual(expected.getAttributeNames().sort());
  for (const name of expected.getAttributeNames()) expect(name === 'style' ? actual.style.cssText : actual.getAttribute(name), name).toBe(name === 'style' ? expected.style.cssText : expected.getAttribute(name));
  expect(actual.textContent).toBe(expected.textContent);
}
const cases = [
  { name: '16:9', ratio: 16 / 9 }, { name: '21:9', ratio: 21 / 9 }, { name: '1:1', ratio: 1 }, { name: '9:16', ratio: 9 / 16 },
  { name: 'zero remains unvalidated', ratio: 0 }, { name: 'negative remains unvalidated', ratio: -1 },
  { name: 'props and merged overrides', ratio: 2, id: 'custom', title: 'Ratio & <photo>', 'data-slot': 'custom', 'aria-label': 'Photo', className: 'static aspect-square rounded-lg' },
  { name: 'undefined slot', ratio: 2, 'data-slot': undefined },
  { name: 'unrelated caller style replaces generated ratio', ratio: 2, style: { color: 'red' }, css: 'color: red;' },
  { name: 'caller custom ratio replaces generated ratio', ratio: 2, style: { '--ratio': 3 }, css: '--ratio: 3;' },
  { name: 'caller aspect ratio', ratio: 2, style: { aspectRatio: '4 / 3' }, css: 'aspect-ratio: 4 / 3;' },
  { name: 'explicit undefined style', ratio: 2, style: undefined, css: undefined },
  { name: 'explicit null style', ratio: 2, style: null, css: null },
  { name: 'empty caller style', ratio: 2, style: {}, css: '' },
];
for (const { name, css, ...props } of cases) it(`paired pinned host/classes/style precedence: ${name}`, async () => {
  const host = target(); const { className, ...rest } = props;
  const local = { ...rest, class: className, ...('style' in props ? { style: css } : {}) };
  mounted.push(mount(AspectRatio, { target: host, props: local })); await tick();
  compare(host.firstElementChild as HTMLDivElement, reference(props as Parameters<typeof Reference>[0]));
  expect(host.children).toHaveLength(1); expect(host.firstElementChild!.hasAttribute('ratio')).toBe(false);
});
it('native class arrays and objects retain pinned cn class merging', async () => {
  const host = target(); mounted.push(mount(AspectRatio, { target: host, props: { ratio: 2, class: ['aspect-square', { static: true, hidden: false }] } })); await tick();
  compare(host.firstElementChild as HTMLDivElement, reference({ ratio: 2, className: 'aspect-square static' }));
});
for (const initializeNull of [false, true]) it(`ref, symbol attachment, children, props and cleanup (${initializeNull ? 'null' : 'undefined'})`, async () => {
  const host = target(); const instance = mount(Fixture, { target: host, props: { initializeNull } }); mounted.push(instance); await tick();
  const node = host.querySelector<HTMLDivElement>('#native-ratio')!;
  const expected = (changed: boolean) => reference({ ratio: changed ? 1 : 16 / 9, id: 'native-ratio', className: changed ? 'static aspect-square' : 'rounded-lg', title: changed ? 'Updated ratio' : 'Initial ratio', 'data-slot': changed ? 'consumer-updated' : 'consumer-initial', children: [changed ? 'Updated message' : 'Initial message', createElement('span', { key: 'child' }, 'Child')] });
  compare(node, expected(false)); expect(node.querySelector('span')!.textContent).toBe('Child');
  expect(instance.snapshot().initialRef).toBe(initializeNull ? null : undefined); expect(instance.snapshot().ref).toBe(node); expect(instance.snapshot().assignments).toEqual([node]);
  node.click(); instance.update(); await tick(); compare(node, expected(true)); expect(instance.snapshot().ref).toBe(node); node.click();
  expect(instance.snapshot().calls).toEqual(['click:initial:DIV', 'click:updated:DIV']);
  instance.replaceAttachment(); await tick(); expect(instance.snapshot().attachmentEvents).toEqual(['attach:0:native-ratio', 'detach:0:native-ratio', 'attach:1:native-ratio']);
  instance.hide(); await tick(); expect(instance.snapshot().ref).toBeNull(); expect(instance.snapshot().detached).toBe(2);
  instance.show(); await tick(); const reopened = host.querySelector<HTMLDivElement>('#native-ratio')!; expect(reopened).not.toBe(node); compare(reopened, expected(true));
  expect(instance.snapshot().assignments).toEqual([node, null, reopened]);
  mounted.pop(); await unmount(instance); await tick(); expect(instance.snapshot().ref).toBeNull(); expect(instance.snapshot().assignments).toEqual([node, null, reopened, null]); expect(instance.snapshot().attached).toBe(3); expect(instance.snapshot().detached).toBe(3);
});
