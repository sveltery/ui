// Source-derived assertions executing immutable React wrappers; not copied upstream tests. MIT/provenance: alert-sources.json / LICENSE.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Reference from '../reference/alert';
import { Alert, AlertTitle, AlertDescription, AlertAction } from '../../apps/docs/registry/bases/base/ui/alert/index.js';
import Fixture from './AlertFixture.svelte';
const parts = { Alert, AlertTitle, AlertDescription, AlertAction };
type Part = keyof typeof parts;
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); document.body.replaceChildren(); });
function target() { const node = document.createElement('section'); document.body.append(node); return node; }
function compare(actual: HTMLDivElement, expected: HTMLDivElement) {
  expect(actual.tagName).toBe('DIV'); expect(actual.tagName).toBe(expected.tagName);
  expect(actual.getAttributeNames().sort()).toEqual(expected.getAttributeNames().sort());
  for (const name of expected.getAttributeNames()) expect(name === 'style' ? actual.style.cssText : actual.getAttribute(name), name).toBe(name === 'style' ? expected.style.cssText : expected.getAttribute(name));
  expect(actual.textContent).toBe(expected.textContent);
  expect(actual.hasAttribute('ref')).toBe(false);
}
function reference(part: Part, props: Record<string, unknown>) {
  const node = document.createElement('section'); node.innerHTML = renderToStaticMarkup(createElement(Reference[part], props));
  return node.firstElementChild as HTMLDivElement;
}
for (const part of Object.keys(parts) as Part[]) for (const scenario of ['default', 'consumer', 'undefined-slot', 'null-slot', 'undefined-role', 'null-role', 'array-class'] as const) it(`${part} native host/props/classes match actual pinned wrapper (${scenario})`, async () => {
  const host = target();
  const attrs = scenario === 'default' ? {} : scenario === 'undefined-slot' ? { 'data-slot': undefined } : scenario === 'null-slot' ? { 'data-slot': null } : scenario === 'undefined-role' ? { role: undefined } : scenario === 'null-role' ? { role: null } : scenario === 'array-class' ? { class: ['text-xs', { 'text-lg': true, hidden: false }] } : {
    id: 'consumer-alert', class: 'static w-auto text-lg', 'data-slot': 'consumer-slot', role: 'status' as const,
    title: 'Native & <alert>', 'aria-describedby': 'description', dir: 'rtl' as const, style: 'color: red;', hidden: true,
  };
  mounted.push(mount(parts[part], { target: host, props: attrs })); await tick();
  const { class: className, style, ...props } = attrs;
  compare(host.firstElementChild as HTMLDivElement, reference(part, { ...props, className: scenario === 'array-class' ? 'text-xs text-lg' : className, style: style ? { color: 'red' } : undefined }));
  expect(host.children).toHaveLength(1);
});
for (const variant of ['default', 'destructive', null, undefined] as const) it(`Alert CVA variant (${variant}) matches the pinned root`, async () => {
  const host = target(); mounted.push(mount(Alert, { target: host, props: { variant } })); await tick();
  compare(host.firstElementChild as HTMLDivElement, reference('Alert', { variant }));
  expect(host.firstElementChild!.getAttribute('role')).toBe('alert');
  if (variant === null) expect(host.firstElementChild!.className).toBe('cn-alert group/alert relative w-full');
});
function referenceFixture(part: Part, changed: boolean) {
  return reference(part, { id: 'native-alert', className: changed ? 'relative text-lg w-auto' : 'text-xs', title: changed ? 'Updated & <alert>' : 'Initial & <alert>', 'data-slot': changed ? 'consumer-updated' : 'consumer-initial', children: [changed ? 'Updated message' : 'Initial message', createElement('a', { href: '#native-link', key: 'link' }, 'Details')] });
}
for (const part of Object.keys(parts) as Part[]) for (const initializeNull of [false, true]) it(`${part} reactive native refs/snippets/events/attachment lifecycle (${initializeNull ? 'null' : 'undefined'})`, async () => {
  const host = target(); const instance = mount(Fixture, { target: host, props: { part, initializeNull } }); mounted.push(instance); await tick();
  const div = host.firstElementChild as HTMLDivElement;
  expect(instance.snapshot().initialRef).toBe(initializeNull ? null : undefined);
  expect(instance.snapshot().ref).toBe(div); expect(instance.snapshot().assignments).toEqual([div]);
  expect(instance.snapshot().nodes).toEqual([div]); expect(instance.snapshot().attached).toBe(1);
  compare(div, referenceFixture(part, false));
  div.dispatchEvent(new MouseEvent('click', { bubbles: true })); await tick();
  expect(instance.snapshot().calls).toEqual(['click:initial:DIV']);
  instance.update(); await tick(); compare(div, referenceFixture(part, true));
  expect(host.firstElementChild).toBe(div); expect(instance.snapshot().ref).toBe(div); expect(instance.snapshot().attached).toBe(1);
  div.dispatchEvent(new MouseEvent('click', { bubbles: true })); await tick(); expect(instance.snapshot().calls).toEqual(['click:initial:DIV', 'click:updated:DIV']);
  instance.replaceAttachment(); await tick(); expect(instance.snapshot().ref).toBe(div);
  expect(instance.snapshot().attachmentEvents).toEqual(['attach:0:native-alert', 'detach:0:native-alert', 'attach:1:native-alert']);
  expect(instance.snapshot().attached).toBe(2); expect(instance.snapshot().detached).toBe(1);
  instance.hide(); await tick(); expect(host.children).toHaveLength(0); expect(instance.snapshot().ref).toBeNull(); expect(instance.snapshot().detached).toBe(2);
  instance.show(); await tick(); const reopened = host.firstElementChild as HTMLDivElement;
  expect(reopened).not.toBe(div); expect(instance.snapshot().ref).toBe(reopened); compare(reopened, referenceFixture(part, true));
  expect(instance.snapshot().attached).toBe(3); expect(instance.snapshot().assignments).toEqual([div, null, reopened]);
  mounted.pop(); await unmount(instance); await tick(); expect(instance.snapshot().ref).toBeNull(); expect(instance.snapshot().detached).toBe(3);
  expect(instance.snapshot().assignments).toEqual([div, null, reopened, null]);
});
