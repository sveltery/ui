<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Menu as Primitive } from '@sveltery/base/menu';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, checked = $bindable(false), inset, ...props }: ComponentProps<typeof Primitive.CheckboxItem> & { inset?: boolean } = $props();
</script>
<Primitive.CheckboxItem
  data-slot="menubar-checkbox-item"
  data-inset={inset}
  bind:checked
  {...props}
  class={cn('cn-menubar-checkbox-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0', classProp)}
>
  <span class="cn-menubar-checkbox-item-indicator pointer-events-none absolute flex items-center justify-center" data-slot="menubar-checkbox-item-indicator">
    <Primitive.CheckboxItemIndicator>
      <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" />
    </Primitive.CheckboxItemIndicator>
  </span>
  {@render children?.()}
</Primitive.CheckboxItem>
