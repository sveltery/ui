import { createContext } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { CarouselApi, CarouselOptions } from './types.js';

export type CarouselContextValue = {
  readonly api: CarouselApi | undefined;
  readonly opts: CarouselOptions | undefined;
  readonly orientation: 'horizontal' | 'vertical';
  readonly canScrollPrev: boolean;
  readonly canScrollNext: boolean;
  readonly viewport: Attachment<HTMLElement>;
  scrollPrev(): void;
  scrollNext(): void;
};

export const [useCarousel, setCarouselContext] = createContext<CarouselContextValue>();
