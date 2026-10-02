import type { ComponentProps } from 'svelte';
import { createAttachmentKey } from 'svelte/attachments';
import { Alert, AlertTitle, AlertDescription, AlertAction, type AlertProps, type AlertTitleProps, type AlertDescriptionProps, type AlertActionProps } from '../apps/docs/registry/bases/base/ui/alert/index.js';
const alert: AlertProps = { variant: 'destructive', ref: undefined, class: ['px-3', { 'rounded-none': true }], style: 'color: red', onclick: event => { const node: HTMLDivElement = event.currentTarget; void node; } };
const nullVariant: AlertProps = { variant: null, role: 'status' };
const title: AlertTitleProps = { ref: null, title: 'Title', [createAttachmentKey()]: (node: HTMLDivElement) => { void node; return () => {}; } };
const description: AlertDescriptionProps = { 'aria-label': 'Description' };
const action: AlertActionProps = { onkeydown: event => { const key: KeyboardEvent = event; const node: HTMLDivElement = event.currentTarget; void [key, node]; } };
const components: [ComponentProps<typeof Alert>, ComponentProps<typeof AlertTitle>, ComponentProps<typeof AlertDescription>, ComponentProps<typeof AlertAction>] = [alert, title, description, action];
// @ts-expect-error Variants follow immutable CVA choices.
const warning: AlertProps = { variant: 'warning' };
// @ts-expect-error Only root Alert has variant.
const titleVariant: AlertTitleProps = { variant: 'default' };
// @ts-expect-error Native div parts have no render API.
const render: AlertActionProps = { render: () => {} };
// @ts-expect-error Svelte class spelling.
const className: AlertTitleProps = { className: 'text-lg' };
// @ts-expect-error Svelte native styles are CSS strings.
const objectStyle: AlertDescriptionProps = { style: { color: 'red' } };
// @ts-expect-error Native div parts have no disabled prop.
const disabled: AlertProps = { disabled: true };
// @ts-expect-error Ref targets actual div, not a button.
const buttonRef: AlertActionProps = { ref: document.createElement('button') };
void [components, nullVariant, warning, titleVariant, render, className, objectStyle, disabled, buttonRef];
