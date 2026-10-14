<script lang="ts">
  import EmblaCarousel from 'embla-carousel';
  import { cn } from 'cn';
  import { setCarouselContext } from './context.js';
  import type { CarouselProps } from './types.js';
  let { orientation = 'horizontal', opts, plugins, api = $bindable(), class: classProp, children, ...props }: CarouselProps = $props();
  let canScrollPrev = $state(false);
  let canScrollNext = $state(false);

  setCarouselContext({
    get api() { return api; },
    get opts() { return opts; },
    get orientation() { return orientation; },
    get canScrollPrev() { return canScrollPrev; },
    get canScrollNext() { return canScrollNext; },
    scrollPrev: () => api?.scrollPrev(),
    scrollNext: () => api?.scrollNext(),
    viewport: (node) => {
      const embla = EmblaCarousel(node, { ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' }, plugins);
      const sync = () => {
        canScrollPrev = embla.canScrollPrev();
        canScrollNext = embla.canScrollNext();
      };
      sync();
      embla.on('select', sync).on('reInit', sync);
      api = embla;
      return () => {
        embla.destroy();
        api = undefined;
      };
    },
  });

  function onkeydowncapture(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      api?.scrollPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      api?.scrollNext();
    }
  }
</script>
<div
  {onkeydowncapture}
  class={cn('relative', classProp)}
  role="region"
  aria-roledescription="carousel"
  data-slot="carousel"
  {...props}
>
  {@render children?.()}
</div>
