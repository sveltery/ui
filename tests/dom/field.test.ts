import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, tick, unmount } from 'svelte';
import FieldFixture from './FieldFixture.svelte';
import FieldCardFixture from './FieldCardFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup(errors?: Record<string, string | string[]>) {
  instance = mount(FieldFixture, { target: document.body, props: { errors } });
  flushSync();
  const fields = [...document.querySelectorAll<HTMLElement>('[data-slot=field]')];
  return { email: fields[0]!, name: fields[1]!, code: fields[2]! };
}

it('renders upstream elements with their slots and orientation classes', () => {
  const { email, name } = setup();
  expect([email.localName, email.getAttribute('role'), email.dataset.orientation]).toEqual(['div', 'group', 'vertical']);
  expect(email.className).toBe('cn-field group/field flex w-full cn-field-orientation-vertical flex-col *:w-full [&>.sr-only]:w-auto extra-field');
  expect(name.dataset.orientation).toBe('horizontal');
  expect(document.querySelector('[data-slot=field-set]')!.localName).toBe('fieldset');
  const legend = document.querySelector<HTMLElement>('[data-slot=field-legend]')!;
  expect([legend.localName, legend.dataset.variant, legend.textContent]).toEqual(['div', 'label', 'Account']);
  expect(document.querySelector('[data-slot=field-set]')!.getAttribute('aria-labelledby')).toBe(legend.id);
  expect(email.querySelector('[data-slot=field-description]')!.localName).toBe('p');
  expect(document.querySelector('[data-slot=form]')!.localName).toBe('form');
});

it('marks a Field and its control from the invalid and disabled props', () => {
  const { email, name, code } = setup();
  expect([code.getAttribute('data-invalid'), code.querySelector('input')!.getAttribute('aria-invalid')]).toEqual(['', 'true']);
  expect(email.hasAttribute('data-invalid')).toBe(false);
  expect([name.getAttribute('data-disabled'), name.querySelector('input')!.disabled]).toEqual(['', true]);
});

it('FieldLabel is a Label tied to its control and FieldDescription describes it', () => {
  const { email } = setup();
  const label = email.querySelector<HTMLLabelElement>('[data-slot=field-label]')!;
  const input = email.querySelector('input')!;
  expect(label.localName).toBe('label');
  expect(label.className).toBe('cn-label items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed cn-field-label group/field-label peer/field-label flex w-fit has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col');
  expect(label.control).toBe(input);
  expect(input.getAttribute('aria-describedby')).toContain(email.querySelector('[data-slot=field-description]')!.id);
});

it('FieldError shows static children with match, and FieldError and FormError show nothing without errors', () => {
  setup();
  expect(document.querySelector('[data-testid=errors]')).toBeNull();
  expect(document.querySelector('[data-testid=form-error]')).toBeNull();
  const error = document.querySelector<HTMLElement>('[data-testid=children]')!;
  expect([error.getAttribute('role'), error.dataset.slot, error.textContent]).toEqual(['alert', 'field-error', 'Enter a code.']);
});

it('FieldError shows the Form error for its name as text and marks the Field invalid', () => {
  const { email } = setup({ email: 'Already registered.' });
  expect(document.querySelector('[data-testid=errors]')!.textContent).toBe('Already registered.');
  expect(document.querySelector('[data-testid=errors] ul')).toBeNull();
  expect(email.hasAttribute('data-invalid')).toBe(true);
});

it('FieldError lists several errors', () => {
  setup({ email: ['Too short.', 'Needs a digit.'] });
  const list = document.querySelector('[data-testid=errors] ul')!;
  expect(list.className).toBe('ml-4 flex list-disc flex-col gap-1');
  expect([...list.querySelectorAll('li')].map(item => item.textContent)).toEqual(['Too short.', 'Needs a digit.']);
});

it('FormError shows the messages that belong to no field', () => {
  setup({ '': 'Try again later.' });
  const error = document.querySelector<HTMLElement>('[data-testid=form-error]')!;
  expect([error.getAttribute('role'), error.dataset.slot, error.className, error.textContent]).toEqual(['alert', 'form-error', 'cn-field-error font-normal', 'Try again later.']);
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
