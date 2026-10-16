<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Menu as Primitive } from '@sveltery/base/menu';
  import { cn } from 'cn';
  let {
    children,
    class: classProp,
    inset,
    variant = 'default',
    ...props
  }: ComponentProps<typeof Primitive.Item> & { inset?: boolean; variant?: 'default' | 'destructive' } = $props();
</script>
<Primitive.Item
  data-slot="dropdown-menu-item"
  data-inset={inset}
  data-variant={variant}
  {children}
  {...props}
  class={cn('cn-dropdown-menu-item group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0', classProp)}
/>
