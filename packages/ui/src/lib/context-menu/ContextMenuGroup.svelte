<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { ContextMenu as Primitive } from '@sveltery/base/context-menu';
  let { children, ...props }: ComponentProps<typeof Primitive.Group> = $props();
</script>
<Primitive.Group data-slot="context-menu-group" {children} {...props} />
