import type { HTMLAttributes } from 'svelte/elements';
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import type { ButtonProps } from '../button/index.js';

export type CarouselApi = EmblaCarouselType;
export type CarouselOptions = EmblaOptionsType;
export type CarouselPlugin = EmblaPluginType[];

export type CarouselProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical';
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  /** The Embla instance, set once the carousel mounts. Read it with `bind:api`. */
  api?: CarouselApi;
};
export type CarouselContentProps = HTMLAttributes<HTMLDivElement>;
export type CarouselItemProps = HTMLAttributes<HTMLDivElement>;
export type CarouselPreviousProps = ButtonProps;
export type CarouselNextProps = ButtonProps;
