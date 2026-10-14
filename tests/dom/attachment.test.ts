import { afterEach, expect, it } from 'vitest';
import { createRawSnippet, flushSync, mount, tick, unmount, type Component } from 'svelte';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from '$ui/attachment/index.js';
import AttachmentDialogFixture from './AttachmentDialogFixture.svelte';
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

it('Attachment defaults to a horizontal default-size done div', () => {
  const host = render(Attachment, { children: text, class: 'w-full', id: 'file' }).firstElementChild!;
  expect(host.tagName).toBe('DIV');
  expect(host.getAttribute('data-slot')).toBe('attachment');
  expect(host.getAttribute('data-state')).toBe('done');
  expect(host.getAttribute('data-size')).toBe('default');
  expect(host.getAttribute('data-orientation')).toBe('horizontal');
  expect(host.id).toBe('file');
  expect(host.className).toBe('cn-attachment group/attachment relative flex max-w-full min-w-0 shrink-0 flex-wrap border bg-card text-card-foreground transition-colors has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed cn-attachment-size-default cn-attachment-orientation-horizontal items-center w-full');
  expect(host.querySelector('[data-child]')!.textContent).toBe('child');
});

it('Attachment applies state, size and orientation', () => {
  const host = render(Attachment, { children: text, state: 'error', size: 'xs', orientation: 'vertical' }).firstElementChild!;
  expect(host.getAttribute('data-state')).toBe('error');
  expect(host.getAttribute('data-size')).toBe('xs');
  expect(host.getAttribute('data-orientation')).toBe('vertical');
  expect(host.classList.contains('cn-attachment-size-xs')).toBe(true);
  expect(host.classList.contains('cn-attachment-orientation-vertical')).toBe(true);
  expect(host.classList.contains('flex-col')).toBe(true);
  expect(host.classList.contains('items-center')).toBe(false);
});

it('AttachmentMedia defaults to the icon variant and switches to image', () => {
  const icon = render(AttachmentMedia, { children: text }).firstElementChild!;
  expect(icon.getAttribute('data-slot')).toBe('attachment-media');
  expect(icon.getAttribute('data-variant')).toBe('icon');
  expect(icon.classList.contains('cn-attachment-media-variant-icon')).toBe(true);
  const image = render(AttachmentMedia, { children: text, variant: 'image' }).firstElementChild!;
  expect(image.getAttribute('data-variant')).toBe('image');
  expect(image.classList.contains('cn-attachment-media-variant-image')).toBe(true);
  expect(image.classList.contains('cn-attachment-media-variant-icon')).toBe(false);
});

const parts: [string, Component<never>, string, string, string][] = [
  ['AttachmentGroup', AttachmentGroup, 'div', 'attachment-group', 'cn-attachment-group flex min-w-0 scroll-fade-x snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start'],
  ['AttachmentContent', AttachmentContent, 'div', 'attachment-content', 'cn-attachment-content max-w-full min-w-0 flex-1'],
  ['AttachmentTitle', AttachmentTitle, 'span', 'attachment-title', 'cn-attachment-title block max-w-full min-w-0 truncate group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer'],
  ['AttachmentDescription', AttachmentDescription, 'span', 'attachment-description', 'cn-attachment-description block min-w-0 truncate text-muted-foreground group-data-[state=error]/attachment:text-destructive/80 max-w-full'],
  ['AttachmentActions', AttachmentActions, 'div', 'attachment-actions', 'cn-attachment-actions flex shrink-0 items-center'],
];

for (const [name, component, tag, slot, classes] of parts) {
  it(`${name} renders a ${tag} with its slot, upstream classes, props and children`, () => {
    const host = render(component, { children: text, class: 'extra', id: name, 'aria-label': name }).firstElementChild!;
    expect(host.localName).toBe(tag);
    expect(host.getAttribute('data-slot')).toBe(slot);
    expect(host.className).toBe(`${classes} extra`);
    expect(host.id).toBe(name);
    expect(host.getAttribute('aria-label')).toBe(name);
    expect(host.querySelector('[data-child]')!.textContent).toBe('child');
  });
}

it('AttachmentAction is a ghost icon-xs button by default', () => {
  const button = render(AttachmentAction, { children: text, 'aria-label': 'Remove', class: 'extra' }).firstElementChild!;
  expect(button.tagName).toBe('BUTTON');
  expect(button.getAttribute('data-slot')).toBe('attachment-action');
  expect(button.getAttribute('aria-label')).toBe('Remove');
  expect(button.classList.contains('cn-button-variant-ghost')).toBe(true);
  expect(button.classList.contains('cn-button-size-icon-xs')).toBe(true);
  expect(button.classList.contains('cn-attachment-action')).toBe(true);
  expect(button.classList.contains('extra')).toBe(true);
});

it('AttachmentAction accepts its own variant and size', () => {
  const button = render(AttachmentAction, { children: text, variant: 'outline', size: 'sm' }).firstElementChild!;
  expect(button.classList.contains('cn-button-variant-outline')).toBe(true);
  expect(button.classList.contains('cn-button-size-sm')).toBe(true);
  expect(button.classList.contains('cn-button-variant-ghost')).toBe(false);
});

it('AttachmentAction falls back to ghost for a null variant', () => {
  const button = render(AttachmentAction, { children: text, variant: null }).firstElementChild!;
  expect(button.classList.contains('cn-button-variant-ghost')).toBe(true);
});

it('AttachmentAction clicks reach the caller', () => {
  let clicks = 0;
  const button = render(AttachmentAction, { children: text, onclick: () => clicks++ }).firstElementChild as HTMLButtonElement;
  button.click();
  expect(clicks).toBe(1);
});

it('AttachmentTrigger is an absolutely positioned type=button button', () => {
  const button = render(AttachmentTrigger, { 'aria-label': 'Open', class: 'extra' }).firstElementChild!;
  expect(button.tagName).toBe('BUTTON');
  expect(button.getAttribute('data-slot')).toBe('attachment-trigger');
  expect(button.getAttribute('type')).toBe('button');
  expect(button.getAttribute('aria-label')).toBe('Open');
  expect(button.className).toBe('cn-attachment-trigger absolute inset-0 z-10 outline-none extra');
});

it('AttachmentTrigger keeps an explicit type', () => {
  const button = render(AttachmentTrigger, { type: 'submit' }).firstElementChild!;
  expect(button.getAttribute('type')).toBe('submit');
});

it('AttachmentTrigger renders through a render snippet without forcing type', () => {
  const link = render(RenderFixture, { component: AttachmentTrigger }).querySelector('a')!;
  expect(link.getAttribute('href')).toBe('/docs');
  expect(link.getAttribute('data-slot')).toBe('attachment-trigger');
  expect(link.getAttribute('data-state-slot')).toBe('attachment-trigger');
  expect(link.hasAttribute('type')).toBe(false);
  expect(link.classList.contains('cn-attachment-trigger')).toBe(true);
  expect(link.textContent!.trim()).toBe('Link text');
  expect(document.querySelector('button[data-slot="attachment-trigger"]')).toBe(null);
});

it('AttachmentTrigger keeps a caller type when a render snippet is given', () => {
  const link = render(RenderFixture, { component: AttachmentTrigger, type: 'submit' }).querySelector('a')!;
  expect(link.getAttribute('type')).toBe('submit');
});

it('a DialogTrigger can render an AttachmentTrigger and opens the dialog', async () => {
  render(AttachmentDialogFixture);
  const trigger = document.querySelector<HTMLButtonElement>('button[aria-label="Preview"]')!;
  expect(trigger.className).toContain('cn-attachment-trigger');
  expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  expect(document.querySelector('[role=dialog]')).toBe(null);
  trigger.click();
  await tick();
  await new Promise(resolve => setTimeout(resolve, 70));
  expect(document.querySelector('[role=dialog]')!.textContent).toContain('Preview title');
});
