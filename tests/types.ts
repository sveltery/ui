import type { ComponentProps } from 'svelte';
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogOverlay } from '../apps/docs/registry/bases/base/ui/dialog/index.js';
const root: ComponentProps<typeof Dialog> = { modal: 'trap-focus', open: false, onOpenChange(_open, details) { details.cancel(); details.preventUnmountOnClose(); } };
const trigger: ComponentProps<typeof DialogTrigger> = { name: 'open', form: 'profile', disabled: true, nativeButton: false, onclick(event) { event.preventBaseUIHandler(); event.preventDefault(); const button: HTMLButtonElement = event.currentTarget; void button; } };
const content: ComponentProps<typeof DialogContent> = { showCloseButton: false, initialFocus: false, finalFocus: { current: null }, class: state => state.open ? 'p-8' : 'p-4', style: state => `--open:${Number(state.open)}` };
const footer: ComponentProps<typeof DialogFooter> = { showCloseButton: true, class: ['p-4', { 'border-t': true }] };
const overlay: ComponentProps<typeof DialogOverlay> = { forceRender: true, style: 'opacity:0.5', onpointerdown(event) { const pointer: PointerEvent = event; void pointer; } };
// @ts-expect-error The existing Base API rejects CSS objects.
const styleObject: ComponentProps<typeof DialogContent> = { style: { width: 20 } };
// @ts-expect-error showCloseButton is boolean, not a new variant API.
const closeOption: ComponentProps<typeof DialogFooter> = { showCloseButton: 'outline' };
// @ts-expect-error Pointer handlers retain native event inference.
const keyboardAsPointer: ComponentProps<typeof DialogTrigger> = { onpointerdown(_event: KeyboardEvent) {} };
// @ts-expect-error No new detached handle API is invented.
const detached: ComponentProps<typeof Dialog> = { handle: {} };
void [root, trigger, content, footer, overlay, styleObject, closeOption, keyboardAsPointer, detached];

import { Button, type ButtonProps } from '../apps/docs/registry/bases/base/ui/button/index.js';
const styled: ComponentProps<typeof Button> = { variant: 'link', size: 'icon-lg', focusableWhenDisabled: true, class: state => state.disabled ? 'px-6' : 'px-4', style: state => `--disabled:${Number(state.disabled)}`, onclick: event => event.preventBaseUIHandler() };
const nullable: ButtonProps = { variant: null, size: null, ref: null };
// @ts-expect-error no asChild React API
const reactSlot: ButtonProps = { asChild: true };
// @ts-expect-error sizes stay bounded to the pinned Nova API
const huge: ButtonProps = { size: 'xl' };
// @ts-expect-error classes are Svelte class props
const reactClass: ButtonProps = { className: 'px-6' };
void [styled, nullable, reactSlot, huge, reactClass];

import { Textarea } from '../apps/docs/registry/bases/base/ui/textarea/index.js';
const textarea: ComponentProps<typeof Textarea> = { ref: null, value: 'Message', defaultValue: 'Draft', class: ['px-6'], style: 'resize: none', required: true, readonly: true, rows: 6, minlength: 2, maxlength: 40, form: 'message', oninput: event => { const node: HTMLTextAreaElement = event.currentTarget; void node; }, onchange: event => { const node: HTMLTextAreaElement = event.currentTarget; void node; } };
// @ts-expect-error native Textarea has no variant API
const textareaVariant: ComponentProps<typeof Textarea> = { variant: 'outline' };
// @ts-expect-error native Textarea does not replace its host
const textareaRender: ComponentProps<typeof Textarea> = { render: () => {} };
// @ts-expect-error Svelte native CSS is a string
const textareaStyle: ComponentProps<typeof Textarea> = { style: { resize: 'none' } };
// @ts-expect-error Svelte uses class
const textareaClass: ComponentProps<typeof Textarea> = { className: 'px-6' };
void [textarea, textareaVariant, textareaRender, textareaStyle, textareaClass];

import { Skeleton } from '../apps/docs/registry/bases/base/ui/skeleton/index.js';
const skeleton: ComponentProps<typeof Skeleton> = { ref: undefined, class: ['h-4', { 'rounded-none': true }], style: 'width: 32px', onclick: event => { const node: HTMLDivElement = event.currentTarget; void node; } };
// @ts-expect-error Skeleton is a native div, without variant API
const skeletonVariant: ComponentProps<typeof Skeleton> = { variant: 'outline' };
// @ts-expect-error Skeleton retains its native host
const skeletonRender: ComponentProps<typeof Skeleton> = { render: () => {} };
// @ts-expect-error Svelte native CSS is a string
const skeletonStyle: ComponentProps<typeof Skeleton> = { style: { width: 32 } };
// @ts-expect-error Svelte uses class
const skeletonReactClass: ComponentProps<typeof Skeleton> = { className: 'h-4' };
void [skeleton, skeletonVariant, skeletonRender, skeletonStyle, skeletonReactClass];
