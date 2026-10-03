// Authored source-derived supplements. Detached-image completion is controlled only in jsdom;
// real native decode/cache/source replacement is covered by the separate secured browser gates.
import { afterEach, expect, it, vi } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Reference from '../reference/avatar';
import { Avatar, AvatarBadge, AvatarGroup, AvatarGroupCount } from '../../apps/docs/registry/bases/base/ui/avatar/index.js';
import Fixture from './AvatarFixture.svelte';
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => { for (const component of mounted.splice(0)) await unmount(component); vi.unstubAllGlobals(); document.body.replaceChildren(); });
const snapshot = (node: Element) => ({ tag: node.tagName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort()), text: node.textContent });
for (const [name, Part] of Object.entries({ Avatar, AvatarBadge, AvatarGroup, AvatarGroupCount })) it(`${name} preserves actual original native host/class/rightmost spread`, async () => {
  const target = document.createElement('section'); document.body.append(target);
  mounted.push(mount(Part, { target, props: { class: ['size-12', { 'rounded-none': true }], 'data-slot': 'caller', title: 'Avatar & <draft>' } })); await tick();
  const expected = document.createElement('section'); expected.innerHTML = renderToStaticMarkup(createElement(Reference[name as keyof typeof Reference], { className: 'size-12 rounded-none', 'data-slot': 'caller', title: 'Avatar & <draft>' }));
  expect(snapshot(target.firstElementChild!)).toEqual(snapshot(expected.firstElementChild!));
  expect(target.querySelector('[ref]')).toBeNull();
});
it('Avatar preserves static cn ignoring original-advertised class callbacks', async () => {
  const target = document.createElement('section'); document.body.append(target); let calls = 0;
  mounted.push(mount(Avatar, { target, props: { class: () => { calls++; return 'ignored'; } } })); await tick();
  const expected = document.createElement('section'); expected.innerHTML = renderToStaticMarkup(createElement(Reference.Avatar, { className: () => 'ignored' }));
  expect(snapshot(target.firstElementChild!)).toEqual(snapshot(expected.firstElementChild!)); expect(calls).toBe(0);
});
it('all six genuine parts retain nonempty native refs, reactive source/presence, stale suppression and attachment cleanup', async () => {
  const probes: { src: string; onload?: () => void; onerror?: () => void; complete: boolean; naturalWidth: number }[] = [];
  class DetachedImage {
    src = ''; complete = false; naturalWidth = 0; onload?: () => void; onerror?: () => void;
    constructor() { probes.push(this); }
  }
  vi.stubGlobal('Image', DetachedImage);
  const target = document.createElement('section'); document.body.append(target);
  const fixture = mount(Fixture, { target }); mounted.push(fixture); await tick();
  expect(probes).toHaveLength(1); expect(probes[0].src).toBe('/avatar-first.png');
  expect(fixture.snapshot().statuses).toEqual(['loading']);
  expect(fixture.snapshot().refs.map(node => node?.id ?? null)).toEqual(['bound-avatar-0', null, 'bound-avatar-2', 'bound-avatar-3', 'bound-avatar-4', 'bound-avatar-5']);
  expect(fixture.snapshot().attached).toBe(5);
  const root = fixture.snapshot().refs[0]!; root.click(); await tick(); expect(fixture.snapshot().clicks).toEqual(['bound-avatar-0']);
  fixture.update(); await tick(); expect(fixture.snapshot().refs[0]).toBe(root); expect(root.dataset.size).toBe('sm'); expect(root.classList.contains('size-12')).toBe(true);
  fixture.swap(); await tick(); expect(fixture.snapshot().attached).toBe(10); expect(fixture.snapshot().cleaned).toBe(5);
  // Replacing symbol props disposes Base's old detached probe. That stale completion
  // stays suppressed; only the currently owned probe can change the native presence.
  expect(probes).toHaveLength(2);
  probes[0].onload?.(); await tick(); expect(fixture.snapshot().statuses).toEqual(['loading']);
  probes[1].onload?.(); await tick();
  expect(fixture.snapshot().statuses).toEqual(['loading', 'loaded']); expect(target.querySelector('[data-slot="avatar-fallback"]')).toBeNull();
  expect(fixture.snapshot().refs[1]?.tagName).toBe('IMG'); expect(fixture.snapshot().refs[1]?.getAttribute('alt')).toBe('Fixture portrait');
  expect(fixture.snapshot().attached).toBe(11); expect(fixture.snapshot().cleaned).toBe(6);
  fixture.source('/avatar-second.png'); await tick(); expect(probes).toHaveLength(3);
  probes[0].onerror?.(); await tick(); expect(fixture.snapshot().statuses.at(-1)).toBe('loading');
  probes[2].onerror?.(); await tick(); expect(fixture.snapshot().statuses.at(-1)).toBe('error');
  expect(fixture.snapshot().refs[2]?.textContent).toBe('Initial <Avatar>');
  fixture.remove(); await tick(); expect(fixture.snapshot().refs.every(node => node === undefined || node === null)).toBe(true);
  expect(fixture.snapshot().cleaned).toBe(fixture.snapshot().attached);
  fixture.show(); await tick(); expect(fixture.snapshot().refs[0]).not.toBe(root); expect(fixture.snapshot().refs[0]?.isConnected).toBe(true);
});
