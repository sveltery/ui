// Source-derived local comparisons, not copied upstream tests. See textarea-sources.json and MIT notices.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Textarea as Reference } from '../reference/textarea';
import { Textarea } from '../../apps/docs/registry/bases/base/ui/textarea/index.js';
import Fixture from './TextareaFixture.svelte';
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); document.body.replaceChildren(); });
function target() { const node = document.createElement('section'); document.body.append(node); return node; }
for (const attrs of [{}, { class: 'min-h-32 w-64 rounded-none px-6', 'data-slot': 'custom', rows: 6, 'aria-invalid': 'true' as const, required: true, name: 'message', placeholder: 'Message', readOnly: true, maxLength: 30, form: 'external', style: 'resize: none;' }, { disabled: true, 'aria-describedby': 'description', dir: 'rtl' as const }]) it(`native attributes/classes match actual pinned wrapper: ${JSON.stringify(attrs)}`, async () => {
  const node = target(); mounted.push(mount(Textarea, { target: node, props: attrs })); await tick();
  const reference = document.createElement('section');
  const { class: className, style, ...props } = attrs;
  reference.innerHTML = renderToStaticMarkup(createElement(Reference, { ...props, className, style: style ? { resize: 'none' } : undefined }));
  const actual = node.querySelector('textarea')!; const expected = reference.querySelector('textarea')!;
  expect(actual.tagName).toBe(expected.tagName);
  expect(actual.getAttributeNames().sort()).toEqual(expected.getAttributeNames().sort());
  for (const name of expected.getAttributeNames()) expect(name === 'style' ? actual.style.cssText : actual.getAttribute(name), name).toBe(name === 'style' ? expected.style.cssText : expected.getAttribute(name));
});
it('bind:value, native input/change, ref, attachment cleanup and form/reset preserve native host', async () => {
  const component = mount(Fixture, { target: target() }); mounted.push(component); await tick();
  const textarea = document.getElementById('bound') as HTMLTextAreaElement;
  expect(component.snapshot().ref).toBe(textarea); expect(component.snapshot().attached).toBe(1); expect(textarea.dataset.attached).toBe('true');
  textarea.focus(); textarea.value = 'Edited'; textarea.dispatchEvent(new Event('input', { bubbles: true })); await tick();
  expect(component.snapshot().value).toBe('Edited'); expect(component.snapshot().calls).toEqual(['input:Edited']);
  textarea.dispatchEvent(new Event('change', { bubbles: true })); await tick(); expect(component.snapshot().calls).toEqual(['input:Edited', 'change:Edited']);
  component.setValue('Updated'); await tick(); expect(textarea.value).toBe('Updated'); expect(document.activeElement).toBe(textarea); expect(component.snapshot().attached).toBe(1);
  const form = document.getElementById('message-form') as HTMLFormElement;
  expect([...new FormData(form)]).toEqual([['message', 'Updated'], ['draft', 'Draft']]);
  const draft = document.getElementById('uncontrolled') as HTMLTextAreaElement;
  draft.value = 'Unsaved'; form.reset(); await tick();
  expect(draft.value).toBe('Draft');
  component.remove(); await tick(); expect(component.snapshot().ref).toBeNull(); expect(component.snapshot().detached).toBe(1);
});
