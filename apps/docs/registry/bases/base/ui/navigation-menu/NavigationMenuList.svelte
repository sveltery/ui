<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { NavigationMenu as Primitive } from '@sveltery/base/navigation-menu';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.List> = $props();
</script>
<Primitive.List data-slot="navigation-menu-list" {...props} class={cn('cn-navigation-menu-list group flex flex-1 list-none items-center justify-center', classProp)}>
  {@render children?.()}
</Primitive.List>
