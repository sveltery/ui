import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import Fixture from './Fixture.svelte';
import Example from '../../apps/docs/examples/base/DialogExample.svelte';
const mounted: ReturnType<typeof mount>[] = [];
async function settle() { await tick(); await new Promise(resolve => setTimeout(resolve, 70)); await tick(); }
function setup(props: Parameters<typeof Fixture>[1] = {}) {
  const host = document.createElement('div'); document.body.append(host);
  const instance = mount(Fixture, { target: host, props }); mounted.push(instance); return instance;
}
function click(node: HTMLElement) { node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
afterEach(async () => { for (const instance of mounted.splice(0)) await unmount(instance); document.body.replaceChildren(); document.documentElement.removeAttribute('style'); });
for (const custom of [false, true]) it(`every wrapper relays actual refs, attachments, children and cleanup (custom=${custom})`, async () => {
  const fixture = setup({ custom }); await settle();
  const trigger = fixture.refs().trigger!;
  expect(trigger.getAttribute('name')).toBe('open'); expect(trigger.dataset.attached).toBe('');
  click(trigger); await settle();
  const refs = fixture.refs();
  for (const [part, node] of Object.entries(refs)) {
    if (!(node instanceof HTMLElement)) continue;
    expect(node.isConnected, part).toBe(true); expect(node.dataset.attached, part).toBe('');
    if (custom && !['header', 'footer'].includes(part)) expect(node.dataset.replacement, part).toBe('');
  }
  expect(refs.popup!.getAttribute('aria-labelledby')).toBe(refs.title!.id);
  expect(refs.popup!.getAttribute('aria-describedby')).toBe(refs.description!.id);
  for (const text of ['Title', 'Description', 'Dismiss']) expect(refs.popup!.textContent).toContain(text);
  expect(refs.popup!.style.getPropertyValue('--is-open')).toBe('1');
  expect(refs.popup!.classList.contains('p-8')).toBe(true); expect(refs.popup!.classList.contains('p-4')).toBe(false);
  expect(fixture.portal()!.isConnected).toBe(true);
  fixture.remove(); await settle();
  const removed = fixture.refs(); expect(removed.cleanups).toBe(removed.attachments);
  for (const part of ['trigger', 'overlay', 'popup', 'title', 'description', 'close', 'header', 'footer'] as const) expect(removed[part]).toBeNull();
  expect(document.querySelector('[data-base-ui-portal]')).toBeNull(); expect(document.documentElement.style.overflow).toBe('');
});
it('replacement and consumer handlers compose before activation, and prevention cancels activation', async () => {
  const log: string[] = []; const fixture = setup({ custom: true, prevent: true, log: kind => log.push(kind) }); await settle();
  click(fixture.refs().trigger!); await settle(); expect(log).toEqual(['replacement-click', 'consumer-click']); expect(fixture.refs().popup).toBeNull();
});
it('custom disabled trigger preserves keyboard and click prevention', async () => {
  const fixture = setup({ custom: true, disabled: true }); await settle(); const trigger = fixture.refs().trigger!;
  trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })); click(trigger); await settle();
  expect(trigger.getAttribute('aria-disabled')).toBe('true'); expect(fixture.refs().popup).toBeNull();
});
it('bind:this forwards imperative close, with cancellation preserving open content', async () => {
  const fixture = setup(); await settle(); click(fixture.refs().trigger!); await settle();
  fixture.setCancel('close'); fixture.actions()!.close(); await settle(); expect(fixture.refs().popup).not.toBeNull();
  fixture.setCancel(''); fixture.actions()!.close(); await settle(); expect(fixture.refs().popup).toBeNull();
});
it('canceled preventUnmountOnClose retains a later accepted close until unmount (Base UI 1.8)', async () => {
  const fixture = setup(); await settle(); click(fixture.refs().trigger!); await settle();
  fixture.setCancel('defer-close'); await tick(); fixture.actions()!.close(); await settle(); expect(fixture.refs().popup).not.toBeNull();
  fixture.setCancel(''); await tick(); fixture.actions()!.close(); await settle(); expect(fixture.refs().popup).not.toBeNull();
  fixture.actions()!.unmount(); await settle(); expect(fixture.refs().popup).toBeNull();
});
it('disabled replacement Close anchor suppresses native navigation (Base fix gate)', async () => {
  const fixture = setup({ disabledAnchor: true }); await settle(); click(fixture.refs().trigger!); await settle();
  const event = new MouseEvent('click', { bubbles: true, cancelable: true }); fixture.refs().close!.dispatchEvent(event); await settle();
  expect(event.defaultPrevented).toBe(true); expect(fixture.refs().popup).not.toBeNull();
});
for (const scenario of ['ordinary', 'footer', 'no-close']) it(`content and footer close options preserve registry defaults (${scenario})`, async () => {
  const host = document.createElement('div'); document.body.append(host); mounted.push(mount(Example, { target: host, props: { scenario } })); await settle();
  click(host.querySelector<HTMLElement>('[data-testid=trigger]')!); await settle();
  const popup = document.querySelector<HTMLElement>('[role=dialog]')!;
  expect(popup.closest('[data-slot=dialog-portal]')).not.toBeNull(); expect(document.querySelector('[data-slot=dialog-overlay]')).not.toBeNull();
  expect(popup.querySelectorAll('button')).toHaveLength(scenario === 'no-close' ? 1 : 2);
  expect(!!popup.querySelector('.cn-dialog-close')).toBe(scenario === 'ordinary');
  if (scenario === 'footer') expect(popup.querySelector('[data-slot=dialog-footer]')!.textContent).toContain('Close');
});
it('custom example attachment counters settle and clean up once per Popup lifetime', async () => {
  const host = document.createElement('div'); document.body.append(host); mounted.push(mount(Example, { target: host, props: { scenario: 'custom' } })); await settle();
  const state = () => JSON.parse(host.querySelector('[data-testid=state]')!.textContent ?? '{}');
  click(host.querySelector<HTMLElement>('[data-testid=trigger]')!); await settle();
  expect(state()).toMatchObject({ open: true, attachments: 1, cleanups: 0, popup: 'content' });
  click(host.querySelector<HTMLElement>('[data-testid=action-close]')!); await settle();
  expect(state()).toMatchObject({ open: false, attachments: 1, cleanups: 1, popup: false });
  click(host.querySelector<HTMLElement>('[data-testid=trigger]')!); await settle();
  expect(state()).toMatchObject({ open: true, attachments: 2, cleanups: 1, popup: 'content' });
  click(host.querySelector<HTMLElement>('[data-testid=remove]')!); await settle();
  expect(state()).toMatchObject({ attachments: 2, cleanups: 2, popup: false });
});
