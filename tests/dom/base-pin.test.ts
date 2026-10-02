import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import Example from '../../apps/docs/examples/base/BasePinExample.svelte';
const mounted: ReturnType<typeof mount>[] = [];
beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] }));
async function settle() { await tick(); await vi.advanceTimersByTimeAsync(100); await tick(); await vi.advanceTimersByTimeAsync(100); await tick(); }
afterEach(async () => { for (const instance of mounted.splice(0)) await unmount(instance); vi.useRealTimers(); document.body.replaceChildren(); document.documentElement.removeAttribute('style'); });
async function setup() {
  const host = document.createElement('div'); document.body.append(host);
  const example = mount(Example, { target: host }); mounted.push(example); await settle();
  const state = () => JSON.parse(host.querySelector('[data-testid=base-pin-state]')!.textContent!);
  const click = async (id: string) => { host.querySelector<HTMLElement>(`[data-testid=base-pin-${id}]`)!.click(); await settle(); };
  return { host, example, state, click };
}
it('all eight public refs accept initial undefined, expose actual attached hosts and clear on removal', async () => {
  const { example, state, click } = await setup();
  expect(example.refs().actions).not.toBeNull();
  expect(state().tags).toMatchObject({ button: 'BUTTON', trigger: 'BUTTON', portal: 'undefined' });
  await click('trigger');
  expect(state().tags).toEqual({ button: 'BUTTON', trigger: 'BUTTON', portal: 'DIV', overlay: 'DIV', content: 'DIV', title: 'H2', description: 'P', close: 'BUTTON' });
  for (const [part, node] of Object.entries(example.refs())) {
    if (part === 'actions') continue;
    expect(node).toBeInstanceOf(HTMLElement); expect((node as HTMLElement).isConnected).toBe(true); expect((node as HTMLElement).dataset.probed).toBe(part);
  }
  expect(state().bindingLog).toEqual(['BUTTON']);
  expect(state().attachments).toEqual(Object.fromEntries(Object.keys(state().tags).map(part => [part, 1])));
  await click('action-close');
  expect(state().tags).toMatchObject({ button: 'BUTTON', trigger: 'BUTTON', portal: null, overlay: null, content: null, title: null, description: null, close: null });
  await click('trigger'); await click('remove');
  expect(state().tags).toEqual(Object.fromEntries(Object.keys(state().tags).map(part => [part, null])));
  expect(state().cleanups).toEqual(state().attachments); expect(state().bindingLog).toEqual(['BUTTON', null]);
  expect(document.querySelector('[data-base-ui-portal]')).toBeNull();
});
it('Portal resolves empty refs, explicit null, native targets and misleading ref properties while cleaning old hosts', async () => {
  const { host, example, click } = await setup(); await click('trigger');
  const portal = example.refs().portal!;
  expect(portal.parentNode).toBe(document.body);
  expect(portal.querySelector('[data-testid=base-pin-nested]')?.parentNode).toBe(portal);
  example.setContainer('element-current'); await settle(); expect(example.refs().portal).toBe(portal); expect(portal.parentNode).toBe(host.querySelector('#base-pin-first'));
  example.setContainer('ref-owner-document'); await settle(); expect(portal.parentNode).toBe(host.querySelector('#base-pin-second'));
  example.setContainer('undefined'); await settle(); expect(portal.parentNode).toBe(document.body);
  example.setContainer('null'); await settle(); expect(portal.isConnected).toBe(false); expect(example.refs().portal).toBeNull();
  expect(document.querySelector('[data-base-ui-portal]')).toBeNull();
  example.setContainer('null-ref'); await settle(); const restored = example.refs().portal!; expect(restored).not.toBe(portal); expect(restored.parentNode).toBe(document.body);
  example.remove(); await settle(); expect(restored.isConnected).toBe(false);
});
