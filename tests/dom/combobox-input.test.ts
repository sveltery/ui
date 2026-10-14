import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import ComboboxInputFixture from './ComboboxInputFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function disabledStates(props: { rootDisabled?: boolean; inputDisabled?: boolean }) {
  instance = mount(ComboboxInputFixture, { target: document.body, props });
  flushSync();
  return [document.querySelector('input')!.disabled, document.querySelector<HTMLButtonElement>('[data-slot=input-group-button]')!.disabled];
}

it('a disabled ComboboxInput disables its input and trigger under an enabled root', () => {
  expect(disabledStates({ inputDisabled: true })).toEqual([true, true]);
});

it('a disabled root disables the input and trigger', () => {
  expect(disabledStates({ rootDisabled: true })).toEqual([true, true]);
});

it('an enabled ComboboxInput under an enabled root stays enabled', () => {
  expect(disabledStates({})).toEqual([false, false]);
});
