import { afterEach, expect, it } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount, type Component } from 'svelte';
import { createAttachmentKey } from 'svelte/attachments';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '$ui/alert/index.js';
import { AspectRatio } from '$ui/aspect-ratio/index.js';
import { AvatarBadge, AvatarGroup, AvatarGroupCount } from '$ui/avatar/index.js';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$ui/card/index.js';
import { DialogHeader } from '$ui/dialog/index.js';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '$ui/empty/index.js';
import { Kbd, KbdGroup } from '$ui/kbd/index.js';
import { Label } from '$ui/label/index.js';
import { Skeleton } from '$ui/skeleton/index.js';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '$ui/table/index.js';

const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => {
  for (const instance of mounted.splice(0)) await unmount(instance);
  document.body.replaceChildren();
});

const child = createRawSnippet(() => ({ render: () => '<span data-child>child</span>' }));

function render(component: Component<never>, props: Record<string | symbol, unknown> = {}, host: HTMLElement = document.body) {
  const target = document.createElement('div');
  host.append(target);
  mounted.push(mount(component as Component<Record<string | symbol, unknown>>, { target, props: { children: child, ...props } }));
  flushSync();
  return target;
}

const parts: [string, Component<never>, string, string, string][] = [
  ['Alert', Alert, 'div', 'alert', 'cn-alert'],
  ['AlertTitle', AlertTitle, 'div', 'alert-title', 'cn-alert-title'],
  ['AlertDescription', AlertDescription, 'div', 'alert-description', 'cn-alert-description'],
  ['AlertAction', AlertAction, 'div', 'alert-action', 'cn-alert-action'],
  ['AspectRatio', AspectRatio, 'div', 'aspect-ratio', 'aspect-(--ratio)'],
  ['AvatarBadge', AvatarBadge, 'span', 'avatar-badge', 'cn-avatar-badge'],
  ['AvatarGroup', AvatarGroup, 'div', 'avatar-group', 'cn-avatar-group'],
  ['AvatarGroupCount', AvatarGroupCount, 'div', 'avatar-group-count', 'cn-avatar-group-count'],
  ['Card', Card, 'div', 'card', 'cn-card'],
  ['CardHeader', CardHeader, 'div', 'card-header', 'cn-card-header'],
  ['CardTitle', CardTitle, 'div', 'card-title', 'cn-card-title'],
  ['CardDescription', CardDescription, 'div', 'card-description', 'cn-card-description'],
  ['CardAction', CardAction, 'div', 'card-action', 'cn-card-action'],
  ['CardContent', CardContent, 'div', 'card-content', 'cn-card-content'],
  ['CardFooter', CardFooter, 'div', 'card-footer', 'cn-card-footer'],
  ['DialogHeader', DialogHeader, 'div', 'dialog-header', 'cn-dialog-header'],
  ['Empty', Empty, 'div', 'empty', 'cn-empty'],
  ['EmptyHeader', EmptyHeader, 'div', 'empty-header', 'cn-empty-header'],
  ['EmptyTitle', EmptyTitle, 'div', 'empty-title', 'cn-empty-title'],
  ['EmptyDescription', EmptyDescription, 'div', 'empty-description', 'cn-empty-description'],
  ['EmptyContent', EmptyContent, 'div', 'empty-content', 'cn-empty-content'],
  ['EmptyMedia', EmptyMedia, 'div', 'empty-icon', 'cn-empty-media'],
  ['Kbd', Kbd, 'kbd', 'kbd', 'cn-kbd'],
  ['KbdGroup', KbdGroup, 'kbd', 'kbd-group', 'cn-kbd-group'],
  ['Label', Label, 'label', 'label', 'cn-label'],
  ['Skeleton', Skeleton, 'div', 'skeleton', 'cn-skeleton'],
  ['TableHeader', TableHeader, 'thead', 'table-header', 'cn-table-header'],
  ['TableBody', TableBody, 'tbody', 'table-body', 'cn-table-body'],
  ['TableFooter', TableFooter, 'tfoot', 'table-footer', 'cn-table-footer'],
  ['TableRow', TableRow, 'tr', 'table-row', 'cn-table-row'],
];

for (const [name, component, tag, slot, token] of parts) {
  it(`${name} renders a ${tag} with its slot, classes, props, children and attachments`, async () => {
    let attached: Element | null = null;
    let detached = 0;
    const attach = (node: Element) => { attached = node; return () => { detached++; }; };
    const target = render(component, { class: ['p-2', { 'p-4': true }], id: name, 'aria-label': name, ratio: 1, [createAttachmentKey()]: attach });
    const host = target.querySelector<HTMLElement>(`[data-slot="${slot}"]`)!;
    expect(host.localName).toBe(tag);
    expect(host.id).toBe(name);
    expect(host.getAttribute('aria-label')).toBe(name);
    expect(host.classList.contains(token)).toBe(true);
    expect(host.classList.contains('p-4')).toBe(true);
    expect(host.classList.contains('p-2')).toBe(false);
    expect(host.querySelector('[data-child]')!.textContent).toBe('child');
    expect(attached).toBe(host);
    await unmount(mounted.pop()!);
    expect(detached).toBe(1);
  });
}

it('table cells keep their native hosts inside a table', () => {
  const table = document.createElement('table');
  const row = table.insertRow();
  document.body.append(table);
  mounted.push(mount(TableHead, { target: row, props: { children: child, scope: 'col' } }));
  mounted.push(mount(TableCell, { target: row, props: { children: child, colspan: 2 } }));
  mounted.push(mount(TableCaption, { target: table, props: { children: child } }));
  flushSync();
  expect(row.querySelector('[data-slot=table-head]')!.outerHTML).toBe('<th data-slot="table-head" scope="col" class="cn-table-head cn-table-head-aria"><span data-child="">child</span><!----></th>');
  expect(row.querySelector('[data-slot=table-cell]')!.outerHTML).toBe('<td data-slot="table-cell" colspan="2" class="cn-table-cell cn-table-cell-aria"><span data-child="">child</span><!----></td>');
  expect(table.querySelector('caption')!.dataset.slot).toBe('table-caption');
});

it('Table wraps the table in a scroll container', () => {
  const target = render(Table, { class: 'w-auto' });
  const container = target.querySelector('[data-slot=table-container]')!;
  expect(container.className).toBe('cn-table-container');
  expect(container.firstElementChild!.outerHTML).toBe('<table data-slot="table" class="cn-table w-auto"><span data-child="">child</span><!----></table>');
});

it('Alert announces itself and switches variant classes', () => {
  const target = render(Alert, { variant: 'destructive' });
  const alert = target.querySelector('[data-slot=alert]')!;
  expect(alert.getAttribute('role')).toBe('alert');
  expect(alert.className).toBe('cn-alert group/alert relative w-full cn-alert-variant-destructive');
});

it('Card and EmptyMedia expose their size and variant as data attributes', () => {
  const target = render(Card, {});
  render(Card, { size: 'sm' }, target);
  render(EmptyMedia, { variant: 'icon' }, target);
  expect([...target.querySelectorAll('[data-slot=card]')].map(node => node.getAttribute('data-size'))).toEqual(['default', 'sm']);
  const media = target.querySelector('[data-slot=empty-icon]')!;
  expect(media.getAttribute('data-variant')).toBe('icon');
  expect(media.classList.contains('cn-empty-media-icon')).toBe(true);
});

it('AspectRatio sets the ratio custom property', () => {
  const target = render(AspectRatio, { ratio: 16 / 9 });
  expect(target.querySelector<HTMLElement>('[data-slot=aspect-ratio]')!.style.getPropertyValue('--ratio')).toBe('1.7777777777777777');
});

it('Label activates its associated control', () => {
  const target = render(Label, { for: 'terms' });
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = 'terms';
  target.append(input);
  target.querySelector<HTMLLabelElement>('[data-slot=label]')!.click();
  expect(input.checked).toBe(true);
  expect([...input.labels!].map(label => label.dataset.slot)).toEqual(['label']);
});
