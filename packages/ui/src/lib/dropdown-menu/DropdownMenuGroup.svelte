<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Menu as Primitive } from '@sveltery/base/menu';
  let { children, ...props }: ComponentProps<typeof Primitive.Group> = $props();
</script>
<Primitive.Group data-slot="dropdown-menu-group" {children} {...props} />
