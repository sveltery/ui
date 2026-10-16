<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { ContextMenu as Primitive } from '@sveltery/base/context-menu';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, inset, ...props }: ComponentProps<typeof Primitive.SubmenuTrigger> & { inset?: boolean } = $props();
</script>
<Primitive.SubmenuTrigger
  data-slot="context-menu-sub-trigger"
  data-inset={inset}
  {...props}
  class={cn('cn-context-menu-sub-trigger flex cursor-default items-center outline-hidden select-none [&_svg]:pointer-events-none [&_svg]:shrink-0', classProp)}
>
  {@render children?.()}
  <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" class="cn-rtl-flip ml-auto" />
</Primitive.SubmenuTrigger>
