<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { ContextMenu as Primitive } from '@sveltery/base/context-menu';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, inset, ...props }: ComponentProps<typeof Primitive.RadioItem> & { inset?: boolean } = $props();
</script>
<Primitive.RadioItem
  data-slot="context-menu-radio-item"
  data-inset={inset}
  {...props}
  class={cn('cn-context-menu-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0', classProp)}
>
  <span class="cn-context-menu-item-indicator pointer-events-none">
    <Primitive.RadioItemIndicator>
      <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" />
    </Primitive.RadioItemIndicator>
  </span>
  {@render children?.()}
</Primitive.RadioItem>
