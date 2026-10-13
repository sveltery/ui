<script lang="ts">
  import { cn } from 'cn';
  import { getCarouselContext } from './context.js';
  import type { CarouselContentProps } from './types.js';
  let { class: classProp, children, ...props }: CarouselContentProps = $props();
  const carousel = getCarouselContext();
</script>
<div {@attach carousel.viewport} class="overflow-hidden" data-slot="carousel-content">
  <div class={cn('flex', carousel.orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', classProp)} {...props}>
    {@render children?.()}
  </div>
</div>
