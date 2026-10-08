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
it('all seven public part attachments reach actual hosts, follow close/reopen and clean up on removal', async () => {
  const { example, state, click } = await setup();
  expect(example.actions()).toBeDefined();
  expect(state().tags).toMatchObject({ button: 'BUTTON', trigger: 'BUTTON', overlay: 'undefined' });
  await click('trigger');
  expect(state().tags).toEqual({ button: 'BUTTON', trigger: 'BUTTON', overlay: 'DIV', content: 'DIV', title: 'H2', description: 'P', close: 'BUTTON' });
  for (const [part, node] of Object.entries(example.refs())) {
    expect(node).toBeInstanceOf(HTMLElement); expect((node as HTMLElement).isConnected).toBe(true);
    if (part !== 'portal') expect((node as HTMLElement).dataset.probed).toBe(part);
  }
  expect(state().bindingLog).toEqual(['BUTTON']);
  expect(state().attachments).toEqual(Object.fromEntries(Object.keys(state().tags).map(part => [part, 1])));
  await click('action-close');
  expect(state().tags).toMatchObject({ button: 'BUTTON', trigger: 'BUTTON', overlay: null, content: null, title: null, description: null, close: null });
  expect(example.refs().portal).toBeNull();
  await click('trigger'); await click('remove');
  expect(state().tags).toEqual(Object.fromEntries(Object.keys(state().tags).map(part => [part, null])));
  expect(state().cleanups).toEqual(state().attachments); expect(state().bindingLog).toEqual(['BUTTON', null]);
  expect(document.querySelector('[data-base-ui-portal]')).toBeNull();
});
it('Portal follows native and default targets, and an explicit null container waits like upstream', async () => {
  const { host, example, click } = await setup(); await click('trigger');
  const portal = example.refs().portal!;
  expect(portal.parentNode).toBe(document.body);
  example.setContainer('element'); await settle(); expect(example.refs().portal!.parentNode).toBe(host.querySelector('#base-pin-first'));
  example.setContainer('undefined'); await settle(); expect(example.refs().portal!.parentNode).toBe(document.body);
  // Base UI 1.8 FloatingPortal waits while `container` is explicitly null and renders no portal.
  example.setContainer('null'); await settle(); expect(document.querySelector('[data-base-ui-portal]')).toBeNull();
  example.setContainer('undefined'); await settle(); expect(example.refs().portal!.parentNode).toBe(document.body);
  example.remove(); await settle(); expect(document.querySelector('[data-base-ui-portal]')).toBeNull();
});
