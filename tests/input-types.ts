import type { ComponentProps } from 'svelte';
import { Input, type InputProps } from '../apps/docs/registry/bases/base/ui/input/index.js';
const native: InputProps = { ref: undefined, type: 'email', value: 'hello', defaultValue: 'draft', required: true, readonly: true, maxlength: 40, form: 'external', class: ['px-6', { 'rounded-none': true }], style: 'color: red', oninput: event => { const node: HTMLInputElement = event.currentTarget; void node; }, onchange: event => { const node: HTMLInputElement = event.currentTarget; void node; } };
const component: ComponentProps<typeof Input> = native;
// @ts-expect-error pinned native wrapper does not expose primitive render
const render: InputProps = { render: () => {} };
// @ts-expect-error pinned native wrapper has static classes
const callback: InputProps = { class: () => 'px-6' };
// @ts-expect-error CSS objects require an explicit framework substitution
const style: InputProps = { style: { color: 'red' } };
// @ts-expect-error no new variant API
const variant: InputProps = { variant: 'outline' };
// @ts-expect-error primitive callback is not in the wrapper's native declaration
const change: InputProps = { onValueChange: () => {} };
// @ts-expect-error native input ref cannot target a div
const ref: InputProps = { ref: document.createElement('div') };
void [component, render, callback, style, variant, change, ref];
