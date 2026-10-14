<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Item> = $props();
</script>

<Primitive.Item
  data-slot="combobox-item"
  {...props}
  class={cn('cn-combobox-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0', classProp)}
>
  {@render children?.()}
  <Primitive.ItemIndicator class="cn-combobox-item-indicator">
    <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" class="cn-combobox-item-indicator-icon pointer-events-none" />
  </Primitive.ItemIndicator>
</Primitive.Item>
