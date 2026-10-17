import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, tick, unmount } from 'svelte';
import FieldFixture from './FieldFixture.svelte';
import FieldCardFixture from './FieldCardFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup(errors?: Array<{ message?: string } | undefined>) {
  instance = mount(FieldFixture, { target: document.body, props: { errors } });
  flushSync();
  const fields = [...document.querySelectorAll<HTMLElement>('[data-slot=field]')];
  return { email: fields[0]!, name: fields[1]! };
}

it('renders upstream elements with their slots and orientation classes', () => {
  const { email, name } = setup();
  expect([email.localName, email.getAttribute('role'), email.dataset.orientation]).toEqual(['div', 'group', 'vertical']);
  expect(email.className).toBe('cn-field group/field flex w-full cn-field-orientation-vertical flex-col *:w-full [&>.sr-only]:w-auto extra-field');
  expect(name.dataset.orientation).toBe('horizontal');
  expect(document.querySelector('[data-slot=field-set]')!.localName).toBe('fieldset');
  const legend = document.querySelector<HTMLElement>('[data-slot=field-legend]')!;
  expect([legend.localName, legend.dataset.variant, legend.textContent]).toEqual(['legend', 'label', 'Account']);
  expect(email.querySelector('[data-slot=field-description]')!.localName).toBe('p');
});

it('keeps a hand-set data-invalid or data-disabled from upstream markup', () => {
  const { email, name } = setup();
  expect(email.getAttribute('data-invalid')).toBe('true');
  expect(email.hasAttribute('data-disabled')).toBe(false);
  expect(name.getAttribute('data-disabled')).toBe('true');
  expect(email.querySelector('input')!.getAttribute('aria-invalid')).toBe('true');
});

it('FieldLabel is a Label tied to its control', () => {
  const { email } = setup();
  const label = email.querySelector<HTMLLabelElement>('[data-slot=field-label]')!;
  expect(label.localName).toBe('label');
  expect(label.className).toBe('cn-label items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed cn-field-label group/field-label peer/field-label flex w-fit has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col');
  expect(label.control).toBe(email.querySelector('input'));
});

it('FieldError shows its children, and nothing without children or errors', () => {
  setup();
  expect(document.querySelector('[data-testid=errors]')).toBeNull();
  const error = document.querySelector<HTMLElement>('[data-testid=children]')!;
  expect([error.getAttribute('role'), error.textContent]).toEqual(['alert', 'Enter an email.']);
});

it('FieldError shows one error as text and drops duplicate messages', () => {
  setup([{ message: 'Required.' }, { message: 'Required.' }]);
  expect(document.querySelector('[data-testid=errors]')!.textContent).toBe('Required.'); expect(document.querySelector('[data-testid=errors] ul')).toBeNull();
});

it('FieldError lists several errors', () => {
  setup([{ message: 'Too short.' }, { message: 'Needs a digit.' }]);
  const list = document.querySelector('[data-testid=errors] ul')!;
  expect(list.className).toBe('ml-4 flex list-disc flex-col gap-1');
  expect([...list.querySelectorAll('li')].map(item => item.textContent)).toEqual(['Too short.', 'Needs a digit.']);
});

it('FieldError renders nothing when its only error has no message', () => {
  setup([{}]);
  expect(document.querySelector('[data-testid=errors]')).toBeNull();
});

it('a label card toggles its checkbox, and a description renders anywhere', async () => {
  instance = mount(FieldCardFixture, { target: document.body });
  flushSync();
  const descriptions = [...document.querySelectorAll<HTMLElement>('[data-slot=field-description]')];
  expect(descriptions.map(node => [node.localName, node.textContent])).toEqual([['p', 'Choose what we email you.'], ['p', 'Once a month.']]);
  const checkbox = document.querySelector<HTMLElement>('[role=checkbox]')!;
  expect(checkbox.getAttribute('aria-checked')).toBe('false');
  document.querySelector<HTMLElement>('[data-slot=field-label]:not([class*=cn-field-title])')!.querySelector<HTMLElement>('.cn-field-title')!.click();
  await tick(); flushSync();
  expect(checkbox.getAttribute('aria-checked')).toBe('true');
});
