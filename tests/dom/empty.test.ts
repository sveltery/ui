// Source-derived paired assertions execute pinned wrappers, not an upstream test inventory.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Reference from '../reference/empty';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from '../../apps/docs/registry/bases/base/ui/empty/index.js';
import Fixture from './EmptyFixture.svelte';
const parts = { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia };
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); document.body.replaceChildren(); });
function target() { const node = document.createElement('section'); document.body.append(node); return node; }
function attributes(actual: HTMLElement, expected: HTMLElement) {
  expect(actual.tagName).toBe(expected.tagName); expect(actual.tagName).toBe('DIV');
  expect(actual.getAttributeNames().sort()).toEqual(expected.getAttributeNames().sort());
  for (const name of expected.getAttributeNames()) expect(name === 'style' ? actual.style.cssText : actual.getAttribute(name), name).toBe(name === 'style' ? expected.style.cssText : expected.getAttribute(name));
}
for (const [name, Local] of Object.entries(parts)) {
  for (const attrs of [{}, { class: 'grid items-end text-left max-w-lg flex-row px-6', 'data-slot': 'custom', title: 'Empty & <draft>', 'aria-label': 'Empty details', tabIndex: 2, dir: 'rtl' as const, hidden: true, style: 'color: red;' }, { 'data-slot': undefined }, { 'data-slot': null }]) {
    it(`${name} matches pinned native div, classes and spread precedence: ${JSON.stringify(attrs)}`, async () => {
      const node = target(); mounted.push(mount(Local, { target: node, props: attrs })); await tick();
      const { class: className, style, ...props } = attrs;
      const reference = document.createElement('section'); reference.innerHTML = renderToStaticMarkup(createElement(Reference[name as keyof typeof parts], { ...props, className, style: style ? { color: 'red' } : undefined }));
      attributes(node.firstElementChild as HTMLElement, reference.firstElementChild as HTMLElement);
      expect(node.querySelector('[role]')).toBeNull(); expect(node.firstElementChild!.hasAttribute('ref')).toBe(false);
    });
  }
}
for (const props of [{ variant: undefined }, { variant: 'default' }, { variant: 'icon' }, { variant: null }, { variant: 'icon', 'data-variant': 'custom', 'data-slot': 'consumer-media' }, { variant: 'icon', 'data-variant': undefined }, { variant: 'icon', 'data-variant': null }]) {
  it(`EmptyMedia retains pinned variant default and native data-variant spread: ${JSON.stringify(props)}`, async () => {
    const node = target(); mounted.push(mount(EmptyMedia, { target: node, props: props as never })); await tick();
    const reference = document.createElement('section'); reference.innerHTML = renderToStaticMarkup(createElement(Reference.EmptyMedia, props as never));
    attributes(node.firstElementChild as HTMLElement, reference.firstElementChild as HTMLElement);
    expect(node.firstElementChild!.hasAttribute('variant')).toBe(false);
  });
}
it('Svelte class arrays/objects retain pinned class-conflict resolution', async () => {
  const node = target(); mounted.push(mount(Empty, { target: node, props: { class: ['grid', { 'flex-row': true, 'px-3': false }, 'flex-col px-6'] } })); await tick();
  expect(node.firstElementChild!.className).toBe('cn-empty w-full min-w-0 flex-1 items-center justify-center text-center text-balance grid flex-col px-6');
});
it('six actual div hosts accept undefined/null refs, replaced symbol attachments, reactive children and native events with cleanup', async () => {
  const component = mount(Fixture, { target: target() }); mounted.push(component); await tick();
  const hosts = [...document.querySelectorAll<HTMLDivElement>('[id^=bound-empty-]')];
  expect(hosts).toHaveLength(6); expect(component.snapshot()).toEqual({ refs: hosts, attached: 6, detached: 0, clicks: [] });
  for (const [index, host] of hosts.entries()) { expect(host.textContent).toBe(`Initial & <Empty> ${index}`); expect(host.title).toBe(`Initial & <Empty> ${index}`); expect(host.dataset.attached).toBe('true'); host.click(); }
  expect(component.snapshot().clicks).toEqual(hosts.map(host => host.id));
  component.update(); await tick(); expect(component.snapshot().refs).toEqual(hosts); expect(component.snapshot().attached).toBe(6);
  for (const [index, host] of hosts.entries()) { expect(host.textContent).toBe(`Updated & <Empty> ${index}`); expect(host.title).toBe(`Updated & <Empty> ${index}`); expect(host.classList.contains('px-6')).toBe(true); expect(host.classList.contains('px-3')).toBe(false); }
  component.swap(); await tick(); expect(component.snapshot().refs).toEqual(hosts); expect(component.snapshot().attached).toBe(12); expect(component.snapshot().detached).toBe(6);
  component.remove(); await tick(); expect(component.snapshot().refs).toEqual(Array(6).fill(null)); expect(component.snapshot().detached).toBe(12);
  component.show(); await tick(); const next = [...document.querySelectorAll<HTMLDivElement>('[id^=bound-empty-]')];
  expect(component.snapshot().refs).toEqual(next); expect(component.snapshot().attached).toBe(18); for (const [index, host] of next.entries()) expect(host).not.toBe(hosts[index]);
  await unmount(component); mounted.pop(); expect(component.snapshot().refs).toEqual(Array(6).fill(null)); expect(component.snapshot().detached).toBe(18);
});
