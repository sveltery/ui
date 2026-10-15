import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import FormErrorFixture from './FormErrorFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

it('FormError shows the form errors as an alert', () => {
  instance = mount(FormErrorFixture, { target: document.body });
  flushSync();
  const error = document.querySelector<HTMLElement>('[data-slot=form-error]')!;
  expect(error.getAttribute('role')).toBe('alert');
  expect(error.className).toBe('cn-field-error font-normal [&>ul]:ml-4 [&>ul]:flex [&>ul]:list-disc [&>ul]:flex-col [&>ul]:gap-1');
  expect(error.textContent).toBe('Signups are closed');
});
