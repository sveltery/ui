import type { ComponentProps } from 'svelte';
import { createAttachmentKey } from 'svelte/attachments';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia, type EmptyProps, type EmptyHeaderProps, type EmptyTitleProps, type EmptyDescriptionProps, type EmptyContentProps, type EmptyMediaProps } from '../apps/docs/registry/bases/base/ui/empty/index.js';
const empty: EmptyProps = { ref: undefined, class: ['w-auto', { 'text-left': true }], style: 'color: red', onclick: event => { const node: HTMLDivElement = event.currentTarget; void node; } };
const header: EmptyHeaderProps = { ref: null, title: 'Header', onkeydown: event => { const keyboard: KeyboardEvent = event; const node: HTMLDivElement = event.currentTarget; void [keyboard, node]; } };
const title: EmptyTitleProps = { 'aria-label': 'Title' };
const description: EmptyDescriptionProps = { ref: document.createElement('div'), onclick: event => { const node: HTMLDivElement = event.currentTarget; void node; } };
const content: EmptyContentProps = { hidden: true, [createAttachmentKey()]: node => { const element: Element = node; void element; } };
const media: EmptyMediaProps = { variant: 'icon', dir: 'rtl' };
const components: [ComponentProps<typeof Empty>, ComponentProps<typeof EmptyHeader>, ComponentProps<typeof EmptyTitle>, ComponentProps<typeof EmptyDescription>, ComponentProps<typeof EmptyContent>, ComponentProps<typeof EmptyMedia>] = [empty, header, title, description, content, media];
const mediaDefault: ComponentProps<typeof EmptyMedia> = { variant: 'default' };
const mediaNull: ComponentProps<typeof EmptyMedia> = { variant: null };
const mediaUndefined: ComponentProps<typeof EmptyMedia> = { variant: undefined };
// @ts-expect-error EmptyMedia variants are bounded to the pinned CVA contract.
const unsupportedVariant: EmptyMediaProps = { variant: 'image' };
// @ts-expect-error Only EmptyMedia has the variant API.
const headerVariant: EmptyHeaderProps = { variant: 'icon' };
// @ts-expect-error Native Empty has no size API.
const size: EmptyProps = { size: 'sm' };
// @ts-expect-error Native EmptyTitle has no custom render API.
const render: EmptyTitleProps = { render: () => {} };
// @ts-expect-error Svelte uses class rather than className.
const className: EmptyTitleProps = { className: 'text-lg' };
// @ts-expect-error Native Svelte styles are CSS strings.
const objectStyle: EmptyDescriptionProps = { style: { color: 'red' } };
// @ts-expect-error Native EmptyContent children use snippets.
const stringChildren: EmptyContentProps = { children: 'Content' };
// @ts-expect-error EmptyDescription's actual host is a div, despite the React paragraph annotation.
const wrongRef: EmptyDescriptionProps = { ref: document.createElement('button') };
// @ts-expect-error Native Empty is a div without a form-control API.
const value: EmptyProps = { value: 'native input' };
// @ts-expect-error Native events have no Base cancellation API.
const baseEvent: EmptyMediaProps = { onclick: event => event.preventBaseUIHandler() };
void [components, mediaDefault, mediaNull, mediaUndefined, unsupportedVariant, headerVariant, size, render, className, objectStyle, stringChildren, wrongRef, value, baseEvent];
