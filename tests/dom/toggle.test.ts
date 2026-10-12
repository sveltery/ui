import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import ToggleFixture from './ToggleFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  instance = mount(ToggleFixture, { target: document.body });
  flushSync();
  const toggle = (label: string) => document.querySelector<HTMLButtonElement>(`button[aria-label=${label}]`)!;
  return { toggle, fixture: instance as unknown as { isPressed(): boolean; setPressed(next: boolean): void; changeLog(): boolean[] } };
}

it('renders a button with the slot and the default variant and size classes', () => {
  const { toggle } = setup();
  const bold = toggle('Bold');
  expect(bold.localName).toBe('button');
  expect(bold.type).toBe('button');
  expect(bold.dataset.slot).toBe('toggle');
  expect(bold.className).toBe('cn-toggle group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none hover:bg-muted focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cn-toggle-variant-default cn-toggle-size-default');
});

it('takes the variant, size and extra class', () => {
  const { toggle } = setup();
  const classes = [...toggle('Italic').classList];
  expect(classes).toContain('cn-toggle-variant-outline');
  expect(classes).toContain('cn-toggle-size-lg');
  expect(classes.at(-1)).toBe('extra');
});

it('a click presses and releases it, and bind:pressed follows', () => {
  const { toggle, fixture } = setup();
  const bold = toggle('Bold');
  expect(bold.getAttribute('aria-pressed')).toBe('false');
  expect(bold.hasAttribute('data-pressed')).toBe(false);
  bold.click();
  flushSync();
  expect(fixture.isPressed()).toBe(true);
  expect(bold.getAttribute('aria-pressed')).toBe('true');
  expect(bold.hasAttribute('data-pressed')).toBe(true);
  bold.click();
  flushSync();
  expect(fixture.isPressed()).toBe(false);
  expect(fixture.changeLog()).toEqual([true, false]);
});

it('writing the bound variable presses the toggle', () => {
  const { toggle, fixture } = setup();
  fixture.setPressed(true);
  flushSync();
  expect(toggle('Bold').getAttribute('aria-pressed')).toBe('true');
});

it('a plain pressed prop sets the initial state and the toggle keeps toggling', () => {
  const { toggle } = setup();
  const italic = toggle('Italic');
  expect(italic.getAttribute('aria-pressed')).toBe('true');
  italic.click();
  flushSync();
  expect(italic.getAttribute('aria-pressed')).toBe('false');
});

it('a disabled toggle ignores clicks', () => {
  const { toggle } = setup();
  const underline = toggle('Underline');
  expect(underline.disabled).toBe(true);
  underline.click();
  flushSync();
  expect(underline.getAttribute('aria-pressed')).toBe('false');
});

it('preventDefault in onclick skips the toggle', () => {
  const { toggle } = setup();
  toggle('Cancelled').click();
  flushSync();
  expect(toggle('Cancelled').getAttribute('aria-pressed')).toBe('false');
});
