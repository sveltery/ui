<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Select as Primitive } from '@sveltery/base/select';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, size = 'default', ...props }: ComponentProps<typeof Primitive.Trigger> & { size?: 'sm' | 'default' } = $props();
</script>
<Primitive.Trigger
  data-slot="select-trigger"
  data-size={size}
  {...props}
  class={cn('cn-select-trigger flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0', classProp)}
>
  {@render children?.()}
  <Primitive.Icon class="cn-select-trigger-icon pointer-events-none">
    {#snippet render(iconProps)}
      <IconPlaceholder lucide="ChevronDownIcon" tabler="IconSelector" hugeicons="UnfoldMoreIcon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" {...(iconProps as Record<string, unknown>)} />
    {/snippet}
  </Primitive.Icon>
</Primitive.Trigger>
