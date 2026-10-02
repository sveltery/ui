// Source-derived local comparisons, not copied upstream tests. Exact sources and MIT: label-sources.json / reference/LICENSE.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Label as ReferenceLabel } from '../reference/label';
import { Label } from '../../apps/docs/registry/bases/base/ui/label/index.js';
import Fixture from './LabelFixture.svelte';
import AssociationFixture from './LabelAssociationFixture.svelte';

const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); document.body.replaceChildren(); });
function target() { const node = document.createElement('section'); document.body.append(node); return node; }
function compare(actual: HTMLLabelElement, expected: HTMLLabelElement) {
  expect(actual.tagName).toBe('LABEL');
  expect(actual.tagName).toBe(expected.tagName);
  expect(actual.getAttributeNames().sort()).toEqual(expected.getAttributeNames().sort());
  for (const name of expected.getAttributeNames()) expect(name === 'style' ? actual.style.cssText : actual.getAttribute(name), name).toBe(name === 'style' ? expected.style.cssText : expected.getAttribute(name));
  expect(actual.textContent).toBe(expected.textContent);
}
function reference(props: Parameters<typeof ReferenceLabel>[0]) {
  const node = document.createElement('section'); node.innerHTML = renderToStaticMarkup(createElement(ReferenceLabel, props));
  return node.firstElementChild as HTMLLabelElement;
}

for (const scenario of ['default', 'consumer', 'undefined-slot'] as const) it(`native label host/props/classes match the actual pinned wrapper (${scenario})`, async () => {
  const host = target();
  const attrs = scenario === 'default' ? {} : scenario === 'undefined-slot' ? { 'data-slot': undefined } : {
    id: 'consumer-label', for: 'consumer-control', class: 'inline-block items-start select-text', 'data-slot': 'consumer-slot',
    title: 'Native label', 'aria-describedby': 'description', dir: 'rtl' as const, style: 'color: red;',
  };
  mounted.push(mount(Label, { target: host, props: attrs })); await tick();
  const { class: className, for: htmlFor, style, ...props } = attrs;
  compare(host.firstElementChild as HTMLLabelElement, reference({ ...props, className, htmlFor, style: style ? { color: 'red' } : undefined }));
  expect(host.firstElementChild!.hasAttribute('role')).toBe(false);
  expect(host.children).toHaveLength(1);
});

it('native Svelte class arrays/objects merge through the same pinned cn helper', async () => {
  const host = target();
  mounted.push(mount(Label, { target: host, props: { class: ['items-end', { 'items-start': true, hidden: false }] } })); await tick();
  compare(host.firstElementChild as HTMLLabelElement, reference({ className: 'items-end items-start' }));
});

function referenceFixture(changed: boolean) {
  return reference({
    id: 'native-label', className: changed ? 'inline-block items-start select-text' : 'items-end',
    htmlFor: changed ? 'label-second-control' : 'label-first-control', title: changed ? 'Updated label' : 'Initial label',
    'data-slot': changed ? 'consumer-updated' : 'consumer-initial', children: changed ? 'Updated message' : 'Initial message',
  });
}

for (const initializeNull of [false, true]) it(`native label ref/attachment, reactive props/events and association retain the host and clean up (${initializeNull ? 'null' : 'undefined'} initialization)`, async () => {
  const host = target(); const instance = mount(Fixture, { target: host, props: { initializeNull } }); mounted.push(instance); await tick();
  const label = host.querySelector('label')!;
  expect(instance.snapshot().initialRef).toBe(initializeNull ? null : undefined);
  expect(instance.snapshot().ref).toBe(label); expect(instance.snapshot().assignments).toEqual([label]);
  expect(instance.snapshot().nodes).toEqual([label]); expect(instance.snapshot().attached).toBe(1); expect(instance.snapshot().detached).toBe(0);
  compare(label, referenceFixture(false)); expect(label.control).toBe(host.querySelector('#label-first-control'));
  label.dispatchEvent(new MouseEvent('click', { bubbles: true })); await tick();
  expect(instance.snapshot().calls).toEqual(['click:initial:LABEL']);
  instance.update(); await tick();
  compare(label, referenceFixture(true)); expect(label.control).toBe(host.querySelector('#label-second-control'));
  expect(instance.snapshot().ref).toBe(label); expect(instance.snapshot().attached).toBe(1); expect(instance.snapshot().detached).toBe(0);
  label.dispatchEvent(new MouseEvent('click', { bubbles: true })); await tick();
  expect(instance.snapshot().calls).toEqual(['click:initial:LABEL', 'click:updated:LABEL']);
  instance.hide(); await tick();
  expect(host.querySelector('label')).toBeNull(); expect(instance.snapshot().ref).toBeNull(); expect(instance.snapshot().detached).toBe(1);
  instance.show(); await tick();
  const reopened = host.querySelector('label')!;
  expect(instance.snapshot().ref).toBe(reopened); expect(reopened).not.toBe(label);
  compare(reopened, referenceFixture(true)); expect(instance.snapshot().attached).toBe(2); expect(instance.snapshot().detached).toBe(1);
  expect(instance.snapshot().assignments).toEqual([label, null, reopened]);
  mounted.pop(); await unmount(instance); await tick();
  expect(instance.snapshot().ref).toBeNull(); expect(instance.snapshot().detached).toBe(2);
  expect(instance.snapshot().assignments).toEqual([label, null, reopened, null]);
});

it('replacing a symbol-keyed attachment cleans and reattaches the same native label/ref once', async () => {
  const host = target(); const instance = mount(Fixture, { target: host }); mounted.push(instance); await tick();
  const label = host.querySelector('label')!;
  expect(instance.snapshot().attachmentEvents).toEqual(['attach:0:native-label']);
  instance.replaceAttachment(); await tick();
  expect(instance.snapshot().ref).toBe(label); expect(host.querySelector('label')).toBe(label);
  expect(instance.snapshot().attached).toBe(2); expect(instance.snapshot().detached).toBe(1);
  expect(instance.snapshot().nodes).toEqual([label, label]);
  expect(instance.snapshot().attachmentEvents).toEqual(['attach:0:native-label', 'detach:0:native-label', 'attach:1:native-label']);
  instance.update(); await tick(); expect(instance.snapshot().attached).toBe(2); expect(instance.snapshot().detached).toBe(1);
  instance.hide(); await tick(); expect(instance.snapshot().ref).toBeNull(); expect(instance.snapshot().detached).toBe(2);
  expect(instance.snapshot().attachmentEvents).toEqual(['attach:0:native-label', 'detach:0:native-label', 'attach:1:native-label', 'detach:1:native-label']);
  mounted.pop(); await unmount(instance); await tick(); expect(instance.snapshot().detached).toBe(2);
});

it('supplemental explicit and implicit native textarea associations match pinned label composition', async () => {
  const host = target(); mounted.push(mount(AssociationFixture, { target: host })); await tick();
  const expected = document.createElement('section');
  expected.innerHTML = renderToStaticMarkup(createElement('section', null,
    createElement(ReferenceLabel, { id: 'explicit-label', htmlFor: 'explicit-control' }, 'Message'), createElement('textarea', { id: 'explicit-control' }),
    createElement(ReferenceLabel, { id: 'implicit-label' }, 'Nested message ', createElement('textarea', { id: 'implicit-control' }))));
  for (const kind of ['explicit', 'implicit']) {
    const label = host.querySelector<HTMLLabelElement>(`#${kind}-label`)!; const control = host.querySelector<HTMLTextAreaElement>(`#${kind}-control`)!;
    const referenceLabel = expected.querySelector<HTMLLabelElement>(`#${kind}-label`)!; const referenceControl = expected.querySelector<HTMLTextAreaElement>(`#${kind}-control`)!;
    compare(label, referenceLabel); expect(label.control).toBe(control); expect(referenceLabel.control).toBe(referenceControl);
    expect(Array.from(control.labels!)).toEqual([label]); expect(Array.from(referenceControl.labels!)).toEqual([referenceLabel]);
  }
});
