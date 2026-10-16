<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { NavigationMenu as Primitive } from '@sveltery/base/navigation-menu';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Link> = $props();
</script>
<Primitive.Link data-slot="navigation-menu-link" {children} {...props} class={cn('cn-navigation-menu-link', classProp)} />
