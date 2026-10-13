<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Menu as Primitive } from '@sveltery/base/menu';
  let { children, ...props }: ComponentProps<typeof Primitive.Portal> = $props();
</script>
<Primitive.Portal data-slot="dropdown-menu-portal" {...props}>
  {@render children?.()}
</Primitive.Portal>
