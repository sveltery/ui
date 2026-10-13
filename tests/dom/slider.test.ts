import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import SliderForm from './SliderForm.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  instance = mount(SliderForm, { target: document.body });
  flushSync();
  const form = document.querySelector('form')!;
  const root = (id: string) => document.getElementById(id)!;
  const thumbs = (id: string) => [...root(id).querySelectorAll<HTMLElement>('[data-slot=slider-thumb]')];
  const inputs = (id: string) => thumbs(id).map(thumb => thumb.querySelector<HTMLInputElement>('input[type=range]')!);
  const press = (input: HTMLInputElement, key: string) => {
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    flushSync();
  };
  return { form, root, thumbs, inputs, press, fixture: instance as unknown as { read(): number[]; write(next: number[]): void; commitLog(): string[] } };
}

it('renders root, control, track, range and thumb with the upstream slots and classes', () => {
  const { root, thumbs } = setup();
  const slider = root('single');
  expect(slider.dataset.slot).toBe('slider');
  expect(slider.className).toContain('data-horizontal:w-full data-vertical:h-full');
  expect(slider.getAttribute('data-orientation')).toBe('horizontal');
  const control = slider.querySelector<HTMLElement>('.cn-slider')!;
  expect(control.className).toContain('relative flex w-full touch-none items-center select-none');
  const track = slider.querySelector<HTMLElement>('[data-slot=slider-track]')!;
  expect(track.className).toBe('cn-slider-track relative grow overflow-hidden select-none');
  expect(track.querySelector('[data-slot=slider-range]')!.className).toBe('cn-slider-range select-none data-horizontal:h-full data-vertical:w-full');
  expect(thumbs('single')[0].className).toBe('cn-slider-thumb block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50');
  expect(root('multi').classList.contains('extra')).toBe(true);
});

it('renders one thumb per value', () => {
  const { thumbs } = setup();
  expect(thumbs('single').length).toBe(1);
  expect(thumbs('range').length).toBe(2);
  expect(thumbs('multi').length).toBe(3);
  expect(thumbs('vertical').length).toBe(1);
});

it('defaultValue sets the thumb positions', () => {
  const { inputs } = setup();
  expect(inputs('single').map(input => input.value)).toEqual(['25']);
  expect(inputs('multi').map(input => input.value)).toEqual(['10', '20', '70']);
  expect(inputs('single')[0].getAttribute('aria-valuenow')).toBe('25');
});

it('arrow keys move a thumb by the step and bind:value follows', () => {
  const { inputs, press, fixture } = setup();
  expect(fixture.read()).toEqual([0.3, 0.7]);
  press(inputs('range')[0], 'ArrowRight');
  expect(fixture.read()).toEqual([0.4, 0.7]);
  press(inputs('range')[1], 'ArrowLeft');
  expect(fixture.read()).toEqual([0.4, 0.6]);
  expect(inputs('range').map(input => input.value)).toEqual(['0.4', '0.6']);
});

it('keyboard steps on an uncontrolled slider and stops at the bounds', () => {
  const { inputs, press } = setup();
  press(inputs('single')[0], 'ArrowRight');
  expect(inputs('single')[0].value).toBe('26');
  press(inputs('single')[0], 'Home');
  expect(inputs('single')[0].value).toBe('0');
  press(inputs('single')[0], 'ArrowLeft');
  expect(inputs('single')[0].value).toBe('0');
  press(inputs('single')[0], 'End');
  expect(inputs('single')[0].value).toBe('100');
});

it('writing the bound variable moves the thumbs', () => {
  const { inputs, fixture } = setup();
  fixture.write([0.1, 0.9]);
  flushSync();
  expect(inputs('range').map(input => input.value)).toEqual(['0.1', '0.9']);
});

it('a vertical slider reports its orientation', () => {
  const { root, inputs } = setup();
  expect(root('vertical').getAttribute('data-orientation')).toBe('vertical');
  expect(inputs('vertical')[0].getAttribute('aria-orientation')).toBe('vertical');
});

it('a disabled slider marks its parts and ignores the keyboard', () => {
  const { root, inputs, press } = setup();
  expect(root('off').hasAttribute('data-disabled')).toBe(true);
  expect(root('off').querySelector('.cn-slider')!.hasAttribute('data-disabled')).toBe(true);
  expect(inputs('off')[0].disabled).toBe(true);
  press(inputs('off')[0], 'ArrowRight');
  expect(inputs('off')[0].value).toBe('50');
});

it('submits each thumb value under the slider name and skips a disabled slider', () => {
  const { form } = setup();
  const entries = [...new FormData(form).entries()];
  expect(entries.filter(([name]) => name === 'volume')).toEqual([['volume', '25']]);
  expect(entries.filter(([name]) => name === 'range')).toEqual([['range', '0.3'], ['range', '0.7']]);
  expect(entries.filter(([name]) => name === 'multi')).toEqual([['multi', '10'], ['multi', '20'], ['multi', '70']]);
  expect(entries.filter(([name]) => name === 'off')).toEqual([]);
});

it('reset returns the thumbs to their defaults', async () => {
  const { form, inputs, press } = setup();
  press(inputs('single')[0], 'ArrowRight');
  press(inputs('multi')[2], 'ArrowRight');
  form.reset();
  await new Promise(resolve => setTimeout(resolve));
  flushSync();
  expect(inputs('single')[0].value).toBe('25');
  expect(inputs('multi').map(input => input.value)).toEqual(['10', '20', '70']);
  expect(inputs('multi').map(input => input.getAttribute('aria-valuenow'))).toEqual(['10', '20', '70']);
  expect([...new FormData(form).entries()].filter(([name]) => name === 'volume')).toEqual([['volume', '25']]);
});
