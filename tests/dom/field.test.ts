import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, tick, unmount } from 'svelte';
import FieldForm from './FieldForm.svelte';

type Fixture = { setErrors(next: Record<string, string>): void };
let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  const submits: Record<string, unknown>[] = [];
  instance = mount(FieldForm, { target: document.body, props: { submits } });
  flushSync();
  const field = (label: string) => [...document.querySelectorAll<HTMLElement>('[data-slot=field]')].find(node => node.querySelector('[data-slot=field-label]')?.textContent === label)!;
  const named = (node: Element) => document.getElementById(node.getAttribute('aria-labelledby')!)!.textContent;
  const submit = async () => { document.querySelector<HTMLButtonElement>('button')!.click(); await tick(); flushSync(); };
  return { submits, field, named, submit, fixture: instance as unknown as Fixture };
}

it('renders a Base field with the upstream slots and orientation classes', () => {
  const { field } = setup();
  const email = field('Email');
  expect(email.getAttribute('role')).toBe('group');
  expect(email.dataset.orientation).toBe('vertical');
  expect(email.className).toBe('cn-field group/field flex w-full cn-field-orientation-vertical flex-col *:w-full [&>.sr-only]:w-auto extra-field');
  expect(field('Accept the terms').dataset.orientation).toBe('horizontal');
  expect(email.querySelector('[data-slot=field-description]')!.localName).toBe('p');
});

it('labels and describes the control inside the field', () => {
  const { field, named } = setup();
  const email = field('Email');
  const input = email.querySelector('input')!;
  const label = email.querySelector('label')!;
  expect(label.htmlFor).toBe(input.id);
  expect(named(input)).toBe('Email');
  expect(document.getElementById(input.getAttribute('aria-describedby')!)!.textContent).toBe('We send the receipt here.');
  expect(input.name).toBe('email');
});

it('names the checkbox, switch and radios from their field labels', () => {
  const { field, named } = setup();
  expect(named(field('Accept the terms').querySelector('[role=checkbox]')!)).toBe('Accept the terms');
  expect(named(field('Newsletter').querySelector('[role=switch]')!)).toBe('Newsletter');
  const radios = [...document.querySelectorAll('[role=radio]')];
  expect(radios.map(named)).toEqual(['Free', 'Pro']);
  const group = document.querySelector('[role=radiogroup]')!;
  expect(named(group)).toBe('Plan');
  expect(named(document.querySelector('fieldset')!)).toBe('Plan');
  expect(document.querySelector<HTMLElement>('[data-slot=field-legend]')!.dataset.variant).toBe('label');
});

it('a failed constraint blocks the submit and shows the message as an alert', async () => {
  const { field, submit, submits } = setup();
  expect(field('Email').querySelector('[data-slot=field-error]')).toBeNull();
  await submit();
  expect(submits).toEqual([]);
  const email = field('Email');
  const input = email.querySelector('input')!;
  const error = email.querySelector<HTMLElement>('[data-slot=field-error]')!;
  expect(email.hasAttribute('data-invalid')).toBe(true);
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(error.getAttribute('role')).toBe('alert');
  expect(error.textContent).toBe(input.validationMessage);
  expect(input.getAttribute('aria-describedby')!.split(' ')).toEqual([email.querySelector('p')!.id, error.id]);
});

it('submits each named field once the constraints pass', async () => {
  const { field, submit, submits } = setup();
  const input = field('Email').querySelector('input')!;
  input.value = 'alice@example.com';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  field('Accept the terms').querySelector<HTMLElement>('[role=checkbox]')!.click();
  await submit();
  expect(submits).toEqual([{ email: 'alice@example.com', agree: true, newsletter: false, plan: 'free' }]);
});

it('FormError shows the errors no field claims, and FieldError the field ones', async () => {
  const { field, fixture } = setup();
  fixture.setErrors({ email: 'Email already taken', form: 'Signups are closed' });
  await tick(); flushSync();
  const formError = document.querySelector<HTMLElement>('[data-slot=form-error]')!;
  expect(formError.getAttribute('role')).toBe('alert');
  expect(formError.className).toBe('cn-field-error font-normal [&>ul]:ml-4 [&>ul]:flex [&>ul]:list-disc [&>ul]:flex-col [&>ul]:gap-1');
  expect(formError.textContent).toBe('Signups are closed');
  expect(field('Email').querySelector('[data-slot=field-error]')!.textContent).toBe('Email already taken');
});
