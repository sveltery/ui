import type { ComponentProps, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { Separator, type SeparatorProps, type SeparatorState } from '../apps/docs/registry/bases/base/ui/separator/index.js';
const state: SeparatorState = { orientation: 'vertical' };
const props: SeparatorProps = { orientation: 'vertical', class: ['bg-red-500'], style: 'color: red', role: 'presentation', 'aria-orientation': 'horizontal', onclick: event => { const host: HTMLDivElement = event.currentTarget; void host; } };
// @ts-expect-error Base has no refs; consumers pass {@attach}.
const separatorRef: SeparatorProps = { ref: undefined };
const component: ComponentProps<typeof Separator> = props;
const replacement: Snippet<[HTMLAttributes<HTMLDivElement>, SeparatorState]> = null as unknown as Snippet<[HTMLAttributes<HTMLDivElement>, SeparatorState]>;
const rendered: SeparatorProps = { render: replacement };
// @ts-expect-error source orientation is horizontal or vertical only
const invalid: SeparatorProps = { orientation: 'diagonal' };
// @ts-expect-error CSS objects are not the native Svelte style contract
const objectStyle: SeparatorProps = { style: { color: 'red' } };
// @ts-expect-error no invented decorative API
const decorative: SeparatorProps = { decorative: true };
void [state, props, component, separatorRef, rendered, invalid, objectStyle, decorative];
