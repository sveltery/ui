<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { ContextMenu as Primitive } from '@sveltery/base/context-menu';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, checked = $bindable(false), inset, ...props }: ComponentProps<typeof Primitive.CheckboxItem> & { inset?: boolean } = $props();
</script>
<Primitive.CheckboxItem
  data-slot="context-menu-checkbox-item"
  data-inset={inset}
  bind:checked
  {...props}
  class={cn('cn-context-menu-checkbox-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0', classProp)}
>
  <span class="cn-context-menu-item-indicator pointer-events-none">
    <Primitive.CheckboxItemIndicator>
      <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" />
    </Primitive.CheckboxItemIndicator>
  </span>
  {@render children?.()}
</Primitive.CheckboxItem>
