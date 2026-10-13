<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Drawer as Primitive } from '@sveltery/base/drawer';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Description> = $props();
</script>
<Primitive.Description data-slot="drawer-description" {children} {...props} class={cn('cn-drawer-description text-balance', classProp)} />
