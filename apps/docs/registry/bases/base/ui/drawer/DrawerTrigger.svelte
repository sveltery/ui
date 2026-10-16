<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Drawer as Primitive } from '@sveltery/base/drawer';
  let { children, ...props }: ComponentProps<typeof Primitive.Trigger> = $props();
</script>
<Primitive.Trigger data-slot="drawer-trigger" {children} {...props} />
