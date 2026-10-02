import type { ComponentProps } from 'svelte';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, type CardProps, type CardHeaderProps, type CardTitleProps, type CardDescriptionProps, type CardActionProps, type CardContentProps, type CardFooterProps } from '../apps/docs/registry/bases/base/ui/card/index.js';
const card: CardProps = { size: 'sm', ref: undefined, class: ['px-3', { 'rounded-none': true }], style: 'color: red', onclick: event => { const node: HTMLDivElement = event.currentTarget; void node; } };
const header: CardHeaderProps = { ref: null, title: 'Header' };
const title: CardTitleProps = { 'aria-label': 'Title' };
const description: CardDescriptionProps = { id: 'description' };
const action: CardActionProps = { onkeydown: event => { const key: KeyboardEvent = event; const node: HTMLDivElement = event.currentTarget; void [key, node]; } };
const content: CardContentProps = { hidden: true };
const footer: CardFooterProps = { dir: 'rtl' };
const components: [ComponentProps<typeof Card>, ComponentProps<typeof CardHeader>, ComponentProps<typeof CardTitle>, ComponentProps<typeof CardDescription>, ComponentProps<typeof CardAction>, ComponentProps<typeof CardContent>, ComponentProps<typeof CardFooter>] = [card, header, title, description, action, content, footer];
// @ts-expect-error Card sizes are bounded to the immutable wrapper.
const huge: CardProps = { size: 'lg' };
// @ts-expect-error Only Card has the size API.
const headerSize: CardHeaderProps = { size: 'sm' };
// @ts-expect-error The pinned type does not allow null size.
const nullSize: CardProps = { size: null };
// @ts-expect-error Native Card hosts have no custom render API.
const render: CardActionProps = { render: () => {} };
// @ts-expect-error Svelte uses class rather than className.
const className: CardTitleProps = { className: 'text-lg' };
// @ts-expect-error Native Svelte styles are CSS strings.
const objectStyle: CardDescriptionProps = { style: { color: 'red' } };
// @ts-expect-error Card is a native div without a form-control API.
const value: CardProps = { value: 'native input' };
void [components, huge, headerSize, nullSize, render, className, objectStyle, value];
