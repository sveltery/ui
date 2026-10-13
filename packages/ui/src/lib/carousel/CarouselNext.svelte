<script lang="ts">
  import { cn } from 'cn';
  import { Button } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  import { getCarouselContext } from './context.js';
  import type { CarouselNextProps } from './types.js';
  let { class: classProp, variant = 'outline', size = 'icon-sm', ...props }: CarouselNextProps = $props();
  const carousel = getCarouselContext();
</script>
<Button
  data-slot="carousel-next"
  {variant}
  {size}
  class={cn(
    'cn-carousel-next absolute touch-manipulation',
    carousel.orientation === 'horizontal' ? 'inset-y-0 -right-12 my-auto' : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
    classProp,
  )}
  disabled={!carousel.canScrollNext}
  onclick={carousel.scrollNext}
  {...props}
>
  <IconPlaceholder
    lucide="ChevronRightIcon"
    tabler="IconChevronRight"
    hugeicons="ArrowRight01Icon"
    phosphor="CaretRightIcon"
    remixicon="RiArrowRightSLine"
    class="cn-rtl-flip"
  />
  <span class="sr-only">Next slide</span>
</Button>
