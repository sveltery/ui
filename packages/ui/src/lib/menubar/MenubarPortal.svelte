<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { DropdownMenuPortal } from '../dropdown-menu/index.js';
  let { children, ...props }: ComponentProps<typeof DropdownMenuPortal> = $props();
</script>
<DropdownMenuPortal data-slot="menubar-portal" {...props}>
  {@render children?.()}
</DropdownMenuPortal>
