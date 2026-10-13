import { createContext } from 'svelte';
import type { Attachment } from 'svelte/attachments';

export type CarouselContextValue = {
  readonly orientation: 'horizontal' | 'vertical';
  readonly canScrollPrev: boolean;
  readonly canScrollNext: boolean;
  readonly viewport: Attachment<HTMLElement>;
  scrollPrev(): void;
  scrollNext(): void;
};

export const [getCarouselContext, setCarouselContext] = createContext<CarouselContextValue>();
