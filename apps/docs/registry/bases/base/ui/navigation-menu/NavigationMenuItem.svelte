<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { NavigationMenu as Primitive } from '@sveltery/base/navigation-menu';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Item> = $props();
</script>
<Primitive.Item data-slot="navigation-menu-item" {...props} class={cn('cn-navigation-menu-item relative', classProp)}>
  {@render children?.()}
</Primitive.Item>
