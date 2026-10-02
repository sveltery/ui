// Supplemental public class-input regressions, not upstream UI runtime test ports.
// The expected literals were reproduced with genuine cn@0.2.2 from shadcn's exact lock.
import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { Skeleton } from '../../apps/docs/registry/bases/base/ui/skeleton/index.js';

const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => {
  for (const component of mounted.splice(0)) await unmount(component);
  document.body.replaceChildren();
});

for (const [name, className, expected] of [
  ['nonbreaking space', 'p-2\u00a0p-4', 'cn-skeleton animate-pulse p-2\u00a0p-4'],
  ['Unicode line separator', 'p-2\u2028p-4', 'cn-skeleton animate-pulse p-2\u2028p-4'],
  ['ASCII space', 'p-2 p-4', 'cn-skeleton animate-pulse p-4'],
  ['ASCII tab', 'p-2\tp-4', 'cn-skeleton animate-pulse p-4'],
]) {
  it(`public Skeleton class input preserves pinned cn ${name} behavior`, async () => {
    const target = document.createElement('section');
    document.body.append(target);
    mounted.push(mount(Skeleton, { target, props: { class: className } }));
    await tick();
    expect(target.querySelector('[data-slot=skeleton]')!.getAttribute('class')).toBe(expected);
  });
}
