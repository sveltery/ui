import type { ComponentProps } from 'svelte';
import { Example, ExampleWrapper, type ExampleProps, type ExampleWrapperProps } from '../apps/docs/registry/bases/base/ui/example/index.js';
const example: ExampleProps = { title: 'Title', containerClassName: 'max-w-none', class: ['p-4', { 'p-8': true }], ref: null, style: 'color: red', onclick: event => { const host: HTMLDivElement = event.currentTarget; void host; } };
const wrapper: ExampleWrapperProps = { ref: undefined, class: 'gap-4', title: 'Native wrapper title' };
const exampleComponent: ComponentProps<typeof Example> = example;
const wrapperComponent: ComponentProps<typeof ExampleWrapper> = wrapper;
// @ts-expect-error native scaffold style is a CSS string.
const objectStyle: ExampleProps = { style: { color: 'red' } };
// @ts-expect-error no new render API.
const render: ExampleProps = { render: () => {} };
// @ts-expect-error containerClassName applies only to Example.
const wrapperContainer: ExampleWrapperProps = { containerClassName: 'p-4' };
// @ts-expect-error upstream containerClassName is a string.
const arrayContainer: ExampleProps = { containerClassName: ['p-4'] };
// @ts-expect-error Svelte snippets replace React text children.
const stringChildren: ExampleProps = { children: 'Content' };
// @ts-expect-error Svelte class spelling.
const className: ExampleProps = { className: 'p-4' };
// @ts-expect-error native refs describe div hosts.
const wrongRef: ExampleProps = { ref: document.createElement('span') };
void [exampleComponent, wrapperComponent, objectStyle, render, wrapperContainer, arrayContainer, stringChildren, className, wrongRef];
