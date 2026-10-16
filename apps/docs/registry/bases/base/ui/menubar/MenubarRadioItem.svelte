<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Menu as Primitive } from '@sveltery/base/menu';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, inset, ...props }: ComponentProps<typeof Primitive.RadioItem> & { inset?: boolean } = $props();
</script>
<Primitive.RadioItem
  data-slot="menubar-radio-item"
  data-inset={inset}
  {...props}
  class={cn('cn-menubar-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0', classProp)}
>
  <span class="cn-menubar-radio-item-indicator pointer-events-none absolute flex items-center justify-center">
    <Primitive.RadioItemIndicator>
      <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" />
    </Primitive.RadioItemIndicator>
  </span>
  {@render children?.()}
</Primitive.RadioItem>
