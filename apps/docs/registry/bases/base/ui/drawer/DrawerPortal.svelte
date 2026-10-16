<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Drawer as Primitive } from '@sveltery/base/drawer';
  let { children, ...props }: ComponentProps<typeof Primitive.Portal> = $props();
</script>
<Primitive.Portal data-slot="drawer-portal" {...props}>
  {@render children?.()}
</Primitive.Portal>
