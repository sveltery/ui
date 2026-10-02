import type { ComponentProps } from 'svelte';
import { Label } from '../apps/docs/registry/bases/base/ui/label/index.js';
const label: ComponentProps<typeof Label> = { for: 'message', ref: undefined, class: ['items-end', { 'items-start': true }], style: 'color: red', onclick: event => { const node: HTMLLabelElement = event.currentTarget; void node; } };
const nullableRef: ComponentProps<typeof Label> = { ref: null };
// @ts-expect-error Label ref targets its native label.
const wrongRef: ComponentProps<typeof Label> = { ref: document.createElement('textarea') };
// @ts-expect-error Svelte uses for rather than React htmlFor.
const reactFor: ComponentProps<typeof Label> = { htmlFor: 'message' };
// @ts-expect-error Svelte uses class rather than React className.
const reactClass: ComponentProps<typeof Label> = { className: 'items-start' };
// @ts-expect-error Native Label has no disabled API; upstream composes a disabled control.
const disabled: ComponentProps<typeof Label> = { disabled: true };
// @ts-expect-error Native Label has no variant API.
const variant: ComponentProps<typeof Label> = { variant: 'default' };
// @ts-expect-error Native host children use Svelte snippets.
const stringChildren: ComponentProps<typeof Label> = { children: 'Message' };
// @ts-expect-error Native Svelte CSS styles are strings.
const objectStyle: ComponentProps<typeof Label> = { style: { color: 'red' } };
// @ts-expect-error Native handlers do not acquire Base event methods.
const baseEvent: ComponentProps<typeof Label> = { onclick: event => event.preventBaseUIHandler() };
void [label, nullableRef, wrongRef, reactFor, reactClass, disabled, variant, stringChildren, objectStyle, baseEvent];
