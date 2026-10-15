<script lang="ts">
  import { cn } from 'cn';
  import { useCarousel } from './context.js';
  import type { CarouselItemProps } from './types.js';
  let { class: classProp, children, ...props }: CarouselItemProps = $props();
  const carousel = useCarousel();
</script>
<div
  role="group"
  aria-roledescription="slide"
  data-slot="carousel-item"
  class={cn('min-w-0 shrink-0 grow-0 basis-full', carousel.orientation === 'horizontal' ? 'pl-4' : 'pt-4', classProp)}
  {...props}
>
  {@render children?.()}
</div>
