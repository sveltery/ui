// Source-derived paired assertions, not upstream tests; see kbd-sources.json and MIT notices.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { Kbd as ReferenceKbd, KbdGroup as ReferenceGroup } from '../reference/kbd';
import { Kbd, KbdGroup } from '../../apps/docs/registry/bases/base/ui/kbd/index.js';
import Fixture from './KbdFixture.svelte';
import Example from '../../apps/docs/examples/base/KbdExample.svelte';
import { KbdGallery } from '../reference/KbdGallery';
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); document.body.replaceChildren(); });
function target() { const node = document.createElement('section'); document.body.append(node); return node; }
it('paired supported example functions retain byte-exact actual upstream bodies', () => {
  const original = readFileSync('tests/reference/kbd-example.tsx', 'utf8');
  const selected = readFileSync('tests/reference/kbd-selected-examples.tsx', 'utf8');
  for (const name of ['KbdBasic', 'KbdModifierKeys', 'KbdGroupExample', 'KbdArrowKeys', 'KbdWithSamp']) {
    const start = original.indexOf(`function ${name}()`); const next = original.indexOf('\nfunction ', start + 1);
    expect(start).toBeGreaterThan(-1); expect(selected).toContain(original.slice(start, next < 0 ? undefined : next).trimEnd());
  }
});
for (const [component, reference] of [[Kbd, ReferenceKbd], [KbdGroup, ReferenceGroup]] as const) {
  for (const attrs of [{}, { class: 'inline-block px-6 select-text', 'data-slot': 'custom', title: 'Shortcut', 'aria-label': 'Keyboard instruction', tabIndex: 2, dir: 'rtl' as const, style: 'color: red;' }]) {
    it(`${reference.name} preserves pinned kbd host, prop precedence and classes: ${JSON.stringify(attrs)}`, async () => {
      const node = target(); mounted.push(mount(component, { target: node, props: attrs })); await tick();
      const expectedContainer = document.createElement('section');
      const { class: className, style, ...props } = attrs;
      expectedContainer.innerHTML = renderToStaticMarkup(createElement(reference, { ...props, className, style: style ? { color: 'red' } : undefined }));
      const actual = node.firstElementChild as HTMLElement; const expected = expectedContainer.firstElementChild as HTMLElement;
      expect(actual.tagName).toBe(expected.tagName); expect(actual.tagName).toBe('KBD');
      expect(actual.getAttributeNames().sort()).toEqual(expected.getAttributeNames().sort());
      for (const name of expected.getAttributeNames()) expect(name === 'style' ? actual.style.cssText : actual.getAttribute(name), name).toBe(name === 'style' ? expected.style.cssText : expected.getAttribute(name));
      expect(actual.hasAttribute('role')).toBe(false);
    });
  }
}
it('undefined refs, symbol attachments, reactive children/classes and native events retain hosts and clean up', async () => {
  const component = mount(Fixture, { target: target() }); mounted.push(component); await tick();
  const kbd = document.getElementById('bound-kbd')!; const group = document.getElementById('bound-group')!;
  expect(component.snapshot()).toEqual({ ref: kbd, groupRef: group, attached: 2, detached: 0, clicks: 0 });
  expect(kbd.getAttribute('title')).toBe('Ctrl key'); expect(kbd.textContent).toBe('Ctrl');
  kbd.dispatchEvent(new MouseEvent('click', { bubbles: true })); await tick(); expect(component.snapshot().clicks).toBe(1);
  component.update(); await tick();
  expect(component.snapshot().ref).toBe(kbd); expect(component.snapshot().groupRef).toBe(group);
  expect(kbd.textContent).toBe('Shift'); expect(kbd.getAttribute('title')).toBe('Shift key'); expect(kbd.classList.contains('px-6')).toBe(true); expect(kbd.classList.contains('px-3')).toBe(false);
  expect(component.snapshot().attached).toBe(2);
  component.remove(); await tick(); expect(component.snapshot()).toEqual({ ref: null, groupRef: null, attached: 2, detached: 2, clicks: 1 });
});
it('five supported actual pinned example bodies retain text, grouping and samp composition', async () => {
  const node = target(); mounted.push(mount(Example, { target: node })); await tick();
  const reference = document.createElement('section'); reference.innerHTML = renderToStaticMarkup(createElement(KbdGallery));
  function examples(container: HTMLElement) { return [...container.querySelectorAll('[data-slot=example]')].filter(example => ['Basic', 'Modifier Keys', 'KbdGroup', 'Arrow Keys', 'With samp'].includes(example.firstElementChild?.textContent ?? '')).map(example => ({ title: example.firstElementChild?.textContent, keys: [...example.querySelectorAll('kbd')].map(key => ({ text: key.textContent, slot: key.dataset.slot, class: key.className, parent: key.parentElement?.tagName, samp: key.querySelector('samp')?.textContent ?? null })) })); }
  expect(examples(node)).toEqual(examples(reference)); expect(examples(node)).toHaveLength(5); expect(node.querySelectorAll('[data-slot=example]')).toHaveLength(7);
});
