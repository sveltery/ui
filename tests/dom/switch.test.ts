import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import SwitchForm from './SwitchForm.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  instance = mount(SwitchForm, { target: document.body });
  flushSync();
  const form = document.querySelector('form')!;
  const root = (name: string) => form.querySelector<HTMLElement>(`[data-slot=switch]:has(+ input[name=${name}], + input[type=hidden] + input[name=${name}])`)!;
  const input = (name: string) => form.querySelector<HTMLInputElement>(`input[type=checkbox][name=${name}]`)!;
  const submitted = () => [...new FormData(form).entries()];
  const click = (element: HTMLElement) => { element.click(); flushSync(); };
  return { form, root, input, submitted, click, fixture: instance as unknown as { read(): boolean; write(next: boolean): void; changeLog(): boolean[] } };
}

it('renders a switch role with the slot, size, thumb and classes', () => {
  const { root } = setup();
  const airplane = root('airplane');
  expect(airplane.getAttribute('role')).toBe('switch');
  expect(airplane.dataset.slot).toBe('switch');
  expect(airplane.dataset.size).toBe('default');
  expect(airplane.getAttribute('aria-checked')).toBe('false');
  expect(airplane.className).toBe('cn-switch peer group/switch relative inline-flex items-center transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50');
  const thumb = airplane.querySelector<HTMLElement>('[data-slot=switch-thumb]')!;
  expect(thumb.className).toBe('cn-switch-thumb pointer-events-none block ring-0 transition-transform');
  expect(thumb.hasAttribute('data-unchecked')).toBe(true);
  const bluetooth = root('bluetooth');
  expect(bluetooth.dataset.size).toBe('sm');
  expect(bluetooth.classList.contains('extra')).toBe(true);
});

it('defaultChecked starts the switch on', () => {
  const { root, input } = setup();
  expect(root('bluetooth').getAttribute('aria-checked')).toBe('true');
  expect(root('bluetooth').hasAttribute('data-checked')).toBe(true);
  expect(root('bluetooth').querySelector('[data-slot=switch-thumb]')!.hasAttribute('data-checked')).toBe(true);
  expect(input('bluetooth').checked).toBe(true);
});

it('a click toggles it, and bind:checked and onCheckedChange follow', () => {
  const { root, click, fixture } = setup();
  click(root('airplane'));
  expect(fixture.read()).toBe(true);
  expect(root('airplane').getAttribute('aria-checked')).toBe('true');
  click(root('airplane'));
  expect(fixture.read()).toBe(false);
  expect(fixture.changeLog()).toEqual([true, false]);
});

it('writing the bound variable moves the switch', () => {
  const { root, input, fixture } = setup();
  fixture.write(true);
  flushSync();
  expect(root('airplane').getAttribute('aria-checked')).toBe('true');
  expect(input('airplane').checked).toBe(true);
});

it('a native label click toggles it', () => {
  const { root, click, fixture } = setup();
  click(document.querySelector<HTMLElement>('label[for=airplane]')!);
  expect(fixture.read()).toBe(true);
  expect(root('airplane').getAttribute('aria-checked')).toBe('true');
});

it('space toggles it from the keyboard', () => {
  const { root, fixture } = setup();
  const airplane = root('airplane');
  airplane.focus();
  airplane.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
  airplane.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true, cancelable: true }));
  flushSync();
  expect(fixture.read()).toBe(true);
});

it('submits the on value of checked switches and the off value only when asked', () => {
  const { submitted, click, root } = setup();
  expect(submitted()).toEqual([['bluetooth', 'enabled'], ['locked', 'on'], ['away', 'no']]);
  click(root('airplane'));
  click(root('away'));
  expect(submitted()).toEqual([['airplane', 'on'], ['bluetooth', 'enabled'], ['locked', 'on'], ['away', 'on']]);
});

it('a disabled switch ignores clicks and stays out of the submission', () => {
  const { root, click, submitted } = setup();
  const wifi = root('wifi');
  expect(wifi.getAttribute('aria-disabled')).toBe('true');
  expect(wifi.hasAttribute('data-disabled')).toBe(true);
  click(wifi);
  expect(wifi.getAttribute('aria-checked')).toBe('true');
  expect(submitted().map(([name]) => name)).not.toContain('wifi');
});

it('a read-only switch keeps its state', () => {
  const { root, click, submitted } = setup();
  const locked = root('locked');
  expect(locked.getAttribute('aria-readonly')).toBe('true');
  click(locked);
  expect(locked.getAttribute('aria-checked')).toBe('true');
  expect(submitted().map(([name]) => name)).toContain('locked');
});

it.fails('reset returns the switches to their initial state (Base does not handle form reset yet)', () => {
  const { form, root, input, click, fixture } = setup();
  click(root('airplane'));
  click(root('bluetooth'));
  form.reset();
  flushSync();
  expect(fixture.read()).toBe(false);
  expect(root('airplane').getAttribute('aria-checked')).toBe('false');
  expect(root('bluetooth').getAttribute('aria-checked')).toBe('true');
  expect(input('airplane').checked).toBe(false);
  expect(input('bluetooth').checked).toBe(true);
});
