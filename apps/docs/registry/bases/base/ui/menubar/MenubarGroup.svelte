<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { DropdownMenuGroup } from '../dropdown-menu/index.js';
  let { children, ...props }: ComponentProps<typeof DropdownMenuGroup> = $props();
</script>
<DropdownMenuGroup data-slot="menubar-group" {children} {...props} />
