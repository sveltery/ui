import { expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import Fixture from '../../apps/docs/examples/base/DialogForwardingExample.svelte';

it('five styled wrappers preserve absent, supplied and explicitly empty children against pinned Base', async () => {
  const target = document.createElement('section'); document.body.append(target);
  const instance = mount(Fixture, { target }); await tick();
  try {
    for (const part of ['trigger', 'close', 'title', 'description', 'overlay']) {
      for (const kind of ['base', 'ui']) {
        const content = (mode: string) => document.querySelector(`[data-testid="${kind}-${part}-${mode}"]`)!.textContent;
        // Base cbe46682 always hands Dialog render snippets a children snippet, so an omitted child renders empty there.
        expect(content('omitted'), `${kind} ${part}`).toBe(document.querySelector(`[data-testid="base-${part}-omitted"]`)!.textContent);
        expect(content('omitted'), `${kind} ${part}`).toBe('');
        expect(content('present'), `${kind} ${part}`).toBe('Explicit label');
        expect(content('empty'), `${kind} ${part}`).toBe('');
      }
    }
  } finally { await unmount(instance); target.remove(); }
});

it('Header/Footer bind an initially undefined ref to their native host and clear it on removal', async () => {
  const target = document.createElement('section'); document.body.append(target);
  const instance = mount(Fixture, { target }); await tick();
  try {
    expect(instance.refs()).toEqual({ header: target.querySelector('[data-testid=header]'), footer: target.querySelector('[data-testid=footer]') });
    target.querySelector<HTMLButtonElement>('[data-testid=remove-wrappers]')!.click(); await tick();
    expect(instance.refs()).toEqual({ header: null, footer: null });
  } finally { await unmount(instance); target.remove(); }
});
