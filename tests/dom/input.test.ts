// Source-derived wrapper comparisons; actual Base helper ports live in a separate suite.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement, act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Input as Reference } from '../reference/input';
import { Input } from '../../apps/docs/registry/bases/base/ui/input/index.js';
import type { InputProps } from '../../apps/docs/registry/bases/base/ui/input/index.js';
import Fixture from './InputFixture.svelte';
const mounted: ReturnType<typeof mount>[] = [];
const roots: Root[] = [];
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); await act(async () => { for (const root of roots.splice(0)) root.unmount(); }); document.body.replaceChildren(); });
function target() { const node = document.createElement('section'); document.body.append(node); return node; }
for (const attrs of [{}, { id: 'explicit', class: 'w-64 rounded-none px-6', type: 'email', 'data-slot': 'custom', 'aria-invalid': 'true', required: true, name: 'email', placeholder: 'Email', readonly: true, maxlength: 30, form: 'external', style: 'color: red;' }, { disabled: true, 'aria-describedby': 'description', dir: 'rtl' }, { type: undefined, style: null, disabled: null }, { type: 'file', accept: 'image/*', multiple: true }, { type: 'checkbox', checked: true, readonly: true }] satisfies InputProps[]) it(`actual pinned wrapper native attributes/classes: ${JSON.stringify(attrs)}`, async () => {
  const node = target(); mounted.push(mount(Input, { target: node, props: attrs })); await tick();
  const reference = document.createElement('section');
  document.body.append(reference);
  const { class: className, style, readonly: readOnly, maxlength: maxLength, ...props } = attrs as InputProps;
  const root = createRoot(reference); roots.push(root);
  await act(async () => root.render(createElement(Reference, { ...props, className, readOnly, maxLength, style: style ? { color: 'red' } : undefined })));
  const actual = node.querySelector('input')!; const expected = reference.querySelector('input')!;
  expect(actual.tagName).toBe(expected.tagName);
  const names = (element: Element) => element.getAttributeNames().filter(name => name !== 'id').sort();
  expect(names(actual)).toEqual(names(expected));
  for (const name of names(expected)) expect(name === 'style' ? actual.style.cssText : actual.getAttribute(name), name).toBe(name === 'style' ? expected.style.cssText : expected.getAttribute(name));
  if (attrs.id) expect(actual.id).toBe(expected.id); else { expect(actual.id).not.toBe(''); expect(expected.id).not.toBe(''); }
  expect(actual.type).toBe(expected.type); expect(actual.checked).toBe(expected.checked);
});
for (const policy of ['accept', 'reject', 'rewrite'] as const) it(`explicit controlled owner ${policy} preserves native events and restoration`, async () => {
  const component = mount(Fixture, { target: target(), props: { policy } }); mounted.push(component); await tick();
  const input = document.getElementById('controlled-input') as HTMLInputElement;
  expect(component.snapshot().ref).toBe(input); expect(component.snapshot().nullRef).toBe(document.getElementById('draft-input'));
  input.value = 'edit'; input.dispatchEvent(new Event('input', { bubbles: true })); await tick();
  expect(input.value).toBe(policy === 'accept' ? 'edit' : policy === 'rewrite' ? 'EDIT' : 'Initial');
  input.dispatchEvent(new Event('change', { bubbles: true })); await tick();
  expect(component.snapshot().calls).toEqual(['input:edit', `change:${input.value}`]);
  component.update('Updated'); await tick(); expect(input.value).toBe('Updated');
});
it('native symbol attachments, undefined/null refs, replacement, detach and form/reset retain real host', async () => {
  const component = mount(Fixture, { target: target() }); mounted.push(component); await tick();
  const input = document.getElementById('controlled-input') as HTMLInputElement;
  expect(component.snapshot().attached).toBe(1); expect(input.dataset.attached).toBe('true');
  input.focus(); component.update('Updated'); await tick(); expect(document.activeElement).toBe(input); expect(component.snapshot().attached).toBe(1);
  component.swap(); await tick(); expect(component.snapshot().attached).toBe(2); expect(component.snapshot().detached).toBe(1); expect(component.snapshot().ref).toBe(input);
  const form = document.getElementById('input-form') as HTMLFormElement;
  expect([...new FormData(form)]).toEqual([['value', 'Updated'], ['draft', 'Draft'], ['external', 'Outside']]);
  const draft = document.getElementById('draft-input') as HTMLInputElement; draft.value = 'Unsaved'; form.reset(); await tick(); expect(draft.value).toBe('Draft');
  // Recorded Base I-02: Svelte keeps the native controlled input reset default.
  expect(input.value).toBe(''); expect(component.snapshot().value).toBe('Updated');
  component.remove(); await tick(); expect(component.snapshot().ref).toBeNull(); expect(component.snapshot().detached).toBe(2);
  component.show(); await tick(); expect(component.snapshot().ref).toBe(document.getElementById('controlled-input')); expect(component.snapshot().attached).toBe(3);
});

async function pairedChecked(props: InputProps) {
  const local = target(); mounted.push(mount(Input, { target: local, props })); await tick();
  const reference = target(); const root = createRoot(reference); roots.push(root);
  const { readonly: readOnly, ...rest } = props;
  await act(async () => root.render(createElement(Reference, { ...rest, readOnly })));
  return { actual: local.querySelector('input')!, expected: reference.querySelector('input')! };
}
for (const checked of [true, false]) it(`original controlled checkbox ${checked} rejects native toggle like actual React1.6`, async () => {
  const { actual, expected } = await pairedChecked({ type: 'checkbox', checked, readonly: true });
  await act(async () => expected.click()); actual.click(); await tick(); await new Promise(resolve => setTimeout(resolve, 1));
  expect(actual.checked).toBe(expected.checked);
  expect(actual.defaultChecked).toBe(expected.defaultChecked);
});
for (const type of ['checkbox', 'radio']) it(`original controlled ${type} reset default matches actual React1.6`, async () => {
  const local = document.createElement('form'); document.body.append(local);
  mounted.push(mount(Input, { target: local, props: { type, checked: true, readonly: true } })); await tick();
  const reference = document.createElement('form'); document.body.append(reference);
  const root = createRoot(reference); roots.push(root);
  await act(async () => root.render(createElement(Reference, { type, checked: true, readOnly: true })));
  const actual = local.querySelector('input')!; const expected = reference.querySelector('input')!;
  actual.checked = false; expected.checked = false; local.reset(); reference.reset(); await tick();
  expect(actual.checked).toBe(expected.checked);
  expect(actual.defaultChecked).toBe(expected.defaultChecked);
  expect(actual.getAttribute('checked')).toBe(expected.getAttribute('checked'));
});
it('original native checked=null with defaultChecked initializes like actual React1.6', async () => {
  const { actual, expected } = await pairedChecked({ type: 'checkbox', checked: null, defaultChecked: true });
  expect(actual.checked).toBe(expected.checked);
});
it('native uncontrolled defaultChecked retains its observed React1.6 default and toggle', async () => {
  const { actual, expected } = await pairedChecked({ type: 'checkbox', defaultChecked: true });
  expect(actual.checked).toBe(expected.checked); expect(actual.defaultChecked).toBe(expected.defaultChecked);
  await act(async () => expected.click()); actual.click(); await tick(); expect(actual.checked).toBe(expected.checked);
});
