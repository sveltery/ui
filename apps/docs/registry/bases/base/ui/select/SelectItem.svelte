<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Select as Primitive } from '@sveltery/base/select';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Item> = $props();
</script>
<Primitive.Item
  data-slot="select-item"
  {...props}
  class={cn('cn-select-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0', classProp)}
>
  <Primitive.ItemText class="cn-select-item-text shrink-0 whitespace-nowrap">
    {@render children?.()}
  </Primitive.ItemText>
  <Primitive.ItemIndicator class="cn-select-item-indicator">
    <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" class="cn-select-item-indicator-icon pointer-events-none" />
  </Primitive.ItemIndicator>
</Primitive.Item>
