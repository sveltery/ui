import type { ComponentProps, Snippet } from 'svelte';
import { Separator, type SeparatorProps, type SeparatorState } from '../apps/docs/registry/bases/base/ui/separator/index.js';
const state: SeparatorState = { orientation: 'vertical' };
const props: SeparatorProps = { orientation: 'vertical', class: ['bg-red-500'], style: value => `color: ${value.orientation === 'vertical' ? 'red' : 'green'}`, ref: undefined, role: 'presentation', 'aria-orientation': 'horizontal', onclick: event => { const host: HTMLDivElement = event.currentTarget; void host; } };
const advertisedIgnoredClass: SeparatorProps = { class: value => value.orientation };
const component: ComponentProps<typeof Separator> = props;
const replacement: Snippet<[Record<string | symbol, unknown>, SeparatorState, Snippet | undefined]> = null as unknown as Snippet<[Record<string | symbol, unknown>, SeparatorState, Snippet | undefined]>;
const rendered: SeparatorProps = { render: replacement };
// @ts-expect-error source orientation is horizontal or vertical only
const invalid: SeparatorProps = { orientation: 'diagonal' };
// @ts-expect-error CSS objects are not the native Svelte style contract
const objectStyle: SeparatorProps = { style: { color: 'red' } };
// @ts-expect-error no invented decorative API
const decorative: SeparatorProps = { decorative: true };
void [state, props, component, advertisedIgnoredClass, rendered, invalid, objectStyle, decorative];
