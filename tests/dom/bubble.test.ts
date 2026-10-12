import { afterEach, expect, it } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount, type Component } from 'svelte';
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from '$ui/bubble/index.js';
import RenderFixture from './RenderFixture.svelte';

const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => {
  for (const instance of mounted.splice(0)) await unmount(instance);
  document.body.replaceChildren();
});

function render(component: Component<never>, props: Record<string, unknown> = {}) {
  const target = document.createElement('div');
  document.body.append(target);
  mounted.push(mount(component as Component<Record<string, unknown>>, { target, props }));
  flushSync();
  return target;
}

const text = createRawSnippet(() => ({ render: () => '<span data-child>child</span>' }));

it('BubbleGroup renders a column div', () => {
  const host = render(BubbleGroup, { children: text, class: 'gap-1', id: 'group' }).firstElementChild!;
  expect(host.tagName).toBe('DIV');
  expect(host.getAttribute('data-slot')).toBe('bubble-group');
  expect(host.id).toBe('group');
  expect(host.className).toBe('cn-bubble-group flex min-w-0 flex-col gap-1');
  expect(host.querySelector('[data-child]')!.textContent).toBe('child');
});

it('Bubble defaults to the start-aligned default variant', () => {
  const host = render(Bubble, { children: text, class: 'extra' }).firstElementChild!;
  expect(host.tagName).toBe('DIV');
  expect(host.getAttribute('data-slot')).toBe('bubble');
  expect(host.getAttribute('data-variant')).toBe('default');
  expect(host.getAttribute('data-align')).toBe('start');
  expect(host.className).toBe('cn-bubble group/bubble relative flex w-fit min-w-0 flex-col cn-bubble-variant-default extra');
  expect(host.querySelector('[data-child]')!.textContent).toBe('child');
});

for (const variant of ['secondary', 'muted', 'tinted', 'outline', 'ghost', 'destructive']) {
  it(`Bubble variant ${variant} sets its data attribute and class`, () => {
    const host = render(Bubble, { children: text, variant, align: 'end' }).firstElementChild!;
    expect(host.getAttribute('data-variant')).toBe(variant);
    expect(host.getAttribute('data-align')).toBe('end');
    expect(host.classList.contains(`cn-bubble-variant-${variant}`)).toBe(true);
    expect(host.classList.contains('cn-bubble-variant-default')).toBe(false);
  });
}

it('BubbleContent renders a div with the upstream classes', () => {
  const host = render(BubbleContent, { children: text, class: 'whitespace-pre-line', id: 'content' }).firstElementChild!;
  expect(host.tagName).toBe('DIV');
  expect(host.getAttribute('data-slot')).toBe('bubble-content');
  expect(host.id).toBe('content');
  expect(host.className).toBe('cn-bubble-content w-fit max-w-full min-w-0 overflow-hidden wrap-break-word [button]:text-left [button,a]:transition-colors whitespace-pre-line');
  expect(host.querySelector('[data-child]')!.textContent).toBe('child');
});

it('BubbleContent renders through a render snippet onto a link', () => {
  const link = render(RenderFixture, { component: BubbleContent }).querySelector('a')!;
  expect(link.getAttribute('href')).toBe('/docs');
  expect(link.getAttribute('data-slot')).toBe('bubble-content');
  expect(link.getAttribute('data-state-slot')).toBe('bubble-content');
  expect(link.classList.contains('cn-bubble-content')).toBe(true);
  expect(link.textContent!.trim()).toBe('Link text');
  expect(document.querySelector('div[data-slot="bubble-content"]')).toBe(null);
});

it('BubbleReactions defaults to the bottom end placement', () => {
  const host = render(BubbleReactions, { children: text, role: 'img', 'aria-label': 'Reaction: thumbs up' }).firstElementChild!;
  expect(host.tagName).toBe('DIV');
  expect(host.getAttribute('data-slot')).toBe('bubble-reactions');
  expect(host.getAttribute('data-side')).toBe('bottom');
  expect(host.getAttribute('data-align')).toBe('end');
  expect(host.getAttribute('role')).toBe('img');
  expect(host.getAttribute('aria-label')).toBe('Reaction: thumbs up');
  expect(host.className).toBe('cn-bubble-reactions absolute z-10 flex w-fit items-center justify-center cn-bubble-reactions-side-bottom cn-bubble-reactions-align-end');
});

it('BubbleReactions applies side and align', () => {
  const host = render(BubbleReactions, { children: text, side: 'top', align: 'start', class: 'px-1.5' }).firstElementChild!;
  expect(host.getAttribute('data-side')).toBe('top');
  expect(host.getAttribute('data-align')).toBe('start');
  expect(host.classList.contains('cn-bubble-reactions-side-top')).toBe(true);
  expect(host.classList.contains('cn-bubble-reactions-align-start')).toBe(true);
  expect(host.classList.contains('cn-bubble-reactions-side-bottom')).toBe(false);
  expect(host.classList.contains('px-1.5')).toBe(true);
});
