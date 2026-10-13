<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Menu as Primitive } from '@sveltery/base/menu';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, inset, ...props }: ComponentProps<typeof Primitive.SubmenuTrigger> & { inset?: boolean } = $props();
</script>
<Primitive.SubmenuTrigger
  data-slot="dropdown-menu-sub-trigger"
  data-inset={inset}
  {...props}
  class={cn('cn-dropdown-menu-sub-trigger flex cursor-default items-center outline-hidden select-none data-popup-open:bg-accent data-popup-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0', classProp)}
>
  {@render children?.()}
  <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" class="cn-rtl-flip ml-auto" />
</Primitive.SubmenuTrigger>
