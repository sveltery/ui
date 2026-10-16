<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Drawer as Primitive } from '@sveltery/base/drawer';
  let { children, ...props }: ComponentProps<typeof Primitive.Close> = $props();
</script>
<Primitive.Close data-slot="drawer-close" {children} {...props} />
