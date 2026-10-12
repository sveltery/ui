import { afterEach, expect, it } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount, type Component } from 'svelte';
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from '$ui/message/index.js';

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

const parts: [string, Component<never>, string, string][] = [
  ['MessageGroup', MessageGroup, 'message-group', 'cn-message-group flex min-w-0 flex-col'],
  ['MessageAvatar', MessageAvatar, 'message-avatar', 'cn-message-avatar flex w-fit shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted'],
  ['MessageContent', MessageContent, 'message-content', 'cn-message-content flex w-full min-w-0 flex-col wrap-break-word'],
  ['MessageHeader', MessageHeader, 'message-header', 'cn-message-header flex max-w-full min-w-0 items-center'],
  ['MessageFooter', MessageFooter, 'message-footer', 'cn-message-footer flex max-w-full min-w-0 items-center group-data-[align=end]/message:justify-end'],
];

for (const [name, component, slot, classes] of parts) {
  it(`${name} renders a div with its slot, upstream classes, props and children`, () => {
    const host = render(component, { children: text, class: 'extra', id: name, 'aria-label': name }).firstElementChild!;
    expect(host.tagName).toBe('DIV');
    expect(host.getAttribute('data-slot')).toBe(slot);
    expect(host.className).toBe(`${classes} extra`);
    expect(host.id).toBe(name);
    expect(host.getAttribute('aria-label')).toBe(name);
    expect(host.querySelector('[data-child]')!.textContent).toBe('child');
  });
}

it('Message defaults to start alignment', () => {
  const host = render(Message, { children: text, class: 'extra' }).firstElementChild!;
  expect(host.tagName).toBe('DIV');
  expect(host.getAttribute('data-slot')).toBe('message');
  expect(host.getAttribute('data-align')).toBe('start');
  expect(host.className).toBe('cn-message group/message relative flex w-full min-w-0 data-[align=end]:flex-row-reverse extra');
  expect(host.querySelector('[data-child]')!.textContent).toBe('child');
});

it('Message applies the end alignment', () => {
  const host = render(Message, { children: text, align: 'end' }).firstElementChild!;
  expect(host.getAttribute('data-align')).toBe('end');
});
