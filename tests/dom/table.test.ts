// Source-derived local comparisons, not copied upstream tests. Exact sources and MIT: table-sources.json / reference/LICENSE.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount, type Component } from 'svelte';
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Reference from '../reference/table';
import * as UI from '../../apps/docs/registry/bases/base/ui/table/index.js';
import Fixture from './TableFixture.svelte';

const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); document.body.replaceChildren(); });
function target(tag = 'section') { const node = document.createElement(tag); document.body.append(node); return node; }
function compare(actual: Element, expected: Element) {
  expect(actual.tagName).toBe(expected.tagName);
  expect(actual.getAttributeNames().sort()).toEqual(expected.getAttributeNames().sort());
  for (const name of expected.getAttributeNames()) {
    expect(name === 'style' ? (actual as HTMLElement).style.cssText : actual.getAttribute(name), `${actual.tagName} ${name}`).toBe(name === 'style' ? (expected as HTMLElement).style.cssText : expected.getAttribute(name));
  }
  // Svelte source indentation adds whitespace between child elements; compare
  // every non-whitespace direct text node and retain exact leaf snippet text.
  const directText = (node: Element) => Array.from(node.childNodes).filter(child => child.nodeType === Node.TEXT_NODE && (node.children.length === 0 || child.textContent!.trim() !== '')).map(child => child.textContent).join('');
  expect(directText(actual)).toBe(directText(expected));
  expect(actual.children.length).toBe(expected.children.length);
  Array.from(expected.children).forEach((child, index) => compare(actual.children[index], child));
}
const parts = [
  ['Table', 'table', 'section'],
  ['TableHeader', 'thead', 'table'],
  ['TableBody', 'tbody', 'table'],
  ['TableFooter', 'tfoot', 'table'],
  ['TableRow', 'tr', 'tbody'],
  ['TableHead', 'th', 'tr'],
  ['TableCell', 'td', 'tr'],
  ['TableCaption', 'caption', 'table'],
] as const;

for (const [name, tag, parent] of parts) {
  for (const scenario of ['default', 'consumer', 'undefined-slot'] as const) it(`${name} native host/props/classes match the actual pinned wrapper (${scenario})`, async () => {
    const host = target(parent);
    const attrs = scenario === 'default' ? {} : scenario === 'undefined-slot' ? { 'data-slot': undefined } : {
      id: `test-${tag}`, class: 'px-2 px-6 font-bold', 'data-slot': 'consumer-slot', title: 'Native table part',
      'aria-describedby': 'description', dir: 'rtl' as const, style: 'color: red;',
      ...(tag === 'th' ? { scope: 'col', colspan: 2, rowspan: 3, abbr: 'Invoice' } : {}),
      ...(tag === 'td' ? { colspan: 2, rowspan: 3, headers: 'heading' } : {}),
      ...(tag === 'table' ? { 'aria-label': 'Invoices' } : {}),
      ...(tag === 'tr' ? { 'data-state': 'selected', 'aria-expanded': 'true' } : {}),
    };
    mounted.push(mount(UI[name] as unknown as Component<Record<string, unknown>>, { target: host, props: attrs })); await tick();
    const { class: className, style, ...props } = attrs;
    const expected = document.createElement(parent);
    expected.innerHTML = renderToStaticMarkup(createElement(Reference[name] as ComponentType<Record<string, unknown>>, { ...props, className, style: style ? { color: 'red' } : undefined }));
    const actual = host.querySelector(tag)!;
    compare(actual, expected.querySelector(tag)!);
    if (name === 'Table') {
      const container = actual.parentElement!;
      expect(container.getAttributeNames().sort()).toEqual(['class', 'data-slot']);
      expect(container.className).toBe('cn-table-container');
      expect(container.dataset.slot).toBe('table-container');
      expect(container.parentElement).toBe(host);
      compare(container, expected.firstElementChild!);
    }
  });
}

function referenceFixture(changed: boolean) {
  const common = { className: changed ? 'px-6 font-bold' : 'px-2', title: changed ? 'Updated' : 'Initial', 'data-slot': changed ? 'consumer-updated' : 'consumer-initial' };
  const spans = { colSpan: changed ? 3 : 2, rowSpan: changed ? 2 : 1 };
  return createElement(Reference.Table, { id: 'native-table', ...common },
    createElement(Reference.TableCaption, { id: 'native-caption', ...common }, changed ? 'Updated caption' : 'Initial caption'),
    createElement(Reference.TableHeader, { id: 'native-header', ...common },
      createElement(Reference.TableRow, null, createElement(Reference.TableHead, { id: 'native-head', ...common, ...spans, scope: 'col' }, 'Invoice'))),
    createElement(Reference.TableBody, { id: 'native-body', ...common },
      createElement(Reference.TableRow, { id: 'native-row', ...common, 'data-state': changed ? 'selected' : undefined },
        createElement(Reference.TableCell, { id: 'native-cell', ...common, ...spans, headers: 'native-head' }, changed ? 'Updated invoice' : 'Initial invoice'))),
    createElement(Reference.TableFooter, { id: 'native-footer', ...common }, createElement(Reference.TableRow, null, createElement(Reference.TableCell, null, 'Total'))));
}

for (const initializeNull of [false, true]) it(`all eight refs/attachments bind, survive reactive native props and clean up (${initializeNull ? 'null' : 'undefined'} initialization)`, async () => {
  const host = target();
  const instance = mount(Fixture, { target: host, props: { initializeNull } }); mounted.push(instance); await tick();
  const original = instance.snapshot().refs;
  expect(Object.keys(original)).toHaveLength(8);
  for (const [name, node] of Object.entries(original)) expect(node, name).toBe(host.querySelector(`#native-${name}`));
  expect(instance.snapshot().attached).toBe(8); expect(instance.snapshot().detached).toBe(0);
  expect(new Set(instance.snapshot().nodes)).toEqual(new Set(Object.values(original)));
  const expected = document.createElement('section');
  expected.innerHTML = renderToStaticMarkup(referenceFixture(false));
  compare(host.firstElementChild!, expected.firstElementChild!);
  instance.update(); await tick();
  expected.innerHTML = renderToStaticMarkup(referenceFixture(true));
  compare(host.firstElementChild!, expected.firstElementChild!);
  expect(instance.snapshot().refs).toEqual(original);
  expect(instance.snapshot().attached).toBe(8); expect(instance.snapshot().detached).toBe(0);
  const expectedCalls: string[] = [];
  for (const node of Object.values(original)) {
    const path: HTMLElement[] = [];
    for (let ancestor = node; ancestor; ancestor = ancestor.parentElement) if (Object.values(original).includes(ancestor)) path.push(ancestor);
    node!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    node!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expectedCalls.push(...path.map(part => `click:${part.tagName}`), ...path.map(part => `key:${part.tagName}:Enter`));
  }
  expect(instance.snapshot().calls).toEqual(expectedCalls);
  instance.hide(); await tick();
  expect(host.querySelector('table')).toBeNull();
  expect(Object.values(instance.snapshot().refs)).toEqual(Array(8).fill(null));
  expect(instance.snapshot().attached).toBe(8); expect(instance.snapshot().detached).toBe(8);
  instance.show(); await tick();
  expect(instance.snapshot().attached).toBe(16); expect(instance.snapshot().detached).toBe(8);
  for (const [name, node] of Object.entries(instance.snapshot().refs)) { expect(node).toBe(host.querySelector(`#native-${name}`)); expect(node).not.toBe(original[name as keyof typeof original]); }
  mounted.pop(); await unmount(instance); await tick();
  expect(Object.values(instance.snapshot().refs)).toEqual(Array(8).fill(null));
  expect(instance.snapshot().detached).toBe(16);
});

it('replacing a symbol-keyed attachment cleans and reattaches all eight native hosts without replacing hosts or refs', async () => {
  const host = target();
  const instance = mount(Fixture, { target: host }); mounted.push(instance); await tick();
  const original = instance.snapshot().refs;
  const names = Object.keys(original);
  const expectedEvents = (kind: string, version: number) => names.map(name => `${kind}:${version}:native-${name}`).sort();
  const events = (kind: string, version: number) => instance.snapshot().attachmentEvents.filter(event => event.startsWith(`${kind}:${version}:`)).sort();
  expect(events('attach', 0)).toEqual(expectedEvents('attach', 0));
  instance.replaceAttachment(); await tick();
  expect(instance.snapshot().refs).toEqual(original);
  for (const [name, node] of Object.entries(original)) expect(host.querySelector(`#native-${name}`)).toBe(node);
  expect(instance.snapshot().attached).toBe(16); expect(instance.snapshot().detached).toBe(8);
  expect(events('detach', 0)).toEqual(expectedEvents('detach', 0));
  expect(events('attach', 1)).toEqual(expectedEvents('attach', 1));
  expect(events('detach', 1)).toEqual([]);
  expect(new Set(instance.snapshot().nodes)).toEqual(new Set(Object.values(original)));
  instance.update(); await tick();
  expect(instance.snapshot().refs).toEqual(original);
  expect(instance.snapshot().attached).toBe(16); expect(instance.snapshot().detached).toBe(8);
  instance.hide(); await tick();
  expect(Object.values(instance.snapshot().refs)).toEqual(Array(8).fill(null));
  expect(instance.snapshot().detached).toBe(16);
  expect(events('detach', 0)).toEqual(expectedEvents('detach', 0));
  expect(events('detach', 1)).toEqual(expectedEvents('detach', 1));
  for (const name of names) expect(instance.snapshot().attachmentEvents.filter(event => event.endsWith(`:native-${name}`))).toEqual([
    `attach:0:native-${name}`, `detach:0:native-${name}`, `attach:1:native-${name}`, `detach:1:native-${name}`,
  ]);
  mounted.pop(); await unmount(instance); await tick();
  expect(instance.snapshot().detached).toBe(16);
});

it('native Svelte class arrays/objects merge through the same pinned cn helper', async () => {
  const host = target();
  mounted.push(mount(UI.Table, { target: host, props: { class: ['px-2', { 'px-6': true, hidden: false }] } })); await tick();
  const expected = document.createElement('section');
  expected.innerHTML = renderToStaticMarkup(createElement(Reference.Table, { className: 'px-2 px-6' }));
  compare(host.firstElementChild!, expected.firstElementChild!);
});
