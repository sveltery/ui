<script lang="ts">
  import { cn } from 'cn';
  import { Button } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  import { getCarouselContext } from './context.js';
  import type { CarouselPreviousProps } from './types.js';
  let { class: classProp, variant = 'outline', size = 'icon-sm', ...props }: CarouselPreviousProps = $props();
  const carousel = getCarouselContext();
</script>
<Button
  data-slot="carousel-previous"
  {variant}
  {size}
  class={cn(
    'cn-carousel-previous absolute touch-manipulation',
    carousel.orientation === 'horizontal' ? 'inset-y-0 -left-12 my-auto' : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
    classProp,
  )}
  disabled={!carousel.canScrollPrev}
  onclick={carousel.scrollPrev}
  {...props}
>
  <IconPlaceholder
    lucide="ChevronLeftIcon"
    tabler="IconChevronLeft"
    hugeicons="ArrowLeft01Icon"
    phosphor="CaretLeftIcon"
    remixicon="RiArrowLeftSLine"
    class="cn-rtl-flip"
  />
  <span class="sr-only">Previous slide</span>
</Button>
