// Source-derived paired assertions execute pinned wrappers, not an upstream test inventory.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Reference from '../reference/card';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '../../apps/docs/registry/bases/base/ui/card/index.js';
import Fixture from './CardFixture.svelte';
import Gallery from '../../apps/docs/examples/base/CardExample.svelte';
import { CardGallery } from '../reference/CardGallery';
const parts = { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter };
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); document.body.replaceChildren(); });
function target() { const node = document.createElement('section'); document.body.append(node); return node; }
function attributes(actual: HTMLElement, expected: HTMLElement) {
  expect(actual.tagName).toBe(expected.tagName); expect(actual.tagName).toBe('DIV');
  expect(actual.getAttributeNames().sort()).toEqual(expected.getAttributeNames().sort());
  for (const name of expected.getAttributeNames()) expect(name === 'style' ? actual.style.cssText : actual.getAttribute(name), name).toBe(name === 'style' ? expected.style.cssText : expected.getAttribute(name));
}
it('seven selected galleries retain genuine shell/grid/title/content/native Card/Button trees', async () => {
  const node = target(); mounted.push(mount(Gallery, { target: node })); await tick();
  const reference = target(); reference.innerHTML = renderToStaticMarkup(createElement(CardGallery));
  const selector = '[data-slot="example-wrapper"]';
  const actual = node.querySelector(selector)!; const expected = reference.querySelector(selector)!;
  expect(actual).not.toBeNull(); expect(expected).not.toBeNull();
  const snapshot = (host: Element): unknown => ({ tag: host.tagName, attrs: Object.fromEntries([...host.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...host.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent!.replace(/\s+/gu, ' ').trim()).filter(Boolean), children: [...host.children].map(snapshot) });
  expect(snapshot(actual.parentElement!)).toEqual(snapshot(expected.parentElement!));
  expect(actual.parentElement!.className).toBe('w-full bg-muted dark:bg-background');
  expect(actual.children).toHaveLength(7);
  expect([...actual.children].map(example => ({ tag: example.tagName, slot: example.getAttribute('data-slot'), titleTag: example.firstElementChild!.tagName, title: example.firstElementChild!.textContent, content: example.lastElementChild!.getAttribute('data-slot') }))).toEqual(['Default Size', 'Small Size', 'Content Edge to Edge', 'Header with Border', 'Footer with Border', 'Header with Border (Small)', 'Footer with Border (Small)'].map(title => ({ tag: 'DIV', slot: 'example', titleTag: 'DIV', title, content: 'example-content' })));
  expect(actual.querySelectorAll('section,h2,[data-supplemental]')).toHaveLength(0);
  expect(actual.parentElement!.querySelectorAll('[data-slot]')).toHaveLength(55);
  expect(actual.querySelectorAll('[data-slot="example-content"] [data-slot]')).toHaveLength(40);
  expect(actual.parentElement!.querySelectorAll('*').length).toBe(expected.parentElement!.querySelectorAll('*').length);
  for (const name of ['action', 'override']) expect(snapshot(node.querySelector(`[data-supplemental="${name}"]`)!)).toEqual(snapshot(reference.querySelector(`[data-supplemental="${name}"]`)!));
});
for (const [name, Local] of Object.entries(parts)) {
  for (const attrs of [{}, { class: 'block grid grid-cols-3 items-end self-end row-start-3 px-6', 'data-slot': 'custom', title: 'Card & <draft>', 'aria-label': 'Card details', tabIndex: 2, dir: 'rtl' as const, hidden: true, style: 'color: red;' }]) {
    it(`${name} matches pinned native div, classes and spread precedence: ${JSON.stringify(attrs)}`, async () => {
      const node = target(); mounted.push(mount(Local, { target: node, props: attrs })); await tick();
      const { class: className, style, ...props } = attrs;
      const reference = document.createElement('section'); reference.innerHTML = renderToStaticMarkup(createElement(Reference[name as keyof typeof parts], { ...props, className, style: style ? { color: 'red' } : undefined }));
      attributes(node.firstElementChild as HTMLElement, reference.firstElementChild as HTMLElement);
      expect(node.querySelector('[role]')).toBeNull(); expect(node.firstElementChild!.hasAttribute('ref')).toBe(false);
    });
  }
}
for (const props of [{ size: undefined }, { size: 'default' }, { size: 'sm' }, { size: null }, { size: 'sm', 'data-size': 'custom', 'data-slot': 'consumer-card' }, { size: 'sm', 'data-size': undefined }, { size: 'sm', 'data-size': null }]) {
  it(`Card retains pinned size default and native data-size spread: ${JSON.stringify(props)}`, async () => {
    const node = target(); mounted.push(mount(Card, { target: node, props: props as never })); await tick();
    const reference = document.createElement('section'); reference.innerHTML = renderToStaticMarkup(createElement(Reference.Card, props as never));
    attributes(node.firstElementChild as HTMLElement, reference.firstElementChild as HTMLElement);
    expect(node.firstElementChild!.hasAttribute('size')).toBe(false);
  });
}
it('Svelte class arrays/objects retain pinned class-conflict resolution', async () => {
  const node = target(); mounted.push(mount(Card, { target: node, props: { class: ['grid', { 'flex-row': true, 'px-3': false }, 'flex-col px-6'] } })); await tick();
  expect(node.firstElementChild!.className).toBe('cn-card group/card grid flex-col px-6');
});
it('all seven hosts accept undefined/null refs, symbol attachments, reactive declarations, children and native events with complete cleanup', async () => {
  const component = mount(Fixture, { target: target() }); mounted.push(component); await tick();
  const hosts = [...document.querySelectorAll<HTMLDivElement>('[id^=bound-card-]')];
  expect(hosts).toHaveLength(7); expect(component.snapshot()).toEqual({ refs: hosts, attached: 7, detached: 0, clicks: [] });
  for (const [index, host] of hosts.entries()) { expect(host.textContent).toBe(`Initial & <Card> ${index}`); expect(host.title).toBe(`Initial & <Card> ${index}`); expect(host.dataset.attached).toBe('true'); host.click(); }
  expect(component.snapshot().clicks).toEqual(hosts.map(host => host.id));
  component.update(); await tick();
  expect(component.snapshot().refs).toEqual(hosts); expect(component.snapshot().attached).toBe(7);
  for (const [index, host] of hosts.entries()) { expect(host.textContent).toBe(`Updated & <Card> ${index}`); expect(host.title).toBe(`Updated & <Card> ${index}`); expect(host.classList.contains('px-6')).toBe(true); expect(host.classList.contains('px-3')).toBe(false); }
  component.remove(); await tick(); expect(component.snapshot().refs).toEqual(Array(7).fill(null)); expect(component.snapshot().detached).toBe(7);
  component.show(); await tick(); const next = [...document.querySelectorAll<HTMLDivElement>('[id^=bound-card-]')];
  expect(component.snapshot().refs).toEqual(next); expect(component.snapshot().attached).toBe(14); for (const [index, host] of next.entries()) expect(host).not.toBe(hosts[index]);
  await unmount(component); mounted.pop(); expect(component.snapshot().refs).toEqual(Array(7).fill(null)); expect(component.snapshot().detached).toBe(14);
});
