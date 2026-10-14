<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { cn } from 'cn';
  import { DropdownMenuSeparator } from '../dropdown-menu/index.js';
  let { class: classProp, ...props }: ComponentProps<typeof DropdownMenuSeparator> = $props();
</script>
<DropdownMenuSeparator data-slot="menubar-separator" {...props} class={cn('cn-menubar-separator -mx-1 my-1 h-px', classProp)} />
