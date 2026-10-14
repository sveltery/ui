<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { ContextMenu as Primitive } from '@sveltery/base/context-menu';
  let { children, ...props }: ComponentProps<typeof Primitive.Portal> = $props();
</script>
<Primitive.Portal data-slot="context-menu-portal" {...props}>
  {@render children?.()}
</Primitive.Portal>
