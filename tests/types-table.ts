import type { ComponentProps } from 'svelte';
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from '../apps/docs/registry/bases/base/ui/table/index.js';
const table: ComponentProps<typeof Table> = { ref: undefined, class: ['w-full', { 'text-base': true }], style: 'table-layout: fixed', onclick: event => { const node: HTMLTableElement = event.currentTarget; void node; } };
const header: ComponentProps<typeof TableHeader> = { ref: null, onclick: event => { const node: HTMLTableSectionElement = event.currentTarget; void node; } };
const body: ComponentProps<typeof TableBody> = { ref: undefined, onclick: event => { const node: HTMLTableSectionElement = event.currentTarget; void node; } };
const footer: ComponentProps<typeof TableFooter> = { ref: null, onclick: event => { const node: HTMLTableSectionElement = event.currentTarget; void node; } };
const row: ComponentProps<typeof TableRow> = { ref: undefined, onclick: event => { const node: HTMLTableRowElement = event.currentTarget; void node; } };
const head: ComponentProps<typeof TableHead> = { ref: null, scope: 'col', colspan: 2, rowspan: 3, onclick: event => { const node: HTMLTableCellElement = event.currentTarget; void node; } };
const cell: ComponentProps<typeof TableCell> = { ref: undefined, headers: 'account', colspan: 2, rowspan: 3, onclick: event => { const node: HTMLTableCellElement = event.currentTarget; void node; } };
const caption: ComponentProps<typeof TableCaption> = { ref: null, onclick: event => { const node: HTMLElement = event.currentTarget; void node; } };
// @ts-expect-error Table ref targets the native table, rather than the scroll container.
const containerRef: ComponentProps<typeof Table> = { ref: document.createElement('div') };
// @ts-expect-error TableHead retains native table-cell ref types.
const headRef: ComponentProps<typeof TableHead> = { ref: document.createElement('table') };
// @ts-expect-error Svelte uses class rather than React className.
const reactClass: ComponentProps<typeof Table> = { className: 'text-base' };
// @ts-expect-error Native Table has no variant API.
const variant: ComponentProps<typeof Table> = { variant: 'striped' };
// @ts-expect-error Native host children use Svelte snippets.
const stringChildren: ComponentProps<typeof TableCell> = { children: 'text' };
// @ts-expect-error Native Svelte CSS styles are strings.
const objectStyle: ComponentProps<typeof Table> = { style: { tableLayout: 'fixed' } };
// @ts-expect-error Native handlers do not acquire Base event methods.
const baseEvent: ComponentProps<typeof TableRow> = { onclick: event => event.preventBaseUIHandler() };
void [table, header, body, footer, row, head, cell, caption, containerRef, headRef, reactClass, variant, stringChildren, objectStyle, baseEvent];
