<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { cn } from 'cn';
  import { DropdownMenuLabel } from '../dropdown-menu/index.js';
  let { children, class: classProp, inset, ...props }: ComponentProps<typeof DropdownMenuLabel> = $props();
</script>
<DropdownMenuLabel data-slot="menubar-label" {children} {inset} {...props} class={cn('cn-menubar-label', classProp)} />
