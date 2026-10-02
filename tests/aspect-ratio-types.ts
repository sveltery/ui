import type { ComponentProps } from 'svelte';
import { AspectRatio, type AspectRatioProps } from '../apps/docs/registry/bases/base/ui/aspect-ratio/index.js';
const props: AspectRatioProps = { ratio: 16 / 9, ref: undefined, class: ['aspect-square', { static: true }], style: '--ratio: 3;', onclick: event => { const node: HTMLDivElement = event.currentTarget; void node; } };
const nullable: ComponentProps<typeof AspectRatio> = { ratio: 1, ref: null };
// @ts-expect-error The pinned wrapper requires ratio, with no default.
const missing: AspectRatioProps = {};
// @ts-expect-error Ratio is numeric.
const textRatio: AspectRatioProps = { ratio: '16/9' };
// @ts-expect-error Ref targets the native div.
const wrongRef: AspectRatioProps = { ratio: 1, ref: document.createElement('button') };
// @ts-expect-error Svelte uses class.
const reactClass: AspectRatioProps = { ratio: 1, className: 'static' };
// @ts-expect-error Native styles are CSS strings.
const objectStyle: AspectRatioProps = { ratio: 1, style: { aspectRatio: '1' } };
// @ts-expect-error Native children are snippets.
const stringChildren: AspectRatioProps = { ratio: 1, children: 'Photo' };
// @ts-expect-error Native AspectRatio exposes no custom render API.
const render: AspectRatioProps = { ratio: 1, render: 'span' };
void [props, nullable, missing, textRatio, wrongRef, reactClass, objectStyle, stringChildren, render];
