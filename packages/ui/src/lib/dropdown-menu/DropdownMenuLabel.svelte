<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Menu as Primitive } from '@sveltery/base/menu';
  import { cn } from 'cn';
  let { children, class: classProp, inset, ...props }: ComponentProps<typeof Primitive.GroupLabel> & { inset?: boolean } = $props();
</script>
<Primitive.GroupLabel data-slot="dropdown-menu-label" data-inset={inset} {children} {...props} class={cn('cn-dropdown-menu-label', classProp)} />
