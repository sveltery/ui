import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import SwitchForm from './SwitchForm.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  instance = mount(SwitchForm, { target: document.body });
  flushSync();
  const form = document.querySelector('form')!;
  const input = (name: string) => form.querySelector<HTMLInputElement>(`input[role=switch][name=${name}]`)!;
  const root = (name: string) => input(name).closest<HTMLElement>('[data-slot=switch]')!;
  const submitted = () => [...new FormData(form).entries()];
  const click = (element: HTMLElement) => { element.click(); flushSync(); };
  return { form, root, input, submitted, click, fixture: instance as unknown as { read(): boolean; write(next: boolean): void; changeLog(): boolean[] } };
}

it('renders a box with the slot, size, thumb and classes around a switch input', () => {
  const { root, input } = setup();
  const airplane = root('airplane');
  expect(airplane.tagName).toBe('SPAN');
  expect(airplane.dataset.size).toBe('default');
  expect(airplane.hasAttribute('data-unchecked')).toBe(true);
  expect(input('airplane').type).toBe('checkbox');
  expect(input('airplane').checked).toBe(false);
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
  expect(root('bluetooth').hasAttribute('data-checked')).toBe(true);
  expect(root('bluetooth').querySelector('[data-slot=switch-thumb]')!.hasAttribute('data-checked')).toBe(true);
  expect(input('bluetooth').checked).toBe(true);
});

it('a click toggles it, and bind:checked and the change event follow', () => {
  const { root, input, click, fixture } = setup();
  click(input('airplane'));
  expect(fixture.read()).toBe(true);
  expect(root('airplane').hasAttribute('data-checked')).toBe(true);
  click(input('airplane'));
  expect(fixture.read()).toBe(false);
  expect(fixture.changeLog()).toEqual([true, false]);
});

it('writing the bound variable moves the switch', () => {
  const { root, input, fixture } = setup();
  fixture.write(true);
  flushSync();
  expect(root('airplane').hasAttribute('data-checked')).toBe(true);
  expect(input('airplane').checked).toBe(true);
});

it('a native label click toggles it', () => {
  const { root, click, fixture } = setup();
  click(document.querySelector<HTMLElement>('label[for=airplane]')!);
  expect(fixture.read()).toBe(true);
  expect(root('airplane').hasAttribute('data-checked')).toBe(true);
});

it('submits the on value of checked switches and the off value only when asked', () => {
  const { submitted, click, input } = setup();
  expect(submitted()).toEqual([['bluetooth', 'enabled'], ['locked', 'on'], ['away', 'no']]);
  click(input('airplane'));
  click(input('away'));
  expect(submitted()).toEqual([['airplane', 'on'], ['bluetooth', 'enabled'], ['locked', 'on'], ['away', 'on']]);
});

it('a disabled switch ignores clicks and stays out of the submission', () => {
  const { root, input, click, submitted } = setup();
  expect(input('wifi').disabled).toBe(true);
  expect(root('wifi').hasAttribute('data-disabled')).toBe(true);
  click(input('wifi'));
  expect(input('wifi').checked).toBe(true);
  expect(submitted().map(([name]) => name)).not.toContain('wifi');
});

it('a read-only switch keeps its state', () => {
  const { input, click, submitted } = setup();
  expect(input('locked').getAttribute('aria-readonly')).toBe('true');
  click(input('locked'));
  expect(input('locked').checked).toBe(true);
  expect(submitted().map(([name]) => name)).toContain('locked');
});

it('reset returns the switches to their initial state', async () => {
  const { form, root, input, click, fixture } = setup();
  click(input('airplane'));
  click(input('bluetooth'));
  form.reset();
  await new Promise(resolve => setTimeout(resolve));
  flushSync();
  expect(fixture.read()).toBe(false);
  expect(root('airplane').hasAttribute('data-unchecked')).toBe(true);
  expect(root('bluetooth').hasAttribute('data-checked')).toBe(true);
  expect(input('airplane').checked).toBe(false);
  expect(input('bluetooth').checked).toBe(true);
});
